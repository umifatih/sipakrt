'use client';
import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Filter, Download, ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const trendData = [
  { bulan: 'Jan', pemasukan: 5200000, pengeluaran: 3800000 },
  { bulan: 'Feb', pemasukan: 5500000, pengeluaran: 4200000 },
  { bulan: 'Mar', pemasukan: 5100000, pengeluaran: 3900000 },
  { bulan: 'Apr', pemasukan: 6200000, pengeluaran: 4500000 },
  { bulan: 'Mei', pemasukan: 5900000, pengeluaran: 4100000 },
  { bulan: 'Jun', pemasukan: 6500000, pengeluaran: 4300000 },
];

const pemasukan = [
  { id: 1, desc: 'Iuran Warga - Bulan Juni', amount: 4500000, date: '1 Jun 2025', category: 'Iuran' },
  { id: 2, desc: 'Sumbangan Kegiatan 17 Agustus', amount: 2000000, date: '15 Jun 2025', category: 'Sumbangan' },
];

const pengeluaran = [
  { id: 1, desc: 'Pembelian Lampu Jalan', amount: 1200000, date: '5 Jun 2025', category: 'Infrastruktur' },
  { id: 2, desc: 'Konsumsi Rapat RT', amount: 500000, date: '10 Jun 2025', category: 'Operasional' },
  { id: 3, desc: 'Biaya Kebersihan Lingkungan', amount: 800000, date: '18 Jun 2025', category: 'Kebersihan' },
];

const tagihan = [
  { id: 1, desc: 'Iuran Bulanan - Juli 2025', amount: 50000, dueDate: '30 Jul 2025', status: 'Belum Bayar' },
  { id: 2, desc: 'Iuran Keamanan - Juli 2025', amount: 25000, dueDate: '30 Jul 2025', status: 'Belum Bayar' },
];

export function KeuanganRT() {
  const totalSaldo = 6500000;
  const totalPemasukan = 6500000;
  const totalPengeluaran = 2500000;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Saldo Banner */}
      <Card className="bg-gradient-to-br from-[#007BFF] to-[#0056d2] text-white rounded-2xl shadow-[0_8px_32px_rgba(0,123,255,0.25)] border-0 p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-2">Total Saldo Kas RT</p>
            <h2 className="text-white mb-1">
              Rp {totalSaldo.toLocaleString('id-ID')}
            </h2>
            <div className="flex items-center gap-2 text-blue-100 mt-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+12% dari bulan lalu</span>
            </div>
          </div>
          <div className="hidden md:block">
            <Wallet className="w-24 h-24 text-white opacity-20" />
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ArrowUpCircle className="w-6 h-6 text-green-600" />
            </div>
            <Badge className="bg-green-100 text-green-600 hover:bg-green-100">Pemasukan</Badge>
          </div>
          <p className="text-2xl text-gray-800 mb-1">Rp {totalPemasukan.toLocaleString('id-ID')}</p>
          <p className="text-sm text-gray-500">Bulan ini</p>
        </Card>

        <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <ArrowDownCircle className="w-6 h-6 text-red-600" />
            </div>
            <Badge className="bg-red-100 text-red-600 hover:bg-red-100">Pengeluaran</Badge>
          </div>
          <p className="text-2xl text-gray-800 mb-1">Rp {totalPengeluaran.toLocaleString('id-ID')}</p>
          <p className="text-sm text-gray-500">Bulan ini</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ringkasan" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-1.5">
            <TabsTrigger 
              value="ringkasan"
              className="rounded-lg data-[state=active]:bg-[#007BFF] data-[state=active]:text-white"
            >
              Ringkasan
            </TabsTrigger>
            <TabsTrigger 
              value="pemasukan"
              className="rounded-lg data-[state=active]:bg-[#007BFF] data-[state=active]:text-white"
            >
              Pemasukan
            </TabsTrigger>
            <TabsTrigger 
              value="pengeluaran"
              className="rounded-lg data-[state=active]:bg-[#007BFF] data-[state=active]:text-white"
            >
              Pengeluaran
            </TabsTrigger>
            <TabsTrigger 
              value="tagihan"
              className="rounded-lg data-[state=active]:bg-[#007BFF] data-[state=active]:text-white"
            >
              Tagihan Iuran
            </TabsTrigger>
          </TabsList>

          <Button variant="outline" className="rounded-xl hover:bg-[#E8F1FB] hover:border-[#007BFF]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Ringkasan */}
        <TabsContent value="ringkasan">
          <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-800">Trend Keuangan 6 Bulan</h3>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F1FB" />
                <XAxis dataKey="bulan" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pemasukan" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  name="Pemasukan"
                />
                <Line 
                  type="monotone" 
                  dataKey="pengeluaran" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 5 }}
                  name="Pengeluaran"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Pemasukan */}
        <TabsContent value="pemasukan">
          <div className="space-y-4">
            {pemasukan.map((item) => (
              <Card 
                key={item.id}
                className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6 hover:shadow-[0_8px_24px_rgba(0,123,255,0.15)] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <ArrowUpCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 mb-1">{item.desc}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl text-green-600 mb-1">
                      +Rp {item.amount.toLocaleString('id-ID')}
                    </p>
                    <Badge variant="outline" className="border-green-200 text-green-600 bg-green-50">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pengeluaran */}
        <TabsContent value="pengeluaran">
          <div className="space-y-4">
            {pengeluaran.map((item) => (
              <Card 
                key={item.id}
                className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6 hover:shadow-[0_8px_24px_rgba(0,123,255,0.15)] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <ArrowDownCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 mb-1">{item.desc}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl text-red-600 mb-1">
                      -Rp {item.amount.toLocaleString('id-ID')}
                    </p>
                    <Badge variant="outline" className="border-red-200 text-red-600 bg-red-50">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tagihan */}
        <TabsContent value="tagihan">
          <div className="space-y-4">
            {tagihan.map((item) => (
              <Card 
                key={item.id}
                className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 mb-1">{item.desc}</p>
                      <p className="text-sm text-gray-500">Jatuh tempo: {item.dueDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl text-gray-800 mb-2">
                      Rp {item.amount.toLocaleString('id-ID')}
                    </p>
                    <Badge className="bg-yellow-100 text-yellow-600 hover:bg-yellow-100">
                      {item.status}
                    </Badge>
                  </div>
                </div>
                <Button className="w-full bg-[#007BFF] hover:bg-[#0056d2] text-white rounded-xl">
                  Bayar Sekarang
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default KeuanganRT;