import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Chat from '@/lib/models/Chat';
import { aiChatSchema } from '@/lib/validators';
import { generateAstroResponse } from '@/lib/ai';

export async function POST(req: Request) {
  await connectDB();
  const parsed = aiChatSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const user = await User.findById(parsed.data.userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const birthContext = `${user.birthDate} ${user.birthTime}, ${user.birthPlace}`;
  const aiReply = await generateAstroResponse(parsed.data.astrologerName, birthContext, parsed.data.message);

  const chat = await Chat.create({
    userId: user._id,
    type: 'ai',
    astrologerName: parsed.data.astrologerName,
    messages: [
      { sender: 'user', text: parsed.data.message },
      { sender: 'ai', text: aiReply }
    ],
    status: 'active'
  });

  return NextResponse.json({ chatId: chat._id, reply: aiReply });
}
