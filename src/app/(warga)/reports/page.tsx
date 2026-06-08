'use client';
import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Link from 'next/link';

type Report = { id:string; type:'Keamanan'|'Sosial'|'Kritik'|'Saran'; status:'Baru'|'Diproses'|'Selesai'; excerpt:string; createdAt:string };

const MOCK: Report[] = [
  { id:'r1', type:'Keamanan', status:'Diproses', excerpt:'Lampu jalan mati di blok C', createdAt:'10 Okt 2025' },
  { id:'r2', type:'Sosial', status:'Selesai', excerpt:'Bantuan lansia telah disalurkan', createdAt:'09 Okt 2025' },
  { id:'r3', type:'Kritik', status:'Baru', excerpt:'Perbaikan saluran air', createdAt:'08 Okt 2025' },
];

export default function Page() {
  const [list] = useState<Report[]>(MOCK);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Laporan & Aspirasi</h2>
          <p className="text-slate-600 text-sm">Pantau status penanganan laporan</p>
        </div>
        <Link href="/reports/new">
          <Button variant="primary">Kirim Laporan</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map(r=>(
          <Card key={r.id} className="p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-800">{r.type}</div>
              <Badge color={
                r.status==='Selesai' ? 'emerald' :
                r.status==='Diproses' ? 'amber' : 'blue'
              }>{r.status}</Badge>
            </div>
            <div className="mt-2 text-sm text-slate-600">{r.excerpt}</div>
            <div className="mt-3 text-xs text-slate-500">Dibuat: {r.createdAt}</div>
            <div className="mt-4 flex gap-2">
              <Button variant="ghost">Detail</Button>
              <Button variant="outline">Tindak Lanjut</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
