'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { key: 'dashboard',     href: '/',             label: 'Dashboard',         icon: '🏠' },
  { key: 'services',      href: '/services',     label: 'Layanan Surat',     icon: '📄' },
  { key: 'billing',       href: '/billing',      label: 'Tagihan & Iuran',   icon: '💳' },
  { key: 'finance',       href: '/finance',      label: 'Keuangan',          icon: '💰' },
  { key: 'patrol',        href: '/patrol',       label: 'Jadwal Ronda',      icon: '🛡️' },
  { key: 'events',        href: '/events',       label: 'Kegiatan',          icon: '📅' },
  { key: 'announcements', href: '/announcements',label: 'Pengumuman',        icon: '📢' },
  { key: 'reports',       href: '/reports',      label: 'Laporan & Aspirasi',icon: '💬' },
  { key: 'profile',       href: '/profile',      label: 'Profil Saya',       icon: '🙋‍♂️' },
];

export default function Sidebar() {
  const pathname = usePathname();
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
        {NAV.map(item => {
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
      <div className="mt-auto p-3 text-xs text-slate-500">v0.2 – Warga</div>
    </aside>
  );
}
