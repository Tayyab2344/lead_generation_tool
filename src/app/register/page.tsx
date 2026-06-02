'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { UserPlus, ArrowRight, ShieldCheck, Mail, Building2, Check } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
}

export default function Register() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    roleId: '',
    termsAccepted: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Load available roles
  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await fetch('/api/auth/roles');
        if (res.ok) {
          const data = await res.json();
          setRoles(data.roles);
          if (data.roles.length > 0) {
            setFormData(prev => ({ ...prev, roleId: data.roles[0].id }));
          }
        }
      } catch (err) {
        console.error('Error loading roles:', err);
      }
    }
    loadRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
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
          maxWidth: '520px',
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* BRAND */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <Logo size={36} />
          <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.03em' }}>LeadPulse</span>
        </div>

        {!success ? (
          <>
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>Create your account</h2>
              <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.9rem' }}>
                Join LeadPulse and streamline client acquisitions.
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
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="john.doe@company.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Name (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={16} className="form-input-icon" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    placeholder="Acme Corp"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Role Category</label>
                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id} style={{ backgroundColor: 'hsl(var(--bg-tertiary-hsl))' }}>
                      {r.name} - {r.description.slice(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Password checklist hint */}
              <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))', marginBottom: '24px', lineHeight: '1.4' }}>
                Password must be at least 8 characters and contain an uppercase letter, lowercase letter, number, and special character.
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '28px' }}>
                <input
                  type="checkbox"
                  name="termsAccepted"
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="form-input-checkbox"
                  style={{ marginTop: '2px' }}
                  required
                />
                <label htmlFor="termsAccepted" style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary-hsl))', cursor: 'pointer', lineHeight: '1.4' }}>
                  I agree to the <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link> and accept the platform configuration.
                </label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
                <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
                <UserPlus size={16} />
              </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'hsl(var(--text-secondary-hsl))' }}>
              Already have an account? <Link href="/login">Log In</Link>
            </div>
          </>
        ) : (
          <div className="animate-scale-in" style={{ textAlign: 'center', padding: '16px 0' }}>
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

            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px' }}>Registration Successful!</h2>
            <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.6' }}>
              We have generated a mock verification email for <strong>{formData.email}</strong>.
            </p>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '32px', textAlign: 'left', border: '1px solid rgba(104, 117, 245, 0.2)' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: 'hsl(var(--primary-hsl))', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} />
                <span>Local Testing Note</span>
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-secondary-hsl))', margin: 0 }}>
                Please click the **Developer Mailbox** floating button at the bottom-right of your screen (or go to <Link href="/dev/mailbox">/dev/mailbox</Link>) to find your verification email and click the confirmation link.
              </p>
            </div>

            <button onClick={() => router.push('/login')} className="btn btn-primary" style={{ width: '100%' }}>
              <span>Go to Login Screen</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
