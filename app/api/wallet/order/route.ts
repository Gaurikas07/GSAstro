import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';

export async function POST(req: Request) {
  const { amount, userId } = await req.json();
  if (!amount || !userId) return NextResponse.json({ error: 'amount and userId required' }, { status: 400 });

  const order = await razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
    notes: { userId }
  });

  return NextResponse.json({ order, key: process.env.RAZORPAY_KEY_ID });
}
