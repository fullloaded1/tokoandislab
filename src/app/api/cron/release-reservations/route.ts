import { NextResponse } from 'next/server';
import { releaseExpiredReservations } from '@/lib/stock';

export const dynamic = 'force-dynamic';
// export const runtime = 'edge'; // Cron jobs usually can run on Edge, but Prisma sometimes needs Node.js. Use default Node.js.

export async function GET(req: Request) {
  try {
    // Optionally check for authorization header here if running outside Vercel's protected cron
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { released, cancelled } = await releaseExpiredReservations();

    return NextResponse.json({
      success: true,
      message: `Lepas ${released} reservasi, cancel ${cancelled} order kedaluwarsa.`,
      released,
      cancelled,
    });
  } catch (error: any) {
    console.error("Cron Error: Failed to release reservations", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
