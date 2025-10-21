'use client';
import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';

type Ann = { id:string; title:string; date:string; category:string; content?:string };

const MOCK: Ann[] = [
  { id:'a1', title:'Rapat Bulanan RT 05', date:'20 Okt 2025', category:'Rapat', content:'Rapat bahas kas & ronda.' },
  { id:'a2', title:'Kerja Bakti Sabtu', date:'25 Okt 2025', category:'Kerja Bakti', content:'Bawa alat kebersihan.' },
  { id:'a3', title:'Perayaan 17 Agustus', date:'17 Agu 2026', category:'Perayaan', content:'Lomba-lomba & panggung.' },
];

export default function Page() {
  const [data, setData] = useState<Ann[]>(MOCK);
  // useEffect(()=>{ fetch('/api/announcements').then(r=>r.json()).then(setData) }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Pengumuman & Event</h2>
          <p className="text-slate-600 text-sm">Informasi terbaru dari pengurus</p>
        </div>
        <Button variant="ghost">Langganan Notifikasi</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(a=>(
          <Card key={a.id} className="p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-800">{a.title}</div>
              <Badge color="slate">{a.date}</Badge>
            </div>
            <div className="mt-2 text-sm text-slate-600">Kategori: {a.category}</div>
            {a.content && <p className="mt-2 text-slate-700 text-sm">{a.content}</p>}
            <div className="mt-4 flex gap-2">
              <Button variant="ghost">Detail</Button>
              <Button variant="outline">Tambahkan ke Kalender</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
