'use client';  // <-- Tambahkan ini di paling atas

import { useState } from 'react';
import { FileText, Clock, CheckCircle, Eye, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const riwayatSurat = [
  { id: 1, type: 'Surat Pengantar KTP', date: '15 Okt 2025', status: 'Selesai', icon: CheckCircle, color: 'text-green-500' },
  { id: 2, type: 'Surat Keterangan Domisili', date: '18 Okt 2025', status: 'Diproses', icon: Clock, color: 'text-orange-500' },
  { id: 3, type: 'Surat Pengantar SKCK', date: '20 Okt 2025', status: 'Menunggu', icon: Clock, color: 'text-blue-500' },
];

export function LayananSurat() {
  const [step, setStep] = useState(1);
  const [jenisSurat, setJenisSurat] = useState('');

  const handleSubmit = () => {
    toast.success('Permohonan surat berhasil diajukan!');
    setStep(1);
    setJenisSurat('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Tabs defaultValue="buat" className="space-y-6">
        <TabsList className="bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-1.5">
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
          <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step >= s 
                        ? 'bg-[#007BFF] text-white shadow-[0_4px_12px_rgba(0,123,255,0.3)]' 
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div 
                      className={`w-16 h-1 mx-2 rounded transition-all duration-300 ${
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
                <div className="text-center mb-6">
                  <h3 className="text-gray-800 mb-2">Pilih Jenis Surat</h3>
                  <p className="text-gray-500">Pilih jenis surat yang ingin Anda ajukan</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="p-6 rounded-xl border-2 border-gray-200 hover:border-[#007BFF] hover:bg-[#E8F1FB] transition-all duration-300 text-left group"
                    >
                      <FileText className="w-8 h-8 text-gray-400 group-hover:text-[#007BFF] mb-3 transition-colors" />
                      <p className="text-gray-800">{type}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Isi Keperluan */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-gray-800 mb-2">Isi Keperluan</h3>
                  <p className="text-gray-500">Jelaskan keperluan surat ini</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Keperluan</Label>
                    <Textarea 
                      placeholder="Contoh: Untuk pembuatan KTP baru"
                      className="rounded-xl border-gray-200 focus:border-[#007BFF] min-h-[120px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Keterangan Tambahan (Opsional)</Label>
                    <Textarea 
                      placeholder="Tambahkan keterangan jika diperlukan"
                      className="rounded-xl border-gray-200 focus:border-[#007BFF] min-h-[80px]"
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
                    className="flex-1 bg-[#007BFF] hover:bg-[#0056d2] text-white rounded-xl"
                  >
                    Lanjut
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Upload Dokumen */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-gray-800 mb-2">Unggah Dokumen</h3>
                  <p className="text-gray-500">Upload dokumen pendukung jika diperlukan</p>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#007BFF] hover:bg-[#E8F1FB] transition-all duration-300 cursor-pointer group">
                  <Upload className="w-12 h-12 text-gray-400 group-hover:text-[#007BFF] mx-auto mb-4 transition-colors" />
                  <p className="text-gray-600 mb-2">Klik atau drag file ke sini</p>
                  <p className="text-sm text-gray-400">Format: PDF, JPG, PNG (Max 5MB)</p>
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
                    className="flex-1 bg-[#007BFF] hover:bg-[#0056d2] text-white rounded-xl"
                  >
                    Lanjut
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Konfirmasi */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-gray-800 mb-2">Konfirmasi Pengajuan</h3>
                  <p className="text-gray-500">Pastikan data Anda sudah benar</p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#E8F1FB]">
                    <p className="text-sm text-gray-500 mb-1">Jenis Surat</p>
                    <p className="text-gray-800">{jenisSurat}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#E8F1FB]">
                    <p className="text-sm text-gray-500 mb-1">Pemohon</p>
                    <p className="text-gray-800">Budi Santoso</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#E8F1FB]">
                    <p className="text-sm text-gray-500 mb-1">Estimasi Selesai</p>
                    <p className="text-gray-800">3 hari kerja</p>
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
                    className="flex-1 bg-[#007BFF] hover:bg-[#0056d2] text-white rounded-xl"
                  >
                    Ajukan Surat
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Riwayat Surat */}
        <TabsContent value="riwayat">
          <div className="space-y-4">
            {riwayatSurat.map((surat) => {
              const Icon = surat.icon;
              return (
                <Card 
                  key={surat.id}
                  className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6 hover:shadow-[0_8px_24px_rgba(0,123,255,0.15)] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${surat.status === 'Selesai' ? 'bg-green-100' : surat.status === 'Diproses' ? 'bg-orange-100' : 'bg-blue-100'} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${surat.color}`} />
                      </div>
                      <div>
                        <p className="text-gray-800 mb-1">{surat.type}</p>
                        <p className="text-sm text-gray-500">{surat.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline"
                        className={`${
                          surat.status === 'Selesai' 
                            ? 'border-green-200 text-green-600 bg-green-50' 
                            : surat.status === 'Diproses'
                            ? 'border-orange-200 text-orange-600 bg-orange-50'
                            : 'border-blue-200 text-blue-600 bg-blue-50'
                        }`}
                      >
                        {surat.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-xl hover:bg-[#E8F1FB] hover:border-[#007BFF]"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default LayananSurat;