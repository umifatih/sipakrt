'use client';
import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Sparkline from '@/components/Sparkline';
import { rupiah } from '@/components/_utils';

type Tx = { id:string; date:string; desc:string; amount:number };
type Summary = { balance:number; incomeThisMonth:number; expenseThisMonth:number; trend:number[] };

const MOCK_SUMMARY: Summary = {
  balance: 18_500_000,
  incomeThisMonth: 5_200_000,
  expenseThisMonth: 3_100_000,
  trend: [40,42,38,45,50,48,55,60,58,66],
};
const MOCK_TX: Tx[] = [
  { id:'t1', date:'01/10', desc:'Iuran Bulanan', amount: 1_500_000 },
  { id:'t2', date:'05/10', desc:'Donasi', amount: 1_000_000 },
  { id:'t3', date:'09/10', desc:'Biaya Kebersihan', amount: -500_000 },
];

export default function Page() {
  const [summary, setSummary] = useState<Summary>(MOCK_SUMMARY);
  const [tx, setTx] = useState<Tx[]>(MOCK_TX);

  // TODO: sambungkan API
  // useEffect(() => {
  //   fetch('/api/finance/summary').then(r=>r.json()).then(setSummary);
  //   fetch('/api/finance/transactions').then(r=>r.json()).then(setTx);
  // }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Keuangan RT</h2>
          <p className="text-slate-600 text-sm">Transparansi kas, pemasukan & pengeluaran</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Unduh Laporan</Button>
          <Button variant="primary">Riwayat Saya</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5">
          <div className="text-slate-500 text-sm">Saldo saat ini</div>
          <div className="text-3xl font-bold mt-1">{rupiah(summary.balance)}</div>
          <div className="mt-4"><Sparkline data={summary.trend} width={280} height={70} /></div>
        </Card>
        <Card className="p-5">
          <div className="text-slate-500 text-sm">Pemasukan bulan ini</div>
          <div className="text-2xl font-semibold text-emerald-700 mt-1">+ {rupiah(summary.incomeThisMonth)}</div>
          <ul className="mt-4 space-y-2 text-sm">
            {tx.filter(t=>t.amount>0).map(t=>(
              <li key={t.id} className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-700">{t.date} · {t.desc}</span>
                <span className="text-emerald-700 font-medium">{rupiah(t.amount)}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <div className="text-slate-500 text-sm">Pengeluaran bulan ini</div>
          <div className="text-2xl font-semibold text-rose-700 mt-1">- {rupiah(summary.expenseThisMonth)}</div>
          <ul className="mt-4 space-y-2 text-sm">
            {tx.filter(t=>t.amount<0).map(t=>(
              <li key={t.id} className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-700">{t.date} · {t.desc}</span>
                <span className="text-rose-700 font-medium">{rupiah(t.amount)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5 overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2 pr-4">Tanggal</th>
              <th className="py-2 pr-4">Keterangan</th>
              <th className="py-2 pr-4">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {tx.map(t=>(
              <tr key={t.id} className="border-t border-slate-100">
                <td className="py-3 pr-4">{t.date}</td>
                <td className="py-3 pr-4">{t.desc}</td>
                <td className={`py-3 pr-4 font-medium text-right ${t.amount>0?'text-emerald-700':'text-rose-700'}`}>{rupiah(t.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
