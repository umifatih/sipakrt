// src/app/api/keuangan/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/keuangan?tipe=PEMASUKAN|PENGELUARAN (opsional)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipe = searchParams.get('tipe'); // 'PEMASUKAN' / 'PENGELUARAN' / null

    const where: any = {};
    if (tipe) where.tipe = tipe;

    const transaksi = await prisma.transaksi.findMany({
      where,
      orderBy: { tanggal: 'desc' },
    });

    return NextResponse.json(transaksi);
  } catch (err) {
    console.error('GET /api/keuangan error:', err);
    return NextResponse.json(
      { message: 'Gagal mengambil data keuangan.' },
      { status: 500 },
    );
  }
}

// POST /api/keuangan
// body: { tanggal: '2025-10-19', tipe: 'PEMASUKAN'|'PENGELUARAN', deskripsi, kategori, jumlah }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tanggal, tipe, deskripsi, kategori, jumlah } = body as {
      tanggal: string;
      tipe: 'PEMASUKAN' | 'PENGELUARAN';
      deskripsi: string;
      kategori: string;
      jumlah: number | string;
    };

    if (!tanggal || !tipe || !deskripsi || !kategori || !jumlah) {
      return NextResponse.json(
        {
          message:
            'Tanggal, tipe, deskripsi, kategori, dan jumlah wajib diisi.',
        },
        { status: 400 },
      );
    }

    if (tipe !== 'PEMASUKAN' && tipe !== 'PENGELUARAN') {
      return NextResponse.json(
        { message: 'Tipe harus PEMASUKAN atau PENGELUARAN.' },
        { status: 400 },
      );
    }

    const jumlahInt = Number(jumlah);
    if (Number.isNaN(jumlahInt) || jumlahInt <= 0) {
      return NextResponse.json(
        { message: 'Jumlah harus angka lebih dari 0.' },
        { status: 400 },
      );
    }

    const tanggalDate = new Date(tanggal);
    if (Number.isNaN(tanggalDate.getTime())) {
      return NextResponse.json(
        { message: 'Format tanggal tidak valid.' },
        { status: 400 },
      );
    }

    const trx = await prisma.transaksi.create({
      data: {
        tanggal: tanggalDate,
        tipe,
        deskripsi,
        kategori,
        jumlah: jumlahInt,
      },
    });

    return NextResponse.json(trx, { status: 201 });
  } catch (err) {
    console.error('POST /api/keuangan error:', err);
    return NextResponse.json(
      { message: 'Gagal menyimpan transaksi.' },
      { status: 500 },
    );
  }
}
