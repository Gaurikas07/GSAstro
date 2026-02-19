import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  await connectDB();
  const data = await req.json();
  const { userId, ...updates } = data;
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
  const allowed = ['name', 'phone', 'birthDate', 'birthTime', 'birthPlace', 'imagePath'];
  const filtered = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)));
  const user = await User.findByIdAndUpdate(userId, filtered, { new: true }).select('-password');
  return NextResponse.json({ user });
}
