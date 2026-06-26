"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { calculateProductScores, type ProductScore } from "@/lib/stockEvaluation";
import { revalidatePath } from "next/cache";
import { StockEvalStatus } from "@prisma/client";
import Decimal from "decimal.js";

// ── List evaluations ────────────────────────────────────────────
export async function getEvaluations() {
  await requireAdmin();
  const evals = await prisma.stockEvaluation.findMany({
    orderBy: { period: "desc" },
    include: {
      _count: { select: { items: true } },
      admin: { select: { name: true } },
    },
  });
  return evals.map((e) => ({
    ...e,
    period: e.period.toISOString(),
    approvedAt: e.approvedAt?.toISOString() ?? null,
    executedAt: e.executedAt?.toISOString() ?? null,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));
}

// ── Get single evaluation with items ────────────────────────────
export async function getEvaluationDetail(id: string) {
  await requireAdmin();
  const ev = await prisma.stockEvaluation.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: { select: { image: true, slug: true } } },
        orderBy: { score: "asc" },
      },
      admin: { select: { name: true } },
    },
  });
  if (!ev) throw new Error("Evaluasi tidak ditemukan");
  return {
    ...ev,
    period: ev.period.toISOString(),
    approvedAt: ev.approvedAt?.toISOString() ?? null,
    executedAt: ev.executedAt?.toISOString() ?? null,
    createdAt: ev.createdAt.toISOString(),
    updatedAt: ev.updatedAt.toISOString(),
    items: ev.items.map((i) => ({
      ...i,
      score: i.score.toString(),
      marginPercent: i.marginPercent?.toString() ?? null,
      clearanceDiscount: i.clearanceDiscount?.toString() ?? null,
      createdAt: i.createdAt.toISOString(),
    })),
  };
}

// ── Generate evaluation for a month ─────────────────────────────
export async function generateEvaluation(retireCount = 10, monthsBack = 3) {
  const session = await requireAdmin();

  const now = new Date();
  const period = new Date(now.getFullYear(), now.getMonth(), 1);
  const evalNo = `EVAL-${period.getFullYear()}-${String(period.getMonth() + 1).padStart(2, "0")}`;

  // Cek duplikat
  const existing = await prisma.stockEvaluation.findUnique({ where: { evalNo } });
  if (existing) {
    return { success: false, error: `Evaluasi ${evalNo} sudah ada` };
  }

  // Hitung skor
  const scores = await calculateProductScores(monthsBack);
  const retireCandidates = scores.slice(0, retireCount);

  // Hitung total ready stock saat ini
  const totalReadyStock = await prisma.product.count({ where: { isReadyStock: true } });

  const evaluation = await prisma.stockEvaluation.create({
    data: {
      evalNo,
      period,
      targetCount: 50,
      createdBy: session.username,
      items: {
        create: retireCandidates.map((s: ProductScore) => ({
          productId: s.productId,
          action: "RETIRE" as const,
          salesCount: s.salesCount,
          inquiryCount: s.inquiryCount,
          pageViews: s.pageViews,
          currentStock: s.currentStock,
          daysSinceLastSale: s.daysSinceLastSale,
          marginPercent: s.marginPercent !== null ? new Decimal(s.marginPercent) : null,
          score: new Decimal(s.score),
          productName: s.productName,
          productBrand: s.productBrand,
          productModel: s.productModel,
        })),
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "GENERATE_STOCK_EVAL",
      entityType: "StockEvaluation",
      entityId: evaluation.id,
      actorId: session.username,
      notes: `Generated ${evalNo} — ${retireCandidates.length} retire candidates dari ${totalReadyStock} ready stock`,
    },
  });

  revalidatePath("/admin/stock-evaluation");
  return { success: true, id: evaluation.id };
}

// ── Add INTRODUCE item ──────────────────────────────────────────
export async function addIntroduceItem(evaluationId: string, productId: string, reason?: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { success: false, error: "Produk tidak ditemukan" };

  await prisma.stockEvalItem.create({
    data: {
      evaluationId,
      productId,
      action: "INTRODUCE",
      productName: product.name,
      productBrand: product.brand,
      productModel: product.model,
      reason,
    },
  });

  revalidatePath("/admin/stock-evaluation");
  return { success: true };
}

// ── Remove item from evaluation ─────────────────────────────────
export async function removeEvalItem(itemId: string) {
  await requireAdmin();
  await prisma.stockEvalItem.delete({ where: { id: itemId } });
  revalidatePath("/admin/stock-evaluation");
  return { success: true };
}

// ── Set clearance discount ──────────────────────────────────────
export async function setClearanceDiscount(itemId: string, discountPercent: number) {
  await requireAdmin();

  if (discountPercent < 0 || discountPercent > 100) {
    return { success: false, error: "Diskon harus 0-100%" };
  }

  await prisma.stockEvalItem.update({
    where: { id: itemId },
    data: { clearanceDiscount: new Decimal(discountPercent) },
  });

  revalidatePath("/admin/stock-evaluation");
  return { success: true };
}

// ── Approve evaluation ──────────────────────────────────────────
export async function approveEvaluation(id: string) {
  const session = await requireAdmin();
  await prisma.stockEvaluation.update({
    where: { id },
    data: { status: "APPROVED", approvedAt: new Date() },
  });

  await prisma.auditLog.create({
    data: {
      action: "APPROVE_STOCK_EVAL",
      entityType: "StockEvaluation",
      entityId: id,
      actorId: session.username,
    },
  });

  revalidatePath("/admin/stock-evaluation");
  return { success: true };
}

// ── Execute rolling ─────────────────────────────────────────────
export async function executeRolling(id: string) {
  const session = await requireAdmin();

  const evaluation = await prisma.stockEvaluation.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!evaluation) return { success: false, error: "Evaluasi tidak ditemukan" };
  if (evaluation.status !== "APPROVED") {
    return { success: false, error: "Evaluasi harus APPROVED dulu" };
  }

  const retireItems = evaluation.items.filter((i) => i.action === "RETIRE");
  const introduceItems = evaluation.items.filter((i) => i.action === "INTRODUCE");

  if (introduceItems.length === 0) {
    return { success: false, error: "Belum ada produk pengganti (INTRODUCE)" };
  }

  // Execute dalam satu transaction
  await prisma.$transaction(async (tx) => {
    // Retire: set isReadyStock=false, apply clearance discount
    for (const item of retireItems) {
      const updateData: Record<string, unknown> = { isReadyStock: false };
      if (item.clearanceDiscount) {
        updateData.clearanceDiscount = item.clearanceDiscount;
      }
      await tx.product.update({
        where: { id: item.productId },
        data: updateData,
      });
    }

    // Introduce: set isReadyStock=true, clear clearance discount
    for (const item of introduceItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { isReadyStock: true, clearanceDiscount: null },
      });
    }

    // Update status
    await tx.stockEvaluation.update({
      where: { id },
      data: { status: "EXECUTED", executedAt: new Date() },
    });

    // Audit log
    await tx.auditLog.create({
      data: {
        action: "EXECUTE_STOCK_ROLLING",
        entityType: "StockEvaluation",
        entityId: id,
        actorId: session.username,
        notes: `Retire ${retireItems.length} produk, Introduce ${introduceItems.length} produk`,
        newValue: JSON.stringify({
          retired: retireItems.map((i) => i.productId),
          introduced: introduceItems.map((i) => i.productId),
        }),
      },
    });
  });

  revalidatePath("/admin/stock-evaluation");
  revalidatePath("/ready-stock");
  revalidatePath("/katalog");
  revalidatePath("/");
  return { success: true };
}

// ── Cancel evaluation ───────────────────────────────────────────
export async function cancelEvaluation(id: string) {
  const session = await requireAdmin();
  await prisma.stockEvaluation.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  await prisma.auditLog.create({
    data: {
      action: "CANCEL_STOCK_EVAL",
      entityType: "StockEvaluation",
      entityId: id,
      actorId: session.username,
    },
  });

  revalidatePath("/admin/stock-evaluation");
  return { success: true };
}

// ── Get all products (for INTRODUCE picker) ─────────────────────
export async function getNonReadyStockProducts() {
  await requireAdmin();
  return prisma.product.findMany({
    where: { isReadyStock: false },
    select: { id: true, name: true, brand: true, model: true, category: true, image: true },
    orderBy: { name: "asc" },
  });
}

// ── Get current scoring leaderboard ─────────────────────────────
export async function getScoreLeaderboard(monthsBack = 3) {
  await requireAdmin();
  return calculateProductScores(monthsBack);
}
