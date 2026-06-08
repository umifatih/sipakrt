'use client';

import { useEffect, useState } from 'react';
import {
  Calendar,
  Shield,
  Megaphone,
  AlertCircle,
  Clock,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type RondaItem = {
  id: number;
  tanggal: string;
  shiftKe: number;
  jamMulai: string;
  jamSelesai: string;
  // kalau API include warga, boleh ditambah:
  warga?: { nama: string } | null;
};

type Announcement = {
  id: number;
  title: string;
  emoji: string | null;
  category: string | null;
  content: string;
  date: string;
};

type EventItem = {
  id: number;
  title: string;
  emoji: string | null;
  category: string | null;
  date: string;
  timeStart: string | null;
  timeEnd: string | null;
  location: string;
  description: string;
  participants: number;
  maxParticipants: number | null;
};

type ReportItem = {
  id: number;
  title: string;
  status: 'baru' | 'proses' | 'selesai';
  createdAt: string;
};

// --- utils kecil ---

function formatDateIndo(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
  });
}

export default function WargaDashboard() {
  const [todayShifts, setTodayShifts] = useState<RondaItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const today = new Date();
        const dateParam = today.toISOString().slice(0, 10); // YYYY-MM-DD

        const [rondaRes, annRes, evtRes, repRes] = await Promise.all([
          fetch(`/api/ronda?date=${dateParam}`),
          fetch('/api/announcements?public=true'),
          fetch('/api/events?public=true'),
          fetch('/api/reports?me=true'),
        ]);

        if (!rondaRes.ok || !annRes.ok || !evtRes.ok || !repRes.ok) {
          throw new Error('Gagal memuat data dashboard');
        }

        const rondaData = (await rondaRes.json()) as RondaItem[];
        const annData = (await annRes.json()) as Announcement[];
        const evtData = (await evtRes.json()) as EventItem[];
        const repData = (await repRes.json()) as ReportItem[];

        setTodayShifts(rondaData);
        setAnnouncements(annData);
        setEvents(evtData);
        setReports(repData);
      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat data dashboard warga.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const today = new Date();
  const todayLabel = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  if (loading) {
    return <div className="p-6 text-gray-600">Memuat dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero / Welcome */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg border-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-1 text-lg md:text-xl">Selamat datang di SIPAKRT 👋</h1>
            <p className="text-sm md:text-base text-blue-100">
              Ringkasan informasi ronda, iuran, pengumuman, dan laporan untuk warga RT.
            </p>
          </div>
          <div className="text-right text-sm">
            <div className="text-blue-100">Hari ini</div>
            <div className="font-medium">{todayLabel}</div>
          </div>
        </div>
      </Card>

      {/* Ringkasan 4 kartu kecil */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl p-4 border-0 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Jadwal ronda hari ini</div>
            <div className="text-gray-900 text-sm">
              {todayShifts.length > 0
                ? `${todayShifts.length} shift`
                : 'Tidak ada jadwal'}
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-4 border-0 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Pengumuman terbaru</div>
            <div className="text-gray-900 text-sm">
              {announcements.length > 0 ? `${announcements.length} item` : 'Tidak ada'}
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-4 border-0 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Event & kegiatan</div>
            <div className="text-gray-900 text-sm">
              {events.length > 0 ? `${events.length} kegiatan` : 'Belum ada'}
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-4 border-0 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Laporan saya</div>
            <div className="text-gray-900 text-sm">
              {reports.length > 0 ? `${reports.length} laporan` : 'Belum ada'}
            </div>
          </div>
        </Card>
      </div>

      {/* 3 kolom: ronda, pengumuman, laporan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jadwal ronda hari ini */}
        <Card className="lg:col-span-1 rounded-2xl border-0 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800">Jadwal Ronda Hari Ini</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              asChild
            >
              <a href="/patrol">
                Lihat Detail
                <ChevronRight className="w-3 h-3 ml-1" />
              </a>
            </Button>
          </div>

          {todayShifts.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-8">
              Tidak ada jadwal ronda untuk hari ini.
            </div>
          ) : (
            <div className="space-y-3">
              {todayShifts.map((shift) => (
                <div
                  key={shift.id}
                  className="border border-gray-100 rounded-xl p-3 flex items-start justify-between"
                >
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Shift {shift.shiftKe}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      {shift.jamMulai} - {shift.jamSelesai}
                    </div>
                    {/* kalau API include nama warga per shift */}
                    {shift.warga?.nama && (
                      <div className="mt-1 text-xs text-gray-500">
                        Petugas: {shift.warga.nama}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Ronda RT
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Pengumuman Terbaru */}
        <Card className="lg:col-span-1 rounded-2xl border-0 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800">Pengumuman Terbaru</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              asChild
            >
              <a href="/events">
                Lihat Semua
                <ChevronRight className="w-3 h-3 ml-1" />
              </a>
            </Button>
          </div>

          {announcements.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-8">
              Belum ada pengumuman.
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl min-w-8">
                    {ann.emoji || '📢'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-gray-800 line-clamp-1">
                        {ann.title}
                      </p>
                      {ann.category && (
                        <Badge className="text-[10px] bg-blue-50 text-blue-600 border-0">
                          {ann.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1 line-clamp-2">
                      {ann.content}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {formatDateShort(ann.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Event & Laporan singkat */}
        <div className="lg:col-span-1 space-y-4">
          {/* Event */}
          <Card className="rounded-2xl border-0 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-800">Event Mendatang</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                asChild
              >
                <a href="/events">
                  Lihat Event
                  <ChevronRight className="w-3 h-3 ml-1" />
                </a>
              </Button>
            </div>

            {events.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-6">
                Belum ada event terjadwal.
              </div>
            ) : (
              <div className="space-y-3">
                {events.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-100 rounded-xl p-3"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm text-gray-800 line-clamp-1">
                        {event.title}
                      </p>
                      {event.category && (
                        <Badge className="text-[10px] bg-green-50 text-green-600 border-0">
                          {event.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {formatDateIndo(event.date)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                      <Clock className="w-3 h-3" />
                      {event.timeStart || '??:??'}
                      {event.timeEnd ? ` - ${event.timeEnd}` : ''}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Ringkas laporan saya */}
          <Card className="rounded-2xl border-0 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-800">Status Laporan Saya</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                asChild
              >
                <a href="/reports">
                  Buka Laporan
                  <ChevronRight className="w-3 h-3 ml-1" />
                </a>
              </Button>
            </div>

            {reports.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-6">
                Belum ada laporan yang dikirim.
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                {reports.slice(0, 3).map((rep) => {
                  const warna =
                    rep.status === 'selesai'
                      ? 'bg-green-50 text-green-700'
                      : rep.status === 'proses'
                      ? 'bg-orange-50 text-orange-700'
                      : 'bg-blue-50 text-blue-700';
                  const label =
                    rep.status === 'selesai'
                      ? 'Selesai'
                      : rep.status === 'proses'
                      ? 'Diproses'
                      : 'Baru';

                  return (
                    <div
                      key={rep.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50"
                    >
                      <div>
                        <p className="text-gray-800 line-clamp-1">
                          {rep.title}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {formatDateShort(rep.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-medium ${warna}`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
