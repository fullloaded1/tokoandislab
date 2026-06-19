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
      data: { likeCount: { increment: 1 } },
      select: { likeCount: true },
    });

    return NextResponse.json({ likeCount: article.likeCount });
  } catch {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  try {
    // Prevent going below zero
    const current = await prisma.article.findUnique({
      where: { slug },
      select: { likeCount: true },
    });

    if (!current) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (current.likeCount <= 0) {
      return NextResponse.json({ likeCount: 0 });
    }

    const article = await prisma.article.update({
      where: { slug },
      data: { likeCount: { decrement: 1 } },
      select: { likeCount: true },
    });

    return NextResponse.json({ likeCount: article.likeCount });
  } catch {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }
}
