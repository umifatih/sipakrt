'use client';

import { useEffect, useMemo, useState } from 'react';
import { Shield, Moon, Plus, X, Edit2, Trash2 } from 'lucide-react';

type RondaShift = {
  id: number;
  tanggal: string;
  shiftKe: number;
  wargaNama: string;
  lokasi: string;
  jamMulai: string;
  jamSelesai: string;
  kelompok: string | null;
};

export default function JadwalRonda() {
  const [shifts, setShifts] = useState<RondaShift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingShift, setEditingShift] = useState<RondaShift | null>(
    null,
  );

  // form state
  const [tanggal, setTanggal] = useState('');
  const [jamMulai, setJamMulai] = useState('20:00');
  const [jamSelesai, setJamSelesai] = useState('00:00');
  const [wargaNama, setWargaNama] = useState('');
  const [lokasi, setLokasi] = useState('Pos RT Jl. Melati');
  const [shiftKe, setShiftKe] = useState(1);
  const [kelompok, setKelompok] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchShifts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ronda');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengambil jadwal ronda.');
      }
      setShifts(data);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const totalKelompok = useMemo(() => {
    const setKel = new Set(
      shifts
        .map((s) => s.kelompok)
        .filter((k): k is string => Boolean(k)),
    );
    return setKel.size;
  }, [shifts]);

  const totalMalamIni = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    return shifts.filter((s) => s.tanggal.slice(0, 10) === todayKey)
      .length;
  }, [shifts]);

  const formatTanggal = (t: string) => {
    const d = new Date(t);
    if (Number.isNaN(d.getTime())) return t;
    return d.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const openAddModal = () => {
    setEditingShift(null);
    setTanggal('');
    setJamMulai('20:00');
    setJamSelesai('00:00');
    setWargaNama('');
    setLokasi('Pos RT Jl. Melati');
    setShiftKe(1);
    setKelompok('');
    setShowModal(true);
  };

  const openEditModal = (shift: RondaShift) => {
    setEditingShift(shift);
    setTanggal(shift.tanggal.slice(0, 10)); // "YYYY-MM-DD"
    setJamMulai(shift.jamMulai);
    setJamSelesai(shift.jamSelesai);
    setWargaNama(shift.wargaNama);
    setLokasi(shift.lokasi);
    setShiftKe(shift.shiftKe);
    setKelompok(shift.kelompok ?? '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggal || !wargaNama || !lokasi) return;

    setSubmitting(true);
    try {
      const payload = {
        tanggal,
        jamMulai,
        jamSelesai,
        wargaNama,
        lokasi,
        shiftKe,
        kelompok: kelompok || null,
      };

      let res: Response;
      if (editingShift) {
        // EDIT
        res = await fetch(`/api/ronda/${editingShift.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // ADD
        res = await fetch('/api/ronda', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Gagal menyimpan jadwal.');
        return;
      }

      setShowModal(false);
      setEditingShift(null);
      await fetchShifts();
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan jadwal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (shift: RondaShift) => {
    if (
      !confirm(
        `Yakin ingin menghapus jadwal ronda untuk ${shift.wargaNama} pada ${formatTanggal(
          shift.tanggal,
        )}?`,
      )
    ) {
      return;
    }

    setDeletingId(shift.id);
    try {
      const res = await fetch(`/api/ronda/${shift.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Gagal menghapus jadwal.');
        return;
      }
      await fetchShifts();
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghapus jadwal.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-gray-900">
            Kelola Jadwal Ronda
          </h1>
          <p className="text-gray-600">
            Atur jadwal keamanan lingkungan RT
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-white transition-all hover:bg-blue-700 hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Tambah Jadwal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">
                Total Shift Terjadwal
              </div>
              <div className="text-gray-900">
                {shifts.length} Shift
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Moon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">
                Ronda Malam Ini
              </div>
              <div className="text-gray-900">
                {totalMalamIni} Shift
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">
                Total Kelompok
              </div>
              <div className="text-gray-900">
                {totalKelompok} Kelompok
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* List Jadwal */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-gray-900">
          Daftar Jadwal Ronda
        </h2>

        {loading ? (
          <p className="text-sm text-gray-500">
            Memuat jadwal...
          </p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : shifts.length === 0 ? (
          <p className="text-sm text-gray-500">
            Belum ada jadwal ronda yang tercatat.
          </p>
        ) : (
          <div className="space-y-3">
            {shifts.map((s) => (
              <div
                key={s.id}
                className="flex items-start justify-between rounded-2xl border border-gray-200 p-4 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="mb-1 text-gray-900">
                      {s.wargaNama}{' '}
                      {s.kelompok && (
                        <span className="text-sm text-gray-500">
                          • {s.kelompok}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTanggal(s.tanggal)} • Shift {s.shiftKe}{' '}
                      ({s.jamMulai} - {s.jamSelesai})
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      Lokasi: {s.lokasi}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(s)}
                    className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(s)}
                    disabled={deletingId === s.id}
                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tambah / Edit Jadwal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl animate-in zoom-in-95 duration-200 rounded-2xl bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-gray-900">
                {editingShift ? 'Edit Jadwal Ronda' : 'Tambah Jadwal Ronda'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingShift(null);
                }}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-6"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-gray-700">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-gray-700">
                    Shift Ke
                  </label>
                  <select
                    value={shiftKe}
                    onChange={(e) =>
                      setShiftKe(Number(e.target.value))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Shift 1</option>
                    <option value={2}>Shift 2</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-gray-700">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    value={jamMulai}
                    onChange={(e) =>
                      setJamMulai(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-gray-700">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    value={jamSelesai}
                    onChange={(e) =>
                      setJamSelesai(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-gray-700">
                    Nama Petugas
                  </label>
                  <input
                    type="text"
                    value={wargaNama}
                    onChange={(e) =>
                      setWargaNama(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Budi Santoso"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-gray-700">
                    Kelompok (opsional)
                  </label>
                  <input
                    type="text"
                    value={kelompok}
                    onChange={(e) =>
                      setKelompok(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Kelompok A"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-gray-700">
                    Lokasi Pos
                  </label>
                  <input
                    type="text"
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingShift(null);
                  }}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting
                    ? 'Menyimpan...'
                    : editingShift
                    ? 'Simpan Perubahan'
                    : 'Simpan Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
