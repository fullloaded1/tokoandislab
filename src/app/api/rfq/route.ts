import { NextResponse } from "next/server";

interface RFQItemPayload {
  id: string;
  slug: string;
  name: string;
  image: string;
  category: string;
  qty: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items: RFQItemPayload[] = body.items;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Keranjang RFQ kosong." },
        { status: 400 }
      );
    }

    // Build WhatsApp message
    const date = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    let message = `📋 *PERMINTAAN PENAWARAN (RFQ)*\n`;
    message += `📅 Tanggal: ${date}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    items.forEach((item, idx) => {
      message += `*${idx + 1}. ${item.name}*\n`;
      message += `   📁 Kategori: ${item.category}\n`;
      message += `   📦 Jumlah: ${item.qty} unit\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📊 Total: ${items.length} produk, ${items.reduce((s, i) => s + i.qty, 0)} unit\n\n`;
    message += `Mohon dikirimkan penawaran harga terbaik beserta informasi ketersediaan stok.\n\n`;
    message += `Terima kasih 🙏\n`;
    message += `— Dikirim dari AndisLab Catalog`;

    const waNumber = "6281234567890";
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({ url, message });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses permintaan." },
      { status: 500 }
    );
  }
}
