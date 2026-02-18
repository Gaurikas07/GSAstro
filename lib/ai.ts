const personaPrompts: Record<string, string> = {
  'Vedic Expert': 'You are a precise Vedic astrologer. Give practical remedies and concise predictions.',
  'Love Specialist': 'You are a compassionate relationship astrologer. Focus on compatibility and emotional healing.',
  'Career Guide': 'You are a strategic career astrologer. Suggest timing, strengths, and action plans.'
};

export async function generateAstroResponse(persona: string, birthContext: string, message: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return `Guidance (${persona}): Based on your birth details (${birthContext}), focus on discipline, clear communication, and patience this week.`;
  }

  const prompt = `${personaPrompts[persona]}\nBirth details: ${birthContext}\nUser question: ${message}`;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    return 'Unable to fetch Gemini response at the moment. Please try again shortly.';
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
}
