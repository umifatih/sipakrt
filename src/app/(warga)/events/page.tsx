'use client';

import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

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

function formatDateIndo(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function PengumumanEvent() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [annRes, evtRes] = await Promise.all([
          fetch('/api/announcements?public=true'),
          fetch('/api/events?public=true'),
        ]);

        if (!annRes.ok || !evtRes.ok) {
          throw new Error('Gagal fetch data');
        }

        const annData = (await annRes.json()) as Announcement[];
        const evtData = (await evtRes.json()) as EventItem[];

        setAnnouncements(annData);
        setEvents(evtData);
      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat pengumuman / event.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleRegister = (eventTitle: string) => {
    // sementara cuma notifikasi, belum ada penyimpanan ke DB
    toast.success(`Berhasil mendaftar ke ${eventTitle}!`);
    setSelectedEvent(null);
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Memuat informasi...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ================== PENGUMUMAN ================== */}
      <div>
        <h3 className="text-gray-800 mb-4">📢 Pengumuman Terbaru</h3>

        {announcements.length === 0 ? (
          <Card className="bg-white rounded-2xl shadow-sm border-0 p-8 text-center">
            <div className="text-4xl mb-2">🙂</div>
            <p className="text-gray-700 mb-1">Belum ada pengumuman.</p>
            <p className="text-gray-500 text-sm">
              Tunggu informasi berikutnya dari pengurus RT.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((announcement) => (
              <Card
                key={announcement.id}
                className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6 hover:shadow-[0_8px_24px_rgba(0,123,255,0.15)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">
                    {announcement.emoji || '📢'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-gray-800">{announcement.title}</h4>
                      {announcement.category && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-blue-100 text-[#007BFF] whitespace-nowrap ml-2"
                        >
                          {announcement.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateIndo(announcement.date)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ================== EVENT & KEGIATAN ================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800">🎯 Kegiatan & Event</h3>
          <p className="text-sm text-gray-500">
            {events.length} kegiatan tersedia
          </p>
        </div>

        {events.length === 0 ? (
          <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-12 text-center">
            <div className="text-6xl mb-4">🌿</div>
            <h4 className="text-gray-800 mb-2">Belum ada kegiatan</h4>
            <p className="text-gray-500">
              Tunggu pengumuman kegiatan selanjutnya
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <Card
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6 hover:shadow-[0_8px_24px_rgba(0,123,255,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                  index % 3 === 1 ? 'md:mt-8' : ''
                }`}
              >
                {/* Emoji besar */}
                <div className="text-5xl mb-4">{event.emoji || '🎉'}</div>

                {/* Badge kategori */}
                {event.category && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-100 text-[#007BFF] mb-3"
                  >
                    {event.category}
                  </Badge>
                )}

                {/* Nama event */}
                <h4 className="text-gray-800 mb-3">{event.title}</h4>

                {/* Tanggal, waktu, lokasi */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-[#007BFF]" />
                    {formatDateIndo(event.date)}
                  </div>

                  {(event.timeStart || event.timeEnd) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-[#007BFF]" />
                      {event.timeStart || '??:??'}
                      {event.timeEnd ? ` - ${event.timeEnd}` : ''}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-[#007BFF]" />
                    {event.location || 'Lokasi belum ditentukan'}
                  </div>
                </div>

                {/* Peserta */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <Users className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {event.participants}
                    {event.maxParticipants
                      ? ` / ${event.maxParticipants} peserta`
                      : ' peserta'}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ================== MODAL DETAIL EVENT ================== */}
      <Dialog
        open={selectedEvent !== null}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="sm:max-w-lg rounded-2xl border-0 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="text-6xl mb-4">
                  {selectedEvent.emoji || '🎉'}
                </div>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#E8F1FB]">
                    <Calendar className="w-5 h-5 text-[#007BFF]" />
                    <span className="text-gray-700">
                      {formatDateIndo(selectedEvent.date)}
                    </span>
                  </div>

                  {(selectedEvent.timeStart || selectedEvent.timeEnd) && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#E8F1FB]">
                      <Clock className="w-5 h-5 text-[#007BFF]" />
                      <span className="text-gray-700">
                        {selectedEvent.timeStart || '??:??'}
                        {selectedEvent.timeEnd
                          ? ` - ${selectedEvent.timeEnd}`
                          : ''}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#E8F1FB]">
                    <MapPin className="w-5 h-5 text-[#007BFF]" />
                    <span className="text-gray-700">
                      {selectedEvent.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#E8F1FB]">
                    <Users className="w-5 h-5 text-[#007BFF]" />
                    <span className="text-gray-700">
                      {selectedEvent.participants}
                      {selectedEvent.maxParticipants
                        ? ` / ${selectedEvent.maxParticipants} peserta terdaftar`
                        : ' peserta terdaftar'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-gray-700">{selectedEvent.description}</p>
                </div>
              </div>

              <Button
                onClick={() => handleRegister(selectedEvent.title)}
                className="w-full bg-[#007BFF] hover:bg-[#0056d2] text-white rounded-xl shadow-[0_4px_16px_rgba(0,123,255,0.3)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,123,255,0.4)]"
              >
                Daftar ke Acara
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
