import { groq } from '@ai-sdk/groq';
import { google } from '@ai-sdk/google';
import { streamText, embed } from 'ai';
import { prisma } from '@/lib/db';
import { money } from '@/lib/money';

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
      const specStr = p.specs.map(s => `${s.label}: ${s.value}`).join(', ');
      return `- ${p.name} (Kategori: ${p.categoryLabel}, Brand: ${p.brand})\n  Harga: ${p.price.toNumber() > 0 ? money.formatIDR(p.price) : 'Hubungi sales untuk penawaran'}\n  Deskripsi: ${p.description}\n  Spesifikasi: ${specStr}`;
    }).join('\n\n');

    let systemPrompt = "";
    let selectedModel = groq('llama-3.3-70b-versatile');

    if (agent === 'tech') {
      selectedModel = google('gemini-2.5-flash');
      systemPrompt = `Kamu adalah AndisBot (Divisi Teknisi & Dukungan Teknis) di AndisLab.
Tugas utamamu adalah membantu klien memahami spesifikasi teknis alat, membandingkan fitur, dan memberikan panduan teknis serta troubleshooting. Jika butuh nomor kontak, berikan link WhatsApp ini: [085973211179](https://wa.me/6285973211179).

Gaya Bicaramu:
- Profesional, sangat akurat secara teknis, solutif, dan sopan.
- Gunakan bahasa Indonesia yang jelas dan mudah dipahami.
- Jangan pernah berhalusinasi spesifikasi yang tidak ada di katalog.

Informasi Katalog AndisLab:
${catalogContext}

Instruksi:
- Fokuslah pada spesifikasi, performa, dimensi, dan fitur teknis.
- Jika pengguna butuh perbaikan atau garansi, arahkan mereka untuk menghubungi tim support via WhatsApp di [085973211179](https://wa.me/6285973211179).
- WAJIB: Setiap kali menyebutkan nomor WA, formatlah sebagai link: [085973211179](https://wa.me/6285973211179)
- Gunakan format markdown agar mudah dibaca.`;
    } else {
      selectedModel = groq('llama-3.3-70b-versatile');
      systemPrompt = `Kamu adalah AndisBot, asisten penjualan B2B cerdas untuk AndisLab (toko spesialis alat laboratorium).
Tugas utamamu adalah menjadi "Sales Funnel" yang efisien, tidak bertele-tele, dan menghemat resource. Kamu harus membimbing percakapan dengan 3 tahap utama secara ketat:

TAHAP 1: PERJELAS KEBUTUHAN (Needs Jelas)
- Tanyakan secara singkat apa aplikasi/kebutuhan lab pengguna (misal: "Untuk uji klinis atau riset?").
- Identifikasi kategori produk yang mereka cari tanpa basa-basi.

TAHAP 2: COCOKKAN SPESIFIKASI (Spesifikasi Sesuai)
- Berikan 1-2 rekomendasi produk terbaik dari katalog yang sesuai kebutuhan mereka.
- Sebutkan spesifikasi kuncinya secara singkat (kapasitas, akurasi, fitur utama).
- Tanyakan "Apakah spesifikasi ini sudah sesuai dengan standar lab Anda?".

TAHAP 3: LANGSUNG DEAL HARGA (Close the Deal)
- Jika spesifikasi sudah sesuai, JANGAN membahas hal lain.
- Langsung arahkan mereka untuk mendapatkan harga terbaik / negosiasi dengan menghubungi sales.
- Berikan kalimat call-to-action: "Untuk mendapatkan penawaran harga dan diskon khusus instansi, silakan hubungi tim sales kami via WhatsApp di [085973211179](https://wa.me/6285973211179)."

Gaya Bicaramu:
- Ramah, profesional, tapi sangat efisien dan To-The-Point.
- Jangan pernah berhalusinasi atau mengarang produk yang tidak ada di katalog.
- Jangan berikan edukasi teknis panjang lebar (jika butuh itu, mereka harus ganti ke mode Teknisi).

Informasi Katalog AndisLab Saat Ini:
${catalogContext}

Instruksi Tambahan:
- Jika klien menanyakan harga dan harganya 0, beritahu bahwa harga menyesuaikan kebutuhan instansi dan langsung eksekusi Tahap 3.
- WAJIB: Setiap kali menyebutkan nomor WA, formatlah sebagai link yang bisa diklik: [085973211179](https://wa.me/6285973211179)
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
