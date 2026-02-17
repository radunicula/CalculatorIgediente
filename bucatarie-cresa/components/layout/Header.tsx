// components/layout/Header.tsx

'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">🍽️</span>
            <span className="text-xl font-semibold">Bucătărie Creșă</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-blue-600"
            >
              Raport Zilnic
            </Link>
            <Link
              href="/retete"
              className="text-sm font-medium transition-colors hover:text-blue-600"
            >
              Rețete
            </Link>
            <Link
              href="/ingrediente"
              className="text-sm font-medium transition-colors hover:text-blue-600"
            >
              Ingrediente
            </Link>
            <Link
              href="/istoric"
              className="text-sm font-medium transition-colors hover:text-blue-600"
            >
              Istoric
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
