import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Hanya lindungi halaman yang dimulai dengan /admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');

    // Ganti ini dengan username & password yang Anda inginkan
    const USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const PASSWORD = process.env.ADMIN_PASSWORD || 'andislab123';

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      // Decode base64
      const [user, pwd] = atob(authValue).split(':');

      if (user === USERNAME && pwd === PASSWORD) {
        return NextResponse.next();
      }
    }

    // Jika belum login atau password salah, minta login
    return new NextResponse('Autentikasi Diperlukan.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
