import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// Fetch all sent mock emails
export async function GET() {
  try {
    const emails = await db.sentEmail.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Dev Mailbox API GET Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// Clear all mock emails
export async function DELETE() {
  try {
    await db.sentEmail.deleteMany({});
    return NextResponse.json({ success: true, message: 'Mailbox cleared.' });
  } catch (error) {
    console.error('Dev Mailbox API DELETE Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
