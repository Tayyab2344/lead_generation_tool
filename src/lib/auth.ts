import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies, headers } from 'next/headers';
import db from './db';
import { UAParser } from 'ua-parser-js';

// Hash passwords securely
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify entered password against hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate secure random tokens
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Parse device information from request headers
export async function getClientDetails() {
  const headerList = await headers();
  const userAgent = headerList.get('user-agent') || 'Unknown Device';
  const ipAddress = headerList.get('x-forwarded-for')?.split(',')[0].trim() || 
                    headerList.get('x-real-ip') || 
                    '127.0.0.1';

  // Parse user agent
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  let deviceInfo = '';
  if (device.model) {
    deviceInfo += `${device.vendor || ''} ${device.model} - `;
  }
  deviceInfo += `${browser.name || 'Unknown Browser'} (${os.name || 'Unknown OS'} ${os.version || ''})`;

  return {
    deviceInfo: deviceInfo.trim(),
    ipAddress,
  };
}

// Create a database-backed session
export async function createSession(userId: string) {
  const token = generateToken();
  const { deviceInfo, ipAddress } = await getClientDetails();
  
  // Set expiration (e.g. 2 hours from now)
  const expirationMinutes = parseInt(process.env.SESSION_TIMEOUT_MINUTES || '120', 10);
  const expirationTime = new Date(Date.now() + expirationMinutes * 60 * 1000);

  // Store in database
  const session = await db.session.create({
    data: {
      userId,
      token,
      deviceInfo,
      ipAddress,
      expirationTime,
      status: 'ACTIVE',
    },
  });

  // Log to LoginHistory
  await db.loginHistory.create({
    data: {
      userId,
      ipAddress,
      deviceInfo,
      status: 'SUCCESS',
    },
  });

  // Set secure HttpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expirationTime,
    path: '/',
  });

  return session;
}

// Retrieve active session from token
export async function getSession(token: string) {
  const session = await db.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!session || session.status !== 'ACTIVE') {
    return null;
  }

  // Check if session has expired
  if (session.expirationTime < new Date()) {
    await db.session.update({
      where: { id: session.id },
      data: { status: 'EXPIRED' },
    });
    return null;
  }

  return session;
}

// Validate current user session and perform sliding window update
export async function verifyCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) return null;

  const session = await getSession(token);
  if (!session) {
    // Clear invalid cookie
    cookieStore.delete('session_token');
    return null;
  }

  // Perform sliding window token rotation / lifetime extension
  const expirationMinutes = parseInt(process.env.SESSION_TIMEOUT_MINUTES || '120', 10);
  const newExpiration = new Date(Date.now() + expirationMinutes * 60 * 1000);

  await db.session.update({
    where: { id: session.id },
    data: { expirationTime: newExpiration },
  });

  // Update cookie expiration
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: newExpiration,
    path: '/',
  });

  return session.user;
}

// Revoke a specific session by ID or token
export async function revokeSession(sessionToken: string) {
  await db.session.update({
    where: { token: sessionToken },
    data: { status: 'REVOKED' },
  });
}

// Revoke current session (Logout)
export async function logoutCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  
  if (token) {
    await revokeSession(token);
    cookieStore.delete('session_token');
  }
}
