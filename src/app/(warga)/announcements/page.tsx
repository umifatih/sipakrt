'use client';

import { useEffect, useState } from 'react';
import {
  Send,
  Upload,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type LaporanStatus = 'baru' | 'proses' | 'selesai';

type LaporanItem = {
  id: number;
  nama: string;
  kategori: string;
  jenis: string;
  uraian: string;
  status: LaporanStatus;
  fotoUrl: string | null;
  response: string | null;
  createdAt: string;
  updatedAt: string;
};

function formatDateIndo(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function statusLabel(status: LaporanStatus) {
  if (status === 'proses') return 'Diproses';
  if (status === 'selesai') return 'Selesai';
  return 'Baru';
}

function badgeClasses(status: LaporanStatus) {
  if (status === 'selesai')
    return 'border-green-200 text-green-600 bg-green-50';
  if (status === 'proses')
    return 'border-orange-200 text-orange-600 bg-orange-50';
  return 'border-blue-200 text-blue-600 bg-blue-50';
}

function borderColor(status: LaporanStatus) {
  if (status === 'selesai') return 'border-green-400';
  if (status === 'proses') return 'border-orange-400';
  return 'border-blue-400';
}

export default function LaporanAspirasi() {
  const [laporan, setLaporan] = useState<LaporanItem[]>([]);
  const [selectedReport, setSelectedReport] =
    useState<LaporanItem | null>(null);
  const [loading, setLoading] = useState(true);

  // form kirim surat laporan
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Infrastruktur');
  const [isi, setIsi] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/laporan');
        if (!res.ok) throw new Error('Fetch gagal');
        const data = (await res.json()) as LaporanItem[];
        setLaporan(data);
        setSelectedReport(data[0] ?? null);
      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat riwayat laporan.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSend = async () => {
    if (!judul.trim() || !isi.trim()) {
      toast.error('Judul dan isi laporan wajib diisi.');
      return;
    }

    try {
      setSending(true);
      const res = await fetch('/api/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kategori,
          jenis: judul,
          uraian: isi,
          // nama & wargaId bisa diisi otomatis dari login kalau sudah ada
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Gagal mengirim laporan.');
      }

      const created = (await res.json()) as LaporanItem;
      setLaporan((prev) => [created, ...prev]);
      setSelectedReport(created);
      setJudul('');
      setIsi('');

      toast.success('Laporan Anda berhasil dikirim!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Gagal mengirim laporan.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Memuat data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel - Kirim & list laporan */}
        <div className="lg:col-span-2 space-y-4">
          {/* Form kirim surat */}
          <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6">
            <h3 className="text-gray-800 mb-4">Kirim Laporan Baru</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Judul Laporan
                </label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Lampu jalan mati di Gang 3"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                >
                  <option>Infrastruktur</option>
                  <option>Kebersihan</option>
                  <option>Keamanan</option>
                  <option>Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Isi Laporan
                </label>
                <Textarea
                  placeholder="Tulis laporan atau aspirasi Anda di sini..."
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  className="rounded-xl border-gray-200 focus:border-[#007BFF] min-h-[120px] resize-none"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl hover:bg-[#E8F1FB] hover:border-[#007BFF]"
                  onClick={() =>
                    toast.info('Upload foto belum diaktifkan ✨')
                  }
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Foto
                </Button>
                <Button
                  type="button"
                  onClick={handleSend}
                  disabled={sending}
                  className="flex-1 bg-[#007BFF] hover:bg-[#0056d2] text-white rounded-xl shadow-[0_4px_16px_rgba(0,123,255,0.3)] disabled:opacity-60"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sending ? 'Mengirim...' : 'Kirim'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Riwayat laporan */}
          <div className="space-y-3">
            <h3 className="text-gray-800 px-2">Riwayat Laporan</h3>
            {laporan.length === 0 ? (
              <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h4 className="text-gray-800 mb-2">Belum ada laporan</h4>
                <p className="text-sm text-gray-500">
                  Laporan Anda akan muncul di sini
                </p>
              </Card>
            ) : (
              laporan.map((report) => (
                <Card
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-l-4 ${borderColor(
                    report.status,
                  )} p-4 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,123,255,0.15)] hover:-translate-y-1 ${
                    selectedReport?.id === report.id
                      ? 'ring-2 ring-[#007BFF]'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-800">
                        {report.jenis}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateIndo(report.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs whitespace-nowrap ml-2 ${badgeClasses(
                        report.status,
                      )}`}
                    >
                      {statusLabel(report.status)}
                    </Badge>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Detail laporan */}
        <div className="lg:col-span-3">
          {selectedReport ? (
            <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-8 animate-in fade-in duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedReport.status === 'selesai'
                      ? 'bg-green-100'
                      : selectedReport.status === 'proses'
                      ? 'bg-orange-100'
                      : 'bg-blue-100'
                  }`}
                >
                  {selectedReport.status === 'selesai' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : selectedReport.status === 'proses' ? (
                    <Clock className="w-6 h-6 text-orange-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-800 mb-2">
                    {selectedReport.jenis}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`text-xs ${badgeClasses(
                        selectedReport.status,
                      )}`}
                    >
                      {statusLabel(selectedReport.status)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatDateIndo(selectedReport.createdAt)}
                    </span>
                    <span className="text-xs text-gray-400">
                      Kategori: {selectedReport.kategori}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm text-gray-500 mb-2">
                    Laporan Anda
                  </h4>
                  <div className="p-4 rounded-xl bg-[#E8F1FB]">
                    <p className="text-gray-700">
                      {selectedReport.uraian}
                    </p>
                  </div>
                </div>

                {selectedReport.response && (
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">
                      Tanggapan Pengurus RT
                    </h4>
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-green-600 mt-0.5" />
                        <p className="text-gray-700">
                          {selectedReport.response}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedReport.response &&
                  selectedReport.status === 'baru' && (
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                      <p className="text-sm text-blue-700">
                        ⏳ Laporan Anda sedang menunggu ditinjau oleh
                        pengurus RT
                      </p>
                    </div>
                  )}

                {!selectedReport.response &&
                  selectedReport.status === 'proses' && (
                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                      <p className="text-sm text-orange-700">
                        🔄 Laporan Anda sedang dalam proses penanganan
                      </p>
                    </div>
                  )}

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm text-gray-500 mb-3">
                    Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                      <div>
                        <p className="text-sm text-gray-800">
                          Laporan dikirim
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateIndo(selectedReport.createdAt)}
                        </p>
                      </div>
                    </div>
                    {selectedReport.status === 'proses' && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
                        <div>
                          <p className="text-sm text-gray-800">
                            Sedang diproses
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDateIndo(selectedReport.updatedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedReport.status === 'selesai' && (
                      <>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
                          <div>
                            <p className="text-sm text-gray-800">
                              Sedang diproses
                            </p>
                            <p className="text-xs text-gray-500">
                              {/* tidak ada tanggal khusus proses, jadi pakai tanggal yang sama */}
                              {formatDateIndo(selectedReport.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                          <div>
                            <p className="text-sm text-gray-800">
                              Selesai ditangani
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDateIndo(selectedReport.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-12 text-center h-full flex items-center justify-center">
              <div>
                <div className="text-6xl mb-4">📋</div>
                <h4 className="text-gray-800 mb-2">
                  Pilih laporan untuk melihat detail
                </h4>
                <p className="text-sm text-gray-500">
                  Detail laporan akan ditampilkan di sini
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
