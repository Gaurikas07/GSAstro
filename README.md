# GSAstro (Next.js 14 + TypeScript + Tailwind + MongoDB)

Production-ready full-stack astrology platform with AI & human chat, wallet integrations, admin panel, kundli generation, and image uploads.

## Stack
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- MongoDB Atlas + Mongoose
- JWT auth + middleware
- Gemini API
- Razorpay

## Folder Structure

```text
app/
  (auth)/login/page.tsx
  (dashboard)/dashboard/layout.tsx
  (dashboard)/dashboard/(routes)/chat/page.tsx
  (dashboard)/dashboard/(routes)/wallet/page.tsx
  (dashboard)/dashboard/(routes)/kundli/page.tsx
  (dashboard)/dashboard/(routes)/profile/page.tsx
  admin/page.tsx
  api/
    auth/login/route.ts
    auth/me/route.ts
    chat/ai/route.ts
    chat/human/start/route.ts
    chat/human/reply/route.ts
    chat/human/end/route.ts
    wallet/order/route.ts
    wallet/webhook/route.ts
    kundli/route.ts
    transactions/route.ts
    user/profile/route.ts
    admin/users/route.ts
    admin/chats/route.ts
    admin/chat/reply/route.ts
    setup/route.ts
components/
  Sidebar.tsx
lib/
  ai.ts
  auth.ts
  db.ts
  razorpay.ts
  validators.ts
  models/
    User.ts
    Chat.ts
    Transaction.ts
pages/api/upload.ts
middleware.ts
```

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env.local
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Seed admin + demo user (optional):
   ```bash
   curl -X POST http://localhost:3000/api/setup
   ```
   Set `NEXT_PUBLIC_DEMO_USER_ID` from returned `demoUserId` and restart.

## Core Features
- AI Chat (Vedic Expert / Love Specialist / Career Guide) with Gemini and user birth details context.
- Human chat sessions with balance threshold check and ₹20/minute charge on session end.
- Razorpay order creation + secure webhook signature verification.
- Kundli API with structured output + AI interpretation.
- Admin panel: user balances, active human chats, admin replies.
- Multer based image upload endpoint storing local file path + DB update.

## Security
- JWT login and HTTP-only cookie session
- Middleware protection for `/admin` and `/api/admin/*`
- Zod validation on core APIs
- Environment-based secret management
