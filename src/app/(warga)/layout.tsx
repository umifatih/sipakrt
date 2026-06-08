import Sidebar from "@/components/Sidebar";
import "../globals.css";

export const metadata = {
  title: "Dashboard Warga | SIPAKRT",
  description: "Sistem Informasi RT untuk Warga",
};

export default function WargaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar fix di kiri */}
      <Sidebar />

      {/* Konten utama di kanan */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
