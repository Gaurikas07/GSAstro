import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Chat from "@/lib/models/Chat";
import User from "@/lib/models/User";
import Transaction from "@/lib/models/Transaction";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { chatId } = await req.json();

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId required" },
        { status: 400 }
      );
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    if (chat.status === "closed") {
      return NextResponse.json({
        message: "Chat already closed",
        charge: 0,
      });
    }

    const end = new Date();
    const start = new Date(chat.startedAt || chat.createdAt);

    const minutes = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / 60000)
    );

    const rate = chat.ratePerMinute || 20;
    const charge = minutes * rate;

    const user = await User.findById(chat.userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const finalCharge = Math.min(charge, user.balance);

    user.balance -= finalCharge;
    await user.save();

    chat.status = "closed";
    chat.endedAt = end;
    chat.durationMinutes = minutes;
    await chat.save();

    await Transaction.create({
      userId: user._id,
      amount: finalCharge,
      type: "debit",
      status: "completed",
      description: "Human astrologer session",
      razorpayPaymentId: `human_chat_${chatId}`,
    });

    return NextResponse.json({
      minutes,
      charge: finalCharge,
      balance: user.balance,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to end chat" },
      { status: 500 }
    );
  }
}
