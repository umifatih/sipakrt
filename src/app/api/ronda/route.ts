import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/ronda  -> ambil semua jadwal
export async function GET() {
  try {
    const shifts = await prisma.rondaShift.findMany({
      orderBy: [
        { tanggal: 'asc' },
        { shiftKe: 'asc' },
      ],
    });

    return NextResponse.json(shifts);
  } catch (err) {
    console.error('Ronda GET error:', err);
    return NextResponse.json(
      { message: 'Gagal mengambil data jadwal ronda.' },
      { status: 500 },
    );
  }
}

// POST /api/ronda  -> tambah jadwal (dipakai admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tanggal,    // string, misal: "2025-10-24"
      jamMulai,   // "20:00"
      jamSelesai, // "00:00"
      wargaNama,
      lokasi,
      shiftKe,
      kelompok,
    } = body as {
      tanggal: string;
      jamMulai: string;
      jamSelesai: string;
      wargaNama: string;
      lokasi: string;
      shiftKe: number;
      kelompok?: string;
    };

    if (!tanggal || !jamMulai || !jamSelesai || !wargaNama || !lokasi || !shiftKe) {
      return NextResponse.json(
        { message: 'Semua field wajib diisi.' },
        { status: 400 },
      );
    }

    const created = await prisma.rondaShift.create({
      data: {
        tanggal: new Date(tanggal),
        jamMulai,
        jamSelesai,
        wargaNama,
        lokasi,
        shiftKe: Number(shiftKe),
        kelompok,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('Ronda POST error:', err);
    return NextResponse.json(
      { message: 'Gagal membuat jadwal ronda.' },
      { status: 500 },
    );
  }
}
