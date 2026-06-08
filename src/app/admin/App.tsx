'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/pages/Dashboard';
import DataWarga from './components/pages/DataWarga';
import LayananSurat from './components/pages/LayananSurat';
import Keuangan from './components/pages/Keuangan';
import JadwalRonda from './components/pages/JadwalRonda';
import Pengumuman from './components/pages/Pengumuman';
import Laporan from './components/pages/Laporan';
import Pengurus from './components/pages/Pengurus';
import Pengaturan from './components/pages/Pengaturan';
import { useRouter } from 'next/navigation';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [allowed, setAllowed] = useState(false); // boleh masuk dashboard admin?
  const router = useRouter();

  // Cek status login + role admin
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const logged = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('role');

    if (!logged) {
      // belum login -> ke halaman login
      router.replace('/login');
      return;
    }

    if (role !== 'admin') {
      // sudah login tapi bukan admin -> lempar ke halaman warga
      router.replace('/');
      return;
    }

    setAllowed(true);
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      // Bersihkan role & login flag
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
    }
    setShowLogoutModal(false);
    // Kembali ke halaman login utama
    router.replace('/login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'data-warga':
        return <DataWarga />;
      case 'layanan-surat':
        return <LayananSurat />;
      case 'keuangan':
        return <Keuangan />;
      case 'jadwal-ronda':
        return <JadwalRonda />;
      case 'pengumuman':
        return <Pengumuman />;
      case 'laporan':
        return <Laporan />;
      case 'pengurus':
        return <Pengurus />;
      case 'pengaturan':
        return <Pengaturan />;
      default:
        return <Dashboard />;
    }
  };

  // Jangan render apa pun sebelum cek allowed
  if (!allowed) return null;

  return (
    <>
      <DashboardLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={() => setShowLogoutModal(true)}
      >
        {renderPage()}
      </DashboardLayout>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-gray-900">Keluar dari Dashboard?</h3>
              <p className="text-gray-600 mb-6">
                Yakin ingin keluar dari Dashboard SIPAKRT?
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Keluar Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
