import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyCurrentSession } from '@/lib/auth';

// Get user notifications
export async function GET() {
  try {
    const user = await verifyCurrentSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const notifications = await db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Notifications API GET Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// Mark notifications as read
export async function PUT(req: NextRequest) {
  try {
    const user = await verifyCurrentSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      await db.notification.updateMany({
        where: { userId: user.id, readStatus: false },
        data: { readStatus: true },
      });
      return NextResponse.json({ success: true, message: 'All notifications marked as read.' });
    }

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required.' }, { status: 400 });
    }

    await db.notification.update({
      where: { id: notificationId },
      data: { readStatus: true },
    });

    return NextResponse.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Notifications API PUT Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
