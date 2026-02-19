import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Chat from "@/lib/models/Chat";
import { humanStartSchema } from "@/lib/validators";
export const runtime = 'nodejs';

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectDB();

    const parsed = humanStartSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { userId } = parsed.data;

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.balance < 60) {
      return NextResponse.json(
        { error: "Minimum balance ₹60 required" },
        { status: 400 }
      );
    }

    // Prevent multiple active human chats
    const existingActiveChat = await Chat.findOne({
      userId,
      type: "human",
      status: "active",
    });

    if (existingActiveChat) {
      return NextResponse.json({
        chatId: existingActiveChat._id,
      });
    }

    const chat = await Chat.create({
      userId: user._id,
      type: "human",
      astrologerName: "Personal Astrologer",
      messages: [],
      status: "active",
      startedAt: new Date(),
    });

    return NextResponse.json({ chatId: chat._id });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to start human chat" },
      { status: 500 }
    );
  }
}
