'use client';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Chip from '@/components/Chip';
import Sparkline from '@/components/Sparkline';
import { FINANCE, ANNOUNCEMENTS, REPORTS } from '@/lib/mockData';
import { rupiah } from '@/components/_utils';
import { useAccess } from '@/components/AccessProvider';

export default function Page() {
  const { isAdmin } = useAccess();

  return (
    <div className="space-y-6">
      {/* HEADER / INTRO */}
      <Card className="p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Halo, Pak/Bu Warga 👋</h2>
          <p className="text-slate-600 mt-1">RT 05 / RW 03, Kel. Suka Jaya</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip tone="blue">Surat diajukan: 3</Chip>
            <Chip tone="amber">Tagihan aktif: 1</Chip>
            <Chip tone="emerald">Ronda berikutnya: Jumat 22.00</Chip>
            <Chip tone="purple">Pengumuman baru: 2</Chip>
          </div>
        </div>
        <div className="hidden md:block">
          <Sparkline data={FINANCE.trend} width={220} height={60} />
        </div>
      </Card>

      {/* 3-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1️⃣ RINGKASAN KAS */}
        <Card className="p-5 col-span-1">
          <h3 className="font-semibold">Ringkasan Kas RT</h3>
          <p className="mt-1 text-sm text-slate-600">Saldo saat ini</p>
          <div className="mt-3 text-2xl font-bold">{rupiah(FINANCE.balance)}</div>
          <div className="mt-4">
            <Sparkline data={FINANCE.trend} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              + {rupiah(FINANCE.incomeThisMonth)}
              <span className="block text-emerald-600/70">Pemasukan bulan ini</span>
            </div>
            <div className="rounded-xl bg-rose-50 p-3 text-rose-700">
              - {rupiah(FINANCE.expenseThisMonth)}
              <span className="block text-rose-600/70">Pengeluaran bulan ini</span>
            </div>
          </div>
        </Card>

        {/* 2️⃣ JADWAL RONDA */}
        <Card className="p-5 col-span-1">
          <h3 className="font-semibold">Jadwal Ronda Hari Ini</h3>
          <ul className="mt-3 space-y-3">
            {[
              { time: '22:00–00:00', team: ['Andi', 'Budi', 'Cici'], status: 'Terjadwal' },
              { time: '00:00–02:00', team: ['Dedi', 'Eka', 'Fani'], status: 'Terjadwal' },
            ].map((s, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-3"
              >
                <div>
                  <div className="font-medium">{s.time}</div>
                  <div className="text-slate-600 text-sm">
                    Kelompok: {s.team.join(', ')}
                  </div>
                </div>
                <Badge color="blue">{s.status}</Badge>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <Button variant="primary">Ajukan Tukar Jadwal</Button>
            {isAdmin && <Button variant="outline">Kelola Jadwal</Button>}
          </div>
        </Card>

        {/* 3️⃣ PENGUMUMAN TERBARU */}
        <Card className="p-5 col-span-1">
          <h3 className="font-semibold">Pengumuman Terbaru</h3>
          <div className="mt-3 space-y-3">
            {ANNOUNCEMENTS.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{a.title}</div>
                  <Badge color="slate">{a.date}</Badge>
                </div>
                <div className="text-slate-600 text-sm mt-1">
                  Kategori: {a.category}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            {isAdmin ? (
              <div className="flex gap-2">
                <Button variant="primary">Buat Pengumuman</Button>
                <Button variant="outline">Kelola Event</Button>
              </div>
            ) : (
              <Button variant="ghost">Lihat Semua</Button>
            )}
          </div>
        </Card>
      </div>

      {/* 4️⃣ LAPORAN & ASPIRASI */}
      <Card className="p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-semibold">Laporan & Aspirasi Warga</h3>
            <p className="text-slate-600 text-sm mt-1">
              Pantau status penanganan laporan
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="primary">Kirim Laporan</Button>
            {isAdmin && <Button variant="outline">Kelola Laporan</Button>}
          </div>
        </div>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {REPORTS.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-100 p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.type}</div>
                <Badge
                  color={
                    r.status === 'Selesai'
                      ? 'emerald'
                      : r.status === 'Diproses'
                      ? 'amber'
                      : 'blue'
                  }
                >
                  {r.status}
                </Badge>
              </div>
              <div className="text-slate-600 text-sm mt-1">{r.excerpt}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
