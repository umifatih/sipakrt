'use client';

import { useEffect, useState } from 'react';
import { UserCog, Plus, Edit, Trash2, X, Shield } from 'lucide-react';
import { toast } from 'sonner';

type PengurusItem = {
  id: number;
  nama: string;
  jabatan: string;
  username: string;
  password?: string; // tidak dikirim dari API kalau kamu mau hide
  noHp: string;
  role: string;
  aktif: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function Pengurus() {
  const [pengurus, setPengurus] = useState<PengurusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // form state
  const [nama, setNama] = useState('');
  const [jabatan, setJabatan] = useState('Ketua RT');
  const [noHp, setNoHp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Full Access');
  const [aktifBaru, setAktifBaru] = useState(true);

  // LOAD DATA
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/pengurus');
        if (!res.ok) throw new Error('Gagal fetch data pengurus');

        const data = (await res.json()) as PengurusItem[];
        setPengurus(data);
      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat data pengurus.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const resetForm = () => {
    setNama('');
    setJabatan('Ketua RT');
    setNoHp('');
    setUsername('');
    setPassword('');
    setRole('Full Access');
    setAktifBaru(true);
  };

  // CREATE
  const handleCreate = async () => {
    if (!nama || !username || !password) {
      toast.error('Nama, username, dan password wajib diisi.');
      return;
    }

    try {
      const res = await fetch('/api/pengurus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama,
          jabatan,
          username,
          password,
          noHp,
          role,
          aktif: aktifBaru,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal menambah pengurus.');
      }

      setPengurus((prev) => [...prev, data]);
      toast.success('Admin / pengurus baru berhasil ditambahkan.');

      resetForm();
      setShowAddModal(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Gagal menambah pengurus.');
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus pengurus ini?')) return;

    try {
      const res = await fetch(`/api/pengurus/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Gagal menghapus pengurus.');
      }

      setPengurus((prev) => prev.filter((p) => p.id !== id));
      toast.success('Pengurus berhasil dihapus.');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Gagal menghapus pengurus.');
    }
  };

  // TOGGLE AKTIF
  const handleToggleAktif = async (item: PengurusItem) => {
    try {
      const res = await fetch(`/api/pengurus/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aktif: !item.aktif }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengubah status.');
      }

      setPengurus((prev) =>
        prev.map((p) => (p.id === item.id ? data : p))
      );
      toast.success('Status akun diperbarui.');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Gagal mengubah status akun.');
    }
  };

  // STAT
  const total = pengurus.length;
  const aktif = pengurus.filter((p) => p.aktif).length;
  const fullAccess = pengurus.filter((p) => p.role === 'Full Access').length;
  const terbatas = aktif - fullAccess;

  if (loading) {
    return <div className="p-6 text-gray-600">Memuat data pengurus...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-1">Manajemen Pengurus / Admin</h1>
          <p className="text-gray-600">Kelola akun pengurus RT</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Tambah Admin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <UserCog className="h-6 w-6" />
            </div>
            <div>
              <div className="text-gray-600 text-sm">Total Pengurus</div>
              <div className="text-gray-900">{total} Orang</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="text-gray-600 text-sm">Akun Aktif</div>
              <div className="text-gray-900">{aktif} Akun</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <UserCog className="h-6 w-6" />
            </div>
            <div>
              <div className="text-gray-600 text-sm">Full Access</div>
              <div className="text-gray-900">{fullAccess} Akun</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="text-gray-600 text-sm">Terbatas</div>
              <div className="text-gray-900">{terbatas} Akun</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-gray-700">Nama</th>
                <th className="text-left px-6 py-4 text-gray-700">Jabatan</th>
                <th className="text-left px-6 py-4 text-gray-700">Username</th>
                <th className="text-left px-6 py-4 text-gray-700">No HP</th>
                <th className="text-left px-6 py-4 text-gray-700">Role</th>
                <th className="text-left px-6 py-4 text-gray-700">Status</th>
                <th className="text-left px-6 py-4 text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pengurus.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                        {p.nama
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span className="text-gray-900">{p.nama}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.jabatan}</td>
                  <td className="px-6 py-4 text-gray-600">{p.username}</td>
                  <td className="px-6 py-4 text-gray-600">{p.noHp}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-sm">
                      {p.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={p.aktif}
                        onChange={() => handleToggleAktif(p)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        type="button"
                        onClick={() =>
                          alert('Fitur edit bisa kamu tambahkan nanti 😊')
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        type="button"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pengurus.length === 0 && (
                <tr>
                  <td
                    className="px-6 py-6 text-center text-gray-500"
                    colSpan={7}
                  >
                    Belum ada pengurus yang terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900">Tambah Admin Baru</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama pengurus"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Jabatan</label>
                  <select
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Ketua RT</option>
                    <option>Sekretaris</option>
                    <option>Bendahara</option>
                    <option>Koordinator Keamanan</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">No. HP</label>
                  <input
                    type="text"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="username_login"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Minimal 8 karakter"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2">
                    Hak Akses / Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Full Access</option>
                    <option>Data & Surat</option>
                    <option>Keuangan Only</option>
                    <option>Ronda & Keamanan</option>
                  </select>
                  <p className="text-gray-500 text-sm mt-2">
                    Tentukan menu dan fitur yang bisa diakses oleh admin ini
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <label className="text-gray-700">Aktifkan Akun</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={aktifBaru}
                    onChange={(e) => setAktifBaru(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Tambah Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
