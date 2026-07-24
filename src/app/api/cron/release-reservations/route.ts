import { NextResponse } from 'next/server';
import { releaseExpiredReservations } from '@/lib/stock';

export const dynamic = 'force-dynamic';
// export const runtime = 'edge'; // Cron jobs usually can run on Edge, but Prisma sometimes needs Node.js. Use default Node.js.

export async function GET(req: Request) {
  try {
    // Fail-closed: reject if CRON_SECRET is not configured or doesn't match
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
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
