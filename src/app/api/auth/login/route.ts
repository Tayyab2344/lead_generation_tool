import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyPassword, createSession, getClientDetails } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase();
    const { deviceInfo, ipAddress } = await getClientDetails();

    // 1. Lockout Protection Check (Brute Force Protection)
    // Check if there are 5 consecutive failed logins in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    // Find the user if they exist
    const user = await db.user.findUnique({
      where: { email: lowerEmail },
      include: { role: true }
    });

    if (user) {
      const recentFailedLogins = await db.loginHistory.findMany({
        where: {
          userId: user.id,
          timestamp: { gte: fiveMinutesAgo },
        },
        orderBy: { timestamp: 'desc' },
        take: 5
      });

      const consecutiveFailures = recentFailedLogins.length >= 5 && 
        recentFailedLogins.every(history => history.status === 'FAILED');

      if (consecutiveFailures) {
        return NextResponse.json(
          { error: 'Too many failed login attempts. This account is temporarily locked for 5 minutes.' },
          { status: 429 }
        );
      }
    }

    // 2. Validate Credentials
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      // Log failed attempt if user exists
      if (user) {
        await db.loginHistory.create({
          data: {
            userId: user.id,
            ipAddress,
            deviceInfo,
            status: 'FAILED',
          },
        });
      }
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 });
    }

    // 3. Check Account Status
    // (Email verification validation removed for now)
    /*
    if (user.status === 'PENDING_VERIFICATION') {
      return NextResponse.json(
        { error: 'Your email address is not verified. Please check your inbox or developer mailbox to verify your email.' },
        { status: 403 }
      );
    }
    */

    if (user.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'Your account has been suspended. Please contact platform administrators.' },
        { status: 403 }
      );
    }

    // 4. Create Session (creates session in DB and sets HttpOnly cookie)
    await createSession(user.id);

    // Create a security notification for the user about new login
    await db.notification.create({
      data: {
        userId: user.id,
        type: 'SECURITY',
        title: 'New Login Detected',
        message: `A new session was opened from ${deviceInfo} (IP: ${ipAddress}). If this wasn't you, revoke it in Security Settings immediately.`,
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
      }
    });
  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
