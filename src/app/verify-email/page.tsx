'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('No verification token was provided in the URL. Please verify your link and try again.');
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        
        // Wait, if the API redirects automatically, the fetch request might follow it.
        // Let's check the redirect behavior or handle response JSON.
        if (res.ok) {
          setStatus('success');
          // Automatically redirect to login after 4 seconds
          const timer = setTimeout(() => {
            router.push('/login?verified=true');
          }, 4000);
          return () => clearTimeout(timer);
        } else {
          // It could be a JSON response or redirect. Let's see if we can parse JSON.
          const data = await res.json().catch(() => ({ error: 'Verification failed.' }));
          setStatus('error');
          setErrorMsg(data.error || 'The verification link is invalid or has expired.');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setErrorMsg('A network error occurred. Please check your connection and try again.');
      }
    }

    verify();
  }, [token, router]);

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
          maxWidth: '460px',
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center'
        }}
      >
        {/* BRAND LOGO */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '36px' }}>
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

        {/* VERIFYING STATE */}
        {status === 'verifying' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px 0' }}>
            <Loader2 className="animate-spin" size={44} style={{ color: 'hsl(var(--primary-hsl))' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>Verifying email address</h2>
            <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              Checking your security credentials. Please do not close or reload this window...
            </p>
            <style jsx global>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              .animate-spin {
                animation: spin 1s linear infinite;
              }
            `}</style>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: 'hsl(var(--success-hsl))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid hsl(var(--success-hsl))',
              marginBottom: '8px'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>Email Verified!</h2>
            <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              Your account verification is complete. You will be redirected to the sign-in screen in a few seconds.
            </p>
            <Link href="/login?verified=true" className="btn btn-primary" style={{ width: '100%', marginTop: '12px', padding: '12px' }}>
              <span>Proceed to Login</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: 'hsl(var(--danger-hsl))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid hsl(var(--danger-hsl))',
              marginBottom: '8px'
            }}>
              <AlertCircle size={36} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>Verification Failed</h2>
            <p style={{ color: 'hsl(var(--danger-hsl))', fontSize: '0.88rem', fontWeight: '500', margin: 0 }}>
              {errorMsg || 'The verification link is invalid or has expired.'}
            </p>
            <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
              If you did not complete verification within 24 hours, you may need to register again or request a new verification token.
            </p>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              <Link href="/register" className="btn btn-primary" style={{ padding: '12px' }}>
                <span>Back to Registration</span>
              </Link>
              <Link href="/login" className="btn btn-secondary" style={{ padding: '12px' }}>
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(var(--bg-primary-hsl))', color: 'hsl(var(--text-secondary-hsl))' }}>
        Loading Verification Screen...
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
