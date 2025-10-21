import './globals.css';
import type { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';


export const metadata: Metadata = {
  title: 'SIPAKRT',
  description: 'Community Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="text-slate-800 flex">
        <Sidebar />
        <div className="flex-1 ml-64"> {/* Geser isi 256px dari kiri */}
          <Header />
          <main className="px-6 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}

