import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      confirmPassword, 
      companyName, 
      roleId, 
      termsAccepted 
    } = body;

    // 1. Basic Field Validations
    if (!firstName || !lastName || !email || !password || !confirmPassword || !roleId) {
      return NextResponse.json(
        { error: 'All fields (First Name, Last Name, Email, Password, Confirm Password, Role) are required.' },
        { status: 400 }
      );
    }

    if (!termsAccepted) {
      return NextResponse.json(
        { error: 'You must accept the Terms of Service and Privacy Policy to register.' },
        { status: 400 }
      );
    }

    // 2. Format and Length Checks
    if (firstName.length < 2 || firstName.length > 50) {
      return NextResponse.json({ error: 'First Name must be between 2 and 50 characters.' }, { status: 400 });
    }

    if (lastName.length < 2 || lastName.length > 50) {
      return NextResponse.json({ error: 'Last Name must be between 2 and 50 characters.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (companyName && companyName.length > 100) {
      return NextResponse.json({ error: 'Company Name cannot exceed 100 characters.' }, { status: 400 });
    }

    // 3. Password Strength Validations
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

    // 4. Role validation
    const role = await db.role.findUnique({
      where: { id: roleId },
    });
    if (!role) {
      return NextResponse.json({ error: 'Selected role is invalid.' }, { status: 400 });
    }

    // 5. Unique Email Check
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email address already exists.' }, { status: 400 });
    }

    // 6. Create User and dependencies
    const hashedPassword = await hashPassword(password);
    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
        companyName,
        roleId,
        status: 'PENDING_VERIFICATION',
      },
    });

    // Create user settings
    await db.settings.create({
      data: {
        userId: user.id,
        theme: 'dark',
        language: 'en',
        timeZone: 'UTC',
        dateFormat: 'YYYY-MM-DD',
      },
    });

    // Create Verification Token
    const verificationToken = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry
    await db.verificationToken.create({
      data: {
        email: user.email,
        token: verificationToken,
        type: 'VERIFY_EMAIL',
        expiresAt,
      },
    });

    // Send mock verification email
    const verificationLink = `${req.nextUrl.origin}/verify-email?token=${verificationToken}`;
    const emailBody = `
      Hi ${firstName},
      
      Thank you for registering at LeadPulse!
      To complete your setup and verify your email, please click the link below:
      
      ${verificationLink}
      
      This verification link will expire in 24 hours.
      If you did not request this registration, please ignore this email.
      
      Best regards,
      The LeadPulse Team
    `;

    await db.sentEmail.create({
      data: {
        to: user.email,
        subject: 'Verify your LeadPulse Email',
        body: emailBody,
        token: verificationToken,
        type: 'VERIFICATION',
      },
    });

    // Also write to stdout/console log for development ease
    console.log('\n=======================================');
    console.log(`MOCK EMAIL SENT TO: ${user.email}`);
    console.log(`SUBJECT: Verify your LeadPulse Email`);
    console.log(`LINK: ${verificationLink}`);
    console.log('=======================================\n');

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful. A verification email has been sent.' 
    });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
