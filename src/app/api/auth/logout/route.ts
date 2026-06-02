import { NextResponse } from 'next/server';
import { logoutCurrentSession } from '@/lib/auth';

export async function POST() {
  try {
    await logoutCurrentSession();
    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout API Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
