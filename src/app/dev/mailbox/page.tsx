'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, RefreshCw, Trash2, ArrowLeft, ExternalLink, Calendar, User } from 'lucide-react';

interface MockEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  token: string | null;
  type: string;
  createdAt: string;
}

export default function DevMailbox() {
  const router = useRouter();
  const [emails, setEmails] = useState<MockEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<MockEmail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/dev/mailbox');
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails);
        if (data.emails.length > 0 && !selectedEmail) {
          setSelectedEmail(data.emails[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching mailbox:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear the mock mailbox?')) return;
    try {
      const res = await fetch('/api/dev/mailbox', { method: 'DELETE' });
      if (res.ok) {
        setEmails([]);
        setSelectedEmail(null);
      }
    } catch (err) {
      console.error('Error clearing mailbox:', err);
    }
  };

  // Helper to extract links from email body text
  const findLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'hsl(var(--bg-primary-hsl))', fontFamily: 'var(--font-family)' }}>
      {/* HEADER */}
      <header className="glass-panel" style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.back()} className="btn btn-secondary" style={{ padding: '8px 12px' }}>
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'hsl(var(--success-hsl))' }}></div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Developer Mailbox</h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={fetchEmails} className="btn btn-secondary" style={{ padding: '10px 16px' }} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button onClick={handleClear} className="btn btn-danger" style={{ padding: '10px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Trash2 size={16} />
            <span>Clear All</span>
          </button>
        </div>
      </header>

      {/* WORKSPACE PANELS */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* LEFT COLUMN: LIST */}
        <div style={{ width: '400px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.1)' }}>
          {isLoading && emails.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--text-muted-hsl))' }}>
              Loading emails...
            </div>
          ) : emails.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center', gap: '12px' }}>
              <Mail size={48} style={{ color: 'hsl(var(--text-muted-hsl))', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary-hsl))' }}>No mock emails sent yet.</p>
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted-hsl))' }}>Trigger an action like registering an account or requesting a password reset to see emails here.</p>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {emails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                return (
                  <div 
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    style={{
                      padding: '16px 24px',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(104, 117, 245, 0.1)' : 'transparent',
                      borderLeft: isSelected ? '4px solid hsl(var(--primary-hsl))' : '4px solid transparent',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="status-badge" style={{ 
                        fontSize: '0.65rem',
                        backgroundColor: email.type === 'VERIFICATION' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(104, 117, 245, 0.15)',
                        color: email.type === 'VERIFICATION' ? 'hsl(var(--success-hsl))' : 'hsl(var(--primary-hsl))'
                      }}>
                        {email.type}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))' }}>
                        {new Date(email.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {email.subject}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary-hsl))', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      To: {email.to}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAIL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.15)' }}>
          {selectedEmail ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Envelope Info */}
              <div className="glass-panel" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '16px' }}>
                  {selectedEmail.subject}
                </h2>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--text-secondary-hsl))' }}>
                    <User size={16} />
                    <span><strong>To:</strong> {selectedEmail.to}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--text-secondary-hsl))' }}>
                    <Calendar size={16} />
                    <span><strong>Sent At:</strong> {new Date(selectedEmail.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Email Content Body */}
              <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div 
                  className="glass-panel" 
                  style={{ 
                    padding: '24px', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    whiteSpace: 'pre-wrap', 
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    color: 'hsl(var(--text-secondary-hsl))'
                  }}
                >
                  {selectedEmail.body}
                </div>

                {/* Extracted Interactive Actions (Extremely convenient!) */}
                {findLinks(selectedEmail.body).length > 0 && (
                  <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--success-hsl))' }}>
                      <ExternalLink size={16} />
                      <span>Developer Quick Actions</span>
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary-hsl))', marginBottom: '16px' }}>
                      Click the link below to verify the email address or reset the password directly on this platform.
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {findLinks(selectedEmail.body).map((link, idx) => (
                        <a 
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary"
                          style={{ alignSelf: 'flex-start', padding: '10px 20px', textDecoration: 'none' }}
                        >
                          <span>Execute Verification Flow</span>
                          <ExternalLink size={14} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--text-muted-hsl))', gap: '16px' }}>
              <Mail size={64} style={{ opacity: 0.3 }} />
              <span>Select an email from the left column to view details.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
