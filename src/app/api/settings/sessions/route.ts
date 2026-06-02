import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyCurrentSession } from '@/lib/auth';
import { cookies } from 'next/headers';

// Fetch active sessions and login history
export async function GET() {
  try {
    const user = await verifyCurrentSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const cookieStore = await cookies();
    const currentToken = cookieStore.get('session_token')?.value;

    // Get active sessions
    const activeSessionsRaw = await db.session.findMany({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        expirationTime: { gte: new Date() },
      },
      orderBy: { loginTime: 'desc' },
    });

    // Map sessions to hide token and flag the current one
    const activeSessions = activeSessionsRaw.map(session => ({
      id: session.id,
      userId: session.userId,
      deviceInfo: session.deviceInfo,
      ipAddress: session.ipAddress,
      loginTime: session.loginTime,
      expirationTime: session.expirationTime,
      status: session.status,
      isCurrent: session.token === currentToken
    }));

    // Get recent login history (last 20 logs)
    const loginHistory = await db.loginHistory.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      activeSessions,
      loginHistory,
    });
  } catch (error) {
    console.error('Sessions API GET Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// Revoke a specific active session
export async function DELETE(req: NextRequest) {
  try {
    const user = await verifyCurrentSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required.' }, { status: 400 });
    }

    // Find the session and make sure it belongs to this user
    const session = await db.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== user.id) {
      return NextResponse.json({ error: 'Session not found or access denied.' }, { status: 404 });
    }

    // Update status to REVOKED
    await db.session.update({
      where: { id: sessionId },
      data: { status: 'REVOKED' },
    });

    // Add security notification
    await db.notification.create({
      data: {
        userId: user.id,
        type: 'SECURITY',
        title: 'Active Session Revoked',
        message: `An active session on ${session.deviceInfo} (IP: ${session.ipAddress}) was manually terminated.`,
      },
    });

    return NextResponse.json({ success: true, message: 'Session revoked successfully.' });
  } catch (error) {
    console.error('Sessions API DELETE Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
