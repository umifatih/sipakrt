// src/app/api/surat/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: { id: string } };

// GET detail surat (opsional, kalau mau dipakai)
export async function GET(_req: Request, { params }: Params) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'ID tidak valid.' }, { status: 400 });
    }

    const surat = await prisma.surat.findUnique({ where: { id } });
    if (!surat) {
      return NextResponse.json(
        { message: 'Data surat tidak ditemukan.' },
        { status: 404 },
      );
    }

    return NextResponse.json(surat);
  } catch (err) {
    console.error('GET /api/surat/[id] error:', err);
    return NextResponse.json(
      { message: 'Gagal mengambil detail surat.' },
      { status: 500 },
    );
  }
}

// PUT /api/surat/[id] -> admin update status & catatan
export async function PUT(request: Request, { params }: Params) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'ID tidak valid.' }, { status: 400 });
    }

    const body = await request.json();
    const { status, catatanAdmin } = body as {
      status?: string;
      catatanAdmin?: string;
    };

    const existing = await prisma.surat.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { message: 'Data surat tidak ditemukan.' },
        { status: 404 },
      );
    }

    const updated = await prisma.surat.update({
      where: { id },
      data: {
        status: status ?? existing.status,
        catatanAdmin:
          typeof catatanAdmin === 'string'
            ? catatanAdmin
            : existing.catatanAdmin,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('PUT /api/surat/[id] error:', err);
    return NextResponse.json(
      { message: 'Gagal mengubah data surat.' },
      { status: 500 },
    );
  }
}
