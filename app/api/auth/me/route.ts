import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { getTokenFromCookies, verifyToken } from '@/lib/auth';

export async function GET() {
  const token = getTokenFromCookies();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = verifyToken(token);
  await connectDB();
  const user = await User.findById(session.id).select('-password');
  return NextResponse.json({ user });
}
