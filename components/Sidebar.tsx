'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard/chat', label: 'Chats' },
  { href: '/dashboard/wallet', label: 'Wallet' },
  { href: '/dashboard/kundli', label: 'Kundli' },
  { href: '/dashboard/profile', label: 'Profile' },
  { href: '/admin', label: 'Admin' }
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full border-b border-gold/20 bg-nebula p-4 md:w-64 md:border-r md:border-b-0">
      <h2 className="mb-4 text-2xl font-bold text-gold">GSAstro</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-lg px-3 py-2 ${pathname === link.href ? 'bg-gold text-black' : 'hover:bg-gold/20'}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
