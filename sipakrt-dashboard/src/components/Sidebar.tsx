'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Users, FileText, Wallet, Shield, Calendar, MessageSquare, User, LogOut,
} from 'lucide-react';

const MENU = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/data', label: 'Data', icon: Users, disabled: true },
  { href: '/services', label: 'Layanan', icon: FileText },
  { href: '/finance', label: 'Keuangan', icon: Wallet },
  { href: '/patrol', label: 'Ronda', icon: Shield },
  { href: '/events', label: 'Event', icon: Calendar },
  { href: '/announcements', label: 'Aspirasi', icon: MessageSquare },
  { href: '/profile', label: 'Profil', icon: User },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white/70 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007BFF] to-[#0056d2] flex items-center justify-center shadow-lg">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[#007BFF] tracking-tight">SIPAKRT</h1>
            <p className="text-sm text-gray-500">Sistem Informasi RT</p>
          </div>
        </div>

        <nav className="space-y-2">
          {MENU.map((m) => {
            const Icon = m.icon;
            const active = m.href === '/'
              ? pathname === '/'
              : pathname.startsWith(m.href);

            return m.disabled ? (
              <div
                key={m.href}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 cursor-not-allowed"
              >
                <Icon className="w-5 h-5" />
                <span>{m.label}</span>
              </div>
            ) : (
              <Link
                key={m.href}
                href={m.href}
                className={[
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out',
                  active
                    ? 'bg-[#007BFF] text-white shadow-[0_4px_16px_rgba(0,123,255,0.3)]'
                    : 'text-gray-600 hover:bg-[#E8F1FB] hover:text-[#007BFF]',
                ].join(' ')}
              >
                <Icon className="w-5 h-5" />
                <span>{m.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => {/* TODO: handle logout */}}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all duration-300 ease-out mt-8"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gradient-to-r from-[#E8F1FB] to-[#C8E6C9] rounded-xl p-4">
          <p className="text-xs text-gray-600">🔒 Sistem ini menerapkan akses berbasis peran (RBAC)</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
