import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiChevronDown, FiUser, FiSettings, FiLogOut, FiLayout } from 'react-icons/fi';
import gsap from 'gsap';

const publicLinks = [
  { path: '/', label: 'Home' },
  { path: '/notices', label: 'Notices' },
  { path: '/events', label: 'Events' },
  { path: '/achievements', label: 'Achievements' },
  { path: '/faculty', label: 'Faculty' },
  {
    path: '/academic',
    label: 'Academic',
    subLinks: [
      { path: '/program', label: 'Program' },
      { path: '/academic', label: 'Admission' },
      { path: '/tuition-fees', label: 'Average Annual Tuition Fees' },
      { path: '/statistics', label: 'Statistics (Jan 2024 - Dec 2024)' },
      { path: '/degrees-awarded', label: 'Degrees Awarded' }
    ]
  },
  { path: '/alumni', label: 'Alumni' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, { height: scrolled ? 60 : 80, duration: 0.3, ease: 'power2.out' });
    }
  }, [scrolled]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  // Build initials from full name
  const getInitials = (name: string) =>
    name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return (
    <nav ref={navRef} className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-text">CSE</span>
          <span className="navbar__brand-sub">SUST</span>
        </Link>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          {publicLinks.map((link) => {
            if (link.subLinks) {
              return (
                <div key={link.label} className="navbar__user-menu" style={{ marginLeft: 0 }}>
                  <div className={`navbar__link ${location.pathname.startsWith(link.path) || link.subLinks.some(s => location.pathname === s.path) ? 'navbar__link--active' : ''}`}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', border: 'none', background: 'transparent', padding: '0.5rem' }}>
                    {link.label} <FiChevronDown style={{ marginTop: '2px', opacity: 0.7 }} />
                  </div>
                  <div className="navbar__dropdown">
                    {link.subLinks.map((subLink) => (
                      <Link key={subLink.path} to={subLink.path} className="navbar__dropdown-item" onClick={() => setMobileOpen(false)}>
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <Link key={link.path} to={link.path}
                className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
                onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            );
          })}

          {user ? (
            <div className="navbar__user-menu">
              {/* User Icon — clicking navigates to /dashboard */}
              <button
                className="navbar__user-icon-btn"
                onClick={() => navigate('/dashboard')}
                title={`${user.full_name} — Go to Dashboard`}
              >
                {(user as any).avatar_url ? (
                  <img src={(user as any).avatar_url} alt={user.full_name} className="navbar__user-avatar" />
                ) : (
                  <span className="navbar__user-initials">{getInitials(user.full_name)}</span>
                )}
              </button>

              {/* Hover Dropdown */}
              <div className="navbar__dropdown navbar__dropdown--user">
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>{user.full_name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '2px 0 0', textTransform: 'capitalize' }}>{user.role}</p>
                </div>

                <Link to="/dashboard" className="navbar__dropdown-item">
                  <FiLayout size={13} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Dashboard
                </Link>
                <Link to="/profile" className="navbar__dropdown-item">
                  <FiUser size={13} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Profile
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="navbar__dropdown-item" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                    <FiSettings size={13} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Admin Panel
                  </Link>
                )}
                <button onClick={logout} className="navbar__dropdown-item navbar__dropdown-item--logout">
                  <FiLogOut size={13} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="navbar__link navbar__link--login">Login</Link>
          )}
        </div>

        <button className="navbar__mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </nav>
  );
}
