import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Chat from "@/lib/models/Chat";
import { aiChatSchema } from "@/lib/validators";
import { generateAstroResponse } from "@/lib/ai";
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    await connectDB();

    const parsed = aiChatSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, message, astrologerName, chatId } = parsed.data;

    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message too long" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const birthContext = `${user.birthDate} ${user.birthTime}, ${user.birthPlace}`;

    const aiReply = await generateAstroResponse(
      astrologerName,
      birthContext,
      message
    );

    let chat;

    if (chatId) {
      // Append to existing chat
      chat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: {
            messages: [
              { sender: "user", text: message },
              { sender: "ai", text: aiReply },
            ],
          },
          lastActivityAt: new Date(),
        },
        { new: true }
      );
    } else {
      // Create new chat
      chat = await Chat.create({
        userId: user._id,
        type: "ai",
        astrologerName,
        messages: [
          { sender: "user", text: message },
          { sender: "ai", text: aiReply },
        ],
        status: "active",
      });
    }

    return NextResponse.json({
      chatId: chat?._id,
      reply: aiReply,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "AI chat failed" },
      { status: 500 }
    );
  }
}
