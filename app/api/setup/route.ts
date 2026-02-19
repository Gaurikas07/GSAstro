import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gsastro.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const userEmail = process.env.DEMO_USER_EMAIL || 'user@gsastro.com';

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const userHash = await bcrypt.hash('user12345', 10);

  const admin = await User.findOneAndUpdate(
    { email: adminEmail },
    {
      name: 'Admin',
      email: adminEmail,
      password: adminHash,
      phone: '0000000000',
      role: 'admin',
      balance: 0,
      birthDate: '1990-01-01',
      birthTime: '08:00',
      birthPlace: 'Delhi'
    },
    { upsert: true, new: true }
  );

  const demo = await User.findOneAndUpdate(
    { email: userEmail },
    {
      name: 'Demo User',
      email: userEmail,
      password: userHash,
      phone: '9999999999',
      role: 'user',
      balance: 200,
      birthDate: '1995-07-14',
      birthTime: '10:30',
      birthPlace: 'Mumbai'
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ adminId: admin._id, demoUserId: demo._id, note: 'Set NEXT_PUBLIC_DEMO_USER_ID to demoUserId' });
}
