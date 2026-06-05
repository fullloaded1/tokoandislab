import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { prisma } from '@/lib/db';
import { formatRupiah } from '@/lib/products';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Fetch all products from database to use as context
    const products = await prisma.product.findMany({
      include: { specs: true }
    });

    // Build the catalog context
    const catalogContext = products.map(p => {
      let specStr = p.specs.map(s => `${s.label}: ${s.value}`).join(', ');
      return `- ${p.name} (Kategori: ${p.categoryLabel}, Brand: ${p.brand})\n  Harga: ${p.price > 0 ? formatRupiah(p.price) : 'Hubungi sales untuk penawaran'}\n  Deskripsi: ${p.description}\n  Spesifikasi: ${specStr}`;
    }).join('\n\n');

    const systemPrompt = `Kamu adalah AndisBot, asisten penjualan dan customer service resmi untuk AndisLab (toko spesialis alat laboratorium B2B di Indonesia).
Tugas utamamu adalah membantu klien memilih produk yang tepat, menjelaskan spesifikasi, dan mengarahkan mereka untuk meminta penawaran (RFQ) atau menghubungi sales via WhatsApp (082125523466).

Gaya Bicaramu:
- Ramah, profesional, sopan, dan sangat membantu.
- Gunakan bahasa Indonesia baku namun santai (seperti CS startup modern). Boleh pakai emoji secukupnya.
- Jangan pernah berhalusinasi atau mengarang produk yang tidak ada di katalog.

Informasi Katalog AndisLab Saat Ini:
${catalogContext}

Instruksi Tambahan:
- Jika klien menanyakan harga dan harganya 0, beritahu bahwa harga menyesuaikan kebutuhan instansi dan arahkan mereka untuk klik "Tanya via WA" atau masukkan ke Keranjang RFQ untuk meminta penawaran.
- Jika ditanya lokasi, AndisLab berlokasi di Bogor, melayani pengiriman seluruh Indonesia.
- Jangan sebutkan ID produk atau detail teknis yang terlalu panjang kecuali diminta.
- Gunakan format markdown (bullet points, bold) agar mudah dibaca.`;

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'), // Better model for indonesian reasoning than 8b
      system: systemPrompt,
      messages,
      temperature: 0.3, // Keep it focused
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
