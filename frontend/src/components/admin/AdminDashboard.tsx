import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiClock, FiMail, FiAlertCircle } from 'react-icons/fi';
import api from '../../lib/api';

interface DashboardStats {
  totalUsers: number;
  pendingApprovals: number;
  totalEmailsSent: number;
  failedEmails: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0, pendingApprovals: 0, totalEmailsSent: 0, failedEmails: 0,
  });

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchStats = async () => {
      try {
        const [usersRes, pendingRes, emailsRes] = await Promise.all([
          api.get('/users?limit=1'),
          api.get('/users?approval_status=pending&limit=1'),
          api.get('/admin/email-logs?limit=1'),
        ]);
        setStats({
          totalUsers: usersRes.data.pagination?.total || 0,
          pendingApprovals: pendingRes.data.pagination?.total || 0,
          totalEmailsSent: emailsRes.data.pagination?.total || 0,
          failedEmails: 0,
        });
      } catch {
        // Stats will remain at 0
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'var(--color-info)', link: '/admin/users' },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: FiClock, color: 'var(--color-warning)', link: '/admin/users?status=pending' },
    { label: 'Emails Sent', value: stats.totalEmailsSent, icon: FiMail, color: 'var(--color-success)', link: '/admin/email-logs' },
    { label: 'Failed Emails', value: stats.failedEmails, icon: FiAlertCircle, color: 'var(--color-danger)', link: '/admin/email-logs?status=failed' },
  ];

  return (
    <div>
      <div className="admin-content__header">
        <h1>Dashboard</h1>
      </div>

      <div className="grid grid--4" style={{ marginBottom: '2rem' }}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} to={card.link} className="skeu-card" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: `${card.color}20`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: card.color,
                }}>
                  <Icon size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: card.color, fontFamily: 'var(--font-primary)' }}>
                    {card.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {card.label}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="skeu-panel">
        <h3 className="skeu-heading skeu-heading--sm" style={{ marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/users?status=pending" className="skeu-btn skeu-btn--primary">Review Pending Users</Link>
          <Link to="/admin/applications" className="skeu-btn skeu-btn--primary">Application Inbox</Link>
          <Link to="/admin/finance" className="skeu-btn">Finance Dashboard</Link>
          <Link to="/admin/send-email" className="skeu-btn">Send Email</Link>
          <Link to="/admin/sessions" className="skeu-btn">Manage Sessions</Link>
          <Link to="/admin/permissions" className="skeu-btn">Manage Permissions</Link>
        </div>
      </div>
    </div>
  );
}
