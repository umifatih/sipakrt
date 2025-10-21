'use client';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';

type Invoice = { id: string; month: number; year: number; amount: number; status: 'UNPAID'|'PAID'|'CANCELED' };

const INVOICES: Invoice[] = [
  { id: 'i1', month: 10, year: 2025, amount: 150000, status: 'UNPAID' },
  { id: 'i2', month: 9,  year: 2025, amount: 150000, status: 'PAID' },
  { id: 'i3', month: 8,  year: 2025, amount: 150000, status: 'PAID' },
];

const rupiah = (n:number)=> new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tagihan Iuran</h2>
          <p className="text-slate-600 text-sm">Lihat dan lunasi iuran bulanan RT</p>
        </div>
        <Button variant="primary">Bayar Sekarang</Button>
      </div>

      <Card className="p-5 overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2 pr-4">Periode</th>
              <th className="py-2 pr-4">Jumlah</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv)=>(
              <tr key={inv.id} className="border-t border-slate-100">
                <td className="py-3 pr-4">{inv.month.toString().padStart(2,'0')}/{inv.year}</td>
                <td className="py-3 pr-4">{rupiah(inv.amount)}</td>
                <td className="py-3 pr-4">
                  <Badge color={inv.status==='PAID'?'emerald':inv.status==='UNPAID'?'amber':'slate'}>{inv.status}</Badge>
                </td>
                <td className="py-3 pr-4">
                  {inv.status==='UNPAID'
                    ? <Button variant="outline">Bayar</Button>
                    : <Button variant="ghost">Lihat Bukti</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
