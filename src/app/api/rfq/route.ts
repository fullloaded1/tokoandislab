import { NextResponse } from "next/server";

interface RFQItemPayload {
  id: string;
  slug: string;
  name: string;
  image: string;
  category: string;
  price: number;
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

    let message = `🛒 *PESANAN BARU (AndisLab Catalog)*\n`;
    message += `📅 Tanggal: ${date}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    items.forEach((item, idx) => {
      const formattedPrice = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.price);
      const formattedSub = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.price * item.qty);
      
      message += `*${idx + 1}. ${item.name}*\n`;
      message += `   📁 Kategori: ${item.category}\n`;
      message += `   💰 Harga: ${formattedPrice}\n`;
      message += `   📦 Jumlah: ${item.qty} unit\n`;
      message += `   💵 Subtotal: ${formattedSub}\n\n`;
    });

    const totalQty = items.reduce((s, i) => s + i.qty, 0);
    const totalPrice = items.reduce((s, i) => s + (i.price * i.qty), 0);
    const formattedTotal = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalPrice);

    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📊 Total Item: ${totalQty} unit\n`;
    message += `🧾 *TOTAL HARGA: ${formattedTotal}*\n\n`;
    message += `Halo Admin AndisLab, saya ingin memproses pesanan di atas. Mohon info lebih lanjut untuk pembayaran dan pengiriman.\n\n`;
    message += `Terima kasih 🙏\n`;
    message += `— Dikirim dari AndisLab Catalog`;

    const waNumber = "6285973211179";
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({ url, message });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses permintaan." },
      { status: 500 }
    );
  }
}
