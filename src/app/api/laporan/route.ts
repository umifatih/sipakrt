import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const laporan = await prisma.laporan.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(laporan);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Gagal memuat laporan.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nama,
      kategori,
      jenis,
      uraian,
      fotoUrl,
      wargaId,
    } = body as {
      nama?: string;
      kategori?: string;
      jenis?: string;
      uraian?: string;
      fotoUrl?: string | null;
      wargaId?: number | null;
    };

    if (!kategori || !jenis || !uraian) {
      return NextResponse.json(
        { message: 'Kategori, judul laporan, dan uraian wajib diisi.' },
        { status: 400 },
      );
    }

    const created = await prisma.laporan.create({
      data: {
        nama: nama || 'Warga',
        kategori,
        jenis,
        uraian,
        fotoUrl: fotoUrl || null,
        // kalau nanti mau pakai wargaId dari login, tinggal pass di body
        wargaId: wargaId ?? null,
      },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Gagal mengirim laporan.' },
      { status: 500 },
    );
  }
}
