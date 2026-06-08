// src/app/api/tagihan-kas/[id]/bayar/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const tagihanId = Number(params.id);
    if (Number.isNaN(tagihanId)) {
      return NextResponse.json(
        { message: 'ID tagihan tidak valid.' },
        { status: 400 },
      );
    }

    const tagihan = await prisma.tagihanKas.findUnique({
      where: { id: tagihanId },
    });

    if (!tagihan) {
      return NextResponse.json(
        { message: 'Tagihan tidak ditemukan.' },
        { status: 404 },
      );
    }

    if (tagihan.status === 'LUNAS') {
      return NextResponse.json(
        { message: 'Tagihan ini sudah lunas.' },
        { status: 400 },
      );
    }

    const sekarang = new Date();

    // Jalankan dalam 1 transaksi DB
    await prisma.$transaction(async (tx) => {
      // 1. catat pemasukan ke tabel Transaksi
      await tx.transaksi.create({
        data: {
          tanggal: sekarang,
          tipe: 'PEMASUKAN',        // harus sama dengan yang dipakai di frontend
          deskripsi: tagihan.judul, // misal: "Iuran Bulanan - Juli 2025"
          kategori: 'Tagihan Kas',
          jumlah: tagihan.jumlah,
        },
      });

      // 2. update status tagihan -> LUNAS
      await tx.tagihanKas.update({
        where: { id: tagihanId },
        data: { status: 'LUNAS' },
      });
    });

    return NextResponse.json({
      message: 'Tagihan berhasil dibayar.',
    });
  } catch (err) {
    console.error('BAYAR TAGIHAN ERROR:', err);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat memproses pembayaran.' },
      { status: 500 },
    );
  }
}
