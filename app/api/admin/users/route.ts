import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
export const runtime = 'nodejs';

export async function GET() {
  await connectDB();
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  return NextResponse.json({ users });
}
