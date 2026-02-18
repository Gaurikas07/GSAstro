import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const aiChatSchema = z.object({
  userId: z.string(),
  message: z.string().min(1),
  astrologerName: z.enum([
    "Vedic Expert",
    "Love Specialist",
    "Career Guide",
  ]),
  chatId: z.string().optional(),
});

export const humanStartSchema = z.object({
  userId: z.string(),
});

export const kundliSchema = z.object({
  userId: z.string(),
});
