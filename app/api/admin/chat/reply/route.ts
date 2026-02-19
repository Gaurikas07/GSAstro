import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Chat from '@/lib/models/Chat';
export const runtime = 'nodejs';
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await connectDB();
  const { chatId, text } = await req.json();
  if (!chatId || !text) return NextResponse.json({ error: 'chatId and text required' }, { status: 400 });
  const chat = await Chat.findById(chatId);
  if (!chat) return NextResponse.json({ error: 'chat not found' }, { status: 404 });
  chat.messages.push({ sender: 'admin', text, timestamp: new Date() });
  await chat.save();
  return NextResponse.json({ chat });
}
