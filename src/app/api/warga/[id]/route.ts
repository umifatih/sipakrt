import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = {
  params: Promise<{ id: string }>;
};

// PUT /api/warga/[id] -> update warga
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { message: 'ID tidak valid.' },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { nama, nik, noKk, alamat, noHp, status } = body as {
      nama?: string;
      nik?: string;
      noKk?: string;
      alamat?: string;
      noHp?: string;
      status?: string;
    };

    const existing = await prisma.warga.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { message: 'Data warga tidak ditemukan.' },
        { status: 404 },
      );
    }

    // kalau nik diubah, pastikan tidak duplikat
    if (nik && nik !== existing.nik) {
      const nikUsed = await prisma.warga.findUnique({ where: { nik } });
      if (nikUsed) {
        return NextResponse.json(
          { message: 'NIK sudah digunakan oleh warga lain.' },
          { status: 400 },
        );
      }
    }

    const updated = await prisma.warga.update({
      where: { id },
      data: {
        nama: nama ?? existing.nama,
        nik: nik ?? existing.nik,
        noKk: noKk ?? existing.noKk,
        alamat: alamat ?? existing.alamat,
        noHp: noHp ?? existing.noHp,
        status: status ?? existing.status,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('PUT /api/warga/[id] error:', err);
    return NextResponse.json(
      { message: 'Gagal mengubah data warga.' },
      { status: 500 },
    );
  }
}

// DELETE /api/warga/[id] -> hapus warga
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { message: 'ID tidak valid.' },
        { status: 400 },
      );
    }

    // pastikan ada dulu
    const existing = await prisma.warga.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { message: 'Data warga tidak ditemukan.' },
        { status: 404 },
      );
    }

    await prisma.warga.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Data warga berhasil dihapus.' });
  } catch (err) {
    console.error('DELETE /api/warga/[id] error:', err);
    return NextResponse.json(
      { message: 'Gagal menghapus data warga.' },
      { status: 500 },
    );
  }
}
