'use client';
import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Modal from '@/components/Modal';
import TextField from '@/components/TextField';

type Row = { n:string; j:string; t:string; s:'Menunggu'|'Disetujui'|'Ditolak' };
const rowsInitial: Row[] = [
  { n: 'Andi', j: 'Domisili', t: '10/10', s: 'Menunggu' },
  { n: 'Budi', j: 'SKTM', t: '12/10', s: 'Disetujui' },
  { n: 'Cici', j: 'Pengantar Nikah', t: '13/10', s: 'Ditolak' },
];

export default function Page() {
  const [rows, setRows] = useState<Row[]>(rowsInitial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ jenis: 'Domisili', tujuan: '', keterangan: '' });

  const submit = () => {
    setRows([{ n:'Saya', j:form.jenis, t: new Date().toLocaleDateString('id-ID'), s:'Menunggu' }, ...rows]);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Layanan Surat</h2>
          <p className="text-slate-600 text-sm">Ajukan & pantau pengantar RT</p>
        </div>
        <Button variant="primary" onClick={()=>setOpen(true)}>+ Ajukan Surat</Button>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Pengajuan Saya</h3>
          <div className="flex gap-2">
            <Button variant="ghost">Semua</Button>
            <Button variant="ghost">Menunggu</Button>
            <Button variant="ghost">Disetujui</Button>
          </div>
        </div>
        <div className="mt-3 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2 pr-4">Nama</th>
                <th className="py-2 pr-4">Jenis Surat</th>
                <th className="py-2 pr-4">Tanggal</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="py-3 pr-4">{row.n}</td>
                  <td className="py-3 pr-4">{row.j}</td>
                  <td className="py-3 pr-4">{row.t}</td>
                  <td className="py-3 pr-4">
                    <Badge color={row.s === 'Disetujui' ? 'emerald' : row.s === 'Menunggu' ? 'amber' : 'rose'}>{row.s}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={()=>setOpen(false)} title="Ajukan Surat">
        <div className="grid gap-3">
          <label className="text-sm text-slate-700">Jenis Surat</label>
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={form.jenis}
            onChange={(e)=>setForm(f=>({...f, jenis: e.target.value}))}
          >
            <option>Domisili</option>
            <option>SKTM</option>
            <option>Pengantar Nikah</option>
            <option>Lainnya</option>
          </select>
          <TextField label="Tujuan" placeholder="Keperluan surat..." value={form.tujuan} onChange={e=>setForm(f=>({...f, tujuan: e.target.value}))} />
          <label className="text-sm text-slate-700">Keterangan</label>
          <textarea
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm min-h-[96px]"
            placeholder="Isi keterangan tambahan…"
            value={form.keterangan}
            onChange={(e)=>setForm(f=>({...f, keterangan: e.target.value}))}
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={()=>setOpen(false)}>Batal</Button>
          <Button variant="primary" onClick={submit}>Kirim</Button>
        </div>
      </Modal>
    </div>
  );
}
