import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome, FiUsers, FiMail, FiSend, FiCalendar,
  FiShield, FiFileText, FiDollarSign, FiClipboard
} from 'react-icons/fi';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: FiHome, exact: true },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/permissions', label: 'Permissions', icon: FiShield },
  { to: '/admin/sessions', label: 'Sessions', icon: FiCalendar },
  { to: '/admin/email-logs', label: 'Email Logs', icon: FiFileText },
  { to: '/admin/send-email', label: 'Send Email', icon: FiSend },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar__title">Admin Panel</h2>
        <nav className="admin-sidebar__nav">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`admin-sidebar__link ${isActive(link.to, link.exact) ? 'admin-sidebar__link--active' : ''}`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
