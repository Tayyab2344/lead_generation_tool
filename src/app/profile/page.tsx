'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { User, Lock, Mail, Phone, Briefcase, ShieldAlert, Check, X } from 'lucide-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  companyName: string | null;
  createdAt: string;
  status: string;
  role: {
    name: string;
    description: string;
  };
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  // Forms states
  const [detailsForm, setDetailsForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    companyName: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [detailsSuccess, setDetailsSuccess] = useState<string | null>(null);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          setDetailsForm({
            firstName: data.profile.firstName || '',
            lastName: data.profile.lastName || '',
            phoneNumber: data.profile.phoneNumber || '',
            companyName: data.profile.companyName || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetailsForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setDetailsError(null);
    setDetailsSuccess(null);
    setUpdating(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(detailsForm),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update details.');
      }

      setDetailsSuccess('Details updated successfully!');
      if (profile) {
        setProfile({
          ...profile,
          firstName: detailsForm.firstName,
          lastName: detailsForm.lastName,
          phoneNumber: detailsForm.phoneNumber || null,
          companyName: detailsForm.companyName || null,
        });
      }
    } catch (err: any) {
      setDetailsError(err.message || 'Something went wrong.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New password confirmation does not match.');
      return;
    }

    setUpdating(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmNewPassword: passwordForm.confirmNewPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setPasswordSuccess('Password changed successfully! Other device sessions have been revoked.');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err: any) {
      setPasswordError(err.message || 'Something went wrong.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0', color: 'hsl(var(--text-secondary-hsl))' }}>
          Loading profile parameters...
        </div>
      ) : (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: 'var(--font-family)', paddingBottom: '40px' }}>
          
          {/* PROFILE SUMMARY HERO CARD */}
          <div className="glass-panel" style={{
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, hsl(var(--primary-hsl)), hsl(var(--accent-hsl)))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: '800',
              boxShadow: 'var(--shadow-primary)'
            }}>
              {profile ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase() : 'LP'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>
                  {profile?.firstName} {profile?.lastName}
                </h1>
                <span className="status-badge status-verified">
                  {profile?.role?.name}
                </span>
              </div>
              <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.9rem', margin: '0 0 6px 0' }}>
                {profile?.email} • Member since {profile ? new Date(profile.createdAt).toLocaleDateString() : ''}
              </p>
              <p style={{ color: 'hsl(var(--text-muted-hsl))', fontSize: '0.8rem', margin: 0 }}>
                {profile?.role?.description}
              </p>
            </div>
          </div>

          {/* EDIT BLOCKS GRID */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '24px'
          }}>
            
            {/* COLUMN 1: GENERAL PROFILE DETAILS */}
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={20} style={{ color: 'hsl(var(--primary-hsl))' }} />
                <span>Personal & Professional Details</span>
              </h2>

              {detailsError && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 16px', color: 'hsl(var(--danger-hsl))', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '20px' }}>
                  {detailsError}
                </div>
              )}

              {detailsSuccess && (
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px 16px', color: 'hsl(var(--success-hsl))', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '20px' }}>
                  {detailsSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateDetails}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={detailsForm.firstName}
                      onChange={handleDetailsChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={detailsForm.lastName}
                      onChange={handleDetailsChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} className="form-input-icon" />
                    <input
                      type="text"
                      name="phoneNumber"
                      value={detailsForm.phoneNumber}
                      onChange={handleDetailsChange}
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                      placeholder="+1 (555) 0199"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '28px' }}>
                  <label className="form-label">Company Name</label>
                  <div style={{ position: 'relative' }}>
                    <Briefcase size={16} className="form-input-icon" />
                    <input
                      type="text"
                      name="companyName"
                      value={detailsForm.companyName}
                      onChange={handleDetailsChange}
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={updating}>
                  {updating ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>

            {/* COLUMN 2: SECURITY & PASSWORD CHANGE */}
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Lock size={20} style={{ color: 'hsl(var(--accent-hsl))' }} />
                <span>Security Settings & Password</span>
              </h2>

              {passwordError && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 16px', color: 'hsl(var(--danger-hsl))', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '20px' }}>
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px 16px', color: 'hsl(var(--success-hsl))', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '20px' }}>
                  {passwordSuccess}
                </div>
              )}

              <form onSubmit={handleUpdatePassword}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="••••••••"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Min. 8 chars with Cap/Num/Spec"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '28px' }}>
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordForm.confirmNewPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.15)', background: 'rgba(245, 158, 11, 0.02)', display: 'flex', gap: '10px', marginBottom: '24px', alignItems: 'flex-start' }}>
                  <ShieldAlert size={18} style={{ color: 'hsl(var(--warning-hsl))', flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-secondary-hsl))', margin: 0, lineHeight: '1.4' }}>
                    <strong>Security Warning:</strong> Changing your password will automatically terminate and revoke all other active browser sessions for your safety.
                  </p>
                </div>

                <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '12px' }} disabled={updating}>
                  {updating ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

          </div>

        </div>
      )}
    </DashboardLayout>
  );
}
