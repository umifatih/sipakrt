'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Home, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'warga' | 'admin'>('warga');
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          role: tab, // 'admin' atau 'warga'
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal login.');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', tab);
        if (data.user?.name) {
          localStorage.setItem('userName', data.user.name);
        }
        if (data.user?.email) {
          localStorage.setItem('userEmail', data.user.email);
        }
      }

      if (tab === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={
        tab === 'warga'
          ? 'min-h-screen bg-[linear-gradient(180deg,#eaf3ff,transparent)]'
          : 'min-h-screen bg-[linear-gradient(180deg,#0b1a2b,#0b1a2b)]'
      }
    >
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white/95 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">
          {/* Switch Tab */}
          <div className="flex items-center justify-center gap-3 -mt-12 mb-4">
            <button
              onClick={() => setTab('warga')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium shadow ${
                tab === 'warga'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white/70 hover:bg-white'
              }`}
              type="button"
            >
              Login Warga
            </button>
            <button
              onClick={() => setTab('admin')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium shadow ${
                tab === 'admin'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-white/70 hover:bg-white'
              }`}
              type="button"
            >
              Login Admin
            </button>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow ${
                tab === 'warga'
                  ? 'bg-gradient-to-br from-[#007BFF] to-[#0056d2] text-white'
                  : 'bg-gradient-to-br from-orange-500 to-orange-700 text-white'
              }`}
            >
              {tab === 'warga' ? (
                <Home className="w-8 h-8" />
              ) : (
                <Shield className="w-8 h-8" />
              )}
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-gray-800 font-semibold">Sistem Informasi RT</h2>
            <p className="text-gray-600 mt-1">
              {tab === 'warga'
                ? 'Masuk sebagai Warga'
                : 'Masuk sebagai Admin RT'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error message */}
            {error && (
              <p className="mb-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {tab === 'warga' ? 'Email / No HP' : 'Email Admin'}
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  tab === 'warga'
                    ? 'contoh@email.com atau 08123456789'
                    : 'admin@rt.com'
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    tab === 'warga'
                      ? 'Masukkan password'
                      : 'Masukkan password admin'
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="toggle password"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                className={`${
                  tab === 'warga' ? 'text-blue-600' : 'text-orange-600'
                } text-sm`}
              >
                Lupa {tab === 'warga' ? 'kata sandi' : 'password'}?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3 font-medium shadow text-white disabled:opacity-60 disabled:cursor-not-allowed ${
                tab === 'warga'
                  ? 'bg-[#007BFF] hover:bg-[#0056d2]'
                  : 'bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800'
              }`}
            >
              {loading
                ? 'Memproses...'
                : tab === 'warga'
                ? 'Masuk'
                : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Masuk sebagai{' '}
            <button
              onClick={() => setTab(tab === 'warga' ? 'admin' : 'warga')}
              className={`${
                tab === 'warga' ? 'text-blue-600' : 'text-orange-500'
              } underline`}
              type="button"
            >
              {tab === 'warga' ? 'Admin' : 'Warga'}?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
