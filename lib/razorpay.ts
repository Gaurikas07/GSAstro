import crypto from "crypto";

export function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Razorpay keys not configured");
  }

  const Razorpay = require("razorpay");

  return new Razorpay({
    key_id,
    key_secret,
  });
}

export function verifyWebhookSignature(body: string, signature: string) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("Webhook secret not configured");
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}
