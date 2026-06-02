import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required.' }, { status: 400 });
    }

    // Find the token
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.type !== 'VERIFY_EMAIL') {
      return NextResponse.json({ error: 'Invalid verification token.' }, { status: 400 });
    }

    // Check expiration
    if (verificationToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Verification token has expired. Please register again or request a new verification email.' },
        { status: 400 }
      );
    }

    // Update user status
    const user = await db.user.update({
      where: { email: verificationToken.email },
      data: { status: 'VERIFIED' },
    });

    // Delete token
    await db.verificationToken.delete({
      where: { token },
    });

    // Create system notification
    await db.notification.create({
      data: {
        userId: user.id,
        type: 'ACCOUNT',
        title: 'Account Verified',
        message: 'Your email address has been successfully verified. Welcome to LeadPulse!',
      },
    });

    // Redirect to login page with a success banner query param
    return NextResponse.redirect(new URL('/login?verified=true', req.url));
  } catch (error: any) {
    console.error('Verify Email API Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
