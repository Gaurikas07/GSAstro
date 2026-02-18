import mongoose, { Schema, models, model } from 'mongoose';

const MessageSchema = new Schema({
  sender: { type: String, enum: ['user', 'ai', 'admin'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ChatSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['ai', 'human'], required: true },
    astrologerName: { type: String, default: '' },
    messages: [MessageSchema],
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date }
  },
  { timestamps: true }
);

export default models.Chat || model('Chat', ChatSchema);
