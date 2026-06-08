import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_req: Request, { params }: Params) {
  const { id: rawId } = await params;
    const id = Number(rawId);
  if (Number.isNaN(id)) {
    return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });
  }

  try {
    await prisma.pengurus.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/pengurus/[id] error', err);
    return NextResponse.json(
      { message: 'Gagal menghapus pengurus.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const { id: rawId } = await params;
    const id = Number(rawId);
  if (Number.isNaN(id)) {
    return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { aktif, role } = body as {
      aktif?: boolean;
      role?: string;
    };

    const updated = await prisma.pengurus.update({
      where: { id },
      data: {
        ...(typeof aktif === 'boolean' ? { aktif } : {}),
        ...(role !== undefined ? { role } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('PATCH /api/pengurus/[id] error', err);
    return NextResponse.json(
      { message: 'Gagal mengubah pengurus.' },
      { status: 500 }
    );
  }
}
