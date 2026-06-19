import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(
  _request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  try {
    const article = await prisma.article.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });

    return NextResponse.json({ viewCount: article.viewCount });
  } catch {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }
}
