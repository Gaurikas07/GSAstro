import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { loginSchema } from '@/lib/validators';
import { signToken } from '@/lib/auth';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  await connectDB();
  const parsed = loginSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const user = await User.findOne({ email: parsed.data.email });
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const match = await bcrypt.compare(parsed.data.password, user.password);
  if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const token = signToken({ id: user._id.toString(), role: user.role, email: user.email });
  const res = NextResponse.json({ user: { id: user._id, role: user.role, name: user.name } });
  res.cookies.set('gsastro_token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
  return res;
}
