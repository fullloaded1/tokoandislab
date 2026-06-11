import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Helper function to send Telegram message
async function sendTelegramMessage(log: {
  source: string;
  leadName?: string | null;
  leadInstitution?: string | null;
  leadPhone?: string | null;
  productName?: string | null;
  inquiryNo?: string | null;
  messageText?: string | null;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const text = `🔔 *LEAD WHATSAPP BARU*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Nama:* ${log.leadName || "-"}\n` +
      `🏢 *Instansi:* ${log.leadInstitution || "-"}\n` +
      `📞 *No. WA:* ${log.leadPhone || "-"}\n` +
      `🌐 *Sumber:* ${log.source}\n` +
      `📦 *Produk:* ${log.productName || "-"}\n` +
      `🧾 *Inquiry Ref:* ${log.inquiryNo || "-"}\n` +
      `💬 *Pesan:* ${log.messageText || "-"}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Silakan segera hubungi klien!`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });
  } catch (err) {
    console.error("Telegram notify failed:", err);
  }
}

const waNumber = "6282125523466";

// GET request (simple anchor tag redirection)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source") || "unknown";
    const text = searchParams.get("text") || "";
    const productId = searchParams.get("productId") || undefined;
    const productName = searchParams.get("productName") || undefined;
    const inquiryNo = searchParams.get("inquiryNo") || undefined;

    let log = null;
    try {
      log = await prisma.whatsAppLog.create({
        data: {
          source,
          productName,
          productId,
          inquiryNo,
          messageText: text || null,
          status: "NEW",
        },
      });
    } catch (dbError) {
      console.error("DB logging failed:", dbError);
    }

    // Fire background Telegram notification if log created
    if (log) {
      sendTelegramMessage(log).catch(console.error);
    }

    const redirectUrl = `https://wa.me/${waNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
    return NextResponse.redirect(redirectUrl, 307);
  } catch (error) {
    console.error("GET wa-redirect error:", error);
    return NextResponse.redirect(`https://wa.me/${waNumber}`, 307);
  }
}

// POST request (Modal Form submission)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      source,
      text,
      productId,
      productName,
      inquiryNo,
      leadName,
      leadInstitution,
      leadPhone,
    } = body;

    let log = null;
    try {
      log = await prisma.whatsAppLog.create({
        data: {
          source: source || "unknown",
          productName: productName || null,
          productId: productId || null,
          inquiryNo: inquiryNo || null,
          messageText: text || null,
          leadName: leadName || null,
          leadInstitution: leadInstitution || null,
          leadPhone: leadPhone || null,
          status: "NEW",
        },
      });
    } catch (dbError) {
      console.error("DB logging failed on POST:", dbError);
    }

    // Fire Telegram message
    if (log) {
      sendTelegramMessage(log).catch(console.error);
    }

    // Build the specific message text including the lead credentials
    let finalMsg = text || "";
    if (leadName && leadInstitution) {
      const intro = `Halo Andis Lab, saya ${leadName} dari ${leadInstitution}.\n\n`;
      finalMsg = intro + finalMsg;
    }
    
    const redirectUrl = `https://wa.me/${waNumber}${finalMsg ? `?text=${encodeURIComponent(finalMsg)}` : ""}`;

    return NextResponse.json({ success: true, redirectUrl });
  } catch (error: any) {
    console.error("POST wa-redirect error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to log lead", redirectUrl: `https://wa.me/${waNumber}` },
      { status: 500 }
    );
  }
}
