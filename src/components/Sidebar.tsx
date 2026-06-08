'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Users, FileText, Wallet, Shield,
  Calendar, MessageSquare, User, LogOut, LogOutIcon,
} from 'lucide-react';

// ⬇️ Import dialog buatanmu (components/ui/dialog.tsx)
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const confirmLogout = () => {
    // bersihkan “login flag”
    localStorage.removeItem('isLoggedIn');
    // arahkan ke login
    router.replace('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-white/70 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div className="p-6">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#007BFF] to-[#0056d2] shadow-lg">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-[#007BFF] tracking-tight">SIPAKRT</h1>
              <p className="text-sm text-gray-500">Sistem Informasi RT</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-6">
          {MENU.map((m) => {
            const Icon = m.icon;
            const active = m.href === '/' ? pathname === '/' : pathname.startsWith(m.href);

            if (m.disabled) {
              return (
                <div
                  key={m.href}
                  className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-gray-300"
                >
                  <Icon className="h-5 w-5" />
                  <span>{m.label}</span>
                </div>
              );
            }

            return (
              <Link
                key={m.href}
                href={m.href}
                className={[
                  'flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ease-out',
                  active
                    ? 'bg-[#007BFF] text-white shadow-[0_4px_16px_rgba(0,123,255,0.3)]'
                    : 'text-gray-600 hover:bg-[#E8F1FB] hover:text-[#007BFF]',
                ].join(' ')}
              >
                <Icon className="h-5 w-5" />
                <span>{m.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout + banner */}
        <div className="relative px-6 pb-6">
          {/* Trigger Dialog Logout */}
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="mb-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-500 transition-all duration-300 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-semibold">Logout</span>
              </button>
            </DialogTrigger>

            {/* Modal */}
            <DialogContent className="sm:max-w-md">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow">
                <LogOutIcon className="h-7 w-7" />
              </div>

              <DialogHeader>
                <DialogTitle className="text-center">Keluar dari Dashboard?</DialogTitle>
                <DialogDescription className="text-center">
                  Yakin ingin keluar dari Dashboard SIPAKRT?
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 flex justify-center gap-3">
                <DialogClose asChild>
                  <button
                    type="button"
                    className="min-w-[120px] rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                </DialogClose>

                <DialogClose asChild>
                  <button
                    type="button"
                    onClick={confirmLogout}
                    className="min-w-[150px] rounded-xl bg-[#1E66FF] px-4 py-2.5 font-medium text-white shadow hover:bg-[#1557dd]"
                  >
                    Keluar Sekarang
                  </button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </aside>
  );
}
