import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || '';

export type SessionUser = { id: string; role: 'user' | 'admin'; email: string };

export function signToken(payload: SessionUser) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): SessionUser {
  return jwt.verify(token, JWT_SECRET) as SessionUser;
}

export function getTokenFromCookies() {
  return cookies().get('gsastro_token')?.value;
}
