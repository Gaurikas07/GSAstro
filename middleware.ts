import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const protectedPath = req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin');
  if (!protectedPath) return NextResponse.next();

  const token = req.cookies.get('gsastro_token')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || '') as { role: string };
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
