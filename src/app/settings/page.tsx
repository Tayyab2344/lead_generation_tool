'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Settings as SettingsIcon, 
  Bell, 
  ShieldCheck, 
  Eye, 
  Globe, 
  Trash2, 
  Clock, 
  Laptop, 
  MonitorCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface SettingsData {
  language: string;
  timeZone: string;
  dateFormat: string;
  theme: string;
  emailNotifications: boolean;
  systemNotifications: boolean;
  campaignAlerts: boolean;
  leadAlerts: boolean;
  dataSharing: boolean;
  accountVisibility: string;
  communicationPreferences: string;
}

interface ActiveSession {
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  loginTime: string;
  expirationTime: string;
  status: string;
  isCurrent: boolean;
}

interface LoginHistoryItem {
  id: string;
  ipAddress: string;
  deviceInfo: string;
  timestamp: string;
  status: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [history, setHistory] = useState<LoginHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'privacy'>('general');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const settingsRes = await fetch('/api/settings');
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettings(data.settings);
        }

        const sessionsRes = await fetch('/api/settings/sessions');
        if (sessionsRes.ok) {
          const data = await sessionsRes.json();
          setSessions(data.activeSessions);
          setHistory(data.loginHistory);
        }
      } catch (err) {
        console.error('Error fetching settings/sessions:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const refreshSessions = async () => {
    try {
      const res = await fetch('/api/settings/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.activeSessions);
        setHistory(data.loginHistory);
      }
    } catch (err) {
      console.error('Error refreshing sessions:', err);
    }
  };

  const handleToggle = (key: keyof SettingsData) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const saveSettings = async (updatedSettings: SettingsData) => {
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save settings.');
      }

      setSuccessMessage('Settings saved successfully!');
      
      // Update data-theme if theme changed
      document.documentElement.setAttribute('data-theme', updatedSettings.theme);
      
      // Clear message after 3s
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings) saveSettings(settings);
  };

  const handleThemeToggle = (themeChoice: string) => {
    if (!settings) return;
    const nextSettings = { ...settings, theme: themeChoice };
    setSettings(nextSettings);
    saveSettings(nextSettings);
  };

  const handleRevokeSession = async (id: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/settings/sessions?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to revoke session.');
      }

      setSuccessMessage('Session terminated successfully.');
      refreshSessions();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong.');
    }
  };

  const tabs = [
    { id: 'general', name: 'General Preferences', icon: Globe },
    { id: 'notifications', name: 'Notifications Alerts', icon: Bell },
    { id: 'security', name: 'Active Sessions & Logs', icon: ShieldCheck },
    { id: 'privacy', name: 'Data Visibility & Privacy', icon: Eye },
  ];

  return (
    <DashboardLayout>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0', color: 'hsl(var(--text-secondary-hsl))' }}>
          Loading settings panel...
        </div>
      ) : (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: 'var(--font-family)', paddingBottom: '40px' }}>
          
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.03em' }}>System Settings</h1>
            <p style={{ color: 'hsl(var(--text-secondary-hsl))', fontSize: '0.95rem', margin: 0 }}>
              Adjust application settings, customize notification guidelines, audit sessions, and control data settings.
            </p>
          </div>

          {/* NOTIFICATION FEEDBACKS */}
          {successMessage && (
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px 16px', color: 'hsl(var(--success-hsl))', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 16px', color: 'hsl(var(--danger-hsl))', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              {errorMessage}
            </div>
          )}

          {/* TAB WRAPPER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* TAB SELECTOR LIST */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-color)',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      background: isActive ? 'rgba(255,255,255,0.03)' : 'none',
                      border: 'none',
                      borderBottom: isActive ? '2px solid hsl(var(--primary-hsl))' : '2px solid transparent',
                      color: isActive ? 'hsl(var(--text-primary-hsl))' : 'hsl(var(--text-secondary-hsl))',
                      fontWeight: isActive ? '600' : '500',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Icon size={16} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT CARDS */}
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}>
              
              {/* 1. GENERAL TAB */}
              {activeTab === 'general' && settings && (
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '6px' }}>General Preferences</h3>
                    <p style={{ color: 'hsl(var(--text-muted-hsl))', fontSize: '0.82rem', margin: 0 }}>Configure base runtime values and aesthetic preferences.</p>
                  </div>

                  {/* THEME CARD */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Color Theme Mode</label>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleThemeToggle('dark')}
                        style={{
                          flex: 1,
                          padding: '16px',
                          borderRadius: 'var(--radius-md)',
                          background: settings.theme === 'dark' ? 'rgba(104, 117, 245, 0.1)' : 'rgba(0,0,0,0.1)',
                          border: '2px solid',
                          borderColor: settings.theme === 'dark' ? 'hsl(var(--primary-hsl))' : 'var(--border-color)',
                          color: 'hsl(var(--text-primary-hsl))',
                          cursor: 'pointer',
                          fontWeight: '600',
                          textAlign: 'center',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        🌙 Dark Space Theme
                      </button>
                      <button
                        type="button"
                        onClick={() => handleThemeToggle('light')}
                        style={{
                          flex: 1,
                          padding: '16px',
                          borderRadius: 'var(--radius-md)',
                          background: settings.theme === 'light' ? 'rgba(90, 75, 218, 0.08)' : 'rgba(0,0,0,0.1)',
                          border: '2px solid',
                          borderColor: settings.theme === 'light' ? 'hsl(var(--primary-hsl))' : 'var(--border-color)',
                          color: 'hsl(var(--text-primary-hsl))',
                          cursor: 'pointer',
                          fontWeight: '600',
                          textAlign: 'center',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        ☀️ Bright Clean Theme
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">System Language</label>
                      <select
                        name="language"
                        value={settings.language}
                        onChange={handleSelectChange}
                        className="form-input"
                      >
                        <option value="en" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>English (US)</option>
                        <option value="es" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>Español</option>
                        <option value="fr" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>Français</option>
                        <option value="de" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>Deutsch</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date Format</label>
                      <select
                        name="dateFormat"
                        value={settings.dateFormat}
                        onChange={handleSelectChange}
                        className="form-input"
                      >
                        <option value="YYYY-MM-DD" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>YYYY-MM-DD</option>
                        <option value="DD-MM-YYYY" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>DD-MM-YYYY</option>
                        <option value="MM-DD-YYYY" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>MM-DD-YYYY</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Default Timezone</label>
                      <select
                        name="timeZone"
                        value={settings.timeZone}
                        onChange={handleSelectChange}
                        className="form-input"
                      >
                        <option value="UTC" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>UTC (GMT+0)</option>
                        <option value="EST" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>EST (New York, GMT-5)</option>
                        <option value="PST" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>PST (Los Angeles, GMT-8)</option>
                        <option value="CET" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>CET (Paris, GMT+1)</option>
                        <option value="PKT" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>PKT (Karachi, GMT+5)</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', padding: '12px 24px' }} disabled={saving}>
                    {saving ? 'Saving...' : 'Save General Prefs'}
                  </button>
                </form>
              )}

              {/* 2. NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && settings && (
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '6px' }}>Notification Alerts</h3>
                    <p style={{ color: 'hsl(var(--text-muted-hsl))', fontSize: '0.82rem', margin: 0 }}>Configure guidelines on when the system triggers updates.</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { key: 'emailNotifications', name: 'Email Notifications', desc: 'Receive automated platform reports & messages directly to your inbox.' },
                      { key: 'systemNotifications', name: 'System Notifications', desc: 'Trigger in-app notification dropdown bubbles on key tasks.' },
                      { key: 'campaignAlerts', name: 'Campaign Execution Alerts', desc: 'Notify regarding campaign launches, delivery caps, or completions.' },
                      { key: 'leadAlerts', name: 'Lead Inbound Warnings', desc: 'Trigger urgent alerts when new client records match acquisition targets.' }
                    ].map(toggleItem => (
                      <div
                        key={toggleItem.key}
                        onClick={() => handleToggle(toggleItem.key as any)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px 20px',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid var(--border-color)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '16px' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: '600' }}>{toggleItem.name}</span>
                          <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted-hsl))' }}>{toggleItem.desc}</span>
                        </div>
                        <div>
                          {settings[toggleItem.key as keyof SettingsData] ? (
                            <ToggleRight size={38} style={{ color: 'hsl(var(--primary-hsl))' }} />
                          ) : (
                            <ToggleLeft size={38} style={{ color: 'hsl(var(--text-muted-hsl))' }} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', padding: '12px 24px' }} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Notification Prefs'}
                  </button>
                </form>
              )}

              {/* 3. SECURITY & SESSIONS TAB */}
              {activeTab === 'security' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  
                  {/* ACTIVE DEVICES */}
                  <div>
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '6px' }}>Active Browser & Device Sessions</h3>
                      <p style={{ color: 'hsl(var(--text-muted-hsl))', fontSize: '0.82rem', margin: 0 }}>
                        Currently authenticated sessions holding access to this account. You can remotely revoke any other device session.
                      </p>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'hsl(var(--text-muted-hsl))', fontWeight: '600' }}>
                            <th style={{ padding: '12px 16px' }}>Device / Browser Details</th>
                            <th style={{ padding: '12px 16px' }}>IP Address</th>
                            <th style={{ padding: '12px 16px' }}>Login Time</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions.map(session => (
                            <tr key={session.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                              <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Laptop size={18} style={{ color: session.isCurrent ? 'hsl(var(--success-hsl))' : 'hsl(var(--text-muted-hsl))' }} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: '600' }}>{session.deviceInfo}</span>
                                  {session.isCurrent && (
                                    <span style={{ fontSize: '0.7rem', color: 'hsl(var(--success-hsl))', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                      Active Current Session
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td style={{ padding: '16px', fontFamily: 'monospace', color: 'hsl(var(--text-secondary-hsl))' }}>
                                {session.ipAddress}
                              </td>
                              <td style={{ padding: '16px', color: 'hsl(var(--text-secondary-hsl))' }}>
                                {new Date(session.loginTime).toLocaleString()}
                              </td>
                              <td style={{ padding: '16px', textAlign: 'right' }}>
                                {session.isCurrent ? (
                                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted-hsl))', fontStyle: 'italic' }}>Protected</span>
                                ) : (
                                  <button
                                    onClick={() => handleRevokeSession(session.id)}
                                    className="btn btn-danger"
                                    style={{
                                      padding: '6px 12px',
                                      fontSize: '0.78rem',
                                      borderRadius: 'var(--radius-sm)',
                                      display: 'inline-flex',
                                      gap: '4px'
                                    }}
                                    title="Revoke session remotely"
                                  >
                                    <Trash2 size={12} />
                                    <span>Revoke</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* AUDIT LOGS HISTORY */}
                  <div>
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '6px' }}>Account Access Logs</h3>
                      <p style={{ color: 'hsl(var(--text-muted-hsl))', fontSize: '0.82rem', margin: 0 }}>
                        Audit trail showing success/failure metrics of last login operations.
                      </p>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'hsl(var(--text-muted-hsl))', fontWeight: '600' }}>
                            <th style={{ padding: '12px 16px' }}>Status</th>
                            <th style={{ padding: '12px 16px' }}>Device Details</th>
                            <th style={{ padding: '12px 16px' }}>IP Address</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right' }}>Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.map(log => {
                            const isSuccess = log.status === 'SUCCESS';
                            return (
                              <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', opacity: isSuccess ? 1 : 0.75 }}>
                                <td style={{ padding: '16px' }}>
                                  <span 
                                    className="status-badge"
                                    style={{
                                      backgroundColor: isSuccess ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                      color: isSuccess ? 'hsl(var(--success-hsl))' : 'hsl(var(--danger-hsl))',
                                      border: isSuccess ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)',
                                      fontSize: '0.7rem'
                                    }}
                                  >
                                    {log.status}
                                  </span>
                                </td>
                                <td style={{ padding: '16px', color: 'hsl(var(--text-secondary-hsl))' }}>
                                  {log.deviceInfo}
                                </td>
                                <td style={{ padding: '16px', fontFamily: 'monospace', color: 'hsl(var(--text-secondary-hsl))' }}>
                                  {log.ipAddress}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right', color: 'hsl(var(--text-muted-hsl))' }}>
                                  {new Date(log.timestamp).toLocaleString()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* 4. PRIVACY TAB */}
              {activeTab === 'privacy' && settings && (
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '6px' }}>Data Visibility & Privacy</h3>
                    <p style={{ color: 'hsl(var(--text-muted-hsl))', fontSize: '0.82rem', margin: 0 }}>Configure metadata sharing regulations and profile visibility.</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Account Visibility Status</label>
                    <select
                      name="accountVisibility"
                      value={settings.accountVisibility}
                      onChange={handleSelectChange}
                      className="form-input"
                      style={{ maxWidth: '360px' }}
                    >
                      <option value="private" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>🔒 Private (Only authorized colleagues view records)</option>
                      <option value="public" style={{ background: 'hsl(var(--bg-tertiary-hsl))' }}>🌐 Public (Available for search indexing)</option>
                    </select>
                  </div>

                  <div
                    onClick={() => handleToggle('dataSharing')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      maxWidth: '640px'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '16px' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: '600' }}>Platform Diagnostics Sharing</span>
                      <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted-hsl))' }}>
                        Share anonymous campaign delivery data to help improve LeadPulse analytics algorithms.
                      </span>
                    </div>
                    <div>
                      {settings.dataSharing ? (
                        <ToggleRight size={38} style={{ color: 'hsl(var(--primary-hsl))' }} />
                      ) : (
                        <ToggleLeft size={38} style={{ color: 'hsl(var(--text-muted-hsl))' }} />
                      )}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', padding: '12px 24px' }} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Privacy Prefs'}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
}
