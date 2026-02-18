import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Chat from '@/lib/models/Chat';
import User from '@/lib/models/User';
import Transaction from '@/lib/models/Transaction';

export async function POST(req: Request) {
  await connectDB();
  const { chatId } = await req.json();
  const chat = await Chat.findById(chatId);
  if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

  const end = new Date();
  const start = new Date(chat.startedAt || chat.createdAt);
  const minutes = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 60000));
  const charge = minutes * 20;

  const user = await User.findById(chat.userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  user.balance = Math.max(0, user.balance - charge);
  await user.save();

  chat.status = 'closed';
  chat.endedAt = end;
  await chat.save();

  await Transaction.create({ userId: user._id, amount: charge, type: 'debit', razorpayPaymentId: `human_chat_${chatId}` });

  return NextResponse.json({ charge, minutes, balance: user.balance });
}
