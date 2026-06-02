import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyCurrentSession, verifyPassword, hashPassword } from '@/lib/auth';

// Fetch current user details
export async function GET() {
  try {
    const user = await verifyCurrentSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // Return profile data (excluding password hash)
    const profile = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        profileImage: true,
        companyName: true,
        createdAt: true,
        status: true,
        role: {
          select: {
            name: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Profile API GET Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// Update profile details and password
export async function PUT(req: NextRequest) {
  try {
    const user = await verifyCurrentSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      firstName, 
      lastName, 
      phoneNumber, 
      companyName, 
      profileImage,
      currentPassword,
      newPassword,
      confirmNewPassword
    } = body;

    // 1. Basic Validations
    if (firstName && (firstName.length < 2 || firstName.length > 50)) {
      return NextResponse.json({ error: 'First Name must be between 2 and 50 characters.' }, { status: 400 });
    }
    if (lastName && (lastName.length < 2 || lastName.length > 50)) {
      return NextResponse.json({ error: 'Last Name must be between 2 and 50 characters.' }, { status: 400 });
    }
    if (companyName && companyName.length > 100) {
      return NextResponse.json({ error: 'Company Name cannot exceed 100 characters.' }, { status: 400 });
    }

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    // 2. Change Password Validation if provided
    if (currentPassword || newPassword || confirmNewPassword) {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return NextResponse.json(
          { error: 'To change your password, you must enter current password, new password, and password confirmation.' },
          { status: 400 }
        );
      }

      // Verify current password
      const fullUser = await db.user.findUnique({ where: { id: user.id } });
      if (!fullUser) {
        return NextResponse.json({ error: 'User not found.' }, { status: 400 });
      }

      const isValidCurrent = await verifyPassword(currentPassword, fullUser.passwordHash);
      if (!isValidCurrent) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
      }

      // Validate new password rules
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters long.' }, { status: 400 });
      }

      const hasUppercase = /[A-Z]/.test(newPassword);
      const hasLowercase = /[a-z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);
      const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

      if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
        return NextResponse.json(
          { error: 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.' },
          { status: 400 }
        );
      }

      if (newPassword !== confirmNewPassword) {
        return NextResponse.json({ error: 'Password confirmation does not match.' }, { status: 400 });
      }

      // Hashing new password
      const newHash = await hashPassword(newPassword);
      updateData.passwordHash = newHash;

      // Revoke all other active sessions except the current one (security measure)
      // Since current session is active, we can look up current cookie token
      const cookieStore = await req.cookies;
      const currentToken = cookieStore.get('session_token')?.value;

      await db.session.updateMany({
        where: {
          userId: user.id,
          token: { not: currentToken },
          status: 'ACTIVE',
        },
        data: { status: 'REVOKED' },
      });

      // Log notification
      await db.notification.create({
        data: {
          userId: user.id,
          type: 'SECURITY',
          title: 'Password Changed',
          message: 'Your account password was updated successfully. All other active sessions have been logged out.',
        },
      });
    }

    // 3. Perform User Update
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        profileImage: true,
        companyName: true,
      },
    });

    // Create notification for general details update
    if (Object.keys(updateData).length > 0 && !updateData.passwordHash) {
      await db.notification.create({
        data: {
          userId: user.id,
          type: 'ACCOUNT',
          title: 'Profile Updated',
          message: 'Your personal and professional details were updated successfully.',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile API PUT Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
