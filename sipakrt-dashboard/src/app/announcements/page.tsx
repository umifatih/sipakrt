'use client';
import { useState } from 'react';
import { Send, Upload, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const reports = [
  {
    id: 1,
    title: 'Lampu jalan mati di Gang 3',
    description: 'Lampu jalan di Gang 3 sudah mati sejak 3 hari yang lalu. Mohon segera diperbaiki karena mengganggu keamanan.',
    date: '18 Okt 2025',
    status: 'Diproses',
    statusColor: 'border-orange-400',
    response: 'Terima kasih atas laporannya. Tim sudah melakukan pengecekan dan akan segera diperbaiki.',
  },
  {
    id: 2,
    title: 'Sampah belum diangkut 2 hari',
    description: 'Sampah di depan rumah belum diangkut sejak 2 hari yang lalu. Mohon koordinasi dengan petugas kebersihan.',
    date: '19 Okt 2025',
    status: 'Baru',
    statusColor: 'border-blue-400',
    response: null,
  },
  {
    id: 3,
    title: 'Jalan berlubang perlu perbaikan',
    description: 'Jalan di depan mushola berlubang cukup besar dan berbahaya untuk pengendara motor.',
    date: '15 Okt 2025',
    status: 'Selesai',
    statusColor: 'border-green-400',
    response: 'Jalan sudah diperbaiki pada tanggal 17 Oktober 2025. Terima kasih atas partisipasinya.',
  },
];

export function LaporanAspirasi() {
  const [message, setMessage] = useState('');
  const [selectedReport, setSelectedReport] = useState<typeof reports[0] | null>(reports[0]);

  const handleSend = () => {
    if (message.trim()) {
      toast.success('Laporan Anda berhasil dikirim!');
      setMessage('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel - List of Reports */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6">
            <h3 className="text-gray-800 mb-4">Kirim Laporan Baru</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Tulis laporan atau aspirasi Anda di sini..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="rounded-xl border-gray-200 focus:border-[#007BFF] min-h-[120px] resize-none"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl hover:bg-[#E8F1FB] hover:border-[#007BFF]"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Foto
                </Button>
                <Button
                  onClick={handleSend}
                  className="flex-1 bg-[#007BFF] hover:bg-[#0056d2] text-white rounded-xl shadow-[0_4px_16px_rgba(0,123,255,0.3)]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Kirim
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <h3 className="text-gray-800 px-2">Riwayat Laporan</h3>
            {reports.length === 0 ? (
              <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h4 className="text-gray-800 mb-2">Belum ada laporan</h4>
                <p className="text-sm text-gray-500">Laporan Anda akan muncul di sini</p>
              </Card>
            ) : (
              reports.map((report) => (
                <Card
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-l-4 ${report.statusColor} p-4 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,123,255,0.15)] hover:-translate-y-1 ${
                    selectedReport?.id === report.id ? 'ring-2 ring-[#007BFF]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-gray-800">{report.title}</p>
                    <Badge
                      variant="outline"
                      className={`text-xs whitespace-nowrap ml-2 ${
                        report.status === 'Selesai'
                          ? 'border-green-200 text-green-600 bg-green-50'
                          : report.status === 'Diproses'
                          ? 'border-orange-200 text-orange-600 bg-orange-50'
                          : 'border-blue-200 text-blue-600 bg-blue-50'
                      }`}
                    >
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{report.date}</p>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Report Detail */}
        <div className="lg:col-span-3">
          {selectedReport ? (
            <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-8 animate-in fade-in duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selectedReport.status === 'Selesai'
                    ? 'bg-green-100'
                    : selectedReport.status === 'Diproses'
                    ? 'bg-orange-100'
                    : 'bg-blue-100'
                }`}>
                  {selectedReport.status === 'Selesai' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : selectedReport.status === 'Diproses' ? (
                    <Clock className="w-6 h-6 text-orange-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-800 mb-2">{selectedReport.title}</h3>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        selectedReport.status === 'Selesai'
                          ? 'border-green-200 text-green-600 bg-green-50'
                          : selectedReport.status === 'Diproses'
                          ? 'border-orange-200 text-orange-600 bg-orange-50'
                          : 'border-blue-200 text-blue-600 bg-blue-50'
                      }`}
                    >
                      {selectedReport.status}
                    </Badge>
                    <span className="text-sm text-gray-500">{selectedReport.date}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm text-gray-500 mb-2">Laporan Anda</h4>
                  <div className="p-4 rounded-xl bg-[#E8F1FB]">
                    <p className="text-gray-700">{selectedReport.description}</p>
                  </div>
                </div>

                {selectedReport.response && (
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Tanggapan Pengurus RT</h4>
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-green-600 mt-0.5" />
                        <p className="text-gray-700">{selectedReport.response}</p>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedReport.response && selectedReport.status === 'Baru' && (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-700">
                      ⏳ Laporan Anda sedang menunggu ditinjau oleh pengurus RT
                    </p>
                  </div>
                )}

                {!selectedReport.response && selectedReport.status === 'Diproses' && (
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                    <p className="text-sm text-orange-700">
                      🔄 Laporan Anda sedang dalam proses penanganan
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm text-gray-500 mb-3">Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                      <div>
                        <p className="text-sm text-gray-800">Laporan dikirim</p>
                        <p className="text-xs text-gray-500">{selectedReport.date}</p>
                      </div>
                    </div>
                    {selectedReport.status === 'Diproses' && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
                        <div>
                          <p className="text-sm text-gray-800">Sedang diproses</p>
                          <p className="text-xs text-gray-500">19 Okt 2025</p>
                        </div>
                      </div>
                    )}
                    {selectedReport.status === 'Selesai' && (
                      <>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
                          <div>
                            <p className="text-sm text-gray-800">Sedang diproses</p>
                            <p className="text-xs text-gray-500">16 Okt 2025</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                          <div>
                            <p className="text-sm text-gray-800">Selesai ditangani</p>
                            <p className="text-xs text-gray-500">17 Okt 2025</p>
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
                <h4 className="text-gray-800 mb-2">Pilih laporan untuk melihat detail</h4>
                <p className="text-sm text-gray-500">Detail laporan akan ditampilkan di sini</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
export default LaporanAspirasi;