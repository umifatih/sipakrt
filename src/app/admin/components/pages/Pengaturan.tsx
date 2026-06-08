import { useState } from 'react';
import { Save, Upload, Download, Bell, Mail } from 'lucide-react';

export default function Pengaturan() {
  const [activeSection, setActiveSection] = useState('profil');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Pengaturan Sistem</h1>
        <p className="text-gray-600">Konfigurasi dan preferensi dashboard</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: 'profil', label: 'Profil RT' },
              { id: 'tema', label: 'Tema Tampilan' },
              { id: 'backup', label: 'Backup & Restore' },
              { id: 'notifikasi', label: 'Notifikasi' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-6 py-4 whitespace-nowrap transition-all ${
                  activeSection === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
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
          {/* Profil RT */}
          {activeSection === 'profil' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-gray-900 mb-4">Informasi RT</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Nomor RT</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="RT 05"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Nomor RW</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="RW 03"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">Kelurahan</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="Menteng"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">Kecamatan</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="Jakarta Pusat"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">Alamat Lengkap</label>
                    <textarea
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      defaultValue="Jl. Melati Raya, Jakarta Pusat"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-900 mb-4">Logo RT</h3>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                      <Upload className="h-5 w-5" />
                      Upload Logo Baru
                    </button>
                    <p className="text-gray-500 text-sm mt-2">
                      Recommended: 512x512px, PNG atau JPG
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tema */}
          {activeSection === 'tema' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-gray-900 mb-4">Warna Utama</h3>
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { name: 'Blue', color: '#007BFF' },
                    { name: 'Green', color: '#10b981' },
                    { name: 'Purple', color: '#8b5cf6' },
                    { name: 'Orange', color: '#f59e0b' },
                    { name: 'Red', color: '#ef4444' },
                  ].map((theme) => (
                    <button
                      key={theme.name}
                      className="aspect-square rounded-2xl border-4 border-transparent hover:border-gray-300 transition-all relative group"
                      style={{ backgroundColor: theme.color }}
                    >
                      {theme.name === 'Blue' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        {theme.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-gray-900 mb-4">Mode Tampilan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-6 border-2 border-blue-600 rounded-2xl bg-blue-50 transition-all">
                    <div className="w-12 h-12 bg-white rounded-xl mx-auto mb-3"></div>
                    <div className="text-gray-900 mb-1">Light Mode</div>
                    <div className="text-gray-600 text-sm">Tema terang (aktif)</div>
                  </button>
                  <button className="p-6 border-2 border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl mx-auto mb-3"></div>
                    <div className="text-gray-900 mb-1">Dark Mode</div>
                    <div className="text-gray-600 text-sm">Tema gelap</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Backup */}
          {activeSection === 'backup' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-blue-50 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <Download className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2">Backup Data</h3>
                    <p className="text-gray-600 mb-4">
                      Simpan salinan data warga, surat, keuangan, dan pengaturan
                    </p>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                      <Download className="h-5 w-5" />
                      Download Backup
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2">Restore Data</h3>
                    <p className="text-gray-600 mb-4">
                      Pulihkan data dari file backup yang sudah ada
                    </p>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                      <Upload className="h-5 w-5" />
                      Upload File Backup
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl p-6">
                <h3 className="text-gray-900 mb-4">Riwayat Backup</h3>
                <div className="space-y-3">
                  {[
                    { date: '19 Okt 2025, 14:30', size: '2.4 MB' },
                    { date: '15 Okt 2025, 09:15', size: '2.3 MB' },
                    { date: '10 Okt 2025, 16:45', size: '2.1 MB' },
                  ].map((backup, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <div className="text-gray-900 mb-1">Backup-SIPAKRT-{backup.date}</div>
                        <div className="text-gray-500 text-sm">{backup.size}</div>
                      </div>
                      <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifikasi */}
          {activeSection === 'notifikasi' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-gray-900 mb-4">Integrasi WhatsApp</h3>
                <div className="bg-green-50 rounded-2xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bell className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900 mb-1">WhatsApp Notification</div>
                      <p className="text-gray-600 text-sm">
                        Kirim notifikasi otomatis ke warga via WhatsApp
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500"
                        defaultChecked
                      />
                      <span className="text-gray-700">Notifikasi Surat Disetujui</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500"
                        defaultChecked
                      />
                      <span className="text-gray-700">Pengumuman Baru</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500"
                      />
                      <span className="text-gray-700">Reminder Jadwal Ronda</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-900 mb-4">Notifikasi Email</h3>
                <div className="bg-blue-50 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900 mb-1">Email Notification</div>
                      <p className="text-gray-600 text-sm mb-4">
                        Kirim notifikasi ke email pengurus RT
                      </p>
                      <input
                        type="email"
                        className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="email@rt05.com"
                        defaultValue="ketua@rt05.com"
                      />
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105">
          <Save className="h-5 w-5" />
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
