'use client';

import { useState } from 'react';

const USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID || '';

export default function WalletPage() {
  const [amount, setAmount] = useState(100);
  const [orderData, setOrderData] = useState('');

  const createOrder = async () => {
    const res = await fetch('/api/wallet/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, userId: USER_ID })
    });
    const data = await res.json();
    setOrderData(JSON.stringify(data.order || data, null, 2));
  };

  return (
    <div className="card space-y-4">
      <h1 className="text-2xl font-bold text-gold">Wallet & Razorpay</h1>
      <input className="input" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={1} />
      <button className="btn-gold" onClick={createOrder}>Create Razorpay Order</button>
      {orderData && <pre className="overflow-auto rounded-lg bg-cosmos p-3 text-xs">{orderData}</pre>}
    </div>
  );
}
