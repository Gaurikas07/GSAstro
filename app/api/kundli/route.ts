import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { generateAstroResponse } from '@/lib/ai';
import { kundliSchema } from '@/lib/validators';

export async function POST(req: Request) {
  await connectDB();
  const parsed = kundliSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const user = await User.findById(parsed.data.userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const structured = {
    lagna: 'Aries',
    moonSign: 'Cancer',
    sunSign: 'Leo',
    nakshatra: 'Pushya',
    doshas: ['Mangal Dosha (mild)'],
    favorablePlanet: 'Jupiter'
  };

  const interpretation = await generateAstroResponse(
    'Vedic Expert',
    `${user.birthDate} ${user.birthTime} ${user.birthPlace}`,
    'Provide a concise kundli interpretation, strengths, challenges and remedies.'
  );

  return NextResponse.json({ kundli: structured, interpretation });
}
