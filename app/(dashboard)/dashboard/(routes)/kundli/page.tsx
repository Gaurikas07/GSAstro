'use client';

import { useState } from 'react';

const USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID || '';

export default function KundliPage() {
  const [result, setResult] = useState<string>('');

  const generate = async () => {
    const res = await fetch('/api/kundli', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: USER_ID })
    });
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <div className="card space-y-4">
      <h1 className="text-2xl font-bold text-gold">Kundli Generator</h1>
      <button className="btn-gold" onClick={generate}>Generate Kundli</button>
      {result && <pre className="overflow-auto rounded-lg bg-cosmos p-3 text-xs">{result}</pre>}
    </div>
  );
}
