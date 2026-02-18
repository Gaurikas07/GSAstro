import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Chat from '@/lib/models/Chat';

export async function GET() {
  await connectDB();
  const chats = await Chat.find({ type: 'human', status: 'active' }).populate('userId', 'name email');
  return NextResponse.json({ chats });
}
