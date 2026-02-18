export const aiChatSchema = z.object({
  userId: z.string(),
  message: z.string(),
  astrologerName: z.enum([
    'Vedic Expert',
    'Love Specialist',
    'Career Guide'
  ]),
  chatId: z.string().optional()
});
