'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Send, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Activity,
  ShieldAlert,
  Briefcase
} from 'lucide-react';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  companyName: string | null;
  role: {
    name: string;
  };
}

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const profileRes = await fetch('/api/profile');
        if (profileRes.ok) {
          const data = await profileRes.json();
          setUser(data.profile);
        }

        const notificationsRes = await fetch('/api/notifications');
        if (notificationsRes.ok) {
          const data = await notificationsRes.json();
          setNotifications(data.notifications.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        color: 'hsl(var(--text-secondary-hsl))',
        fontSize: '1rem',
        fontWeight: '500'
      }}>
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border-color)',
            borderTopColor: 'hsl(var(--primary-hsl))',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span>Synchronizing dashboard base...</span>
          <style jsx global>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  const isVerified = user?.status === 'VERIFIED';

  // Metrics Data
  const stats = [
    { 
      name: 'Total Leads', 
      value: '0', 
      change: '0% change', 
      positive: true, 
      icon: Users, 
      color: 'hsl(var(--primary-hsl))',
      bgGlow: 'rgba(104, 117, 245, 0.15)'
    },
    { 
      name: 'Active Campaigns', 
      value: '0', 
      change: '0 this week', 
      positive: true, 
      icon: Send, 
      color: 'hsl(var(--accent-hsl))',
      bgGlow: 'rgba(6, 182, 212, 0.15)'
    },
    { 
      name: 'Pipeline Value', 
      value: '$0', 
      change: '0% change', 
      positive: true, 
      icon: DollarSign, 
      color: 'hsl(var(--success-hsl))',
      bgGlow: 'rgba(16, 185, 129, 0.15)'
    },
    { 
      name: 'Conversion Rate', 
      value: '0.0%', 
      change: '0.0% overall', 
      positive: true, 
      icon: TrendingUp, 
      color: 'hsl(var(--warning-hsl))',
      bgGlow: 'rgba(245, 158, 11, 0.15)'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
      
      {/* 1. GREETING HEADER CARD */}
      <div 
        className="glass-panel" 
        style={{
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, letterSpacing: '-0.03em' }}>
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <span className={`status-badge ${isVerified ? 'status-verified' : 'status-pending'}`} style={{ fontSize: '0.7rem' }}>
              {user?.role?.name || 'Representative'}
            </span>
          </div>
          <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.95rem', margin: 0 }}>
            Here is your client acquisition progress today. {user?.companyName ? `Managing accounts for ${user.companyName}.` : ''}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/leads" className="btn btn-primary">
            <span>Manage Leads</span>
            <ArrowUpRight size={16} />
          </Link>
          <Link href="/settings" className="btn btn-secondary">
            <span>Security Settings</span>
          </Link>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i}
              className="glass-panel glass-panel-hover"
              style={{
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {/* Glowing decorative indicator */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: stat.color,
                filter: 'blur(25px)',
                opacity: '0.35',
                pointerEvents: 'none'
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.name}
                </span>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: stat.bgGlow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color
                }}>
                  <Icon size={18} />
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
                  {stat.value}
                </h3>
                <span style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: '600',
                  color: stat.positive ? 'hsl(var(--success-hsl))' : 'hsl(var(--danger-hsl))'
                }}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. TWO-COLUMN INTERACTIVE CONTENT GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        
        {/* LEFT COLUMN: PIPELINE PROGRESS CHART */}
        <div 
          className="glass-panel"
          style={{
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '4px' }}>Pipeline Performance</h3>
              <p style={{ color: 'hsl(var(--text-muted-hsl))', fontSize: '0.8rem', margin: 0 }}>Weekly sales & acquisition target metrics</p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              color: 'hsl(var(--text-secondary-hsl))'
            }}>
              <Activity size={14} style={{ color: 'hsl(var(--accent-hsl))' }} />
              <span>Real-Time Simulated</span>
            </div>
          </div>

          {/* SIMULATED GRAPH GRID WITH CSS */}
          <div style={{ 
            height: '200px', 
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '0 8px',
            borderBottom: '1px solid var(--border-color)',
            gap: '12px'
          }}>
            {/* Chart Grid Lines */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: '25%', borderTop: '1px dashed rgba(255,255,255,0.03)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: '1px dashed rgba(255,255,255,0.03)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: '75%', borderTop: '1px dashed rgba(255,255,255,0.03)' }} />

            {/* Simulated Line Overlay Path using absolute SVG */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <path 
                d="M 20 190 L 370 190" 
                fill="none" 
                stroke="hsl(var(--primary-hsl))" 
                strokeWidth="3.5"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 4px 10px rgba(104,117,245,0.3))' }}
              />
              <path 
                d="M 20 190 L 370 190" 
                fill="none" 
                stroke="hsl(var(--accent-hsl))" 
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="4 4"
                opacity="0.75"
              />
            </svg>
 
            {/* Columns (to support hover tooltips) */}
            {[
              { label: 'Mon', hPrimary: '0%', hAccent: '0%' },
              { label: 'Tue', hPrimary: '0%', hAccent: '0%' },
              { label: 'Wed', hPrimary: '0%', hAccent: '0%' },
              { label: 'Thu', hPrimary: '0%', hAccent: '0%' },
              { label: 'Fri', hPrimary: '0%', hAccent: '0%' }
            ].map((col, idx) => (
              <div 
                key={idx} 
                style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  zIndex: 5, 
                  height: '100%', 
                  justifyContent: 'flex-end',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', gap: '4px', width: '100%', justifyContent: 'center', alignItems: 'flex-end', height: '100%', paddingBottom: '6px' }}>
                  {/* Primary Bar */}
                  <div style={{ 
                    width: '8px', 
                    height: col.hPrimary, 
                    backgroundColor: 'rgba(104, 117, 245, 0.45)', 
                    borderRadius: '4px 4px 0 0',
                    transition: 'all var(--transition-fast)'
                  }} />
                  {/* Accent Bar */}
                  <div style={{ 
                    width: '8px', 
                    height: col.hAccent, 
                    backgroundColor: 'rgba(6, 182, 212, 0.35)', 
                    borderRadius: '4px 4px 0 0',
                    transition: 'all var(--transition-fast)'
                  }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted-hsl))', fontWeight: '500', marginTop: '6px' }}>{col.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '0.78rem', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'hsl(var(--primary-hsl))' }} />
              <span style={{ color: 'hsl(var(--text-secondary-hsl))' }}>Completed Conversions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'hsl(var(--accent-hsl))' }} />
              <span style={{ color: 'hsl(var(--text-secondary-hsl))' }}>Outbound Pipelines</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ONBOARDING CHECKLIST */}
        <div 
          className="glass-panel"
          style={{
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '4px' }}>Onboarding Roadmap</h3>
            <p style={{ color: 'hsl(var(--text-muted-hsl))', fontSize: '0.8rem', margin: 0 }}>Fulfill these operations to activate lead generation services.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* TASK 1: REGISTER ACCOUNT */}
            <div style={{ display: 'flex', gap: '14px', padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', alignItems: 'center' }}>
              <CheckCircle2 size={20} style={{ color: 'hsl(var(--success-hsl))', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: '600', textDecoration: 'line-through', color: 'hsl(var(--text-muted-hsl))' }}>Register Account</span>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))' }}>Sync initial profile records successfully.</span>
              </div>
            </div>

            {/* TASK 2: VERIFY EMAIL */}
            <div style={{ 
              display: 'flex', 
              gap: '14px', 
              padding: '12px', 
              borderRadius: 'var(--radius-md)', 
              background: isVerified ? 'rgba(255,255,255,0.02)' : 'rgba(245, 158, 11, 0.04)', 
              border: '1px solid',
              borderColor: isVerified ? 'var(--border-color)' : 'rgba(245, 158, 11, 0.2)',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                {isVerified ? (
                  <CheckCircle2 size={20} style={{ color: 'hsl(var(--success-hsl))', flexShrink: 0 }} />
                ) : (
                  <AlertCircle size={20} style={{ color: 'hsl(var(--warning-hsl))', flexShrink: 0 }} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: '600', textDecoration: isVerified ? 'line-through' : 'none', color: isVerified ? 'hsl(var(--text-muted-hsl))' : 'hsl(var(--text-primary-hsl))' }}>
                    Confirm Email Verification
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))' }}>
                    {isVerified ? 'Completed. Account verified.' : 'Verify your email address using developer mailbox.'}
                  </span>
                </div>
              </div>
              {!isVerified && (
                <Link href="/dev/mailbox" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: 'var(--radius-sm)' }}>
                  Verify Now
                </Link>
              )}
            </div>

            {/* TASK 3: SECURE ACCOUNTS */}
            <div style={{ display: 'flex', gap: '14px', padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <AlertCircle size={20} style={{ color: 'hsl(var(--text-muted-hsl))', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'hsl(var(--text-secondary-hsl))' }}>Audit Active Sessions</span>
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))' }}>Ensure no unauthorized device sessions are open.</span>
                </div>
              </div>
              <Link href="/settings" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: 'var(--radius-sm)' }}>
                View Sessions
              </Link>
            </div>

          </div>
        </div>

      </div>

      {/* 4. SECURITY LOGS & RECENT ALERTS */}
      <div 
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '4px' }}>Recent Audit Logs & System Notifications</h3>
            <p style={{ color: 'hsl(var(--text-muted-hsl))', fontSize: '0.8rem', margin: 0 }}>Automated alerts regarding security, session parameters, and platform updates</p>
          </div>
          <Link href="/settings" style={{ fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Security Center</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'hsl(var(--text-muted-hsl))', fontSize: '0.85rem' }}>
              No notifications generated.
            </div>
          ) : (
            notifications.map((notif) => {
              const isSecurity = notif.type === 'SECURITY';
              return (
                <div 
                  key={notif.id}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: notif.readStatus ? 'rgba(255,255,255,0.01)' : 'rgba(104, 117, 245, 0.04)',
                    border: '1px solid',
                    borderColor: notif.readStatus ? 'var(--border-color)' : 'rgba(104, 117, 245, 0.15)',
                    alignItems: 'flex-start'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: isSecurity ? 'rgba(239, 68, 68, 0.12)' : 'rgba(104, 117, 245, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSecurity ? 'hsl(var(--danger-hsl))' : 'hsl(var(--primary-hsl))',
                    flexShrink: 0
                  }}>
                    {isSecurity ? <ShieldAlert size={18} /> : <Briefcase size={18} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{notif.title}</span>
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))' }}>
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'hsl(var(--text-secondary-hsl))', margin: 0, lineHeight: '1.4' }}>
                      {notif.message}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}