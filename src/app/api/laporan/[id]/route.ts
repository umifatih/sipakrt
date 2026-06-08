import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{ id: string }>;
};

// Update status + response dari admin
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { message: 'ID laporan tidak valid.' },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { status, response } = body as {
      status?: 'baru' | 'proses' | 'selesai';
      response?: string;
    };

    const updated = await prisma.laporan.update({
      where: { id },
      data: {
        status: status ?? undefined,
        response: response ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Gagal menyimpan tanggapan.' },
      { status: 500 },
    );
  }
}
