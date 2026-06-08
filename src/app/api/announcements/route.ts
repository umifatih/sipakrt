// src/app/api/announcements/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get('public') === 'true';

    const announcements = await prisma.announcement.findMany({
      where: isPublic ? { published: true } : {},
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(announcements);
  } catch (err) {
    console.error('GET /api/announcements error', err);
    return NextResponse.json(
      { message: 'Gagal mengambil pengumuman.' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      date,
      emoji,
      category,
      published = true,
    } = body as {
      title: string;
      content: string;
      date: string; // '2025-10-20'
      emoji?: string;
      category?: string;
      published?: boolean;
    };

    if (!title || !content || !date) {
      return NextResponse.json(
        { message: 'Judul, tanggal, dan isi pengumuman wajib diisi.' },
        { status: 400 },
      );
    }

    const created = await prisma.announcement.create({
      data: {
        title,
        content,
        date: new Date(date),
        emoji,
        category,
        published,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('POST /api/announcements error', err);
    return NextResponse.json(
      { message: 'Gagal membuat pengumuman.' },
      { status: 500 },
    );
  }
}
