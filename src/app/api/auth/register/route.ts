// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body as {
      name: string;
      email: string;
      password: string;
      role?: 'admin' | 'warga';
    };

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Nama, email, dan password wajib diisi.' },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar.' },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role === 'admin' ? 'ADMIN' : 'WARGA', // default WARGA
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Terjadi kesalahan di server.' },
      { status: 500 },
    );
  }
}
