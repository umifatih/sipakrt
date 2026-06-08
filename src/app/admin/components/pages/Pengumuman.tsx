'use client';

import { useEffect, useState } from 'react';
import {
  Megaphone,
  Calendar,
  MapPin,
  Users,
  Plus,
  Edit,
  Trash2,
  X,
  MoreVertical,
} from 'lucide-react';
import { toast } from 'sonner';

type Announcement = {
  id: number;
  title: string;
  emoji: string | null;
  category: string | null;
  content: string;
  date: string;
  published: boolean;
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

function formatDateIndoInput(date: string | null) {
  if (!date) return '';
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateIndo(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function Pengumuman() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);

  // form pengumuman
  const [annTitle, setAnnTitle] = useState('');
  const [annDate, setAnnDate] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState('');
  const [annEmoji, setAnnEmoji] = useState('📢');
  const [annPublished, setAnnPublished] = useState(true);

  // form event
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDate, setEvtDate] = useState('');
  const [evtTimeStart, setEvtTimeStart] = useState('');
  const [evtTimeEnd, setEvtTimeEnd] = useState('');
  const [evtLocation, setEvtLocation] = useState('');
  const [evtDescription, setEvtDescription] = useState('');
  const [evtCategory, setEvtCategory] = useState('');
  const [evtEmoji, setEvtEmoji] = useState('🎉');
  const [evtMaxParticipants, setEvtMaxParticipants] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [annRes, evtRes] = await Promise.all([
          fetch('/api/announcements'),
          fetch('/api/events'),
        ]);

        if (!annRes.ok || !evtRes.ok) {
          throw new Error('Fetch gagal');
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

  const resetAnnForm = () => {
    setAnnTitle('');
    setAnnDate('');
    setAnnContent('');
    setAnnCategory('');
    setAnnEmoji('📢');
    setAnnPublished(true);
  };

  const resetEvtForm = () => {
    setEvtTitle('');
    setEvtDate('');
    setEvtTimeStart('');
    setEvtTimeEnd('');
    setEvtLocation('');
    setEvtDescription('');
    setEvtCategory('');
    setEvtEmoji('🎉');
    setEvtMaxParticipants('');
  };

  const handleCreateAnnouncement = async () => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: annTitle,
          date: annDate,
          content: annContent,
          category: annCategory || null,
          emoji: annEmoji || null,
          published: annPublished,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Gagal membuat pengumuman');
      }

      const created = (await res.json()) as Announcement;
      setAnnouncements((prev) => [created, ...prev]);
      toast.success('Pengumuman berhasil dibuat.');
      resetAnnForm();
      setShowAddAnnouncement(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Gagal membuat pengumuman.');
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!confirm('Yakin ingin menghapus pengumuman ini?')) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');

      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      toast.success('Pengumuman dihapus.');
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus pengumuman.');
    }
  };

  const handleCreateEvent = async () => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: evtTitle,
          date: evtDate,
          timeStart: evtTimeStart || null,
          timeEnd: evtTimeEnd || null,
          location: evtLocation,
          description: evtDescription,
          category: evtCategory || null,
          emoji: evtEmoji || null,
          maxParticipants: evtMaxParticipants
            ? Number(evtMaxParticipants)
            : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Gagal membuat event');
      }

      const created = (await res.json()) as EventItem;
      setEvents((prev) => [...prev, created]);
      toast.success('Event berhasil dibuat.');
      resetEvtForm();
      setShowAddEvent(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Gagal membuat event.');
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Yakin ingin menghapus event ini?')) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');

      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success('Event dihapus.');
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus event.');
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Memuat data...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Kelola Informasi RT</h1>
        <p className="text-gray-600">Pengumuman dan event untuk warga</p>
      </div>

      {/* Announcements Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Pengumuman</h2>
          <button
            onClick={() => setShowAddAnnouncement(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Buat Pengumuman
          </button>
        </div>

        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Megaphone className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">Belum ada pengumuman 📢</h3>
            <p className="text-gray-600">
              Buat pengumuman pertama untuk warga RT
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
                      {announcement.emoji || <Megaphone className="h-5 w-5" />}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        announcement.published
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {announcement.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <button className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="text-gray-900 mb-2">{announcement.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {announcement.content}
                </p>
                <div className="text-gray-500 text-xs">
                  {formatDateIndo(announcement.date)}
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    type="button"
                    onClick={() =>
                      alert('Edit pengumuman bisa ditambah nanti 😊')
                    }
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm"
                    type="button"
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Events Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Event & Kegiatan</h2>
          <button
            onClick={() => setShowAddEvent(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Tambahkan Event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            Belum ada event.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-2xl">
                    {event.emoji || <Calendar className="h-6 w-6" />}
                  </div>
                  <button className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="text-gray-900 mb-3">{event.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {formatDateIndo(event.date)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  {(event.timeStart || event.timeEnd) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {event.timeStart || '??:??'}{' '}
                      {event.timeEnd ? `- ${event.timeEnd}` : ''}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {event.participants}
                    {event.maxParticipants
                      ? ` / ${event.maxParticipants} peserta`
                      : ' peserta'}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-sm"
                    type="button"
                    onClick={() => alert('Edit event bisa ditambah nanti 😊')}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm"
                    type="button"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Announcement Modal */}
      {showAddAnnouncement && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900">Buat Pengumuman Baru</h2>
                <button
                  onClick={() => {
                    setShowAddAnnouncement(false);
                    resetAnnForm();
                  }}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Judul Pengumuman</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan judul pengumuman"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Tanggal</label>
                  <input
                    type="date"
                    value={annDate}
                    onChange={(e) => setAnnDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Kategori (opsional)</label>
                  <input
                    type="text"
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Keuangan, Event, dsb."
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Emoji (opsional)</label>
                <input
                  type="text"
                  value={annEmoji}
                  onChange={(e) => setAnnEmoji(e.target.value)}
                  maxLength={4}
                  className="w-24 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl"
                  placeholder="📢"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Isi Pengumuman</label>
                <textarea
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Tulis isi pengumuman di sini..."
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <label className="text-gray-700">Publikasikan ke Warga</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={annPublished}
                    onChange={(e) => setAnnPublished(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddAnnouncement(false);
                    resetAnnForm();
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateAnnouncement}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Publikasikan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900">Tambah Event Baru</h2>
                <button
                  onClick={() => {
                    setShowAddEvent(false);
                    resetEvtForm();
                  }}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
                <div>
                  <label className="block text-gray-700 mb-2">Nama Event</label>
                  <input
                    type="text"
                    value={evtTitle}
                    onChange={(e) => setEvtTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama kegiatan"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Emoji</label>
                  <input
                    type="text"
                    value={evtEmoji}
                    onChange={(e) => setEvtEmoji(e.target.value)}
                    maxLength={4}
                    className="w-20 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl"
                    placeholder="🎉"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Tanggal</label>
                  <input
                    type="date"
                    value={evtDate}
                    onChange={(e) => setEvtDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Kategori (opsional)</label>
                  <input
                    type="text"
                    value={evtCategory}
                    onChange={(e) => setEvtCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Kegiatan, Olahraga, dll."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Waktu Mulai</label>
                  <input
                    type="time"
                    value={evtTimeStart}
                    onChange={(e) => setEvtTimeStart(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Waktu Selesai</label>
                  <input
                    type="time"
                    value={evtTimeEnd}
                    onChange={(e) => setEvtTimeEnd(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Lokasi</label>
                  <input
                    type="text"
                    value={evtLocation}
                    onChange={(e) => setEvtLocation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tempat kegiatan"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Maks. Peserta (opsional)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={evtMaxParticipants}
                    onChange={(e) => setEvtMaxParticipants(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Misal: 50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  value={evtDescription}
                  onChange={(e) => setEvtDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Deskripsi event..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddEvent(false);
                    resetEvtForm();
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateEvent}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Tambah Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
