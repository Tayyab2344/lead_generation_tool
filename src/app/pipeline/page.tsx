'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  GitBranch, 
  Search, 
  Plus, 
  DollarSign, 
  Building2, 
  User, 
  ShieldAlert, 
  Home, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface PipelineDeal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: 'IDENTIFIED' | 'CONTACTED' | 'PROPOSAL' | 'NEGOTIATION';
  owner: string;
}

export default function Pipeline() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock deals
  const deals: PipelineDeal[] = [];

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

  // Columns stages definition
  const stages = [
    { id: 'IDENTIFIED', name: 'Lead Identified', color: 'hsl(var(--primary-hsl))' },
    { id: 'CONTACTED', name: 'Contact Initiated', color: 'hsl(var(--accent-hsl))' },
    { id: 'PROPOSAL', name: 'Proposal Sent', color: 'hsl(var(--warning-hsl))' },
    { id: 'NEGOTIATION', name: 'In Negotiation', color: 'hsl(var(--success-hsl))' },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0', color: 'hsl(var(--text-secondary-hsl))' }}>
          Loading pipeline configuration...
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
            The **Pipeline Management Module** is restricted for your role (**{userRole}**). Only Administrators, Managers, and Sales Representatives can view or mutate acquisition pipeline configurations.
          </p>

          <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '32px', textAlign: 'left', background: 'rgba(255, 255, 255, 0.01)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'hsl(var(--primary-hsl))', display: 'block', marginBottom: '6px' }}>Need Access?</span>
            <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted-hsl))', margin: 0 }}>
              Please contact your administrator to request a role elevation to **Sales Representative** or **Manager** to manage corporate deal pipelines.
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

  // RENDER NORMAL HIGH-FIDELITY BOARD FOR OTHERS
  const filteredDeals = deals.filter(deal => 
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: 'var(--font-family)', paddingBottom: '40px' }}>
        
        {/* HEADER ROW */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.03em' }}>Sales Pipeline</h1>
            <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.95rem', margin: 0 }}>
              Track the progress of prospective contracts and active business negotiations.
            </p>
          </div>

          <button className="btn btn-primary">
            <Plus size={16} />
            <span>Create New Deal</span>
          </button>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: 'hsl(var(--text-muted-hsl))' }} />
            <input
              type="text"
              placeholder="Search active deals and clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ padding: '10px 16px 10px 40px', fontSize: '0.88rem' }}
            />
          </div>
        </div>

        {/* PIPELINE KANBAN BOARD */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          alignItems: 'flex-start'
        }}>
          {stages.map(stage => {
            const stageDeals = filteredDeals.filter(d => d.stage === stage.id);
            const totalValue = stageDeals.reduce((acc, curr) => acc + curr.value, 0);

            return (
              <div 
                key={stage.id} 
                className="glass-panel"
                style={{
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  background: 'rgba(15, 23, 42, 0.4)',
                  minHeight: '450px'
                }}
              >
                {/* Column Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{stage.name}</span>
                    <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted-hsl))', fontWeight: '500' }}>
                      {stageDeals.length} {stageDeals.length === 1 ? 'deal' : 'deals'}
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: '700', 
                    color: stage.color,
                    backgroundColor: `rgba(255,255,255,0.02)`,
                    border: '1px solid var(--border-color)',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    ${totalValue.toLocaleString()}
                  </span>
                </div>

                {/* Deal Cards Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  {stageDeals.map(deal => (
                    <div 
                      key={deal.id}
                      className="glass-panel glass-panel-hover"
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'grab',
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: '700', fontSize: '0.85rem', display: 'block', marginBottom: '2px' }}>{deal.title}</span>
                        <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted-hsl))', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Building2 size={10} />
                          <span>{deal.company}</span>
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.02)', paddingTop: '10px' }}>
                        <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'hsl(var(--accent-hsl))', display: 'flex', alignItems: 'center' }}>
                          <DollarSign size={12} />
                          <span>{deal.value.toLocaleString()}</span>
                        </span>

                        <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted-hsl))', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={10} />
                          <span>{deal.owner}</span>
                        </span>
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div style={{
                      display: 'flex',
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px dashed var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'hsl(var(--text-muted-hsl))',
                      fontSize: '0.78rem',
                      padding: '24px 12px',
                      textAlign: 'center'
                    }}>
                      No deals in this stage.
                    </div>
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
