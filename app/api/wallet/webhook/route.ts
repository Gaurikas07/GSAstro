import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Transaction from "@/lib/models/Transaction";
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      await connectDB();

      const payment = event.payload.payment.entity;
      const userId = payment.notes?.userId;
      const razorpayPaymentId = payment.id;
      const razorpayOrderId = payment.order_id;

      if (!userId) {
        return NextResponse.json({ ok: true });
      }

      // Check if transaction already processed
      const existingTransaction = await Transaction.findOne({
        razorpayPaymentId,
      });

      if (existingTransaction) {
        return NextResponse.json({ ok: true }); // prevent double credit
      }

      const amount = payment.amount / 100;

      // Update user balance safely
      await User.findByIdAndUpdate(userId, {
        $inc: { balance: amount },
      });

      // Mark pending transaction as completed OR create new one
      await Transaction.findOneAndUpdate(
        { razorpayOrderId },
        {
          status: "completed",
          razorpayPaymentId,
        },
        { new: true }
      );

      // If no pending transaction existed, create fallback
      await Transaction.updateOne(
        { razorpayPaymentId },
        {
          $setOnInsert: {
            userId,
            amount,
            type: "credit",
            status: "completed",
            razorpayOrderId,
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
