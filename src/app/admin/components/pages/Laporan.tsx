'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  MessageSquare,
  Filter,
  X,
  Camera,
  CheckCircle,
} from 'lucide-react';
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
  createdAt: string;   // ISO dari API
  updatedAt: string;
};

function formatDateIndo(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function Laporan() {
  const [laporan, setLaporan] = useState<LaporanItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<LaporanStatus>('baru');
  const [selectedLaporan, setSelectedLaporan] =
    useState<LaporanItem | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [responseText, setResponseText] = useState('');
  const [statusDraft, setStatusDraft] = useState<LaporanStatus>('baru');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/laporan');
        if (!res.ok) throw new Error('Fetch gagal');
        const data = (await res.json()) as LaporanItem[];
        setLaporan(data);
      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat laporan.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredData = useMemo(
    () => laporan.filter((l) => l.status === activeTab),
    [laporan, activeTab],
  );

  const countBaru = useMemo(
    () => laporan.filter((l) => l.status === 'baru').length,
    [laporan],
  );
  const countProses = useMemo(
    () => laporan.filter((l) => l.status === 'proses').length,
    [laporan],
  );
  const countSelesai = useMemo(
    () => laporan.filter((l) => l.status === 'selesai').length,
    [laporan],
  );
  const totalBulanIni = laporan.length; // kalau mau bisa difilter by bulan

  const handleViewDetail = (lap: LaporanItem) => {
    setSelectedLaporan(lap);
    setResponseText(lap.response ?? '');
    setStatusDraft(lap.status);
  };

  const handleSaveResponse = async () => {
    if (!selectedLaporan) return;

    try {
      setSaving(true);
      const res = await fetch(`/api/laporan/${selectedLaporan.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusDraft,
          response: responseText,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Gagal menyimpan tanggapan');
      }

      const updated = (await res.json()) as LaporanItem;

      setLaporan((prev) =>
        prev.map((l) => (l.id === updated.id ? updated : l)),
      );
      setSelectedLaporan(updated);
      toast.success('Tanggapan berhasil disimpan.');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Gagal menyimpan tanggapan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Memuat laporan...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-1">Laporan & Aspirasi Warga</h1>
          <p className="text-gray-600">
            Kelola laporan dan masukan dari warga
          </p>
        </div>
        <button
          onClick={() => setShowFilterModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Filter className="h-5 w-5" />
          Filter Kategori
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <div className="text-gray-600 text-sm">Laporan Baru</div>
              <div className="text-gray-900">{countBaru} Laporan</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <div className="text-gray-600 text-sm">Dalam Proses</div>
              <div className="text-gray-900">{countProses} Laporan</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <div className="text-gray-600 text-sm">Selesai</div>
              <div className="text-gray-900">{countSelesai} Laporan</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <div className="text-gray-600 text-sm">Total Bulan Ini</div>
              <div className="text-gray-900">
                {totalBulanIni} Laporan
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'baru', label: 'Laporan Baru', count: countBaru },
              {
                id: 'proses',
                label: 'Dalam Penanganan',
                count: countProses,
              },
              { id: 'selesai', label: 'Selesai', count: countSelesai },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LaporanStatus)}
                className={`flex-1 px-6 py-4 transition-all ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-gray-900 mb-2">Tidak ada laporan</h3>
              <p className="text-gray-600">
                Belum ada laporan di kategori ini
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredData.map((lap) => (
                <div
                  key={lap.id}
                  onClick={() => handleViewDetail(lap)}
                  className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                        {lap.nama
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <div className="text-gray-900">{lap.nama}</div>
                        <div className="text-gray-500 text-sm">
                          {formatDateIndo(lap.createdAt)}
                        </div>
                      </div>
                    </div>
                    {lap.fotoUrl && (
                      <Camera className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="mb-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        lap.kategori === 'Infrastruktur'
                          ? 'bg-blue-50 text-blue-600'
                          : lap.kategori === 'Kebersihan'
                          ? 'bg-green-50 text-green-600'
                          : lap.kategori === 'Keamanan'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-purple-50 text-purple-600'
                      }`}
                    >
                      {lap.kategori}
                    </span>
                  </div>
                  <div className="text-gray-900 mb-2">
                    {lap.jenis}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {lap.uraian}
                  </p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-lg text-sm ${
                      lap.status === 'baru'
                        ? 'bg-orange-50 text-orange-600'
                        : lap.status === 'proses'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-green-50 text-green-600'
                    }`}
                  >
                    {lap.status === 'baru'
                      ? 'Baru'
                      : lap.status === 'proses'
                      ? 'Dalam Proses'
                      : 'Selesai'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLaporan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900">Detail Laporan</h2>
                <button
                  onClick={() => setSelectedLaporan(null)}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Reporter Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
                  {selectedLaporan.nama
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <div className="text-gray-900 mb-1">
                    {selectedLaporan.nama}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {formatDateIndo(selectedLaporan.createdAt)}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-gray-600 text-sm mb-1">
                    Kategori
                  </div>
                  <div className="text-gray-900">
                    {selectedLaporan.kategori}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-gray-600 text-sm mb-1">
                    Jenis Laporan
                  </div>
                  <div className="text-gray-900">
                    {selectedLaporan.jenis}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-gray-600 text-sm mb-2">
                    Uraian Lengkap
                  </div>
                  <div className="text-gray-900">
                    {selectedLaporan.uraian}
                  </div>
                </div>
              </div>

              {/* Photo if available */}
              {selectedLaporan.fotoUrl && (
                <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-gray-400" />
                  <p className="text-gray-500 ml-3">
                    Foto laporan (belum di-preview)
                  </p>
                </div>
              )}

              {/* Response Form */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Catatan Tanggapan RT
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Tulis tanggapan atau tindak lanjut..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusDraft}
                  onChange={(e) =>
                    setStatusDraft(e.target.value as LaporanStatus)
                  }
                >
                  <option value="baru">Baru</option>
                  <option value="proses">Dalam Proses</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedLaporan(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={handleSaveResponse}
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Tanggapan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal (dummy, belum nge-filter beneran) */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900">Filter Kategori</h2>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {[
                'Semua Kategori',
                'Infrastruktur',
                'Kebersihan',
                'Keamanan',
                'Lainnya',
              ].map((kategori) => (
                <label
                  key={kategori}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    defaultChecked={kategori === 'Semua Kategori'}
                  />
                  <span className="text-gray-900">{kategori}</span>
                </label>
              ))}
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
