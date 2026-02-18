import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { generateAstroResponse } from "@/lib/ai";
import { kundliSchema } from "@/lib/validators";
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    await connectDB();

    const parsed = kundliSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { userId } = parsed.data;

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const birthContext = `${user.birthDate}, ${user.birthTime}, ${user.birthPlace}`;

    const aiResponse = await generateAstroResponse(
      "Vedic Expert",
      birthContext,
      `Generate a structured Vedic kundli in JSON format with:
      lagna,
      moonSign,
      sunSign,
      nakshatra,
      doshas (array),
      favorablePlanet,
      strengths,
      challenges,
      remedies.
      Respond ONLY in valid JSON.`
    );

    let kundliData;

    try {
      kundliData = JSON.parse(aiResponse);
    } catch {
      // fallback if AI formatting fails
      kundliData = {
        lagna: "Unknown",
        moonSign: "Unknown",
        sunSign: "Unknown",
        nakshatra: "Unknown",
        doshas: [],
        favorablePlanet: "Unknown",
        strengths: "Analysis unavailable",
        challenges: "Analysis unavailable",
        remedies: "Please try again",
      };
    }

    return NextResponse.json({
      kundli: kundliData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Kundli generation failed" },
      { status: 500 }
    );
  }
}
