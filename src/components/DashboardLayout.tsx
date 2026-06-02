'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { 
  LayoutDashboard, 
  Users, 
  GitBranch, 
  Send, 
  BarChart3, 
  Settings as SettingsIcon, 
  User as UserIcon, 
  Bell, 
  LogOut, 
  Menu,
  Sun,
  Moon,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import styles from '@/app/layout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: {
    name: string;
  };
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // 1. Fetch user profile, settings, and notifications
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch profile
        const profileRes = await fetch('/api/profile');
        if (profileRes.ok) {
          const data = await profileRes.json();
          setUser(data.profile);
        } else {
          router.push('/login');
          return;
        }

        // Fetch settings (for theme)
        const settingsRes = await fetch('/api/settings');
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          const activeTheme = data.settings?.theme || 'dark';
          setTheme(activeTheme);
          document.documentElement.setAttribute('data-theme', activeTheme);
        }

        // Fetch notifications
        fetchNotifications();
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    }
    fetchData();
  }, [router]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        const unread = data.notifications.filter((n: any) => !n.readStatus).length;
        setUnreadNotifications(unread);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  // 2. Navigation items definition
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Pipeline', path: '/pipeline', icon: GitBranch },
    { name: 'Campaigns', path: '/campaigns', icon: Send },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: UserIcon },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  // 3. Breadcrumbs calculation
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');
      const isLast = index === segments.length - 1;
      const formattedName = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      return (
        <React.Fragment key={path}>
          {index > 0 && <span className={styles.breadcrumbSeparator}>/</span>}
          {isLast ? (
            <span className={styles.breadcrumbActive}>{formattedName}</span>
          ) : (
            <Link href={path}>{formattedName}</Link>
          )}
        </React.Fragment>
      );
    });
  };

  // 4. Toggle theme (Light / Dark)
  const toggleTheme = async () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);

    // Save preference to database
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: nextTheme }),
      });
    } catch (err) {
      console.error('Error saving theme settings:', err);
    }
  };

  // 5. Logout handler
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
      }
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  // 6. Notifications read toggles
  const markNotificationRead = async (id: string) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Error marking all notifications read:', err);
    }
  };

  // Helper for user initials
  const getUserInitials = () => {
    if (!user) return 'LP';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className={styles.wrapper}>
      {/* SIDEBAR NAVIGATION */}
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.sidebarBrand}>
          <Logo size={32} />
          <span className={`${styles.brandName} ${isCollapsed ? styles.brandNameHidden : ''}`}>
            LeadPulse
          </span>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <Link 
                href={item.path} 
                key={item.path}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <Icon size={20} />
                <span className={`${styles.navLabel} ${isCollapsed ? styles.navLabelHidden : ''}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>
              {getUserInitials()}
            </div>
            {!isCollapsed && user && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.firstName} {user.lastName}</span>
                <span className={styles.userRole}>{user.role?.name}</span>
              </div>
            )}
          </div>
          
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 12px', justifyContent: isCollapsed ? 'center' : 'flex-start', width: '100%' }}>
            <LogOut size={18} />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE AREA */}
      <div className={`${styles.main} ${isCollapsed ? styles.mainCollapsed : ''}`}>
        {/* HEADER BAR */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className={styles.collapseButton}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <div className={styles.breadcrumbs}>
              {getBreadcrumbs()}
            </div>
          </div>

          <div className={styles.headerRight}>
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className={styles.actionButton}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification Bell Icon */}
            <div style={{ position: 'relative' }}>
              <button 
                className={styles.actionButton} 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  if (!isNotificationsOpen) fetchNotifications();
                }}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadNotifications > 0 && (
                  <span className={styles.badge}>{unreadNotifications}</span>
                )}
              </button>

              {/* Notification Dropdown panel */}
              {isNotificationsOpen && (
                <div 
                  className="glass-panel" 
                  style={{
                    position: 'absolute',
                    top: '50px',
                    right: '0',
                    width: '320px',
                    maxHeight: '400px',
                    borderRadius: 'var(--radius-md)',
                    overflowY: 'auto',
                    zIndex: '150',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Notifications</span>
                    {unreadNotifications > 0 && (
                      <button 
                        onClick={markAllNotificationsRead} 
                        style={{ background: 'none', border: 'none', color: 'hsl(var(--primary-hsl))', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: 'hsl(var(--text-muted-hsl))', fontSize: '0.85rem' }}>
                      No notifications yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => !notif.readStatus && markNotificationRead(notif.id)}
                          style={{
                            padding: '10px',
                            borderRadius: 'var(--radius-sm)',
                            background: notif.readStatus ? 'transparent' : 'rgba(104, 117, 245, 0.08)',
                            border: '1px solid',
                            borderColor: notif.readStatus ? 'transparent' : 'rgba(104, 117, 245, 0.15)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '600', fontSize: '0.8rem', color: notif.readStatus ? 'hsl(var(--text-primary-hsl))' : 'hsl(var(--primary-hsl))' }}>
                              {notif.title}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted-hsl))' }}>
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary-hsl))', margin: 0, lineHeight: '1.3' }}>
                            {notif.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className={styles.content}>
          {children}
        </main>
      </div>

      {/* FLOATING DEVELOPER MAILBOX ACCESS */}
      <div className={styles.mailDebugger}>
        <button 
          onClick={() => router.push('/dev/mailbox')} 
          className={styles.mailBadge}
          title="Open local Developer Mailbox to verify registration/passwords"
        >
          <Mail size={16} />
          <span>Developer Mailbox</span>
        </button>
      </div>
    </div>
  );
}
