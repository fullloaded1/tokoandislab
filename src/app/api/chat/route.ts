import { groq } from '@ai-sdk/groq';
import { google } from '@ai-sdk/google';
import { streamText, embed } from 'ai';
import { prisma } from '@/lib/db';
import { formatRupiah } from '@/lib/products';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("INCOMING CHAT REQUEST BODY:", JSON.stringify(body, null, 2));
    const { messages, agent = 'sales' } = body;

    // Fetch all products from database to use as context
    const products = await prisma.product.findMany({
      include: { specs: true }
    });

    // Build the catalog context
    const catalogContext = products.map(p => {
      let specStr = p.specs.map(s => `${s.label}: ${s.value}`).join(', ');
      return `- ${p.name} (Kategori: ${p.categoryLabel}, Brand: ${p.brand})\n  Harga: ${p.price > 0 ? formatRupiah(p.price) : 'Hubungi sales untuk penawaran'}\n  Deskripsi: ${p.description}\n  Spesifikasi: ${specStr}`;
    }).join('\n\n');

    let systemPrompt = "";
    let selectedModel = groq('llama-3.3-70b-versatile');

    if (agent === 'tech') {
      selectedModel = google('gemini-2.5-flash');
      systemPrompt = `Kamu adalah AndisBot (Divisi Teknisi & Dukungan Teknis) di AndisLab.
Tugas utamamu adalah membantu klien memahami spesifikasi teknis alat, membandingkan fitur, dan memberikan panduan teknis serta troubleshooting. Jika butuh nomor kontak, berikan link WhatsApp ini: [082125523466](https://wa.me/6282125523466).

Gaya Bicaramu:
- Profesional, sangat akurat secara teknis, solutif, dan sopan.
- Gunakan bahasa Indonesia yang jelas dan mudah dipahami.
- Jangan pernah berhalusinasi spesifikasi yang tidak ada di katalog.

Informasi Katalog AndisLab:
${catalogContext}

Instruksi:
- Fokuslah pada spesifikasi, performa, dimensi, dan fitur teknis.
- Jika pengguna butuh perbaikan atau garansi, arahkan mereka untuk menghubungi tim support via WhatsApp di [082125523466](https://wa.me/6282125523466).
- WAJIB: Setiap kali menyebutkan nomor WA, formatlah sebagai link: [082125523466](https://wa.me/6282125523466)
- Gunakan format markdown agar mudah dibaca.`;
    } else {
      selectedModel = groq('llama-3.3-70b-versatile');
      systemPrompt = `Kamu adalah AndisBot, asisten penjualan dan customer service resmi untuk AndisLab (toko spesialis alat laboratorium B2B di Indonesia).
Tugas utamamu adalah membantu klien memilih produk yang tepat, menjelaskan secara singkat, dan mengarahkan mereka untuk meminta penawaran (RFQ) atau menghubungi sales via WhatsApp di [082125523466](https://wa.me/6282125523466).

Gaya Bicaramu:
- Ramah, profesional, sopan, dan sangat membantu.
- Gunakan bahasa Indonesia baku namun santai (seperti CS startup modern). Boleh pakai emoji secukupnya.
- Jangan pernah berhalusinasi atau mengarang produk yang tidak ada di katalog.

Informasi Katalog AndisLab Saat Ini:
${catalogContext}

Instruksi Tambahan:
- Jika klien menanyakan harga dan harganya 0, beritahu bahwa harga menyesuaikan kebutuhan instansi dan arahkan mereka untuk klik "Tanya via WA" atau masukkan ke Keranjang RFQ untuk meminta penawaran.
- Jika ditanya lokasi, AndisLab berlokasi di Bogor, melayani pengiriman seluruh Indonesia.
- Jangan sebutkan ID produk atau detail teknis yang terlalu panjang kecuali diminta (arahkan ke teknisi jika perlu).
- WAJIB: Setiap kali menyebutkan nomor WA, formatlah sebagai link yang bisa diklik: [082125523466](https://wa.me/6282125523466)
- Gunakan format markdown (bullet points, bold) agar mudah dibaca.`;
    }

    const coreMessages = messages.map((m: any) => {
      let content = '';
      if (m.parts) {
        content = m.parts.map((p: any) => p.text).join('');
      } else if (m.content) {
        content = typeof m.content === 'string' ? m.content : '';
      }
      return { role: m.role, content };
    });

    const lastUserMessage = coreMessages.filter((m: any) => m.role === 'user').pop();
    const userText = lastUserMessage?.content || '';

    // RAG Semantic Search
    let ragContext = "";
    try {
      if (userText && userText.trim() !== '') {
        const { embedding } = await embed({
          model: google.textEmbeddingModel('text-embedding-004'),
          value: userText,
        });

        // Prisma query for vector search. Note: pgvector <-> is distance, we order by distance
        // Cast embedding array to vector string
        const embeddingString = `[${embedding.join(',')}]`;
        const documents: any[] = await prisma.$queryRaw`
          SELECT title, content, 1 - (embedding <=> ${embeddingString}::vector) as similarity
          FROM "DocumentKnowledge"
          ORDER BY embedding <=> ${embeddingString}::vector
          LIMIT 3
        `;

        if (documents && documents.length > 0 && documents[0].similarity > 0.5) {
          ragContext = "\n\nInformasi Tambahan dari Manual Book & Brosur (RAG):\n" + documents.map(d => `--- [${d.title}] ---\n${d.content}`).join('\n\n');
          systemPrompt += ragContext;
        }
      }
    } catch (e) {
      console.error("Vector search error (RAG):", e);
    }

    // Create ChatLog placeholder
    const chatLog = await prisma.chatLog.create({
      data: {
        sessionId: req.headers.get("x-forwarded-for") || "anonymous",
        userMessage: userText,
        agent: agent
      }
    });

    const result = streamText({
      model: selectedModel,
      system: systemPrompt,
      messages: coreMessages,
      temperature: 0.3, // Keep it focused
      onFinish: async ({ text }) => {
        try {
          await prisma.chatLog.update({
            where: { id: chatLog.id },
            data: { aiResponse: text }
          });
        } catch (e) {
          console.error("Failed to save AI response:", e);
        }
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
