'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Shield,
  Calendar as CalendarIcon,
  Moon,
  ArrowRightLeft,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from 'sonner';

type RondaShift = {
  id: number;
  tanggal: string;      // YYYY-MM-DD / ISO
  shiftKe: number;
  wargaNama: string | null;   // ⬅ bisa null
  lokasi: string;
  jamMulai: string;     // "20:00"
  jamSelesai: string;   // "00:00"
  kelompok: string | null;
};

export default function JadwalRonda() {
  const [selectedDate] = useState<Date>(() => new Date());
  const [shifts, setShifts] = useState<RondaShift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sendingSwap, setSendingSwap] = useState(false);

  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  // ambil nama user dari localStorage (hasil login)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.name) {
        setCurrentUserName(parsed.name as string);
      }
    } catch {
      // abaikan
    }
  }, []);

  // ambil jadwal ronda untuk hari ini
  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true);
      setError(null);
      try {
        const dateKey = selectedDate.toISOString().slice(0, 10); // YYYY-MM-DD
        const res = await fetch(`/api/ronda?date=${dateKey}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Gagal mengambil jadwal ronda.');
        }
        setShifts(data as RondaShift[]);
      } catch (err: any) {
        setError(
          err?.message || 'Terjadi kesalahan saat memuat jadwal ronda.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [selectedDate]);

  const formattedTitle = useMemo(() => {
    return selectedDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [selectedDate]);

  const myShift = useMemo(
    () =>
      currentUserName
        ? shifts.find((s) => s.wargaNama === currentUserName) ?? null
        : null,
    [shifts, currentUserName],
  );

  const otherShifts = useMemo(
    () =>
      currentUserName
        ? shifts.filter((s) => s.wargaNama !== currentUserName)
        : shifts,
    [shifts, currentUserName],
  );

  const formatTimeRange = (shift: RondaShift) =>
    `${shift.jamMulai} - ${shift.jamSelesai} WIB`;

  const handleSwapRequest = async (target: RondaShift) => {
    if (!myShift || !currentUserName) {
      toast.error(
        'Kamu belum punya jadwal hari ini, jadi tidak bisa tukar.',
      );
      return;
    }

    if (!target.wargaNama) {
      toast.error('Shift yang dipilih belum punya nama warga.');
      return;
    }

    setSendingSwap(true);
    try {
      const res = await fetch('/api/ronda/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromShiftId: myShift.id,
          toShiftId: target.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || 'Gagal mengirim permintaan tukar jadwal.',
        );
      }
      toast.success('Permintaan tukar jadwal berhasil dikirim!');
      setIsSheetOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Terjadi kesalahan saat tukar jadwal.');
    } finally {
      setSendingSwap(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header Banner */}
      <Card className="rounded-2xl border-0 bg-gradient-to-br from-purple-500 to-purple-700 p-8 text-white shadow-[0_8px_32px_rgba(147,51,234,0.25)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <Shield className="h-8 w-8" />
              <h2 className="text-white">Jadwal Ronda RT 03</h2>
            </div>
            <p className="text-purple-100">
              Jaga keamanan bersama untuk lingkungan yang lebih aman
            </p>
          </div>
          <div className="hidden text-6xl opacity-20 md:block">🛡️</div>
        </div>
      </Card>

      {/* Kartu Info Cepat */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Jadwal milik user hari ini */}
        <Card className="rounded-2xl border-0 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <Moon className="h-6 w-6 text-[#007BFF]" />
            </div>
            <Badge className="bg-green-100 text-green-600 hover:bg-green-100">
              Jadwal Hari Ini
            </Badge>
          </div>
          {myShift ? (
            <>
              <p className="mb-2 text-sm text-gray-500">
                Jadwal ronda kamu hari ini
              </p>
              <p className="mb-1 text-xl text-gray-800">{formattedTitle}</p>
              <p className="text-gray-600">{formatTimeRange(myShift)}</p>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Kamu tidak punya jadwal ronda untuk hari ini.
            </p>
          )}
        </Card>

        {/* Ajukan tukar jadwal */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Card className="cursor-pointer rounded-2xl border-0 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,123,255,0.15)]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                  <ArrowRightLeft className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="mb-2 text-sm text-gray-500">
                Perlu tukar jadwal ronda hari ini?
              </p>
              <Button
                disabled={!myShift}
                className="mt-2 w-full rounded-xl bg-[#007BFF] text-white hover:bg-[#0056d2]"
              >
                {myShift
                  ? 'Ajukan Tukar Jadwal'
                  : 'Tidak ada jadwal untuk ditukar'}
              </Button>
            </Card>
          </SheetTrigger>
          <SheetContent className="w-full rounded-l-2xl sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Tukar Jadwal Ronda</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 py-6">
              {myShift ? (
                <>
                  <div className="rounded-xl bg-[#E8F1FB] p-4">
                    <p className="mb-1 text-sm text-gray-500">
                      Jadwal Kamu Hari Ini
                    </p>
                    <p className="text-gray-800">{formattedTitle}</p>
                    <p className="text-gray-600">
                      {formatTimeRange(myShift)}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">
                      Pilih warga untuk bertukar jadwal:
                    </p>
                    <div className="space-y-2">
                      {otherShifts.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          Tidak ada jadwal lain di hari ini.
                        </p>
                      ) : (
                        otherShifts.map((shift) => (
                          <button
                            key={shift.id}
                            disabled={sendingSwap}
                            onClick={() => handleSwapRequest(shift)}
                            className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-4 transition-all hover:border-[#007BFF] hover:bg-[#E8F1FB] disabled:opacity-60"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                                  shift.wargaNama || 'Petugas Ronda',
                                )}`}
                              />
                              <AvatarFallback className="bg-[#007BFF] text-white">
                                {(shift.wargaNama ?? '?')[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-left">
                              <p className="text-gray-800">
                                {shift.wargaNama ?? 'Belum ada nama'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatTimeRange(shift)} •{' '}
                                {shift.kelompok ?? 'Tanpa kelompok'}
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Kamu tidak punya jadwal hari ini, jadi tidak bisa mengajukan
                  tukar.
                </p>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Daftar jadwal hari ini */}
      <Card className="rounded-2xl border-0 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
        <div className="mb-4 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-[#007BFF]" />
          <h3 className="text-gray-800">
            Jadwal Ronda •{' '}
            <span className="text-sm text-gray-500">{formattedTitle}</span>
          </h3>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">
            Memuat jadwal ronda hari ini...
          </p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : shifts.length === 0 ? (
          <p className="text-sm text-gray-500">
            Belum ada jadwal ronda yang dibuat untuk hari ini.
          </p>
        ) : (
          <div className="space-y-3">
            {shifts.map((shift) => {
              const isYou =
                currentUserName && shift.wargaNama === currentUserName;
              return (
                <div
                  key={shift.id}
                  className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
                    isYou
                      ? 'border-[#007BFF] bg-[#E8F1FB]'
                      : 'border-gray-200 hover:border-[#007BFF] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                          shift.wargaNama || 'Petugas Ronda',
                        )}`}
                      />
                      <AvatarFallback className="bg-purple-500 text-white">
                        {(shift.wargaNama ?? '?')[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-gray-800">
                        {shift.wargaNama ?? 'Belum ada nama'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Shift {shift.shiftKe} • {formatTimeRange(shift)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Lokasi: {shift.lokasi}{' '}
                        {shift.kelompok && `• ${shift.kelompok}`}
                      </p>
                    </div>
                  </div>
                  {isYou && (
                    <Badge className="bg-[#007BFF] text-white hover:bg-[#007BFF]">
                      Jadwal Anda
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
