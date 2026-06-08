// src/app/api/ronda/swap/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fromShiftId, toShiftId } = body as {
      fromShiftId: number;
      toShiftId: number;
    };

    if (!fromShiftId || !toShiftId) {
      return NextResponse.json(
        { message: 'ID shift tidak lengkap.' },
        { status: 400 },
      );
    }

    const [shiftA, shiftB] = await prisma.$transaction([
      prisma.rondaShift.findUnique({ where: { id: fromShiftId } }),
      prisma.rondaShift.findUnique({ where: { id: toShiftId } }),
    ]);

    if (!shiftA || !shiftB) {
      return NextResponse.json(
        { message: 'Shift yang dipilih tidak ditemukan.' },
        { status: 404 },
      );
    }

    await prisma.$transaction([
      prisma.rondaShift.update({
        where: { id: shiftA.id },
        data: { wargaNama: shiftB.wargaNama },
      }),
      prisma.rondaShift.update({
        where: { id: shiftB.id },
        data: { wargaNama: shiftA.wargaNama },
      }),
    ]);

    return NextResponse.json({
      message: 'Jadwal ronda berhasil ditukar.',
    });
  } catch (err) {
    console.error('Ronda swap error:', err);
    return NextResponse.json(
      { message: 'Gagal menukar jadwal ronda.' },
      { status: 500 },
    );
  }
}
