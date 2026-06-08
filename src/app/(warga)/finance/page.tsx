'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Transaksi = {
  id: number;
  tanggal: string;
  tipe: 'PEMASUKAN' | 'PENGELUARAN';
  deskripsi: string;
  kategori: string;
  jumlah: number;
};

type TagihanKas = {
  id: number;
  judul: string;
  deskripsi: string | null;
  jumlah: number;
  jatuhTempo: string;
  status: string; // BELUM_BAYAR / LUNAS / TERLAMBAT dll
};

type TrendPoint = {
  bulan: string;
  pemasukan: number;
  pengeluaran: number;
};

export function KeuanganRT() {
  // ========= STATE =========
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loadingTransaksi, setLoadingTransaksi] = useState(true);
  const [errorTransaksi, setErrorTransaksi] = useState<string | null>(null);

  const [tagihan, setTagihan] = useState<TagihanKas[]>([]);
  const [loadingTagihan, setLoadingTagihan] = useState(true);
  const [errorTagihan, setErrorTagihan] = useState<string | null>(null);

  const [payingId, setPayingId] = useState<number | null>(null);

  // ========= HELPER =========
  const formatRupiah = (n: number) =>
    `Rp ${n.toLocaleString('id-ID')}`;

  const formatTanggal = (tanggal: string) => {
    const d = new Date(tanggal);
    if (Number.isNaN(d.getTime())) return tanggal;
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // ========= FETCH DATA =========
  const fetchTransaksi = async () => {
    setLoadingTransaksi(true);
    setErrorTransaksi(null);
    try {
      const res = await fetch('/api/keuangan');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengambil data keuangan.');
      }
      setTransaksi(data);
    } catch (err: any) {
      setErrorTransaksi(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoadingTransaksi(false);
    }
  };

  const fetchTagihan = async () => {
    setLoadingTagihan(true);
    setErrorTagihan(null);
    try {
      // hanya ambil tagihan yang belum dibayar
      const res = await fetch('/api/tagihan-kas?status=BELUM_BAYAR');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengambil data tagihan.');
      }
      setTagihan(data);
    } catch (err: any) {
      setErrorTagihan(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoadingTagihan(false);
    }
  };

  useEffect(() => {
    fetchTransaksi();
    fetchTagihan();
  }, []);

  // ========= HITUNG SUMMARY =========
  const pemasukan = useMemo(
    () => transaksi.filter((t) => t.tipe === 'PEMASUKAN'),
    [transaksi],
  );
  const pengeluaran = useMemo(
    () => transaksi.filter((t) => t.tipe === 'PENGELUARAN'),
    [transaksi],
  );

  const totalPemasukan = pemasukan.reduce((sum, t) => sum + t.jumlah, 0);
  const totalPengeluaran = pengeluaran.reduce((sum, t) => sum + t.jumlah, 0);
  const totalSaldo = totalPemasukan - totalPengeluaran;

  // ========= DATA GRAFIK TREND (6 BULAN TERAKHIR) =========
  const trendData: TrendPoint[] = useMemo(() => {
    if (transaksi.length === 0) return [];

    const map: Record<
      string,
      { pemasukan: number; pengeluaran: number; order: number }
    > = {};

    transaksi.forEach((t) => {
      const d = new Date(t.tanggal);
      if (Number.isNaN(d.getTime())) return;

      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map[key]) {
        map[key] = {
          pemasukan: 0,
          pengeluaran: 0,
          order: d.getFullYear() * 12 + d.getMonth(),
        };
      }

      if (t.tipe === 'PEMASUKAN') {
        map[key].pemasukan += t.jumlah;
      } else {
        map[key].pengeluaran += t.jumlah;
      }
    });

    const points = Object.entries(map)
      .sort((a, b) => a[1].order - b[1].order)
      .slice(-6)
      .map(([key, val]) => {
        const [yearStr, monthStr] = key.split('-');
        const d = new Date(Number(yearStr), Number(monthStr), 1);
        const bulanLabel = d.toLocaleDateString('id-ID', { month: 'short' });
        return {
          bulan: bulanLabel,
          pemasukan: val.pemasukan,
          pengeluaran: val.pengeluaran,
        };
      });

    return points;
  }, [transaksi]);

  // ========= BAYAR SEKARANG =========
  const handleBayar = async (id: number) => {
    if (!confirm('Yakin ingin membayar tagihan ini?')) return;

    setPayingId(id);

    try {
      const res = await fetch(`/api/tagihan-kas/${id}/bayar`, {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Gagal memproses pembayaran.');
        return;
      }

      alert('Tagihan berhasil dibayar.');

      // Refresh tagihan + transaksi supaya saldo dan list ikut update
      await Promise.all([fetchTagihan(), fetchTransaksi()]);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat memproses pembayaran.');
    } finally {
      setPayingId(null);
    }
  };

  // ========= RENDER =========
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Banner Saldo */}
      <Card className="rounded-2xl border-0 bg-gradient-to-br from-[#007BFF] to-[#0056d2] p-8 text-white shadow-[0_8px_32px_rgba(0,123,255,0.25)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-2 text-blue-100">Total Saldo Kas RT</p>
            <h2 className="mb-1 text-white">
              {formatRupiah(totalSaldo)}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-blue-100">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">
                Ringkasan berdasarkan seluruh transaksi
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <Wallet className="h-24 w-24 text-white opacity-20" />
          </div>
        </div>
      </Card>

      {/* Error umum transaksi */}
      {errorTransaksi && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {errorTransaksi}
        </div>
      )}

      {/* Summary atas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="rounded-2xl border-0 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <ArrowUpCircle className="h-6 w-6 text-green-600" />
            </div>
            <Badge className="bg-green-100 text-green-600 hover:bg-green-100">
              Pemasukan
            </Badge>
          </div>
          <p className="mb-1 text-2xl text-gray-800">
            {formatRupiah(totalPemasukan)}
          </p>
          <p className="text-sm text-gray-500">
            Total pemasukan kas RT
          </p>
        </Card>

        <Card className="rounded-2xl border-0 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
              <ArrowDownCircle className="h-6 w-6 text-red-600" />
            </div>
            <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
              Pengeluaran
            </Badge>
          </div>
          <p className="mb-1 text-2xl text-gray-800">
            {formatRupiah(totalPengeluaran)}
          </p>
          <p className="text-sm text-gray-500">
            Total pengeluaran kas RT
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ringkasan" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="rounded-xl bg-white p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
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

          <Button
            variant="outline"
            className="rounded-xl hover:border-[#007BFF] hover:bg-[#E8F1FB]"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* ===== TAB RINGKASAN (Grafik) ===== */}
        <TabsContent value="ringkasan">
          <Card className="rounded-2xl border-0 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-gray-800">Trend Keuangan 6 Bulan</h3>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            {loadingTransaksi ? (
              <p className="text-sm text-gray-500">
                Memuat grafik...
              </p>
            ) : trendData.length === 0 ? (
              <p className="text-sm text-gray-500">
                Belum ada data transaksi untuk grafik.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={trendData}>
                  <CartesianGrid stroke="#E8F1FB" strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: 12,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: any) => formatRupiah(Number(value))}
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
            )}
          </Card>
        </TabsContent>

        {/* ===== TAB PEMASUKAN ===== */}
        <TabsContent value="pemasukan">
          {loadingTransaksi ? (
            <p className="text-sm text-gray-500">
              Memuat data...
            </p>
          ) : pemasukan.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada data pemasukan.
            </p>
          ) : (
            <div className="space-y-4">
              {pemasukan.map((item) => (
                <Card
                  key={item.id}
                  className="rounded-2xl border-0 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,123,255,0.15)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                        <ArrowUpCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="mb-1 text-gray-800">
                          {item.deskripsi}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatTanggal(item.tanggal)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="mb-1 text-xl text-green-600">
                        + {formatRupiah(item.jumlah)}
                      </p>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-600"
                      >
                        {item.kategori}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ===== TAB PENGELUARAN ===== */}
        <TabsContent value="pengeluaran">
          {loadingTransaksi ? (
            <p className="text-sm text-gray-500">
              Memuat data...
            </p>
          ) : pengeluaran.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada data pengeluaran.
            </p>
          ) : (
            <div className="space-y-4">
              {pengeluaran.map((item) => (
                <Card
                  key={item.id}
                  className="rounded-2xl border-0 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,123,255,0.15)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                        <ArrowDownCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="mb-1 text-gray-800">
                          {item.deskripsi}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatTanggal(item.tanggal)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="mb-1 text-xl text-red-600">
                        - {formatRupiah(item.jumlah)}
                      </p>
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-600"
                      >
                        {item.kategori}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ===== TAB TAGIHAN IURAN ===== */}
        <TabsContent value="tagihan">
          {errorTagihan && (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {errorTagihan}
            </div>
          )}

          {loadingTagihan ? (
            <p className="text-sm text-gray-500">
              Memuat tagihan...
            </p>
          ) : tagihan.length === 0 ? (
            <p className="text-sm text-gray-500">
              Tidak ada tagihan kas aktif saat ini.
            </p>
          ) : (
            <div className="space-y-4">
              {tagihan.map((item) => (
                <Card
                  key={item.id}
                  className="rounded-2xl border-0 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="mb-1 text-gray-800">
                          {item.judul}
                        </p>
                        {item.deskripsi && (
                          <p className="text-xs text-gray-500">
                            {item.deskripsi}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                          Jatuh tempo: {formatTanggal(item.jatuhTempo)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="mb-2 text-xl text-gray-800">
                        {formatRupiah(item.jumlah)}
                      </p>
                      <Badge className="bg-yellow-100 text-yellow-600 hover:bg-yellow-100">
                        Belum Bayar
                      </Badge>
                    </div>
                  </div>
                  <Button
                    className="w-full rounded-xl bg-[#007BFF] text-white hover:bg-[#0056d2] disabled:opacity-60"
                    disabled={payingId === item.id}
                    onClick={() => handleBayar(item.id)}
                  >
                    {payingId === item.id ? 'Memproses...' : 'Bayar Sekarang'}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default KeuanganRT;
