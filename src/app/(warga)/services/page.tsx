'use client';

import { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle, Eye, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type Surat = {
  id: number;
  pemohonNama: string;
  pemohonEmail?: string | null;
  jenis: string;
  keperluan: string;
  keterangan?: string | null;
  status: string;
  catatanAdmin?: string | null;
  createdAt?: string;
};

export function LayananSurat() {
  const [step, setStep] = useState(1);
  const [jenisSurat, setJenisSurat] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [riwayat, setRiwayat] = useState<Surat[]>([]);
  const [loadingRiwayat, setLoadingRiwayat] = useState(true);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // NEW: state tab & success message
  const [activeTab, setActiveTab] = useState<'buat' | 'riwayat'>('buat');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ambil nama & email dari localStorage (di-set waktu login)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserName(localStorage.getItem('userName') || '');
      setUserEmail(localStorage.getItem('userEmail') || '');
    }
  }, []);

  const fetchRiwayat = async (email: string) => {
    if (!email) {
      setLoadingRiwayat(false);
      return;
    }
    setLoadingRiwayat(true);
    try {
      const res = await fetch(
        `/api/surat?email=${encodeURIComponent(email)}`,
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengambil riwayat surat.');
      }
      setRiwayat(data);
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengambil riwayat surat.');
    } finally {
      setLoadingRiwayat(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchRiwayat(userEmail);
    }
  }, [userEmail]);

  const resetForm = () => {
    setStep(1);
    setJenisSurat('');
    setKeperluan('');
    setKeterangan('');
  };

  const handleSubmit = async () => {
    if (!jenisSurat || !keperluan) {
      toast.error('Jenis surat dan keperluan wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null); // clear pesan lama

    try {
      const res = await fetch('/api/surat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pemohonNama: userName || 'Warga RT',
          pemohonEmail: userEmail || null,
          jenis: jenisSurat,
          keperluan,
          keterangan,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengajukan surat.');
      }

      toast.success('Permohonan surat berhasil diajukan!');
      setSuccessMessage('Permohonan surat berhasil diajukan. Silakan cek status di riwayat surat.');

      resetForm();

      // pindah otomatis ke tab Riwayat
      setActiveTab('riwayat');

      if (userEmail) {
        fetchRiwayat(userEmail);
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat mengajukan surat.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapStatus = (status: string) => {
    switch (status) {
      case 'SELESAI':
        return {
          label: 'Selesai',
          color: 'text-green-500',
          bg: 'bg-green-100',
          badge:
            'border-green-200 text-green-600 bg-green-50',
          icon: CheckCircle,
        };
      case 'DIPROSES':
        return {
          label: 'Diproses',
          color: 'text-orange-500',
          bg: 'bg-orange-100',
          badge:
            'border-orange-200 text-orange-600 bg-orange-50',
          icon: Clock,
        };
      case 'DITOLAK':
        return {
          label: 'Ditolak',
          color: 'text-red-500',
          bg: 'bg-red-100',
          badge: 'border-red-200 text-red-600 bg-red-50',
          icon: Clock,
        };
      default:
        return {
          label: 'Menunggu',
          color: 'text-blue-500',
          bg: 'bg-blue-100',
          badge:
            'border-blue-200 text-blue-600 bg-blue-50',
          icon: Clock,
        };
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
    <div className="mx-auto max-w-6xl">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'buat' | 'riwayat')}
        className="space-y-6"
      >
        <TabsList className="rounded-xl bg-white p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <TabsTrigger
            value="buat"
            className="rounded-lg data-[state=active]:bg-[#007BFF] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_12px_rgba(0,123,255,0.3)]"
          >
            Buat Surat Baru
          </TabsTrigger>
          <TabsTrigger
            value="riwayat"
            className="rounded-lg data-[state=active]:bg-[#007BFF] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_12px_rgba(0,123,255,0.3)]"
          >
            Riwayat Surat
          </TabsTrigger>
        </TabsList>

        {/* Buat Surat Baru */}
        <TabsContent value="buat">
          <Card className="rounded-2xl border-0 bg-white p-8 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            {/* Progress Steps */}
            <div className="mb-8 flex items-center justify-center">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                      step >= s
                        ? 'bg-[#007BFF] text-white shadow-[0_4px_12px_rgba(0,123,255,0.3)]'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`mx-2 h-1 w-16 rounded transition-all duration-300 ${
                        step > s ? 'bg-[#007BFF]' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Pilih Jenis Surat */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-gray-800">
                    Pilih Jenis Surat
                  </h3>
                  <p className="text-gray-500">
                    Pilih jenis surat yang ingin Anda ajukan
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    'Surat Pengantar KTP',
                    'Surat Keterangan Domisili',
                    'Surat Pengantar SKCK',
                    'Surat Keterangan Usaha',
                  ].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setJenisSurat(type);
                        setStep(2);
                      }}
                      className="group rounded-xl border-2 border-gray-200 p-6 text-left transition-all duration-300 hover:border-[#007BFF] hover:bg-[#E8F1FB]"
                    >
                      <FileText className="mb-3 h-8 w-8 text-gray-400 transition-colors group-hover:text-[#007BFF]" />
                      <p className="text-gray-800">{type}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Isi Keperluan */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-gray-800">
                    Isi Keperluan
                  </h3>
                  <p className="text-gray-500">
                    Jelaskan keperluan surat ini
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Keperluan</Label>
                    <Textarea
                      placeholder="Contoh: Untuk pembuatan KTP baru"
                      className="min-h-[120px] rounded-xl border-gray-200 focus:border-[#007BFF]"
                      value={keperluan}
                      onChange={(e) =>
                        setKeperluan(e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Keterangan Tambahan (Opsional)</Label>
                    <Textarea
                      placeholder="Tambahkan keterangan jika diperlukan"
                      className="min-h-[80px] rounded-xl border-gray-200 focus:border-[#007BFF]"
                      value={keterangan}
                      onChange={(e) =>
                        setKeterangan(e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-xl"
                  >
                    Kembali
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-xl bg-[#007BFF] text-white hover:bg-[#0056d2]"
                  >
                    Lanjut
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Upload Dokumen (placeholder) */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-gray-800">
                    Unggah Dokumen
                  </h3>
                  <p className="text-gray-500">
                    Upload dokumen pendukung jika diperlukan
                  </p>
                </div>
                <div className="group cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-12 text-center transition-all duration-300 hover:border-[#007BFF] hover:bg-[#E8F1FB]">
                  <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400 transition-colors group-hover:text-[#007BFF]" />
                  <p className="mb-2 text-gray-600">
                    (Opsional) Klik atau drag file ke sini
                  </p>
                  <p className="text-sm text-gray-400">
                    Format: PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-xl"
                  >
                    Kembali
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    className="flex-1 rounded-xl bg-[#007BFF] text-white hover:bg-[#0056d2]"
                  >
                    Lanjut
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Konfirmasi */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-gray-800">
                    Konfirmasi Pengajuan
                  </h3>
                  <p className="text-gray-500">
                    Pastikan data Anda sudah benar
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl bg-[#E8F1FB] p-4">
                    <p className="mb-1 text-sm text-gray-500">
                      Jenis Surat
                    </p>
                    <p className="text-gray-800">
                      {jenisSurat || '-'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#E8F1FB] p-4">
                    <p className="mb-1 text-sm text-gray-500">
                      Pemohon
                    </p>
                    <p className="text-gray-800">
                      {userName || 'Nama Anda'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#E8F1FB] p-4">
                    <p className="mb-1 text-sm text-gray-500">
                      Estimasi Selesai
                    </p>
                    <p className="text-gray-800">
                      3 hari kerja
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-xl"
                  >
                    Kembali
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-[#007BFF] text-white hover:bg-[#0056d2] disabled:opacity-60"
                  >
                    {isSubmitting
                      ? 'Mengajukan...'
                      : 'Ajukan Surat'}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Riwayat Surat */}
        <TabsContent value="riwayat">
          {/* Banner sukses */}
          {successMessage && (
            <div className="mb-4 flex items-start justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              <span>{successMessage}</span>
              <button
                onClick={() => setSuccessMessage(null)}
                className="ml-3 text-green-700 hover:text-green-900"
              >
                ✕
              </button>
            </div>
          )}

          {loadingRiwayat ? (
            <p className="text-sm text-gray-500">
              Memuat riwayat surat...
            </p>
          ) : riwayat.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada pengajuan surat.
            </p>
          ) : (
            <div className="space-y-4">
              {riwayat.map((surat) => {
                const mapped = mapStatus(surat.status);
                const Icon = mapped.icon;
                return (
                  <Card
                    key={surat.id}
                    className="rounded-2xl border-0 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,123,255,0.15)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${mapped.bg}`}
                        >
                          <Icon
                            className={`h-6 w-6 ${mapped.color}`}
                          />
                        </div>
                        <div>
                          <p className="mb-1 text-gray-800">
                            {surat.jenis}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatTanggal(surat.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={mapped.badge}
                        >
                          {mapped.label}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl hover:border-[#007BFF] hover:bg-[#E8F1FB]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {surat.catatanAdmin && (
                      <p className="mt-2 text-xs text-gray-500">
                        Catatan pengurus:{' '}
                        {surat.catatanAdmin}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LayananSurat;
