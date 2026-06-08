// src/app/api/tagihan-kas/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tagihan-kas?status=BELUM_BAYAR (opsional)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) where.status = status;

    const tagihan = await prisma.tagihanKas.findMany({
      where,
      orderBy: { jatuhTempo: 'asc' },
    });

    return NextResponse.json(tagihan);
  } catch (err) {
    console.error('GET /api/tagihan-kas error:', err);
    return NextResponse.json(
      { message: 'Gagal mengambil data tagihan kas.' },
      { status: 500 },
    );
  }
}

// POST /api/tagihan-kas
// body: { judul, deskripsi?, jumlah, jatuhTempo }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { judul, deskripsi, jumlah, jatuhTempo } = body as {
      judul: string;
      deskripsi?: string;
      jumlah: number | string;
      jatuhTempo: string; // 'YYYY-MM-DD'
    };

    if (!judul || !jumlah || !jatuhTempo) {
      return NextResponse.json(
        {
          message:
            'Judul, jumlah, dan jatuh tempo wajib diisi.',
        },
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

    const jatuhTempoDate = new Date(jatuhTempo);
    if (Number.isNaN(jatuhTempoDate.getTime())) {
      return NextResponse.json(
        { message: 'Format tanggal jatuh tempo tidak valid.' },
        { status: 400 },
      );
    }

    const tagihan = await prisma.tagihanKas.create({
      data: {
        judul,
        deskripsi: deskripsi || null,
        jumlah: jumlahInt,
        jatuhTempo: jatuhTempoDate,
        status: 'BELUM_BAYAR',
      },
    });

    return NextResponse.json(tagihan, { status: 201 });
  } catch (err) {
    console.error('POST /api/tagihan-kas error:', err);
    return NextResponse.json(
      { message: 'Gagal menyimpan tagihan kas.' },
      { status: 500 },
    );
  }
}
