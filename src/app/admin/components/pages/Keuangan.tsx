'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  Printer,
  X,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
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
  status: string; // BELUM_BAYAR / LUNAS / TERLAMBAT
};

type ActiveTab = 'pemasukan' | 'pengeluaran' | 'laporan' | 'tagihan';

const PIE_COLORS = [
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#6366f1',
  '#ec4899',
  '#8b5cf6',
];

export default function Keuangan() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pemasukan');

  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loadingTransaksi, setLoadingTransaksi] = useState(true);

  const [tagihan, setTagihan] = useState<TagihanKas[]>([]);
  const [loadingTagihan, setLoadingTagihan] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [showAddTransaksiModal, setShowAddTransaksiModal] = useState(false);
  const [savingTransaksi, setSavingTransaksi] = useState(false);
  const [formTransaksi, setFormTransaksi] = useState({
    jenis: 'PEMASUKAN' as 'PEMASUKAN' | 'PENGELUARAN',
    tanggal: '',
    deskripsi: '',
    kategori: 'Iuran RT',
    jumlah: '',
  });

  const [showAddTagihanModal, setShowAddTagihanModal] = useState(false);
  const [savingTagihan, setSavingTagihan] = useState(false);
  const [formTagihan, setFormTagihan] = useState({
    judul: '',
    deskripsi: '',
    jatuhTempo: '',
    jumlah: '',
  });

  // ===== FETCH DATA =====
  const fetchTransaksi = async () => {
    setLoadingTransaksi(true);
    setError(null);
    try {
      const res = await fetch('/api/keuangan');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengambil data keuangan.');
      }
      setTransaksi(data);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoadingTransaksi(false);
    }
  };

  const fetchTagihan = async () => {
    setLoadingTagihan(true);
    setError(null);
    try {
      const res = await fetch('/api/tagihan-kas');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengambil data tagihan kas.');
      }
      setTagihan(data);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoadingTagihan(false);
    }
  };

  useEffect(() => {
    fetchTransaksi();
    fetchTagihan();
  }, []);

  // ===== HITUNG SUMMARY =====
  const pemasukan = useMemo(
    () => transaksi.filter((t) => t.tipe === 'PEMASUKAN'),
    [transaksi],
  );
  const pengeluaran = useMemo(
    () => transaksi.filter((t) => t.tipe === 'PENGELUARAN'),
    [transaksi],
  );

  const totalPemasukan = pemasukan.reduce(
    (sum, t) => sum + t.jumlah,
    0,
  );
  const totalPengeluaran = pengeluaran.reduce(
    (sum, t) => sum + t.jumlah,
    0,
  );
  const totalSaldo = totalPemasukan - totalPengeluaran;

  // Pie chart pemasukan per kategori
  const pieData = useMemo(() => {
    if (pemasukan.length === 0) return [];

    const perKategori: Record<string, number> = {};
    pemasukan.forEach((t) => {
      perKategori[t.kategori] =
        (perKategori[t.kategori] || 0) + t.jumlah;
    });

    return Object.entries(perKategori).map(([name, total], idx) => ({
      name,
      value:
        totalPemasukan > 0
          ? Math.round((total / totalPemasukan) * 100)
          : 0,
      color: PIE_COLORS[idx % PIE_COLORS.length],
    }));
  }, [pemasukan, totalPemasukan]);

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

  // ===== FORM HANDLERS =====
  const handleFormTransaksiChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormTransaksi((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormTagihanChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormTagihan((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveTransaksi = async () => {
    if (
      !formTransaksi.tanggal ||
      !formTransaksi.deskripsi ||
      !formTransaksi.jumlah
    ) {
      alert('Tanggal, deskripsi, dan jumlah wajib diisi.');
      return;
    }

    const jumlahInt = Number(formTransaksi.jumlah);
    if (Number.isNaN(jumlahInt) || jumlahInt <= 0) {
      alert('Jumlah harus angka lebih dari 0.');
      return;
    }

    setSavingTransaksi(true);
    setError(null);

    try {
      const res = await fetch('/api/keuangan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tanggal: formTransaksi.tanggal, // 'YYYY-MM-DD'
          tipe: formTransaksi.jenis,
          deskripsi: formTransaksi.deskripsi,
          kategori: formTransaksi.kategori,
          jumlah: jumlahInt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal menyimpan transaksi.');
      }

      setShowAddTransaksiModal(false);
      setFormTransaksi({
        jenis: 'PEMASUKAN',
        tanggal: '',
        deskripsi: '',
        kategori: 'Iuran RT',
        jumlah: '',
      });

      await fetchTransaksi();
      alert('Transaksi berhasil disimpan.');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setSavingTransaksi(false);
    }
  };

  const handleSaveTagihan = async () => {
    if (
      !formTagihan.judul ||
      !formTagihan.jumlah ||
      !formTagihan.jatuhTempo
    ) {
      alert('Judul, jumlah, dan jatuh tempo wajib diisi.');
      return;
    }

    const jumlahInt = Number(formTagihan.jumlah);
    if (Number.isNaN(jumlahInt) || jumlahInt <= 0) {
      alert('Jumlah harus angka lebih dari 0.');
      return;
    }

    setSavingTagihan(true);
    setError(null);

    try {
      const res = await fetch('/api/tagihan-kas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judul: formTagihan.judul,
          deskripsi:
            formTagihan.deskripsi.trim() || undefined,
          jumlah: jumlahInt,
          jatuhTempo: formTagihan.jatuhTempo, // 'YYYY-MM-DD'
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal menyimpan tagihan kas.');
      }

      setShowAddTagihanModal(false);
      setFormTagihan({
        judul: '',
        deskripsi: '',
        jatuhTempo: '',
        jumlah: '',
      });

      await fetchTagihan();
      alert('Tagihan kas berhasil dibuat.');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setSavingTagihan(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'LUNAS':
        return {
          label: 'Lunas',
          color: 'text-green-600',
          bg: 'bg-green-50',
        };
      case 'TERLAMBAT':
        return {
          label: 'Terlambat',
          color: 'text-red-600',
          bg: 'bg-red-50',
        };
      default:
        return {
          label: 'Belum Bayar',
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
        };
    }
  };

  // ===== RENDER =====
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-gray-900">
            Manajemen Keuangan RT
          </h1>
          <p className="text-gray-600">
            Kelola kas, transaksi, dan tagihan RT
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50">
            <Printer className="h-5 w-5" />
            Cetak Laporan PDF
          </button>
          <button
            onClick={() => setShowAddTransaksiModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-white transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Tambah Transaksi
          </button>
          <button
            onClick={() => setShowAddTagihanModal(true)}
            className="flex items-center gap-2 rounded-xl border border-blue-600 px-4 py-2.5 text-blue-600 transition-all hover:bg-blue-50"
          >
            <Plus className="h-5 w-5" />
            Tagihan Kas
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 p-6 text-white shadow-lg">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="text-blue-100">Total Saldo</div>
          </div>
          <div className="mb-1">
            {formatRupiah(totalSaldo)}
          </div>
          <div className="text-sm text-blue-100">
            Per{' '}
            {new Date().toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-green-100 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-gray-600">Total Pemasukan</div>
          </div>
          <div className="mb-1 text-gray-900">
            {formatRupiah(totalPemasukan)}
          </div>
          <div className="text-sm text-green-600">
            (Seluruh transaksi)
          </div>
        </div>

        <div className="rounded-2xl border-2 border-red-100 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div className="text-gray-600">
              Total Pengeluaran
            </div>
          </div>
          <div className="mb-1 text-gray-900">
            {formatRupiah(totalPengeluaran)}
          </div>
          <div className="text-sm text-red-600">
            (Seluruh transaksi)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Transactions & Tab */}
        <div className="lg:col-span-2 overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: 'pemasukan', label: 'Pemasukan' },
                { id: 'pengeluaran', label: 'Pengeluaran' },
                { id: 'tagihan', label: 'Tagihan Kas' },
                { id: 'laporan', label: 'Laporan Kas' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as ActiveTab)
                  }
                  className={`flex-1 px-6 py-4 transition-all ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 bg-blue-50/50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'pemasukan' && (
              <>
                {loadingTransaksi ? (
                  <div className="py-8 text-center text-gray-500">
                    Memuat data...
                  </div>
                ) : pemasukan.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Belum ada transaksi pemasukan.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pemasukan.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <TrendingUp className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="mb-1 text-gray-900">
                              {item.deskripsi}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500">
                                {formatTanggal(item.tanggal)}
                              </span>
                              <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                                {item.kategori}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-green-600">
                          + {formatRupiah(item.jumlah)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'pengeluaran' && (
              <>
                {loadingTransaksi ? (
                  <div className="py-8 text-center text-gray-500">
                    Memuat data...
                  </div>
                ) : pengeluaran.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Belum ada transaksi pengeluaran.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pengeluaran.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <TrendingDown className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="mb-1 text-gray-900">
                              {item.deskripsi}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500">
                                {formatTanggal(item.tanggal)}
                              </span>
                              <span className="rounded-lg bg-orange-50 px-2 py-0.5 text-xs text-orange-600">
                                {item.kategori}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-red-600">
                          - {formatRupiah(item.jumlah)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'tagihan' && (
              <>
                {loadingTagihan ? (
                  <div className="py-8 text-center text-gray-500">
                    Memuat data tagihan...
                  </div>
                ) : tagihan.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Belum ada tagihan kas. Klik tombol
                    &quot;Tagihan Kas&quot; di atas untuk menambah.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {tagihan.map((t) => {
                      const status = getStatusLabel(t.status);
                      return (
                        <div
                          key={t.id}
                          className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-gray-50"
                        >
                          <div>
                            <div className="mb-1 text-gray-900">
                              {t.judul}
                            </div>
                            {t.deskripsi && (
                              <div className="text-xs text-gray-500">
                                {t.deskripsi}
                              </div>
                            )}
                            <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                              <span>
                                Jatuh tempo:{' '}
                                {formatTanggal(t.jatuhTempo)}
                              </span>
                              <span
                                className={`inline-flex rounded-lg px-2 py-0.5 text-xs ${status.bg} ${status.color}`}
                              >
                                {status.label}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-gray-900">
                              {formatRupiah(t.jumlah)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {activeTab === 'laporan' && (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Printer className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-2 text-gray-900">
                  Laporan Kas
                </h3>
                <p className="mb-6 text-gray-600">
                  Buat dan cetak laporan keuangan periode
                  tertentu
                </p>
                <button className="rounded-xl bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700">
                  Buat Laporan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart Pemasukan */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-gray-900">
            Kategori Pemasukan
          </h3>
          <div className="h-64">
            {pieData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                Belum ada data pemasukan.
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-6 space-y-3">
            {pieData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">
                    {item.name}
                  </span>
                </div>
                <span className="text-gray-900">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Tambah Transaksi */}
      {showAddTransaksiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white animate-in zoom-in-95 duration-200">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900">
                  Tambah Transaksi
                </h2>
                <button
                  onClick={() => setShowAddTransaksiModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-gray-700">
                  Jenis Transaksi
                </label>
                <select
                  name="jenis"
                  value={formTransaksi.jenis}
                  onChange={handleFormTransaksiChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PEMASUKAN">Pemasukan</option>
                  <option value="PENGELUARAN">
                    Pengeluaran
                  </option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-gray-700">
                  Tanggal
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={formTransaksi.tanggal}
                  onChange={handleFormTransaksiChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-gray-700">
                  Deskripsi
                </label>
                <input
                  type="text"
                  name="deskripsi"
                  value={formTransaksi.deskripsi}
                  onChange={handleFormTransaksiChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Keterangan transaksi"
                />
              </div>
              <div>
                <label className="mb-2 block text-gray-700">
                  Kategori
                </label>
                <select
                  name="kategori"
                  value={formTransaksi.kategori}
                  onChange={handleFormTransaksiChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Iuran RT</option>
                  <option>Kebersihan</option>
                  <option>Infrastruktur</option>
                  <option>Operasional</option>
                  <option>Donasi</option>
                  <option>Lain-lain</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-gray-700">
                  Jumlah (Rp)
                </label>
                <input
                  type="number"
                  name="jumlah"
                  value={formTransaksi.jumlah}
                  onChange={handleFormTransaksiChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min={0}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() =>
                    setShowAddTransaksiModal(false)
                  }
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50"
                  disabled={savingTransaksi}
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveTransaksi}
                  disabled={savingTransaksi}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                >
                  {savingTransaksi
                    ? 'Menyimpan...'
                    : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Tagihan Kas */}
      {showAddTagihanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white animate-in zoom-in-95 duration-200">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900">
                  Tambah Tagihan Kas
                </h2>
                <button
                  onClick={() =>
                    setShowAddTagihanModal(false)
                  }
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-gray-700">
                  Judul Tagihan
                </label>
                <input
                  type="text"
                  name="judul"
                  value={formTagihan.judul}
                  onChange={handleFormTagihanChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Iuran Bulanan - Juli 2025"
                />
              </div>
              <div>
                <label className="mb-2 block text-gray-700">
                  Deskripsi (Opsional)
                </label>
                <textarea
                  name="deskripsi"
                  value={formTagihan.deskripsi}
                  onChange={handleFormTagihanChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Contoh: Iuran kas rutin untuk operasional dan kebersihan lingkungan."
                />
              </div>
              <div>
                <label className="mb-2 block text-gray-700">
                  Jatuh Tempo
                </label>
                <input
                  type="date"
                  name="jatuhTempo"
                  value={formTagihan.jatuhTempo}
                  onChange={handleFormTagihanChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-gray-700">
                  Jumlah per Warga (Rp)
                </label>
                <input
                  type="number"
                  name="jumlah"
                  value={formTagihan.jumlah}
                  onChange={handleFormTagihanChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50000"
                  min={0}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() =>
                    setShowAddTagihanModal(false)
                  }
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50"
                  disabled={savingTagihan}
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveTagihan}
                  disabled={savingTagihan}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                >
                  {savingTagihan
                    ? 'Menyimpan...'
                    : 'Simpan Tagihan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
