import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // For security, if user doesn't exist, we still return a generic success message
    // so we don't disclose registered email addresses. But we only send email if user exists.
    if (user) {
      if (user.status === 'SUSPENDED') {
        return NextResponse.json({ error: 'This account has been suspended.' }, { status: 403 });
      }

      // Generate Reset Token
      const token = generateToken();
      const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour expiry

      // Remove existing reset tokens for this email first
      await db.verificationToken.deleteMany({
        where: { email: user.email, type: 'RESET_PASSWORD' }
      });

      await db.verificationToken.create({
        data: {
          email: user.email,
          token,
          type: 'RESET_PASSWORD',
          expiresAt,
        },
      });

      // Send mock recovery email
      const resetLink = `${req.nextUrl.origin}/reset-password?token=${token}`;
      const emailBody = `
        Hi ${user.firstName},
        
        We received a request to reset your password.
        To choose a new password, please click the link below:
        
        ${resetLink}
        
        This password reset link will expire in 1 hour.
        If you did not request a password reset, please ignore this email.
        
        Best regards,
        The LeadPulse Team
      `;

      await db.sentEmail.create({
        data: {
          to: user.email,
          subject: 'Reset your LeadPulse Password',
          body: emailBody,
          token,
          type: 'PASSWORD_RESET',
        },
      });

      console.log('\n=======================================');
      console.log(`MOCK EMAIL SENT TO: ${user.email}`);
      console.log(`SUBJECT: Reset your LeadPulse Password`);
      console.log(`LINK: ${resetLink}`);
      console.log('=======================================\n');
    }

    return NextResponse.json({
      success: true,
      message: 'If the email is associated with an account, a password reset link has been sent.'
    });
  } catch (error: any) {
    console.error('Forgot Password API Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
