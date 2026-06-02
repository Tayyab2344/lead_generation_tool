'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Send, 
  Search, 
  Plus, 
  Mail, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertCircle, 
  ShieldAlert, 
  Home, 
  BarChart2, 
  Sparkles 
} from 'lucide-react';

interface CampaignItem {
  id: string;
  name: string;
  type: 'EMAIL' | 'LINKEDIN' | 'COLD_CALL';
  status: 'RUNNING' | 'PAUSED' | 'COMPLETED';
  sent: number;
  opened: number;
  replied: number;
  startDate: string;
}

export default function Campaigns() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock campaigns
  const campaigns: CampaignItem[] = [];

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.profile.role.name);
        }
      } catch (err) {
        console.error('Error fetching role:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserRole();
  }, []);

  const isAnalyst = userRole === 'Analyst';

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0', color: 'hsl(var(--text-secondary-hsl))' }}>
          Loading campaign configurations...
        </div>
      </DashboardLayout>
    );
  }

  // RENDER RESTRICTED SCREEN FOR ANALYST
  if (isAnalyst) {
    return (
      <DashboardLayout>
        <div 
          className="glass-panel animate-scale-in"
          style={{
            maxWidth: '560px',
            margin: '60px auto',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            textAlign: 'center',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: 'hsl(var(--danger-hsl))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            border: '2px solid hsl(var(--danger-hsl))'
          }}>
            <ShieldAlert size={32} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px' }}>Access Restricted</h2>
          <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
            The **Campaigns Execution Module** is restricted for your role (**{userRole}**). Only Administrators, Managers, and Sales Representatives can configure or execute client outreach campaigns.
          </p>

          <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '32px', textAlign: 'left', background: 'rgba(255, 255, 255, 0.01)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'hsl(var(--primary-hsl))', display: 'block', marginBottom: '6px' }}>Need Access?</span>
            <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted-hsl))', margin: 0 }}>
              Please request role elevation to **Sales Representative** or **Manager** to run automated outbound email sequences.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/dashboard" className="btn btn-primary" style={{ padding: '10px 20px' }}>
              <Home size={16} />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // RENDER NORMAL HIGH-FIDELITY CAMPAIGNS LIST
  const filteredCampaigns = campaigns.filter(camp => 
    camp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: CampaignItem['status']) => {
    switch (status) {
      case 'RUNNING':
        return { text: 'Running', style: { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'hsl(var(--success-hsl))', border: '1px solid rgba(16, 185, 129, 0.25)' } };
      case 'PAUSED':
        return { text: 'Paused', style: { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'hsl(var(--warning-hsl))', border: '1px solid rgba(245, 158, 11, 0.25)' } };
      case 'COMPLETED':
        return { text: 'Completed', style: { backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.25)' } };
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: 'var(--font-family)', paddingBottom: '40px' }}>
        
        {/* HEADER ROW */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.03em' }}>Outbound Campaigns</h1>
            <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.95rem', margin: 0 }}>
              Launch, audit, and analyze outbound sales sequences across email, social, and phone.
            </p>
          </div>

          <button className="btn btn-primary">
            <Plus size={16} />
            <span>New Campaign Sequence</span>
          </button>
        </div>

        {/* STATS HIGHLIGHTS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(104, 117, 245, 0.12)', color: 'hsl(var(--primary-hsl))' }}>
              <Send size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted-hsl))', display: 'block' }}>Total Contacts Sent</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800' }}>4,455</span>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(6, 182, 212, 0.12)', color: 'hsl(var(--accent-hsl))' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted-hsl))', display: 'block' }}>Average Open Rate</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'hsl(var(--accent-hsl))' }}>59.8%</span>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'hsl(var(--success-hsl))' }}>
              <BarChart2 size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted-hsl))', display: 'block' }}>Average Reply Rate</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'hsl(var(--success-hsl))' }}>13.7%</span>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: 'hsl(var(--text-muted-hsl))' }} />
            <input
              type="text"
              placeholder="Search outbound campaign folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ padding: '10px 16px 10px 40px', fontSize: '0.88rem' }}
            />
          </div>
        </div>

        {/* CAMPAIGNS LIST PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredCampaigns.map(camp => {
            const badge = getStatusBadge(camp.status);
            const openPercent = camp.sent > 0 ? Math.round((camp.opened / camp.sent) * 100) : 0;
            const replyPercent = camp.opened > 0 ? Math.round((camp.replied / camp.sent) * 100) : 0;

            return (
              <div 
                key={camp.id}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '24px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '24px',
                  border: '1px solid var(--border-color)'
                }}
              >
                {/* Left Section: Info */}
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0 }}>{camp.name}</h3>
                    <span className="status-badge" style={{ ...badge?.style, fontSize: '0.65rem' }}>
                      {badge?.text}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted-hsl))' }}>
                    Channel: <strong>{camp.type}</strong> • Launched on {new Date(camp.startDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Center Section: Metrics details */}
                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))', fontWeight: '500', textTransform: 'uppercase' }}>Sent</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', marginTop: '4px' }}>{camp.sent.toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))', fontWeight: '500', textTransform: 'uppercase' }}>Open Rate</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'hsl(var(--accent-hsl))', marginTop: '4px' }}>
                      {openPercent}%
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))', fontWeight: '500', marginLeft: '4px' }}>
                        ({camp.opened})
                      </span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))', fontWeight: '500', textTransform: 'uppercase' }}>Reply Rate</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'hsl(var(--success-hsl))', marginTop: '4px' }}>
                      {replyPercent}%
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))', fontWeight: '500', marginLeft: '4px' }}>
                        ({camp.replied})
                      </span>
                    </span>
                  </div>
                </div>

                {/* Right Section: Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {camp.status === 'RUNNING' ? (
                    <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
                      <Pause size={14} />
                      <span>Pause</span>
                    </button>
                  ) : camp.status === 'PAUSED' ? (
                    <button className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
                      <Play size={14} />
                      <span>Resume</span>
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted-hsl))', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={14} style={{ color: 'hsl(var(--success-hsl))' }} />
                      <span>Completed</span>
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </DashboardLayout>
  );
}
