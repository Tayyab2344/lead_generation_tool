'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Check, Lock, ArrowRight, ShieldAlert } from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      setError('Password reset token is missing from the URL. Please request a new password reset link.');
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Password reset failed.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(ellipse at bottom, hsl(var(--bg-primary-hsl)) 0%, hsl(var(--bg-secondary-hsl)) 100%)',
      fontFamily: 'var(--font-family)'
    }}>
      <div 
        className="glass-panel animate-scale-in" 
        style={{
          width: '100%',
          maxWidth: '440px',
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* LOGO */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <Logo size={36} />
          <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.03em' }}>LeadPulse</span>
        </div>

        {!success ? (
          <>
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>Create new password</h2>
              <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.9rem' }}>
                Type your new secure password below to restore access.
              </p>
            </div>

            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                color: 'hsl(var(--danger-hsl))',
                fontSize: '0.85rem',
                fontWeight: '500',
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} className="form-input-icon" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    placeholder="••••••••"
                    required
                    disabled={!token}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} className="form-input-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    placeholder="••••••••"
                    required
                    disabled={!token}
                  />
                </div>
              </div>

              {/* Password checklist hint */}
              <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))', marginBottom: '24px', lineHeight: '1.4' }}>
                Password must be at least 8 characters and contain an uppercase letter, lowercase letter, number, and special character.
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading || !token}>
                <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: 'hsl(var(--success-hsl))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              border: '2px solid hsl(var(--success-hsl))'
            }}>
              <Check size={32} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px' }}>Password Updated!</h2>
            <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.9rem', marginBottom: '32px', lineHeight: '1.6' }}>
              Your account password has been changed successfully. All other active sessions have been revoked.
            </p>

            <button onClick={() => router.push('/login?reset=true')} className="btn btn-primary" style={{ width: '100%' }}>
              <span>Log In Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(var(--bg-primary-hsl))', color: 'hsl(var(--text-secondary-hsl))' }}>
        Loading Password Reset...
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
