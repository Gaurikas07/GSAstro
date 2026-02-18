'use client';

import { useState } from 'react';

const USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID || '';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [status, setStatus] = useState('');

  const save = async () => {
    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: USER_ID, name, phone, birthDate, birthTime, birthPlace })
    });
    setStatus(res.ok ? 'Profile updated' : 'Failed');
  };

  return (
    <div className="card space-y-3">
      <h1 className="text-2xl font-bold text-gold">Profile</h1>
      <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="input" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input className="input" placeholder="Birth Date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
      <input className="input" placeholder="Birth Time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
      <input className="input" placeholder="Birth Place" value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} />
      <button className="btn-gold" onClick={save}>Save Profile</button>
      <p>{status}</p>
      <form action="/api/upload" method="post" encType="multipart/form-data" className="space-y-2 rounded-lg border border-gold/20 p-3">
        <input type="hidden" name="userId" value={USER_ID} />
        <input className="input" type="file" name="image" />
        <button className="btn-gold" type="submit">Upload Profile Image</button>
      </form>
    </div>
  );
}
