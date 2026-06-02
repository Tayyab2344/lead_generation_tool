'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check if redirect query flags are set
    if (searchParams.get('verified') === 'true') {
      setInfoMessage('Email address verified successfully. You can now log in.');
    } else if (searchParams.get('reset') === 'true') {
      setInfoMessage('Password reset successfully. Please log in with your new credentials.');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      // Redirect to the dashboard (or the callback URL if specified)
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      router.push(callbackUrl);
      router.refresh();
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
        {/* BRAND LOGO */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, hsl(var(--primary-hsl)), hsl(var(--accent-hsl)))',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '800'
          }}>LP</div>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.03em' }}>LeadPulse</span>
        </div>

        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>Sign in to Platform</h2>
          <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.9rem' }}>
            Enter your credentials to access your client base.
          </p>
        </div>

        {/* FEEDBACK BANNERS */}
        {infoMessage && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            color: 'hsl(var(--success-hsl))',
            fontSize: '0.85rem',
            fontWeight: '500',
            marginBottom: '20px'
          }}>
            {infoMessage}
          </div>
        )}

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
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} className="form-input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="admin@leadpulse.com"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <Link href="/forgot-password" style={{ fontSize: '0.78rem', color: 'hsl(var(--primary-hsl))' }}>
                Forgot Password?
              </Link>
            </div>
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
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
            <input
              type="checkbox"
              name="rememberMe"
              id="rememberMe"
              className="form-input-checkbox"
            />
            <label htmlFor="rememberMe" style={{ fontSize: '0.82rem', color: 'hsl(var(--text-secondary-hsl))', cursor: 'pointer' }}>
              Remember me on this device
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            <span>{loading ? 'Logging in...' : 'Sign In'}</span>
            <LogIn size={16} />
          </button>
        </form>

        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'hsl(var(--text-secondary-hsl))' }}>
          Don't have an account? <Link href="/register">Register Here</Link>
        </div>

        <div style={{ marginTop: '16px', fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))', textAlign: 'center' }}>
          Demo Admin: <strong>admin@leadpulse.com</strong> / <strong>Password123!</strong>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(var(--bg-primary-hsl))', color: 'hsl(var(--text-secondary-hsl))' }}>
        Loading Login Screen...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
