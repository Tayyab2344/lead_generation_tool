'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Users, 
  Send, 
  GitBranch, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Globe, 
  MousePointerClick 
} from 'lucide-react';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at bottom, hsl(var(--bg-primary-hsl)) 0%, hsl(var(--bg-secondary-hsl)) 100%)',
      fontFamily: 'var(--font-family)',
      overflowX: 'hidden',
      color: 'hsl(var(--text-primary-hsl))'
    }}>
      
      {/* NAVBAR */}
      <header style={{
        height: '80px',
        borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(var(--glass-blur))',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        background: 'rgba(15, 23, 42, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, hsl(var(--primary-hsl)), hsl(var(--accent-hsl)))',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '800'
          }}>LP</div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em' }}>LeadPulse</span>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/login" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'hsl(var(--text-secondary-hsl))', padding: '8px 16px' }}>
            Sign In
          </Link>
          <Link href="/register" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
            <span>Get Started</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{
        padding: '160px 20px 80px 20px',
        textAlign: 'center',
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Glow decorative background bubbles */}
        <div style={{
          position: 'absolute',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(104, 117, 245, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(104, 117, 245, 0.1)',
          border: '1px solid rgba(104, 117, 245, 0.2)',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8rem',
          fontWeight: '600',
          color: 'hsl(var(--primary-hsl))',
          marginBottom: '24px',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <Zap size={14} />
          <span>Outbound Client Acquisition Re-imagined</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          fontWeight: '800',
          lineHeight: '1.1',
          letterSpacing: '-0.04em',
          maxWidth: '900px',
          margin: '0 auto 24px auto',
          background: 'linear-gradient(135deg, #fff 30%, hsl(var(--text-secondary-hsl)) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Accelerate Your Client Acquisition Flow
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'hsl(var(--text-secondary-hsl))',
          maxWidth: '650px',
          margin: '0 auto 40px auto',
          lineHeight: '1.6'
        }}>
          A premium unified workspace to capture business leads, deploy targeted outbound sequences, manage sales pipelines, and analyze conversion channels.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
            <span>Create Free Account</span>
            <ArrowRight size={18} />
          </Link>
          <Link href="/login" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
            <span>Sign In to Platform</span>
          </Link>
        </div>
      </section>

      {/* DASHBOARD PREVIEW OVERLAY */}
      <section style={{
        padding: '0 20px 80px 20px',
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative'
      }}>
        <div className="glass-panel" style={{
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(15, 23, 42, 0.75)',
          overflow: 'hidden'
        }}>
          {/* Mock Browser Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'hsl(var(--danger-hsl))' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'hsl(var(--warning-hsl))' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'hsl(var(--success-hsl))' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))', fontFamily: 'monospace' }}>app.leadpulse.com/dashboard</span>
            <div style={{ width: '36px' }} />
          </div>

          {/* Mock Dashboard Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '20px' }}>
            {/* Mock Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderRight: '1px solid var(--border-color)', paddingRight: '16px' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: i === 1 ? 'hsl(var(--primary-hsl))' : 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: i === 1 ? 'white' : 'hsl(var(--text-muted-hsl))' }} />
                </div>
              ))}
            </div>

            {/* Mock Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Row 1: Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '120px', height: '16px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
                <div style={{ width: '80px', height: '24px', borderRadius: '6px', backgroundColor: 'hsl(var(--success-hsl))', opacity: 0.8 }} />
              </div>

              {/* Row 2: Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.15)' }}>
                    <div style={{ width: '60px', height: '10px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.03)', marginBottom: '8px' }} />
                    <div style={{ width: '40px', height: '18px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
                  </div>
                ))}
              </div>

              {/* Row 3: Graph Card */}
              <div className="glass-panel" style={{ height: '120px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '16px' }}>
                {[40, 70, 50, 90, 60, 80, 75].map((h, i) => (
                  <div key={i} style={{ width: '24px', height: `${h}%`, borderRadius: '4px 4px 0 0', backgroundColor: i === 3 ? 'hsl(var(--primary-hsl))' : 'rgba(104, 117, 245, 0.25)', transition: 'height 0.3s' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUE PROPOSITIONS */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '12px' }}>Unified Acquisition Toolkit</h2>
          <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.95rem' }}>Core features engineered for rapid business development operations.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          
          {/* VALUE 1: LEADS DIRECTORY */}
          <div className="glass-panel glass-panel-hover" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(104, 117, 245, 0.12)', color: 'hsl(var(--primary-hsl))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px' }}>Leads Directory</h3>
            <p style={{ fontSize: '0.88rem', color: 'hsl(var(--text-secondary-hsl))', lineHeight: '1.6', margin: 0 }}>
              Store, segment, and tag business leads with comprehensive contact profiles, company names, and financial value metrics.
            </p>
          </div>

          {/* VALUE 2: OUTBOUND SEQUENCES */}
          <div className="glass-panel glass-panel-hover" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(6, 182, 212, 0.12)', color: 'hsl(var(--accent-hsl))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Send size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px' }}>Outbound Campaigns</h3>
            <p style={{ fontSize: '0.88rem', color: 'hsl(var(--text-secondary-hsl))', lineHeight: '1.6', margin: 0 }}>
              Deploy sequence structures across email, social, and phone. Tracks opens, replies, and click-through conversions automatically.
            </p>
          </div>

          {/* VALUE 3: DEAL PIPELINES */}
          <div className="glass-panel glass-panel-hover" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'hsl(var(--success-hsl))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <GitBranch size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px' }}>Acquisition Pipeline</h3>
            <p style={{ fontSize: '0.88rem', color: 'hsl(var(--text-secondary-hsl))', lineHeight: '1.6', margin: 0 }}>
              Track contract negotiations through visual stages. Monitor total value in pipeline, win rates, and expected completion.
            </p>
          </div>

          {/* VALUE 4: REPORTING ANALYTICS */}
          <div className="glass-panel glass-panel-hover" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.12)', color: 'hsl(var(--warning-hsl))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <BarChart3 size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px' }}>Unified Analytics</h3>
            <p style={{ fontSize: '0.88rem', color: 'hsl(var(--text-secondary-hsl))', lineHeight: '1.6', margin: 0 }}>
              Audit customer lifetime value (LTV), acquisition cost (CAC), LTV:CAC ratios, and average sales lifecycle durations.
            </p>
          </div>

        </div>
      </section>

      {/* SECURITY / INFRA BARRICADE */}
      <section style={{
        padding: '60px 20px 120px 20px',
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div className="glass-panel" style={{
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <ShieldCheck size={40} style={{ color: 'hsl(var(--success-hsl))' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Enterprise Security Baseline</h2>
          <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.9rem', maxWidth: '600px', margin: 0, lineHeight: '1.6' }}>
            We implement database-backed user device session management. Monitor active connections, receive instant security notifications on new logins, and execute remote session terminations on suspicious access attempts.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '40px 20px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'hsl(var(--text-muted-hsl))',
        background: 'rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} LeadPulse. All rights reserved. Locally protected sandbox.</p>
      </footer>

    </div>
  );
}
