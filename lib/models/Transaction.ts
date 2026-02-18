import { Schema, models, model } from 'mongoose';

const TransactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    razorpayPaymentId: { type: String, default: '' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.Transaction || model('Transaction', TransactionSchema);
