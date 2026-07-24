import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { removeBackground } from "@imgly/background-removal-node";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  // Protect the route
  const session = await verifySession();
  if (!session?.isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!filename || !request.body) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let uploadBuffer = buffer;

    // Proses Remove BG menggunakan @imgly/background-removal-node
    try {
      console.log(`Starting background removal for ${filename}...`);
      
      // imgly requires a standard Blob object which is globally available in modern Node/Next.js
      const imageBlob = new Blob([buffer]);
      
      const bgRemovedBlob = await removeBackground(imageBlob);
      const bgRemovedArrayBuffer = await bgRemovedBlob.arrayBuffer();
      uploadBuffer = Buffer.from(bgRemovedArrayBuffer);
      
      console.log(`Successfully removed background for ${filename}`);
    } catch (bgError) {
      console.error("Error removing background with imgly:", bgError);
      // Fallback: Use original image buffer if background removal fails
    }

    const blob = await put(filename, uploadBuffer, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Blob upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
