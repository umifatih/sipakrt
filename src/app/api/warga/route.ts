import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/warga -> ambil semua warga
export async function GET() {
  try {
    const warga = await prisma.warga.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(warga);
  } catch (err) {
    console.error('GET /api/warga error:', err);
    return NextResponse.json(
      { message: 'Gagal mengambil data warga.' },
      { status: 500 },
    );
  }
}

// POST /api/warga -> tambah warga
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, nik, noKk, alamat, noHp, status } = body as {
      nama: string;
      nik: string;
      noKk?: string;
      alamat: string;
      noHp?: string;
      status?: string;
    };

    if (!nama || !nik || !alamat) {
      return NextResponse.json(
        { message: 'Nama, NIK, dan alamat wajib diisi.' },
        { status: 400 },
      );
    }

    const existing = await prisma.warga.findUnique({ where: { nik } });
    if (existing) {
      return NextResponse.json(
        { message: 'NIK sudah terdaftar.' },
        { status: 400 },
      );
    }

    const warga = await prisma.warga.create({
      data: {
        nama,
        nik,
        noKk: noKk || null,
        alamat,
        noHp: noHp || null,
        status: status || 'AKTIF',
      },
    });

    return NextResponse.json(warga, { status: 201 });
  } catch (err) {
    console.error('POST /api/warga error:', err);
    return NextResponse.json(
      { message: 'Gagal menambah data warga.' },
      { status: 500 },
    );
  }
}
