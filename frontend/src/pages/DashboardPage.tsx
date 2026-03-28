import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiUser, FiFileText, FiDollarSign, FiDatabase,
  FiCheckSquare, FiSettings, FiEdit3, FiAward, FiShield,
} from 'react-icons/fi';
import api from '../lib/api';

interface Counts {
  applications: number;
  pendingApplications: number;
  myPendingSteps: number;
}

const DashboardCard = ({
  to, icon, accentColor, title, description, badge, highlight
}: {
  to: string; icon: React.ReactNode; accentColor: string;
  title: string; description: string; badge?: number; highlight?: boolean;
}) => (
  <Link
    to={to}
    className="skeu-card"
    style={{
      padding: '1.75rem',
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      borderTop: highlight ? `3px solid ${accentColor}` : '3px solid transparent',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
      (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.transform = '';
      (e.currentTarget as HTMLElement).style.boxShadow = '';
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{
        width: '46px', height: '46px', borderRadius: '12px',
        background: `${accentColor}18`,
        color: accentColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${accentColor}28`,
      }}>
        {icon}
      </div>
      {typeof badge === 'number' && badge > 0 && (
        <span style={{
          background: 'var(--color-danger)', color: 'white',
          borderRadius: '9999px', padding: '0.15rem 0.5rem',
          fontSize: '0.72rem', fontWeight: 700,
        }}>
          {badge}
        </span>
      )}
    </div>
    <div>
      <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.3rem', color: 'var(--color-text-primary)', fontWeight: 700 }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
        {description}
      </p>
    </div>
  </Link>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState<Counts>({ applications: 0, pendingApplications: 0, myPendingSteps: 0 });

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const res = await api.get('/applications');
        const apps: any[] = res.data.data || [];
        const pending = apps.filter((a: any) => a.status === 'pending').length;
        const mySteps = apps.filter((a: any) =>
          a.approval_steps?.some((s: any) => s.approver_id === user?.id && s.status === 'pending')
        ).length;
        setCounts({ applications: apps.length, pendingApplications: pending, myPendingSteps: mySteps });
      } catch { /* silent */ }
    };
    if (user) loadCounts();
  }, [user]);

  if (!user) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  return (
    <div className="page">
      <section className="section" style={{ paddingTop: '2.5rem' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>

          {/* ── Hero Greeting ──────────────────────────────────────────── */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem',
          }}>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent)', marginBottom: '0.4rem' }}>
                {user.role.replace('_', ' ')}
              </p>
              <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--color-text-heading)', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
                {greeting}, {user.full_name.split(' ')[0]} 👋
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', margin: 0 }}>
                {user.role === 'student' && 'Manage your applications and academic profile.'}
                {user.role === 'teacher' && 'Review and sign pending applications assigned to you.'}
                {(user.role === 'admin' || user.role === 'super_admin') && 'Oversee all university applications and manage portal settings.'}
              </p>
            </div>

            {/* Admin shortcut button */}
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.75rem 1.5rem', borderRadius: '10px',
                  background: 'var(--color-accent)', color: 'white',
                  border: 'none', cursor: 'pointer', fontWeight: 700,
                  fontSize: '0.9rem', transition: 'opacity 0.2s',
                  boxShadow: 'var(--shadow-accent)',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <FiShield size={16} /> Admin Panel
              </button>
            )}
          </div>

          {/* ── STUDENT Dashboard ──────────────────────────────────────── */}
          {user.role === 'student' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '1.25rem' }}>
              <DashboardCard
                to="/applications?mode=submit"
                icon={<FiEdit3 size={22} />}
                accentColor="#7c3aed"
                title="New Application"
                description="Submit a leave request, event permission, financial aid or any official request."
                highlight
              />
              <DashboardCard
                to="/applications"
                icon={<FiFileText size={22} />}
                accentColor="#059669"
                title="My Applications"
                description="Track all your submissions and download signed copies."
                badge={counts.applications}
              />
              <DashboardCard
                to="/profile"
                icon={<FiUser size={22} />}
                accentColor="#2563eb"
                title="My Profile"
                description="Manage your personal information, skills, and academic portfolio."
              />
              <DashboardCard
                to="/finance"
                icon={<FiDollarSign size={22} />}
                accentColor="#0891b2"
                title="Finance & Fees"
                description="View fee structures, bank statements, and financial cost requests."
              />
              <DashboardCard
                to="/important-data"
                icon={<FiDatabase size={22} />}
                accentColor="#9333ea"
                title="Important Data"
                description="Access syllabus, academic calendar, and downloadable resources."
              />
              <DashboardCard
                to="/work-assignments"
                icon={<FiCheckSquare size={22} />}
                accentColor="#dc2626"
                title="Assignments"
                description="Track your academic tasks, projects, and class assignments."
              />
            </div>
          )}

          {/* ── TEACHER Dashboard ──────────────────────────────────────── */}
          {user.role === 'teacher' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '1.25rem' }}>
              <DashboardCard
                to="/applications"
                icon={<FiFileText size={22} />}
                accentColor="#d97706"
                title="Pending Signatures"
                description="Review and digitally sign applications waiting for your approval."
                badge={counts.myPendingSteps}
                highlight={counts.myPendingSteps > 0}
              />
              <DashboardCard
                to="/applications?mode=settings"
                icon={<FiEdit3 size={22} />}
                accentColor="#7c3aed"
                title="Signature & Seal"
                description="Upload your digital signature and department seal for PDF stamping."
              />
              <DashboardCard
                to="/profile"
                icon={<FiUser size={22} />}
                accentColor="#2563eb"
                title="My Profile"
                description="Keep your designation and contact information up to date."
              />
              <DashboardCard
                to="/students"
                icon={<FiAward size={22} />}
                accentColor="#059669"
                title="Student Directory"
                description="Browse student profiles, portfolios, and academic records."
              />
              <DashboardCard
                to="/finance"
                icon={<FiDollarSign size={22} />}
                accentColor="#0891b2"
                title="Finance"
                description="View fiscal year overviews, cost requests, and bank statements."
              />
            </div>
          )}

          {/* ── ADMIN Dashboard ────────────────────────────────────────── */}
          {isAdmin && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '1.25rem' }}>
              <DashboardCard
                to="/applications"
                icon={<FiFileText size={22} />}
                accentColor="#d97706"
                title="Application Inbox"
                description="Review incoming applications and assign approval chains."
                badge={counts.pendingApplications}
                highlight={counts.pendingApplications > 0}
              />
              <DashboardCard
                to="/admin"
                icon={<FiSettings size={22} />}
                accentColor="var(--color-accent)"
                title="Admin Control Panel"
                description="Manage users, notices, events, permissions, and portal settings."
                highlight
              />
              <DashboardCard
                to="/finance"
                icon={<FiDollarSign size={22} />}
                accentColor="#0891b2"
                title="Finance & Accounts"
                description="Manage fiscal years, bank statements, cost requests, and approvals."
              />
              <DashboardCard
                to="/students"
                icon={<FiUser size={22} />}
                accentColor="#059669"
                title="Student Directory"
                description="Browse all student profiles and manage academic records."
              />
              <DashboardCard
                to="/important-data"
                icon={<FiDatabase size={22} />}
                accentColor="#9333ea"
                title="Important Data"
                description="Manage syllabus files, academic calendar, and department resources."
              />
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
