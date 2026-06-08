// src/app/api/ronda/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// UPDATE (PATCH) /api/ronda/:id
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { message: 'ID tidak valid.' },
        { status: 400 },
      );
    }

    const body = await request.json();
    const {
      tanggal,
      jamMulai,
      jamSelesai,
      wargaNama,
      lokasi,
      shiftKe,
      kelompok,
    } = body as {
      tanggal?: string;
      jamMulai?: string;
      jamSelesai?: string;
      wargaNama?: string;
      lokasi?: string;
      shiftKe?: number;
      kelompok?: string | null;
    };

    const existing = await prisma.rondaShift.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: 'Jadwal tidak ditemukan.' },
        { status: 404 },
      );
    }

    const updated = await prisma.rondaShift.update({
      where: { id },
      data: {
        tanggal: tanggal ? new Date(tanggal) : existing.tanggal,
        jamMulai: jamMulai ?? existing.jamMulai,
        jamSelesai: jamSelesai ?? existing.jamSelesai,
        wargaNama: wargaNama ?? existing.wargaNama,
        lokasi: lokasi ?? existing.lokasi,
        shiftKe: shiftKe ?? existing.shiftKe,
        kelompok:
          typeof kelompok === 'undefined'
            ? existing.kelompok
            : kelompok,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Ronda PATCH error:', err);
    return NextResponse.json(
      { message: 'Gagal mengubah jadwal ronda.' },
      { status: 500 },
    );
  }
}

// DELETE /api/ronda/:id
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { message: 'ID tidak valid.' },
        { status: 400 },
      );
    }

    const existing = await prisma.rondaShift.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: 'Jadwal tidak ditemukan.' },
        { status: 404 },
      );
    }

    await prisma.rondaShift.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Jadwal berhasil dihapus.' });
  } catch (err) {
    console.error('Ronda DELETE error:', err);
    return NextResponse.json(
      { message: 'Gagal menghapus jadwal ronda.' },
      { status: 500 },
    );
  }
}
