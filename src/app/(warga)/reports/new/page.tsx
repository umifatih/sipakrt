'use client';
import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import TextField from '@/components/TextField';

export default function NewReportPage() {
  const [form, setForm] = useState({ jenis: 'Keamanan', judul: '', isi: '' });

  const submit = () => {
    alert(`Laporan terkirim: ${form.jenis} - ${form.judul}`);
    // TODO: fetch('/api/reports', {method:'POST', body: JSON.stringify(form)})
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Kirim Laporan / Aspirasi</h2>
      <Card className="p-5">
        <div className="grid gap-3 max-w-2xl">
          <label className="text-sm text-slate-700">Jenis Laporan</label>
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={form.jenis}
            onChange={(e)=>setForm(f=>({...f, jenis: e.target.value}))}
          >
            <option>Keamanan</option>
            <option>Sosial</option>
            <option>Kritik</option>
            <option>Saran</option>
          </select>
          <TextField label="Judul" placeholder="Ringkas dan jelas…" value={form.judul} onChange={(e)=>setForm(f=>({...f, judul: e.target.value}))} />
          <label className="text-sm text-slate-700">Isi Laporan</label>
          <textarea
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm min-h-[140px]"
            placeholder="Ceritakan masalah/aspirasi…"
            value={form.isi}
            onChange={(e)=>setForm(f=>({...f, isi: e.target.value}))}
          />
          <div className="mt-4">
            <Button variant="primary" onClick={submit}>Kirim Laporan</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
