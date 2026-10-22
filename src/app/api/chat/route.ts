import { groq } from '@ai-sdk/groq';
import { google } from '@ai-sdk/google';
import { streamText, embed } from 'ai';
import { prisma } from '@/lib/db';
import { money } from '@/lib/money';
import { sanitizeChatRequest } from '@/lib/chat/sanitize';
import { classifyInput } from '@/lib/chat/classifyInput';
import { filterOutput } from '@/lib/chat/filterOutput';
import { buildSystemPrompt } from '@/lib/chat/guardrails';
import { createCannedUIResponse } from '@/lib/chat/cannedResponse';

export const maxDuration = 30;

function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || 'anonymous';
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json().catch(() => null);

    // 1. Sanitize & validate incoming request payload
    const sanitized = sanitizeChatRequest(rawBody);
    if (!sanitized.ok) {
      return new Response(sanitized.error, { status: 400 });
    }

    const { agent, messages, lastUserMessage } = sanitized;
    const clientIp = getClientIdentifier(req);

    // 2. Pre-LLM Guardrail Classifier (Zero-cost immunity against known exploits)
    const classification = classifyInput(lastUserMessage);
    if (!classification.isSafe && classification.cannedResponse) {
      // Record blocked attempt to ChatLog
      try {
        await prisma.chatLog.create({
          data: {
            sessionId: clientIp,
            userMessage: lastUserMessage,
            aiResponse: classification.cannedResponse,
            agent,
          },
        });
      } catch (logErr) {
        console.error('Failed to log blocked chat:', logErr);
      }

      return createCannedUIResponse(classification.cannedResponse);
    }

    // 3. Fetch products from database to use as catalog context
    const products = await prisma.product.findMany({
      include: { specs: true },
    });

    const catalogContext = products
      .map((p) => {
        const specStr = p.specs.map((s) => `${s.label}: ${s.value}`).join(', ');
        const priceStr =
          p.price.toNumber() > 0 ? money.formatIDR(p.price) : 'Hubungi sales untuk penawaran';
        return `- ${p.name} (Kategori: ${p.categoryLabel}, Brand: ${p.brand})\n  Harga: ${priceStr}\n  Deskripsi: ${p.description}\n  Spesifikasi: ${specStr}`;
      })
      .join('\n\n');

    // 4. RAG Semantic Search with passive data containment
    let ragContext = '';
    try {
      if (lastUserMessage.trim() !== '') {
        const { embedding } = await embed({
          model: google.textEmbeddingModel('text-embedding-004'),
          value: lastUserMessage,
        });

        const embeddingString = `[${embedding.join(',')}]`;
        const documents: any[] = await prisma.$queryRaw`
          SELECT title, content, 1 - (embedding <=> ${embeddingString}::vector) as similarity
          FROM "DocumentKnowledge"
          ORDER BY embedding <=> ${embeddingString}::vector
          LIMIT 3
        `;

        if (documents && documents.length > 0 && documents[0].similarity > 0.5) {
          ragContext = documents
            .map((d) => `<dokumen_referensi judul="${d.title}">\n${d.content}\n</dokumen_referensi>`)
            .join('\n\n');
        }
      }
    } catch (e) {
      console.error('Vector search error (RAG):', e);
    }

    // 5. System Prompt Generation with Hardened Guardrails & Canary
    const canaryToken = `CANARY_${Date.now().toString(36).toUpperCase()}`;
    const systemPrompt = buildSystemPrompt({
      agent,
      catalogContext,
      ragContext,
      canaryToken,
    });

    // 6. Select appropriate LLM model
    const selectedModel = agent === 'tech'
      ? google('gemini-2.5-flash')
      : groq('llama-3.3-70b-versatile');

    // 7. Create ChatLog entry
    let chatLogId: string | null = null;
    try {
      const chatLog = await prisma.chatLog.create({
        data: {
          sessionId: clientIp,
          userMessage: lastUserMessage,
          agent,
        },
      });
      chatLogId = chatLog.id;
    } catch (logErr) {
      console.error('Failed to create chat log placeholder:', logErr);
    }

    // 8. Stream response with safety limits
    const result = streamText({
      model: selectedModel,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.2,
      maxOutputTokens: 800,
      abortSignal: req.signal,
      onError: async ({ error }) => {
        console.error('AI stream error occurred:', error);
        if (chatLogId) {
          try {
            await prisma.chatLog.update({
              where: { id: chatLogId },
              data: { aiResponse: '[Gagal menghasilkan respons karena gangguan sistem]' },
            });
          } catch {}
        }
      },
      onFinish: async ({ text }) => {
        if (!chatLogId) return;
        try {
          // Filter output before saving to audit database
          const { filteredText } = filterOutput(text, canaryToken);
          await prisma.chatLog.update({
            where: { id: chatLogId },
            data: { aiResponse: filteredText },
          });
        } catch (e) {
          console.error('Failed to save AI response:', e);
        }
      },
    });

    // 9. Stream to client (strip reasoning tokens to prevent prompt/thought reverse engineering)
    return result.toUIMessageStreamResponse({
      sendReasoning: false,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
