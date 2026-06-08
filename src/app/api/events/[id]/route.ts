// src/app/api/events/[id]/route.ts
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
      date,
      timeStart,
      timeEnd,
      location,
      description,
      emoji,
      category,
      maxParticipants,
      participants,
    } = body as {
      title?: string;
      date?: string;
      timeStart?: string;
      timeEnd?: string;
      location?: string;
      description?: string;
      emoji?: string;
      category?: string;
      maxParticipants?: number | null;
      participants?: number;
    };

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(timeStart !== undefined && { timeStart }),
        ...(timeEnd !== undefined && { timeEnd }),
        ...(location !== undefined && { location }),
        ...(description !== undefined && { description }),
        ...(emoji !== undefined && { emoji }),
        ...(category !== undefined && { category }),
        ...(maxParticipants !== undefined && { maxParticipants }),
        ...(participants !== undefined && { participants }),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('PUT /api/events/[id] error', err);
    return NextResponse.json(
      { message: 'Gagal mengubah event.' },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/events/[id] error', err);
    return NextResponse.json(
      { message: 'Gagal menghapus event.' },
      { status: 500 },
    );
  }
}
