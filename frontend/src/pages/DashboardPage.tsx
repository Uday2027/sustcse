import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiUser, FiFileText, FiDollarSign, FiDatabase,
  FiCheckSquare, FiSettings, FiEdit3, FiAward,
} from 'react-icons/fi';
import api from '../lib/api';

interface Counts {
  applications: number;
  pendingApplications: number;
  myPendingSteps: number;
}

const DashboardCard = ({
  to, icon, iconBg, iconColor, title, description, badge, highlight
}: {
  to: string; icon: React.ReactNode; iconBg: string; iconColor: string;
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
      border: highlight ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      {typeof badge === 'number' && badge > 0 && (
        <span style={{ background: '#ef4444', color: 'white', borderRadius: '9999px', padding: '0.2rem 0.55rem', fontSize: '0.75rem', fontWeight: 700 }}>
          {badge}
        </span>
      )}
    </div>
    <div>
      <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.35rem', color: 'var(--text-primary)', fontWeight: 700 }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>{description}</p>
    </div>
  </Link>
);

export default function DashboardPage() {
  const { user } = useAuth();
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

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page" style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--color-bg, #F8FAFC)' }}>
      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Greeting */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 className="skeu-heading skeu-heading--lg" style={{ marginBottom: '0.4rem' }}>
              {greeting}, {user.full_name.split(' ')[0]} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              {user.role === 'student' && 'Manage your applications and academic profile.'}
              {user.role === 'teacher' && 'Review and sign pending applications assigned to you.'}
              {user.role === 'admin' && 'Oversee all university applications and manage portal settings.'}
            </p>
          </div>

          {/* ── STUDENT Dashboard ─────────────────────────── */}
          {user.role === 'student' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' }}>
              <DashboardCard
                to="/applications?mode=submit"
                icon={<FiEdit3 size={22} />}
                iconBg="#ede9fe" iconColor="#7c3aed"
                title="New Application"
                description="Submit a leave request, event permission, financial aid or any official request."
                highlight
              />
              <DashboardCard
                to="/applications"
                icon={<FiFileText size={22} />}
                iconBg="#dcfce7" iconColor="#16a34a"
                title="My Applications"
                description="Track the status of all your submissions and download signed copies."
                badge={counts.applications}
              />
              <DashboardCard
                to="/profile"
                icon={<FiUser size={22} />}
                iconBg="#e0e7ff" iconColor="#4338ca"
                title="My Profile"
                description="Manage your personal information, skills, and academic portfolio."
              />
              <DashboardCard
                to="/finance"
                icon={<FiDollarSign size={22} />}
                iconBg="#e0f2fe" iconColor="#0284c7"
                title="Finance & Fees"
                description="View your fee structure, payment history, and financial notices."
              />
              <DashboardCard
                to="/important-data"
                icon={<FiDatabase size={22} />}
                iconBg="#f3e8ff" iconColor="#9333ea"
                title="Important Data"
                description="Access syllabus, academic calendar, and downloadable resources."
              />
              <DashboardCard
                to="/work-assignments"
                icon={<FiCheckSquare size={22} />}
                iconBg="#fee2e2" iconColor="#dc2626"
                title="Assignments"
                description="Track your academic tasks, projects, and class assignments."
              />
            </div>
          )}

          {/* ── TEACHER Dashboard ──────────────────────────── */}
          {user.role === 'teacher' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' }}>
              <DashboardCard
                to="/applications"
                icon={<FiFileText size={22} />}
                iconBg="#fef3c7" iconColor="#d97706"
                title="Pending Signatures"
                description="Review and digitally sign applications that are waiting for your approval."
                badge={counts.myPendingSteps}
                highlight={counts.myPendingSteps > 0}
              />
              <DashboardCard
                to="/applications?mode=settings"
                icon={<FiEdit3 size={22} />}
                iconBg="#ede9fe" iconColor="#7c3aed"
                title="Signature & Seal Setup"
                description="Upload or draw your digital signature and department seal for PDF stamping."
              />
              <DashboardCard
                to="/profile"
                icon={<FiUser size={22} />}
                iconBg="#e0e7ff" iconColor="#4338ca"
                title="My Profile"
                description="Keep your designation and contact information up to date."
              />
              <DashboardCard
                to="/students"
                icon={<FiAward size={22} />}
                iconBg="#dcfce7" iconColor="#16a34a"
                title="Student Directory"
                description="Browse student profiles, portfolios, and academic records."
              />
            </div>
          )}

          {/* ── ADMIN Dashboard ────────────────────────────── */}
          {(user.role === 'admin' || user.role === 'super_admin') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' }}>
              <DashboardCard
                to="/applications"
                icon={<FiFileText size={22} />}
                iconBg="#fef3c7" iconColor="#d97706"
                title="Application Inbox"
                description="Review incoming applications and assign approval chains to department heads."
                badge={counts.pendingApplications}
                highlight={counts.pendingApplications > 0}
              />
              <DashboardCard
                to="/admin"
                icon={<FiSettings size={22} />}
                iconBg="#e0e7ff" iconColor="#4338ca"
                title="Admin Control Panel"
                description="Manage users, notices, events, permissions, and portal settings."
                highlight
              />
              <DashboardCard
                to="/students"
                icon={<FiUser size={22} />}
                iconBg="#dcfce7" iconColor="#16a34a"
                title="Student Directory"
                description="Browse all student profiles and manage academic records."
              />
              <DashboardCard
                to="/finance"
                icon={<FiDollarSign size={22} />}
                iconBg="#e0f2fe" iconColor="#0284c7"
                title="Finance & Accounts"
                description="Manage fiscal years, fee structures, and payment records."
              />
              <DashboardCard
                to="/important-data"
                icon={<FiDatabase size={22} />}
                iconBg="#f3e8ff" iconColor="#9333ea"
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
