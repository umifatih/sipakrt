'use client';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';

type Event = { id:string; title:string; date:string; location?:string; joined?:boolean };
const EVENTS: Event[] = [
  { id:'e1', title:'Kerja Bakti Akhir Bulan', date:'Sabtu, 25 Okt 2025', location:'Lapangan RT', joined:false },
  { id:'e2', title:'Rapat Bulanan', date:'Minggu, 27 Okt 2025', location:'Balai RW', joined:true },
];

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Kegiatan & Event</h2>
          <p className="text-slate-600 text-sm">Daftar kegiatan warga dan RSVP</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EVENTS.map(ev=>(
          <Card key={ev.id} className="p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{ev.title}</div>
              {ev.joined && <Badge color="emerald">Terdaftar</Badge>}
            </div>
            <div className="text-sm text-slate-600 mt-1">{ev.date} • {ev.location}</div>
            <div className="mt-4">
              {ev.joined
                ? <Button variant="outline">Batalkan</Button>
                : <Button variant="primary">Daftar</Button>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
