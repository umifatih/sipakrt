'use client';
import Button from '@/components/Button';

export default function Topbar() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
        {/* kiri (logo kecil saat mobile) */}
        <div className="md:hidden flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand grid place-items-center text-white text-sm">RT</div>
          <div className="font-semibold">SIPAKRT</div>
        </div>

        {/* tengah */}
        <div className="hidden md:block text-sm text-slate-500">
          Dashboard Pengelolaan Lingkungan
        </div>

        {/* kanan */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden sm:inline-flex">🔔 Notifikasi</Button>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand to-brand-700 text-white grid place-items-center">
            AK
          </div>
        </div>
      </div>
    </header>
  );
}
