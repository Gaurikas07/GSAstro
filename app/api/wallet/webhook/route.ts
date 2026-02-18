import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Transaction from '@/lib/models/Transaction';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-razorpay-signature') || '';
  if (!verifyWebhookSignature(body, signature)) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });

  const event = JSON.parse(body);
  if (event.event === 'payment.captured') {
    await connectDB();
    const payment = event.payload.payment.entity;
    const userId = payment.notes?.userId;
    if (userId) {
      const amount = payment.amount / 100;
      await User.findByIdAndUpdate(userId, { $inc: { balance: amount } });
      await Transaction.create({ userId, amount, type: 'credit', razorpayPaymentId: payment.id });
    }
  }

  return NextResponse.json({ ok: true });
}
