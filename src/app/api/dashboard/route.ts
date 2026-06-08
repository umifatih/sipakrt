// src/app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // --- STAT KECIL DI ATAS ---
    const [
      wargaCount,
      laporanBaruCount,
      totalTransaksi,
      sumMasuk,
      sumKeluar,
    ] = await Promise.all([
      prisma.warga.count(),
      // 🔧 SESUAIKAN: status 'baru' harus sama dengan yang kamu pakai di tabel laporan
      prisma.laporan.count({ where: { status: 'baru' } }),
      prisma.keuangan.count(),
      prisma.keuangan.aggregate({
        _sum: { nominal: true },
        where: { jenis: 'MASUK' }, // 🔧 SESUAIKAN jika enum/field lain
      }),
      prisma.keuangan.aggregate({
        _sum: { nominal: true },
        where: { jenis: 'KELUAR' },
      }),
    ]);

    const totalKas =
      (sumMasuk._sum.nominal || 0) - (sumKeluar._sum.nominal || 0);

    // --- CHART: 6 BULAN TERAKHIR ---
    const now = new Date();
    const months: { label: string; start: Date; end: Date }[] = [];

    for (let i = 5; i >= 0; i -= 1) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const label = start.toLocaleString('id-ID', { month: 'short' }); // Jan, Feb, dst
      months.push({ label, start, end });
    }

    const chart: { month: string; pemasukan: number; pengeluaran: number }[] = [];

    for (const m of months) {
      const [mMasuk, mKeluar] = await Promise.all([
        prisma.keuangan.aggregate({
          _sum: { nominal: true },
          where: {
            jenis: 'MASUK',
            tanggal: { gte: m.start, lt: m.end }, // 🔧 SESUAIKAN nama field tanggal di Keuangan
          },
        }),
        prisma.keuangan.aggregate({
          _sum: { nominal: true },
          where: {
            jenis: 'KELUAR',
            tanggal: { gte: m.start, lt: m.end },
          },
        }),
      ]);

      chart.push({
        month: m.label,
        pemasukan: mMasuk._sum.nominal || 0,
        pengeluaran: mKeluar._sum.nominal || 0,
      });
    }

    // --- AKTIVITAS TERBARU ---
    const lastWarga = (await prisma.warga.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })) as any[];

    const lastLaporan = (await prisma.laporan.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })) as any[];

    const lastKeuangan = (await prisma.keuangan.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })) as any[];

    type Activity = {
      type: 'warga' | 'laporan' | 'keuangan';
      name: string;
      createdAt: Date;
    };

    const activities: Activity[] = [
      ...lastWarga.map((w) => ({
        type: 'warga' as const,
        name: `${w.nama ?? 'Warga baru'} mendaftar sebagai warga baru`,
        createdAt: w.createdAt,
      })),
      ...lastLaporan.map((l) => ({
        type: 'laporan' as const,
        // 🔧 SESUAIKAN: pakai judul / jenis / kategori sesuai model-mu
        name: `Laporan baru: ${l.judul ?? l.jenis ?? 'Laporan warga'}`,
        createdAt: l.createdAt,
      })),
      ...lastKeuangan.map((k) => ({
        type: 'keuangan' as const,
        name:
          (k.jenis === 'MASUK' ? 'Pemasukan' : 'Pengeluaran') +
          (k.kategori ? ` (${k.kategori})` : '') +
          (k.nominal
            ? ` Rp ${Number(k.nominal).toLocaleString('id-ID')}`
            : ''),
        createdAt: k.tanggal ?? k.createdAt,
      })),
    ];

    activities.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    const recentActivities = activities.slice(0, 5).map((a) => ({
      type: a.type,
      name: a.name,
      createdAt: a.createdAt.toISOString(),
    }));

    return NextResponse.json({
      wargaCount,
      laporanBaruCount,
      totalKas,
      totalTransaksi,
      chart,
      recentActivities,
    });
  } catch (error) {
    console.error('GET /api/dashboard error', error);
    return NextResponse.json(
      { message: 'Gagal memuat data dashboard.' },
      { status: 500 }
    );
  }
}
