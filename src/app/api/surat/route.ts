// src/app/api/surat/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/surat
// Admin: bisa pakai ?status=...
// Warga: bisa pakai ?email=... untuk filter surat miliknya
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const pemohonEmail = searchParams.get('email');

    const where: any = {};

    if (status) where.status = status;
    if (pemohonEmail) where.pemohonEmail = pemohonEmail;

    const surat = await prisma.surat.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(surat);
  } catch (err) {
    console.error('GET /api/surat error:', err);
    return NextResponse.json(
      { message: 'Gagal mengambil data surat.' },
      { status: 500 },
    );
  }
}

// POST /api/surat -> dipakai warga untuk mengajukan surat
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pemohonNama, pemohonEmail, jenis, keperluan, keterangan } =
      body as {
        pemohonNama: string;
        pemohonEmail?: string | null;
        jenis: string;
        keperluan: string;
        keterangan?: string | null;
      };

    if (!pemohonNama || !jenis || !keperluan) {
      return NextResponse.json(
        {
          message:
            'Nama pemohon, jenis surat, dan keperluan wajib diisi.',
        },
        { status: 400 },
      );
    }

    const surat = await prisma.surat.create({
      data: {
        pemohonNama,
        pemohonEmail: pemohonEmail || null,
        jenis,
        keperluan,
        keterangan: keterangan || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json(surat, { status: 201 });
  } catch (err) {
    console.error('POST /api/surat error:', err);
    return NextResponse.json(
      { message: 'Gagal membuat pengajuan surat.' },
      { status: 500 },
    );
  }
}
