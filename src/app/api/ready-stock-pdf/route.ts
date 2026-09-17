import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { buildReadyStockPdfBytes, type PdfEdition } from "@/lib/readyStockPdf";

export const dynamic = "force-dynamic";

/** Auto-detect edition from day-of-month: 1–15 → M1, 16–31 → M3 */
function detectEdition(date: Date): PdfEdition {
  return date.getDate() <= 15 ? "M1" : "M3";
}

function formatYearMonth(date: Date): string {
  return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

export async function GET(req: NextRequest) {
  try {
    // Allow override via ?edition=M1 or ?edition=M3
    const editionParam = req.nextUrl.searchParams.get("edition");
    const now = new Date();
    const edition: PdfEdition =
      editionParam === "M1" || editionParam === "M3"
        ? editionParam
        : detectEdition(now);

    const yearMonth = formatYearMonth(now);

    const readyStockProducts = await prisma.product.findMany({
      where: {
        isReadyStock: true,
      },
      include: {
        variants: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    const bytes = buildReadyStockPdfBytes(readyStockProducts, edition, yearMonth);

    const dateStr = now.toISOString().split("T")[0];
    const filename = `AndisLab-Katalog-${edition}-${dateStr}.pdf`;

    return new NextResponse(bytes as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to generate Ready Stock PDF:", error);
    return new NextResponse("Gagal membuat PDF Ready Stock", { status: 500 });
  }
}
