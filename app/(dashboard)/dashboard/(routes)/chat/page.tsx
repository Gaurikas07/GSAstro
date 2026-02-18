'use client';

import { useState } from 'react';

const USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID || '';

export default function ChatPage() {
  const [persona, setPersona] = useState('Vedic Expert');
  const [msg, setMsg] = useState('');
  const [reply, setReply] = useState('');
  const [humanChatId, setHumanChatId] = useState('');

  const askAI = async () => {
    const res = await fetch('/api/chat/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: USER_ID, astrologerName: persona, message: msg })
    });
    const data = await res.json();
    setReply(data.reply || data.error);
  };

  const startHuman = async () => {
    const res = await fetch('/api/chat/human/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: USER_ID })
    });
    const data = await res.json();
    setHumanChatId(data.chatId || data.error);
  };

  return (
    <div className="space-y-6">
      <div className="card space-y-3">
        <h1 className="text-2xl font-bold text-gold">AI Astrologer Chat</h1>
        <select className="input" value={persona} onChange={(e) => setPersona(e.target.value)}>
          <option>Vedic Expert</option>
          <option>Love Specialist</option>
          <option>Career Guide</option>
        </select>
        <textarea className="input" rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Ask your astrology question" />
        <button className="btn-gold" onClick={askAI}>Ask AI</button>
        {reply && <p className="rounded-lg bg-cosmos p-3">{reply}</p>}
      </div>

      <div className="card space-y-3">
        <h2 className="text-xl font-semibold text-gold">Human Astrologer Chat</h2>
        <p className="text-sm text-slate-300">Requires minimum wallet balance of ₹60. Charged ₹20/minute.</p>
        <button className="btn-gold" onClick={startHuman}>Start Human Chat</button>
        {humanChatId && <p className="text-sm text-slate-300">Session: {humanChatId}</p>}
      </div>
    </div>
  );
}
