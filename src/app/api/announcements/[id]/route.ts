// src/app/api/announcements/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    const body = await request.json();
    const {
      title,
      content,
      date,
      emoji,
      category,
      published,
    } = body as {
      title?: string;
      content?: string;
      date?: string;
      emoji?: string;
      category?: string;
      published?: boolean;
    };

    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(emoji !== undefined && { emoji }),
        ...(category !== undefined && { category }),
        ...(published !== undefined && { published }),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('PUT /api/announcements/[id] error', err);
    return NextResponse.json(
      { message: 'Gagal mengubah pengumuman.' },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    await prisma.announcement.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/announcements/[id] error', err);
    return NextResponse.json(
      { message: 'Gagal menghapus pengumuman.' },
      { status: 500 },
    );
  }
}
