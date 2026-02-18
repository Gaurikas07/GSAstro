import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Chat from '@/lib/models/Chat';

export async function POST(req: Request) {
  await connectDB();
  const { chatId, sender, text } = await req.json();
  if (!chatId || !sender || !text) return NextResponse.json({ error: 'chatId, sender and text are required' }, { status: 400 });

  const chat = await Chat.findById(chatId);
  if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
  if (chat.status !== 'active') return NextResponse.json({ error: 'Chat closed' }, { status: 400 });

  chat.messages.push({ sender, text, timestamp: new Date() });
  await chat.save();
  return NextResponse.json({ success: true, chat });
}
