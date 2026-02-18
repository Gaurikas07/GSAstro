import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Chat from '@/lib/models/Chat';
import { humanStartSchema } from '@/lib/validators';

export async function POST(req: Request) {
  await connectDB();
  const parsed = humanStartSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const user = await User.findById(parsed.data.userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (user.balance < 60) return NextResponse.json({ error: 'Minimum balance ₹60 required' }, { status: 400 });

  const chat = await Chat.create({ userId: user._id, type: 'human', astrologerName: 'Human Astrologer', messages: [], status: 'active', startedAt: new Date() });
  return NextResponse.json({ chatId: chat._id });
}
