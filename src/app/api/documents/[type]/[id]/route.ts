import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { Prisma } from "@prisma/client";

const TYPE_MAP = {
  "invoice-proof": async (id: string) => {
    const inv = await prisma.invoice.findUnique({ where: { id }, include: { project: { include: { inquiry: true } }, order: true } });
    if (!inv || !inv.paymentProof) return null;
    
    if (inv.orderId && inv.order) {
      return { url: inv.paymentProof, entityId: inv.id, type: "order", order: inv.order };
    }
    if (inv.projectId && inv.project) {
      return { url: inv.paymentProof, entityId: inv.id, type: "project", projectId: inv.projectId, customerId: null, inquiryId: inv.project.inquiryId };
    }
    return null;
  },
  "quotation": async (id: string) => {
    const quote = await prisma.quotation.findUnique({ where: { id }, include: { inquiry: true } });
    if (!quote || !quote.pdfUrl) return null;
    return { url: quote.pdfUrl, entityId: quote.id, type: "inquiry", inquiryId: quote.inquiryId };
  },
  "order-po": async (id: string) => {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order || !order.poDocumentUrl) return null;
    return { url: order.poDocumentUrl, entityId: order.id, type: "order", order };
  },
  "project-po": async (id: string) => {
    const proj = await prisma.project.findUnique({ where: { id }, include: { inquiry: true } });
    if (!proj || !proj.poDocument) return null;
    return { url: proj.poDocument, entityId: proj.id, type: "project", projectId: proj.id, inquiryId: proj.inquiryId };
  }
};

export async function GET(request: Request, props: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await props.params;

  const urlObj = new URL(request.url);
  const guestToken = urlObj.searchParams.get("t");

  // 1. Fetch document record
  if (!(type in TYPE_MAP)) {
    return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
  }

  const docResolver = TYPE_MAP[type as keyof typeof TYPE_MAP];
  const docInfo = await docResolver(id);

  if (!docInfo || !docInfo.url) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // 2. Authorization check
  const session = await verifySession();
  const isAdmin = !!session?.isAuth;

  let isAuthorized = isAdmin;

  // Guest Token Check for Orders
  if (!isAuthorized && docInfo.type === "order" && "order" in docInfo && docInfo.order) {
    if (guestToken && docInfo.order.guestAccessToken === guestToken) {
      if (!docInfo.order.guestAccessTokenExpiresAt || new Date() <= docInfo.order.guestAccessTokenExpiresAt) {
        isAuthorized = true;
      }
    }
    // Also, if customer is logged in and owns the order (future-proofing)
    // currently auth doesn't distinguish customers vs admin well here without more logic, 
    // but the prompt focuses on preventing IDOR and enforcing guestAccessToken.
  }

  if (!isAuthorized) {
    return NextResponse.json({ error: "Forbidden: You do not have access to this document" }, { status: 403 });
  }

  // 3. Proxy Download
  // Since Vercel Blob returns public URLs, we fetch the blob server-side and stream it to the client.
  // This hides the original blob URL.
  try {
    const response = await fetch(docInfo.url);
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch document from storage" }, { status: 500 });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    // Optional: Force download
    // headers.set("Content-Disposition", `attachment; filename="${type}-${id}"`);

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error proxying document:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
