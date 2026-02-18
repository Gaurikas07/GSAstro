import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GSAstro',
  description: 'Astrology platform with AI and human astrologer chat'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
