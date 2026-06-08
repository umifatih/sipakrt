'use client';

import { useEffect, useState } from 'react';
import {
  FileText,
  ChevronDown,
  Check,
  X,
  Eye,
  Download,
} from 'lucide-react';

type Surat = {
  id: number;
  pemohonNama: string;
  pemohonEmail?: string | null;
  jenis: string;
  keperluan: string;
  keterangan?: string | null;
  status: string; // PENDING / DIPROSES / SELESAI / DITOLAK
  catatanAdmin?: string | null;
  createdAt?: string;
};

type TabId = 'menunggu' | 'disetujui' | 'ditolak';

export default function LayananSurat() {
  const [activeTab, setActiveTab] = useState<TabId>('menunggu');
  const [suratList, setSuratList] = useState<Surat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<Surat | null>(null);

  // catatan per-surat (textarea)
  const [catatanMap, setCatatanMap] = useState<Record<number, string>>({});
  const [savingStatusId, setSavingStatusId] = useState<number | null>(null);

  const fetchSurat = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/surat');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengambil data surat.');
      }
      setSuratList(data);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurat();
  }, []);

  // mapping status DB -> tab
  const getTabFromStatus = (status: string): TabId => {
    switch (status) {
      case 'SELESAI':
        return 'disetujui';
      case 'DITOLAK':
        return 'ditolak';
      default:
        return 'menunggu'; // PENDING atau DIPROSES
    }
  };

  const filteredData = suratList.filter(
    (s) => getTabFromStatus(s.status) === activeTab,
  );

  const countMenunggu = suratList.filter(
    (s) => getTabFromStatus(s.status) === 'menunggu',
  ).length;
  const countDisetujui = suratList.filter(
    (s) => getTabFromStatus(s.status) === 'disetujui',
  ).length;
  const countDitolak = suratList.filter(
    (s) => getTabFromStatus(s.status) === 'ditolak',
  ).length;

  const handlePreview = (surat: Surat) => {
    setSelectedSurat(surat);
    setPreviewModal(true);
  };

  const handleCatatanChange = (id: number, value: string) => {
    setCatatanMap((prev) => ({ ...prev, [id]: value }));
  };

  const updateStatus = async (surat: Surat, statusBaru: string) => {
    setSavingStatusId(surat.id);
    setError(null);
    try {
      const res = await fetch(`/api/surat/${surat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusBaru,
          catatanAdmin: catatanMap[surat.id] || surat.catatanAdmin || '',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal memperbarui status surat.');
      }

      await fetchSurat();
      setExpandedId(null);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setSavingStatusId(null);
    }
  };

  const formatTanggal = (createdAt?: string) => {
    if (!createdAt) return '-';
    const d = new Date(createdAt);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="mb-1 text-gray-900">
          Validasi Pengajuan Surat Warga
        </h1>
        <p className="text-gray-600">
          Kelola permohonan surat dari warga
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">
                Menunggu Validasi
              </div>
              <div className="text-gray-900">
                {countMenunggu} Surat
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Disetujui</div>
              <div className="text-gray-900">
                {countDisetujui} Surat
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <X className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Ditolak</div>
              <div className="text-gray-900">
                {countDitolak} Surat
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              {
                id: 'menunggu',
                label: 'Menunggu Validasi',
                count: countMenunggu,
              },
              {
                id: 'disetujui',
                label: 'Disetujui',
                count: countDisetujui,
              },
              {
                id: 'ditolak',
                label: 'Ditolak',
                count: countDitolak,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex-1 px-6 py-4 transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 bg-blue-50/50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
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
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              Memuat data...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-gray-900">Tidak ada surat</h3>
              <p className="text-gray-600">
                Belum ada pengajuan surat di kategori ini
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((surat) => {
                const isExpanded = expandedId === surat.id;
                const catatan =
                  catatanMap[surat.id] ?? surat.catatanAdmin ?? '';

                const statusLabel =
                  surat.status === 'SELESAI'
                    ? 'Disetujui'
                    : surat.status === 'DITOLAK'
                    ? 'Ditolak'
                    : 'Menunggu';

                const statusClass =
                  surat.status === 'SELESAI'
                    ? 'bg-green-50 text-green-600'
                    : surat.status === 'DITOLAK'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-orange-50 text-orange-600';

                return (
                  <div
                    key={surat.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 transition-all hover:shadow-md"
                  >
                    {/* Header */}
                    <div
                      onClick={() =>
                        setExpandedId(isExpanded ? null : surat.id)
                      }
                      className="cursor-pointer p-6 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            {surat.pemohonNama
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <div className="mb-1 text-gray-900">
                              {surat.pemohonNama}
                            </div>
                            <div className="text-sm text-gray-600">
                              {surat.jenis}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="mb-1 text-sm text-gray-600">
                              {formatTanggal(surat.createdAt)}
                            </div>
                            <span
                              className={`inline-flex rounded-lg px-3 py-1 text-sm ${statusClass}`}
                            >
                              {statusLabel}
                            </span>
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 text-gray-400 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="animate-in slide-in-from-top-2 border-t border-gray-100 px-6 pb-6 duration-200">
                        <div className="space-y-4 pt-6">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-xl bg-gray-50 p-4">
                              <div className="mb-1 text-sm text-gray-600">
                                Keperluan
                              </div>
                              <div className="text-gray-900">
                                {surat.keperluan}
                              </div>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-4">
                              <div className="mb-1 text-sm text-gray-600">
                                Keterangan Tambahan
                              </div>
                              <div className="text-gray-900">
                                {surat.keterangan || '-'}
                              </div>
                            </div>
                          </div>

                          {surat.status === 'PENDING' && (
                            <>
                              <div>
                                <label className="mb-2 block text-gray-700">
                                  Catatan Pengurus (Opsional)
                                </label>
                                <textarea
                                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  rows={3}
                                  placeholder="Tambahkan catatan jika diperlukan..."
                                  value={catatan}
                                  onChange={(e) =>
                                    handleCatatanChange(
                                      surat.id,
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>

                              <div className="flex flex-wrap gap-3">
                                <button
                                  onClick={() =>
                                    updateStatus(surat, 'DITOLAK')
                                  }
                                  disabled={savingStatusId === surat.id}
                                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-300 px-4 py-3 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                                >
                                  <X className="h-5 w-5" />
                                  Tolak Pengajuan
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePreview(surat)}
                                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                  <Eye className="h-5 w-5" />
                                  Preview
                                </button>
                                <button
                                  onClick={() =>
                                    updateStatus(surat, 'SELESAI')
                                  }
                                  disabled={savingStatusId === surat.id}
                                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-60"
                                >
                                  <Check className="h-5 w-5" />
                                  Setujui & Simpan
                                </button>
                              </div>
                            </>
                          )}

                          {surat.status === 'SELESAI' && (
                            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-white transition-colors hover:bg-green-700">
                              <Download className="h-5 w-5" />
                              Download Surat (placeholder)
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewModal && selectedSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white animate-in zoom-in-95 duration-200">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900">Preview Surat</h2>
                <button
                  onClick={() => setPreviewModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-8">
              {/* Surat Preview (sederhana, pakai data dari DB) */}
              <div className="rounded-xl border-2 border-gray-300 bg-white p-8">
                <div className="mb-8 text-center">
                  <div className="mb-2">PEMERINTAH KOTA</div>
                  <div className="mb-2">RT 05 / RW 03</div>
                  <div className="mb-4 text-sm text-gray-600">
                    Kelurahan Menteng, Jakarta Pusat
                  </div>
                  <div className="w-full border-b-2 border-gray-900" />
                </div>

                <div className="mb-6 text-center">
                  <div className="uppercase">
                    {selectedSurat.jenis}
                  </div>
                  <div className="text-sm text-gray-600">
                    No: 001/RT05/X/2025
                  </div>
                </div>

                <div className="mb-8 space-y-4">
                  <p className="text-gray-900">
                    Yang bertanda tangan di bawah ini Ketua RT 05 RW 03
                    Kelurahan Menteng, menerangkan bahwa:
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-gray-600">Nama</div>
                    <div className="col-span-2 text-gray-900">
                      : {selectedSurat.pemohonNama}
                    </div>
                    <div className="col-span-1 text-gray-600">
                      Keperluan
                    </div>
                    <div className="col-span-2 text-gray-900">
                      : {selectedSurat.keperluan}
                    </div>
                  </div>
                  {selectedSurat.keterangan && (
                    <p className="text-gray-900">
                      Keterangan tambahan:{' '}
                      {selectedSurat.keterangan}
                    </p>
                  )}
                  <p className="text-gray-900">
                    Demikian surat keterangan ini dibuat untuk dapat
                    digunakan sebagaimana mestinya.
                  </p>
                </div>

                <div className="mt-12 text-right">
                  <div className="mb-16">
                    Jakarta, 20 Oktober 2025
                  </div>
                  <div>
                    <div className="mb-1">Ketua RT 05</div>
                    <div className="text-sm text-gray-600">
                      (Tanda Tangan & Stempel)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 p-6">
              <button
                onClick={() => setPreviewModal(false)}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
