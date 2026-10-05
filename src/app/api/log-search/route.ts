import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { query, results } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    await prisma.searchLog.create({
      data: {
        query: query.trim(),
        results: typeof results === "number" ? results : 0,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging search:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
