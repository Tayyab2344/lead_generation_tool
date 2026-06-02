import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyCurrentSession } from '@/lib/auth';

// Fetch current user settings
export async function GET() {
  try {
    const user = await verifyCurrentSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const settings = await db.settings.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Settings API GET Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// Update user settings preferences
export async function PUT(req: NextRequest) {
  try {
    const user = await verifyCurrentSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      language,
      timeZone,
      dateFormat,
      theme,
      emailNotifications,
      systemNotifications,
      campaignAlerts,
      leadAlerts,
      dataSharing,
      accountVisibility,
      communicationPreferences,
    } = body;

    const settings = await db.settings.upsert({
      where: { userId: user.id },
      update: {
        language,
        timeZone,
        dateFormat,
        theme,
        emailNotifications,
        systemNotifications,
        campaignAlerts,
        leadAlerts,
        dataSharing,
        accountVisibility,
        communicationPreferences,
      },
      create: {
        userId: user.id,
        language: language || 'en',
        timeZone: timeZone || 'UTC',
        dateFormat: dateFormat || 'YYYY-MM-DD',
        theme: theme || 'dark',
        emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
        systemNotifications: systemNotifications !== undefined ? systemNotifications : true,
        campaignAlerts: campaignAlerts !== undefined ? campaignAlerts : true,
        leadAlerts: leadAlerts !== undefined ? leadAlerts : true,
        dataSharing: dataSharing !== undefined ? dataSharing : false,
        accountVisibility: accountVisibility || 'private',
        communicationPreferences: communicationPreferences || 'email',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully.',
      settings,
    });
  } catch (error) {
    console.error('Settings API PUT Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
