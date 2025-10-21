'use client';
import { useState } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { toast } from 'sonner';

const events = [
  {
    id: 1,
    title: 'Gotong Royong Bersama',
    emoji: '🧹',
    date: '25 Oktober 2025',
    time: '07:00 - 10:00',
    location: 'Balai RT 03',
    description: 'Mari bersama-sama membersihkan lingkungan RT kita agar lebih bersih dan nyaman. Harap membawa peralatan kebersihan masing-masing.',
    participants: 45,
    maxParticipants: 50,
    category: 'Kegiatan',
  },
  {
    id: 2,
    title: 'Perayaan 17 Agustus',
    emoji: '🎉',
    date: '17 Agustus 2025',
    time: '08:00 - 17:00',
    location: 'Lapangan RT',
    description: 'Perayaan HUT RI ke-80 dengan berbagai lomba menarik untuk semua kalangan. Jangan lewatkan!',
    participants: 120,
    maxParticipants: 150,
    category: 'Event',
  },
  {
    id: 3,
    title: 'Rapat Koordinasi RT',
    emoji: '📋',
    date: '30 Oktober 2025',
    time: '19:00 - 21:00',
    location: 'Rumah Pak RT',
    description: 'Rapat bulanan untuk membahas program kerja dan evaluasi kegiatan RT.',
    participants: 12,
    maxParticipants: 20,
    category: 'Rapat',
  },
  {
    id: 4,
    title: 'Pengajian Rutin',
    emoji: '🕌',
    date: '22 Oktober 2025',
    time: '20:00 - 22:00',
    location: 'Mushola Al-Ikhlas',
    description: 'Pengajian rutin bulanan bersama Ustadz Ahmad. Semua warga diundang untuk hadir.',
    participants: 35,
    maxParticipants: 40,
    category: 'Keagamaan',
  },
  {
    id: 5,
    title: 'Senam Sehat Bersama',
    emoji: '🏃',
    date: '23 Oktober 2025',
    time: '06:00 - 07:30',
    location: 'Lapangan RT',
    description: 'Senam sehat rutin setiap minggu. Gratis dan terbuka untuk semua usia!',
    participants: 28,
    maxParticipants: 50,
    category: 'Olahraga',
  },
];

const announcements = [
  {
    id: 1,
    title: 'Pembayaran Iuran Bulan November',
    emoji: '💰',
    date: '20 Oktober 2025',
    excerpt: 'Diingatkan kepada seluruh warga untuk segera melakukan pembayaran iuran bulanan...',
    category: 'Keuangan',
  },
  {
    id: 2,
    title: 'Jadwal Ronda Telah Diperbarui',
    emoji: '🛡️',
    date: '18 Oktober 2025',
    excerpt: 'Jadwal ronda untuk bulan November telah diperbarui. Silakan cek jadwal masing-masing...',
    category: 'Keamanan',
  },
];

export function PengumumanEvent() {
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);

  const handleRegister = (eventTitle: string) => {
    toast.success(`Berhasil mendaftar ke ${eventTitle}!`);
    setSelectedEvent(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Pengumuman Section */}
      <div>
        <h3 className="text-gray-800 mb-4">📢 Pengumuman Terbaru</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((announcement) => (
            <Card 
              key={announcement.id}
              className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6 hover:shadow-[0_8px_24px_rgba(0,123,255,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{announcement.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-gray-800">{announcement.title}</h4>
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-[#007BFF] whitespace-nowrap ml-2">
                      {announcement.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{announcement.excerpt}</p>
                  <p className="text-xs text-gray-500">{announcement.date}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Events Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800">🎯 Kegiatan & Event</h3>
          <p className="text-sm text-gray-500">{events.length} kegiatan tersedia</p>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <Card 
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-6 hover:shadow-[0_8px_24px_rgba(0,123,255,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                index % 3 === 1 ? 'md:mt-8' : ''
              }`}
            >
              <div className="text-5xl mb-4">{event.emoji}</div>
              <Badge variant="secondary" className="text-xs bg-blue-100 text-[#007BFF] mb-3">
                {event.category}
              </Badge>
              <h4 className="text-gray-800 mb-3">{event.title}</h4>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-[#007BFF]" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-[#007BFF]" />
                  {event.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-[#007BFF]" />
                  {event.location}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <Users className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {event.participants}/{event.maxParticipants} peserta
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <Card className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-0 p-12 text-center">
            <div className="text-6xl mb-4">🌿</div>
            <h4 className="text-gray-800 mb-2">Belum ada kegiatan minggu ini</h4>
            <p className="text-gray-500">Tunggu pengumuman kegiatan selanjutnya</p>
          </Card>
        )}
      </div>

      {/* Event Detail Modal */}
      <Dialog open={selectedEvent !== null} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-lg rounded-2xl border-0 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="text-6xl mb-4">{selectedEvent.emoji}</div>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#E8F1FB]">
                    <Calendar className="w-5 h-5 text-[#007BFF]" />
                    <span className="text-gray-700">{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#E8F1FB]">
                    <Clock className="w-5 h-5 text-[#007BFF]" />
                    <span className="text-gray-700">{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#E8F1FB]">
                    <MapPin className="w-5 h-5 text-[#007BFF]" />
                    <span className="text-gray-700">{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#E8F1FB]">
                    <Users className="w-5 h-5 text-[#007BFF]" />
                    <span className="text-gray-700">
                      {selectedEvent.participants}/{selectedEvent.maxParticipants} peserta terdaftar
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
export default PengumumanEvent;