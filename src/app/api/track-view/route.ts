import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/track-view
 * Body: { slug: string }
 *
 * Increment pageViews counter untuk produk. Fire-and-forget dari client.
 */
export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    await prisma.product.update({
      where: { slug },
      data: { pageViews: { increment: 1 } },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Produk tidak ditemukan — tidak perlu error ke client
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
