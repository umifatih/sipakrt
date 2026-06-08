import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const pengurus = await prisma.pengurus.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(pengurus);
  } catch (err) {
    console.error('GET /api/pengurus error', err);
    return NextResponse.json(
      { message: 'Gagal mengambil data pengurus' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nama,
      jabatan,
      username,
      password,
      noHp,
      role,
      aktif,
    } = body as {
      nama: string;
      jabatan: string;
      username: string;
      password: string;
      noHp: string;
      role: string;
      aktif?: boolean;
    };

    if (!nama || !username || !password) {
      return NextResponse.json(
        { message: 'Nama, username, dan password wajib diisi.' },
        { status: 400 }
      );
    }

    const created = await prisma.pengurus.create({
      data: {
        nama,
        jabatan,
        username,
        password, // TODO: kalau mau, di-hash dulu
        noHp,
        role,
        aktif: aktif ?? true,
      },
    });

    return NextResponse.json(created);
  } catch (err: any) {
    console.error('POST /api/pengurus error', err);

    // duplicate username
    if (err.code === 'P2002') {
      return NextResponse.json(
        { message: 'Username sudah digunakan.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Gagal menambah pengurus.' },
      { status: 500 }
    );
  }
}
