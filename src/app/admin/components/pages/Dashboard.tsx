// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  FileText,
  Wallet,
  AlertCircle,
  Plus,
  ArrowRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

type ActivityType = 'warga' | 'laporan' | 'keuangan';

type DashboardActivity = {
  type: ActivityType;
  name: string;
  createdAt: string; // ISO string
};

type DashboardResponse = {
  wargaCount: number;
  laporanBaruCount: number;
  totalKas: number;
  totalTransaksi: number;
  chart: { month: string; pemasukan: number; pengeluaran: number }[];
  recentActivities: DashboardActivity[];
};

const quickActions = [
  { label: 'Tambah Pengumuman', icon: Plus, color: 'blue' },
  { label: 'Tambah Jadwal Ronda', icon: Plus, color: 'green' },
  { label: 'Input Keuangan', icon: Plus, color: 'orange' },
  { label: 'Validasi Surat', icon: ArrowRight, color: 'purple' },
];

function formatRupiah(value: number) {
  return 'Rp ' + value.toLocaleString('id-ID');
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return 'Baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} hari lalu`;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) throw new Error('Gagal memuat dashboard');
        const json = (await res.json()) as DashboardResponse;
        setData(json);
      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat data dashboard.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = data
    ? [
        {
          label: 'Jumlah Warga',
          value: data.wargaCount.toString(),
          icon: Users,
          color: 'blue' as const,
        },
        {
          label: 'Laporan Baru',
          value: data.laporanBaruCount.toString(),
          icon: AlertCircle,
          color: 'red' as const,
        },
        {
          label: 'Total Kas RT',
          value: formatRupiah(data.totalKas),
          icon: Wallet,
          color: 'green' as const,
        },
        {
          label: 'Total Transaksi Keuangan',
          value: data.totalTransaksi.toString(),
          icon: FileText,
          color: 'orange' as const,
        },
      ]
    : [];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  };

  const quickActionColors = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
  };

  const typeDotColors: Record<ActivityType, string> = {
    warga: 'bg-blue-500',
    laporan: 'bg-red-500',
    keuangan: 'bg-orange-500',
  };

  const chartData = data?.chart ?? [];

  if (loading) {
    return <div className="p-6 text-gray-600">Memuat dashboard...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-1">Selamat datang, Pak RT 👋</h1>
            <p className="text-blue-100">RT 05 / RW 03 - Kelurahan Menteng</p>
          </div>
          <div className="text-right">
            <div className="text-blue-100 text-sm">Terakhir login</div>
            {/* 🔧 Bisa dihubungkan ke data login kalau sudah ada */}
            <div>Hari ini</div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    colorClasses[stat.color]
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="text-gray-600 mb-1 text-sm">{stat.label}</div>
              <div className="text-gray-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">Aktivitas Terbaru</h2>
            {/* 🔧 Nanti bisa diarahkan ke halaman riwayat penuh */}
            <button className="text-blue-600 text-sm hover:text-blue-700">
              Lihat Semua
            </button>
          </div>
          {(!data || data.recentActivities.length === 0) ? (
            <div className="text-gray-500 text-sm">
              Belum ada aktivitas terbaru.
            </div>
          ) : (
            <div className="space-y-4">
              {data.recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      typeDotColors[activity.type]
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="text-gray-900 text-sm mb-1">
                      {activity.name}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {formatRelativeTime(activity.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  // 🔧 Bisa ditambahkan router.push ke halaman terkait
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white transition-all hover:shadow-lg ${
                    quickActionColors[action.color as keyof typeof quickActionColors]
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-gray-900 mb-1">
            Pemasukan vs Pengeluaran Bulanan
          </h2>
          <p className="text-gray-600 text-sm">
            Laporan keuangan 6 bulan terakhir
          </p>
        </div>

        {chartData.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
            Belum ada data keuangan.
          </div>
        ) : (
          <>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                    }}
                    formatter={(value: any) =>
                      'Rp ' + Number(value).toLocaleString('id-ID')
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="pemasukan"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pengeluaran"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 text-sm">Pemasukan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600 text-sm">Pengeluaran</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
