'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Target, 
  ShieldAlert, 
  Home, 
  ArrowUpRight,
  PieChart,
  Percent
} from 'lucide-react';

interface MetricsSummary {
  cac: number;
  ltv: number;
  avgSalesCycleDays: number;
  totalConversions: number;
}

export default function Analytics() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock analytics summaries
  const stats: MetricsSummary = {
    cac: 0,
    ltv: 0,
    avgSalesCycleDays: 0,
    totalConversions: 0
  };

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

  const isSalesRepresentative = userRole === 'Sales Representative';

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0', color: 'hsl(var(--text-secondary-hsl))' }}>
          Loading analytics metrics...
        </div>
      </DashboardLayout>
    );
  }

  // RENDER RESTRICTED SCREEN FOR SALES REPRESENTATIVES
  if (isSalesRepresentative) {
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
            The **Analytics Reporting Module** is restricted for your role (**{userRole}**). Deep data analytics audits, CAC/LTV mapping, and corporate yield sheets are reserved for Administrators, Managers, and Analysts.
          </p>

          <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '32px', textAlign: 'left', background: 'rgba(255, 255, 255, 0.01)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'hsl(var(--primary-hsl))', display: 'block', marginBottom: '6px' }}>Need Access?</span>
            <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted-hsl))', margin: 0 }}>
              Please request role elevation to **Analyst** or **Manager** to access the financial analytics platform reporting tools.
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

  // RENDER NORMAL HIGH-FIDELITY ANALYTICS FOR OTHERS
  return (
    <DashboardLayout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: 'var(--font-family)', paddingBottom: '40px' }}>
        
        {/* HEADER ROW */}
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.03em' }}>Acquisition Analytics</h1>
          <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.95rem', margin: 0 }}>
            Audit metrics, customer acquisition costs, contract lifetimes, and yield performance.
          </p>
        </div>

        {/* CORE STATS HIGHLIGHTS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', position: 'relative', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted-hsl))', fontWeight: '600', textTransform: 'uppercase' }}>Customer Acquisition Cost</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '8px 0 4px 0', color: 'hsl(var(--danger-hsl))' }}>${stats.cac.toLocaleString()}</h3>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))' }}>Average marketing/sales cost per win</span>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', position: 'relative', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted-hsl))', fontWeight: '600', textTransform: 'uppercase' }}>Customer Lifetime Value</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '8px 0 4px 0', color: 'hsl(var(--success-hsl))' }}>${stats.ltv.toLocaleString()}</h3>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))' }}>Average contract yields over lifecycle</span>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', position: 'relative', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted-hsl))', fontWeight: '600', textTransform: 'uppercase' }}>LTV : CAC Yield Ratio</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '8px 0 4px 0', color: 'hsl(var(--primary-hsl))' }}>
              {stats.cac > 0 ? (stats.ltv / stats.cac).toFixed(1) : '0.0'}x
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))' }}>Target index: &gt; 3.0x (Excellent)</span>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', position: 'relative', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted-hsl))', fontWeight: '600', textTransform: 'uppercase' }}>Average Sales Cycle</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '8px 0 4px 0', color: 'hsl(var(--accent-hsl))' }}>{stats.avgSalesCycleDays} Days</h3>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))' }}>From initial contact to closed-won</span>
          </div>
        </div>

        {/* DETAILS GRAPH GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px'
        }}>
          {/* CHART 1: DISTRIBUTION */}
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '4px' }}>Lead Acquisition Channels</h3>
              <p style={{ color: 'hsl(var(--text-muted-hsl))', fontSize: '0.8rem', margin: 0 }}>Percentage share of inbound lead generations</p>
            </div>

            {/* Simulated Horizontal Share Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
              {[
                { name: 'LinkedIn Inbound', value: 0, color: 'hsl(var(--primary-hsl))' },
                { name: 'Cold Email Sequences', value: 0, color: 'hsl(var(--accent-hsl))' },
                { name: 'Partner Referrals', value: 0, color: 'hsl(var(--success-hsl))' },
                { name: 'Search Ads & Organic', value: 0, color: 'hsl(var(--text-muted-hsl))' }
              ].map((channel, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: '600' }}>{channel.name}</span>
                    <span style={{ fontWeight: '700', color: channel.color }}>{channel.value}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.03)', overflow: 'hidden' }}>
                    <div style={{ width: `${channel.value}%`, height: '100%', borderRadius: '4px', backgroundColor: channel.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHART 2: YIELD PROGRESS */}
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '4px' }}>Win-Rate Analytics Trends</h3>
              <p style={{ color: 'hsl(var(--text-muted-hsl))', fontSize: '0.8rem', margin: 0 }}>Monthly conversion rates comparison</p>
            </div>

            <div style={{ 
              height: '180px', 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'space-between', 
              padding: '0 8px',
              borderBottom: '1px solid var(--border-color)',
              gap: '16px'
            }}>
              {[
                { label: 'Jan', rate: 0 },
                { label: 'Feb', rate: 0 },
                { label: 'Mar', rate: 0 },
                { label: 'Apr', rate: 0 },
                { label: 'May', rate: 0 }
              ].map((m, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ 
                    width: '100%', 
                    height: `${m.rate * 3.5}px`, 
                    backgroundColor: 'rgba(6, 182, 212, 0.45)', 
                    borderRadius: '4px 4px 0 0',
                    position: 'relative',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <span style={{ position: 'absolute', top: '-22px', fontSize: '0.72rem', fontWeight: '700', color: 'hsl(var(--accent-hsl))' }}>{m.rate}%</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted-hsl))', fontWeight: '500', marginTop: '6px' }}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
