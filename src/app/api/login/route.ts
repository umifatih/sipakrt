// src/app/api/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body as {
      email: string;
      password: string;
      role: 'admin' | 'warga';
    };

    if (!email || !password || !role) {
      return NextResponse.json(
        { message: 'Email, password, dan role wajib diisi.' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Email atau password salah.' },
        { status: 401 },
      );
    }

    const expectedRole = role === 'admin' ? 'ADMIN' : 'WARGA';

    if (user.role !== expectedRole) {
      return NextResponse.json(
        { message: 'Role tidak sesuai. Pilih tab login yang benar.' },
        { status: 403 },
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Email atau password salah.' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return NextResponse.json(
      { message: 'Terjadi kesalahan di server.' },
      { status: 500 },
    );
  }
}
