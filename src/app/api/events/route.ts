import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isPublic = searchParams.get('public') === 'true';

    const events = await prisma.event.findMany({
      where: isPublic ? {} : {},       // nanti bisa difilter kalau perlu
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(events);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Gagal memuat event' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      date,
      timeStart,
      timeEnd,
      location,
      description,
      category,
      emoji,
      maxParticipants,
    } = body;

    if (!title || !date || !location || !description) {
      return NextResponse.json(
        { message: 'Title, tanggal, lokasi, dan deskripsi wajib diisi.' },
        { status: 400 },
      );
    }

    const created = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        timeStart: timeStart || null,
        timeEnd: timeEnd || null,
        location,
        description,
        category: category || null,
        emoji: emoji || null,
        maxParticipants: maxParticipants ?? null,
        // participants pakai default 0 dari schema
      },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Gagal membuat event' },
      { status: 500 },
    );
  }
}
