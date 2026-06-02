'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyRound, ArrowLeft, Mail, Check } from 'lucide-react';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit recovery request.');
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
        {/* BACK LINK */}
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'hsl(var(--text-secondary-hsl))', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '24px', padding: 0 }}>
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </button>

        {!success ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(104, 117, 245, 0.1)',
                color: 'hsl(var(--primary-hsl))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '1px solid rgba(104, 117, 245, 0.2)'
              }}>
                <KeyRound size={24} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>Reset password</h2>
              <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Enter the email address associated with your account, and we will send a password reset link.
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
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} className="form-input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    placeholder="john.doe@company.com"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
                <span>{loading ? 'Sending Recovery Link...' : 'Send Recovery Link'}</span>
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

            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px' }}>Request Submitted</h2>
            <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.6' }}>
              If your email is registered in our database, we have generated a mock password reset link.
            </p>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '32px', textAlign: 'left', border: '1px solid rgba(104, 117, 245, 0.2)' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: 'hsl(var(--primary-hsl))', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} />
                <span>Local Testing Note</span>
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-secondary-hsl))', margin: 0 }}>
                Open the **Developer Mailbox** floating button at the bottom-right of your screen to find the password reset email, click the link, and choose a new password.
              </p>
            </div>

            <button onClick={() => router.push('/login')} className="btn btn-primary" style={{ width: '100%' }}>
              <span>Back to Login</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
