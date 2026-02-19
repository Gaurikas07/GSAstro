import { NextResponse } from "next/server";
import { getRazorpayInstance } from "@/lib/razorpay";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Transaction from "@/lib/models/Transaction";
export const runtime = 'nodejs';
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { amount, userId } = await req.json();

    if (!amount || !userId) {
      return NextResponse.json(
        { error: "amount and userId required" },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    if (numericAmount < 50) {
      return NextResponse.json(
        { error: "Minimum wallet recharge is ₹50" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
const razorpay = getRazorpayInstance();

const order = await razorpay.orders.create({

      amount: Math.round(numericAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { userId },
    });

    // Create pending transaction entry
    await Transaction.create({
      userId,
      amount: numericAmount,
      type: "credit",
      status: "pending",
      razorpayOrderId: order.id,
      description: "Wallet top-up",
    });

    return NextResponse.json({
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
