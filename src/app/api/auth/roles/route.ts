import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const roles = await db.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ roles });
  } catch (error) {
    console.error('Roles API GET Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
