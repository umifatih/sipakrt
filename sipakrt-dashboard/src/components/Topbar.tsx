'use client';
import Button from '@/components/Button';
import { useAccess } from '@/components/AccessProvider';

export default function Topbar() {
  const { isAdmin, setIsAdmin } = useAccess();
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="md:hidden flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand grid place-items-center text-white text-sm">RT</div>
          <div className="font-semibold">SIPAKRT</div>
        </div>
        <div className="hidden md:block text-sm text-slate-500">Dashboard Pengelolaan Lingkungan</div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden sm:inline-flex">
            🔔 Notifikasi
          </Button>
          <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <span className="hidden md:inline">Mode Akses:</span>
            <button onClick={() => setIsAdmin(false)} className={`px-2 py-1 rounded-lg ${!isAdmin ? 'bg-white shadow' : ''}`}>
              Warga
            </button>
            <button onClick={() => setIsAdmin(true)} className={`px-2 py-1 rounded-lg ${isAdmin ? 'bg-white shadow' : ''}`}>
              Admin
            </button>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand to-brand-700 text-white grid place-items-center">AK</div>
        </div>
      </div>
    </header>
  );
}
