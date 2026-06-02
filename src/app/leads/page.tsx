'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  TrendingUp,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';
  value: number;
  source: string;
  location: string;
}

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock leads database
  const leads: Lead[] = [];

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

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: Lead['status']) => {
    switch (status) {
      case 'WON':
        return { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'hsl(var(--success-hsl))', border: '1px solid rgba(16, 185, 129, 0.25)' };
      case 'LOST':
        return { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'hsl(var(--danger-hsl))', border: '1px solid rgba(239, 68, 68, 0.25)' };
      case 'NEW':
        return { backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.25)' };
      case 'QUALIFIED':
      case 'NEGOTIATION':
      case 'PROPOSAL':
        return { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'hsl(var(--warning-hsl))', border: '1px solid rgba(245, 158, 11, 0.25)' };
      default:
        return { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'hsl(var(--text-secondary-hsl))', border: '1px solid var(--border-color)' };
    }
  };

  const isAnalyst = userRole === 'Analyst';

  return (
    <DashboardLayout>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0', color: 'hsl(var(--text-secondary-hsl))' }}>
          Loading leads database...
        </div>
      ) : (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: 'var(--font-family)', paddingBottom: '40px' }}>
          
          {/* HEADER ROW */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.03em' }}>Leads Directory</h1>
              <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.95rem', margin: 0 }}>
                Manage, query, and categorize your business acquisition records.
              </p>
            </div>

            {!isAnalyst && (
              <button className="btn btn-primary" style={{ padding: '12px 20px' }}>
                <Plus size={16} />
                <span>Add New Lead</span>
              </button>
            )}
          </div>

          {/* LEADS OVERVIEW STATS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted-hsl))', fontWeight: '600', textTransform: 'uppercase' }}>Active Pipeline Leads</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '8px 0 0 0' }}>{leads.filter(l => l.status !== 'WON' && l.status !== 'LOST').length}</h3>
            </div>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted-hsl))', fontWeight: '600', textTransform: 'uppercase' }}>Conversion Win Rate</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '8px 0 0 0', color: 'hsl(var(--success-hsl))' }}>
                {Math.round((leads.filter(l => l.status === 'WON').length / leads.length) * 100)}%
              </h3>
            </div>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted-hsl))', fontWeight: '600', textTransform: 'uppercase' }}>Pipeline Capital</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '8px 0 0 0', color: 'hsl(var(--accent-hsl))' }}>
                ${leads.filter(l => l.status !== 'LOST').reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
              </h3>
            </div>
          </div>

          {/* FILTERS AND CONTROLS CARD */}
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={16} className="form-input-icon" />
              <input
                type="text"
                placeholder="Search leads, email addresses, or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ padding: '10px 16px 10px 40px', fontSize: '0.88rem' }}
              />
            </div>

            {/* Status Dropdown Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={14} style={{ color: 'hsl(var(--text-muted-hsl))' }} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input"
                style={{
                  padding: '10px 42px 10px 16px',
                  fontSize: '0.88rem',
                  width: '180px'
                }}
              >
                <option value="ALL" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>All Lead Statuses</option>
                <option value="NEW" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>New</option>
                <option value="CONTACTED" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>Contacted</option>
                <option value="QUALIFIED" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>Qualified</option>
                <option value="PROPOSAL" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>Proposal</option>
                <option value="NEGOTIATION" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>Negotiation</option>
                <option value="WON" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>Won (Closed)</option>
                <option value="LOST" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>Lost</option>
              </select>
            </div>
          </div>

          {/* TABLE GLASS PANEL */}
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'hsl(var(--text-muted-hsl))', fontWeight: '600' }}>
                  <th style={{ padding: '12px 16px' }}>Lead Name</th>
                  <th style={{ padding: '12px 16px' }}>Company</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Contract Value</th>
                  <th style={{ padding: '12px 16px' }}>Acquisition Channel</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px 0', color: 'hsl(var(--text-muted-hsl))', fontSize: '0.9rem' }}>
                      No lead records match your queries.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map(lead => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>{lead.name}</span>
                          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))' }}>{lead.email}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', color: 'hsl(var(--text-secondary-hsl))' }}>{lead.company}</td>
                      <td style={{ padding: '16px' }}>
                        <span className="status-badge" style={{ ...getStatusStyle(lead.status), fontSize: '0.7rem' }}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontWeight: '600', color: 'hsl(var(--text-primary-hsl))' }}>
                        ${lead.value.toLocaleString()}
                      </td>
                      <td style={{ padding: '16px', color: 'hsl(var(--text-muted-hsl))', fontSize: '0.8rem' }}>{lead.source}</td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button style={{ background: 'none', border: 'none', color: 'hsl(var(--text-muted-hsl))', cursor: 'pointer' }}>
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
}
