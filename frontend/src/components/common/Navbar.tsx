import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
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
  { path: '/society', label: 'Society' },
];

const authLinks = [
  { path: '/students', label: 'Students' },
  { path: '/finance', label: 'Finance' },
  { path: '/important-data', label: 'Data' },
  { path: '/work-assignments', label: 'Tasks' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
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
      gsap.to(navRef.current, {
        height: scrolled ? 60 : 80,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [scrolled]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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
                  <div className={`navbar__link ${location.pathname.startsWith(link.path) || link.subLinks.some(s => location.pathname === s.path) ? 'navbar__link--active' : ''}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', border: 'none', background: 'transparent', padding: '0.5rem' }}>
                    {link.label} <FiChevronDown style={{ marginTop: '2px', opacity: 0.7 }} />
                  </div>
                  <div className="navbar__dropdown">
                    {link.subLinks.map((subLink) => (
                      <Link
                        key={subLink.path}
                        to={subLink.path}
                        className="navbar__dropdown-item"
                        onClick={() => setMobileOpen(false)}
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          {user && authLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <div className="navbar__user-menu">
              <button className="navbar__user-btn">
                {user.full_name.split(' ')[0]} <FiChevronDown />
              </button>
              <div className="navbar__dropdown">
                <Link to="/profile" className="navbar__dropdown-item">Profile</Link>
                {(user.role === 'admin' || user.role === 'super_admin') && (
                  <Link to="/admin" className="navbar__dropdown-item">Admin Panel</Link>
                )}
                <button onClick={logout} className="navbar__dropdown-item navbar__dropdown-item--logout">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="navbar__link navbar__link--login">Login</Link>
          )}
        </div>

        <button
          className="navbar__mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </nav>
  );
}
