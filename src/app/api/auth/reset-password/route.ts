import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password, confirmPassword } = body;

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Token, password, and password confirmation are required.' },
        { status: 400 }
      );
    }

    // 1. Password Strength Validations
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Password confirmation does not match.' }, { status: 400 });
    }

    // 2. Validate token
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.type !== 'RESET_PASSWORD') {
      return NextResponse.json({ error: 'Invalid or expired password reset token.' }, { status: 400 });
    }

    if (verificationToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Password reset token has expired.' }, { status: 400 });
    }

    // 3. Find user
    const user = await db.user.findUnique({
      where: { email: verificationToken.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 400 });
    }

    // 4. Update Password
    const hashedPassword = await hashPassword(password);
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword },
    });

    // 5. Revoke ALL active sessions for this user (security feature)
    await db.session.updateMany({
      where: { userId: user.id, status: 'ACTIVE' },
      data: { status: 'REVOKED' },
    });

    // 6. Delete Verification Token
    await db.verificationToken.delete({
      where: { token },
    });

    // 7. Write security notification
    await db.notification.create({
      data: {
        userId: user.id,
        type: 'SECURITY',
        title: 'Password Reset Successful',
        message: 'Your account password was recently changed. We have logged you out of all other active sessions for security.',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Your password has been reset successfully. Please log in with your new password.'
    });
  } catch (error: any) {
    console.error('Reset Password API Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
