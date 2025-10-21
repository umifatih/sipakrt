'use client';
import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Modal from '@/components/Modal';

type Shift = { id:string; time:string; team:string[]; status:'Terjadwal'|'Tukar (Menunggu)' };

const MOCK: Shift[] = [
  { id:'s1', time:'22:00–00:00', team:['Andi','Budi','Cici'], status:'Terjadwal' },
  { id:'s2', time:'00:00–02:00', team:['Dedi','Eka','Fani'], status:'Terjadwal' },
];

export default function Page() {
  const [open, setOpen] = useState(false);
  const [shifts, setShifts] = useState<Shift[]>(MOCK);
  const [choice, setChoice] = useState('s1');
  const [note, setNote] = useState('');

  const submitExchange = () => {
    setShifts(prev => prev.map(s => s.id===choice ? { ...s, status:'Tukar (Menunggu)' } : s));
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Jadwal Ronda</h2>
          <p className="text-slate-600 text-sm">Lihat jadwal & ajukan tukar</p>
        </div>
        <Button variant="primary" onClick={()=>setOpen(true)}>Ajukan Tukar Jadwal</Button>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold">Hari Ini</h3>
        <ul className="mt-3 space-y-3">
          {shifts.map(s=>(
            <li key={s.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
              <div>
                <div className="font-medium">{s.time}</div>
                <div className="text-slate-600 text-sm">Kelompok: {s.team.join(', ')}</div>
              </div>
              <Badge color={s.status.includes('Tukar')?'amber':'blue'}>{s.status}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <Modal open={open} onClose={()=>setOpen(false)} title="Ajukan Tukar Jadwal">
        <div className="grid gap-3">
          <label className="text-sm text-slate-700">Pilih shift</label>
          <select value={choice} onChange={e=>setChoice(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            {shifts.map(s=><option key={s.id} value={s.id}>{s.time} • {s.team.join(', ')}</option>)}
          </select>
          <label className="text-sm text-slate-700">Catatan</label>
          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Alasan tukar jadwal…" className="rounded-xl border border-slate-200 px-3 py-2 text-sm min-h-[96px]" />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={()=>setOpen(false)}>Batal</Button>
          <Button variant="primary" onClick={submitExchange}>Kirim Pengajuan</Button>
        </div>
      </Modal>
    </div>
  );
}
