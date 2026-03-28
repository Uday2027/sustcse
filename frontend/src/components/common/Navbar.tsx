import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiUser, FiSettings, FiLogOut, FiLayout, FiChevronDown } from 'react-icons/fi';
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
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
                  <div
                    className={`navbar__link ${location.pathname.startsWith(link.path) || link.subLinks.some(s => location.pathname === s.path) ? 'navbar__link--active' : ''}`}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', border: 'none', background: 'transparent', padding: '0.5rem' }}
                  >
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
              <Link
                key={link.path} to={link.path}
                className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          {user ? (
            <div className="navbar__user-menu" ref={userMenuRef}>
              {/* User Icon — click toggles dropdown */}
              <button
                className="navbar__user-icon-btn"
                onClick={() => setUserMenuOpen(prev => !prev)}
                title={user.full_name}
                aria-expanded={userMenuOpen}
              >
                {(user as any).avatar_url ? (
                  <img src={(user as any).avatar_url} alt={user.full_name} className="navbar__user-avatar" />
                ) : (
                  <span className="navbar__user-initials">{getInitials(user.full_name)}</span>
                )}
              </button>

              {/* Click-based dropdown */}
              {userMenuOpen && (
                <div className="navbar__dropdown navbar__dropdown--user navbar__dropdown--open">
                  <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>{user.full_name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '2px 0 0', textTransform: 'capitalize' }}>{user.role.replace('_', ' ')}</p>
                  </div>

                  <Link to="/dashboard" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FiLayout size={13} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Dashboard
                  </Link>
                  <Link to="/profile" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FiUser size={13} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="navbar__dropdown-item"
                      style={{ color: 'var(--color-accent)', fontWeight: 600 }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiSettings size={13} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="navbar__dropdown-item navbar__dropdown-item--logout"
                  >
                    <FiLogOut size={13} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Logout
                  </button>
                </div>
              )}
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
