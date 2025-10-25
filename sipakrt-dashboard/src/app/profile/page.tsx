// src/app/login/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Home, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<'warga' | 'admin'>('warga');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    router.replace('/');
  };

  if (!mounted) return null; // ⬅️ cegah hydration mismatch

  return (
    <div className={tab === 'warga'
      ? 'min-h-screen bg-[linear-gradient(180deg,#eaf3ff,transparent)]'
      : 'min-h-screen bg-[linear-gradient(180deg,#0b1a2b,#0b1a2b)]'}>
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white/95 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8" suppressHydrationWarning>
          {/* Tab Switch */}
          <div className="flex items-center justify-center gap-3 -mt-12 mb-4">
            <button
              type="button"
              onClick={() => setTab('warga')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium shadow ${tab==='warga' ? 'bg-blue-100 text-blue-700' : 'bg-white/70 hover:bg-white'}`}>
              Login Warga
            </button>
            <button
              type="button"
              onClick={() => setTab('admin')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium shadow ${tab==='admin' ? 'bg-orange-100 text-orange-700' : 'bg-white/70 hover:bg-white'}`}>
              Login Admin
            </button>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow ${tab==='warga'
              ? 'bg-gradient-to-br from-[#007BFF] to-[#0056d2] text-white'
              : 'bg-gradient-to-br from-orange-500 to-orange-700 text-white'}`}>
              {tab==='warga' ? <Home className="w-8 h-8"/> : <Shield className="w-8 h-8"/>}
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-gray-800 font-semibold">Sistem Informasi RT</h2>
            <p className="text-gray-600 mt-1">
              {tab==='warga' ? 'Masuk sebagai Warga' : 'Masuk sebagai Admin RT'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {tab==='warga' ? 'Email / No HP' : 'Email Admin'}
              </label>
              <input
                type="text"
                placeholder={tab==='warga' ? 'contoh@email.com atau 08123456789' : 'admin@rt.com'}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder={tab==='warga' ? 'Masukkan password' : 'Masukkan password admin'}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="toggle password"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <button type="button" className={`${tab==='warga' ? 'text-blue-600' : 'text-orange-600'} text-sm`}>
                Lupa {tab==='warga' ? 'kata sandi' : 'password'}?
              </button>
            </div>

            <button
              type="submit"
              className={`w-full rounded-xl py-3 font-medium shadow text-white ${tab==='warga'
                ? 'bg-[#007BFF] hover:bg-[#0056d2]'
                : 'bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800'}`}
            >
              {tab==='warga' ? 'Masuk' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Masuk sebagai{' '}
            <button
              type="button"
              onClick={() => setTab(tab==='warga' ? 'admin' : 'warga')}
              className={`${tab==='warga' ? 'text-blue-600' : 'text-orange-500'} underline`}
            >
              {tab==='warga' ? 'Admin' : 'Warga'}?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
