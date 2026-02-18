'use client';

import { useEffect, useState } from 'react';

type User = { _id: string; name: string; email: string; balance: number; role: string };
type Chat = { _id: string; userId?: { name: string; email: string }; messages: { sender: string; text: string }[] };

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [reply, setReply] = useState<Record<string, string>>({});

  const load = async () => {
    const [u, c] = await Promise.all([fetch('/api/admin/users'), fetch('/api/admin/chats')]);
    const usersData = await u.json();
    const chatsData = await c.json();
    setUsers(usersData.users || []);
    setChats(chatsData.chats || []);
  };

  useEffect(() => {
    load();
  }, []);

  const sendReply = async (chatId: string) => {
    await fetch('/api/admin/chat/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, text: reply[chatId] })
    });
    setReply((p) => ({ ...p, [chatId]: '' }));
    load();
  };

  return (
    <main className="space-y-6 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gold">Admin Panel</h1>

      <section className="card">
        <h2 className="mb-3 text-xl font-semibold text-gold">All Users & Balances</h2>
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gold/20">
                <th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Role</th><th className="p-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gold/10">
                  <td className="p-2">{u.name}</td><td className="p-2">{u.email}</td><td className="p-2">{u.role}</td><td className="p-2">₹{u.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card space-y-4">
        <h2 className="text-xl font-semibold text-gold">Active Human Chats</h2>
        {chats.map((chat) => (
          <div key={chat._id} className="rounded-lg border border-gold/20 p-3">
            <p className="text-sm text-slate-300">{chat.userId?.name} ({chat.userId?.email})</p>
            <div className="my-2 max-h-36 overflow-auto rounded bg-cosmos p-2 text-sm">
              {chat.messages.map((m, i) => <p key={i}><b>{m.sender}:</b> {m.text}</p>)}
            </div>
            <div className="flex gap-2">
              <input className="input" value={reply[chat._id] || ''} onChange={(e) => setReply((p) => ({ ...p, [chat._id]: e.target.value }))} />
              <button className="btn-gold" onClick={() => sendReply(chat._id)}>Reply</button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
