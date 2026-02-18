import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-cosmos to-black px-6 text-center">
      <h1 className="text-5xl font-bold text-gold">GSAstro</h1>
      <p className="max-w-xl text-lg text-slate-200">Your complete astrology platform powered by AI + human astrologers, secure wallet payments, and kundli generation.</p>
      <div className="flex gap-4">
        <Link href="/login" className="btn-gold">Login</Link>
        <Link href="/dashboard/chat" className="rounded-lg border border-gold px-4 py-2 text-gold">Open Dashboard</Link>
      </div>
    </main>
  );
}
