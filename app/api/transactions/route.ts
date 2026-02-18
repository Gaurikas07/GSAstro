import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Transaction from '@/lib/models/Transaction';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  await connectDB();
  const userId = new URL(req.url).searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
  const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json({ transactions });
}
