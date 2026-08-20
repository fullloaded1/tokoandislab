import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildReadyStockPdfBytes } from "@/lib/readyStockPdf";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

    const bytes = buildReadyStockPdfBytes(readyStockProducts);

    return new NextResponse(bytes as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="AndisLab-Ready-Stock-${new Date().toISOString().split('T')[0]}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to generate Ready Stock PDF:", error);
    return new NextResponse("Gagal membuat PDF Ready Stock", { status: 500 });
  }
}
