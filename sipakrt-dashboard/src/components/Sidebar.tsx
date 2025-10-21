'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccess } from '@/components/AccessProvider';

const NAV = [
  { key: 'dashboard', href: '/', label: 'Dashboard', icon: '🏠' },
  { key: 'citizens', href: '/citizens', label: 'Data Warga', icon: '👥', admin: true },
  { key: 'services', href: '/services', label: 'Layanan Surat', icon: '📄' },
  { key: 'finance', href: '/finance', label: 'Keuangan', icon: '💰' },
  { key: 'patrol', href: '/patrol', label: 'Jadwal Ronda', icon: '🛡️' },
  { key: 'announcements', href: '/announcements', label: 'Pengumuman & Event', icon: '📢' },
  { key: 'reports', href: '/reports', label: 'Laporan & Aspirasi', icon: '💬' },
  { key: 'settings', href: '/settings', label: 'Pengaturan', icon: '⚙️', admin: true },
];

export default function Sidebar() {
  const { isAdmin } = useAccess();
  const pathname = usePathname();
  const items = NAV.filter((i) => (i.admin ? isAdmin : true));
  return (
    <aside className="w-64 shrink-0 hidden md:flex md:flex-col gap-2 p-4 bg-white/80 backdrop-blur border-r border-slate-100">
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="h-9 w-9 rounded-xl bg-brand grid place-items-center text-white text-lg">RT</div>
        <div>
          <div className="font-semibold text-slate-800">SIPAKRT</div>
          <div className="text-xs text-slate-500">Community Dashboard</div>
        </div>
      </div>
      <nav className="mt-4 grid gap-1">
        {items.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm font-medium border transition hover:bg-slate-50 ${
                active ? 'bg-brand-50 border-brand-50 text-brand' : 'border-transparent text-slate-700'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-3 text-xs text-slate-500">v0.2 – TS UI</div>
    </aside>
  );
}
