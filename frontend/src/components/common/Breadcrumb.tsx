import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiHome, FiUser, FiInfo, FiMessageSquare, FiUsers, FiAward, FiFileText, FiCalendar } from 'react-icons/fi';
import gsap from 'gsap';

const routeConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  'notices': { label: 'Notices', icon: <FiFileText /> },
  'events': { label: 'Events', icon: <FiCalendar /> },
  'achievements': { label: 'Achievements', icon: <FiAward /> },
  'faculty': { label: 'Faculty', icon: <FiUser /> },
  'about': { label: 'About', icon: <FiInfo /> },
  'message-from-head': { label: 'Message from Head', icon: <FiMessageSquare /> },
  'alumni': { label: 'Alumni Network', icon: <FiUsers /> },
  'society': { label: 'Society', icon: <FiUsers /> },
  'students': { label: 'Students', icon: <FiUsers /> },
  'profile': { label: 'My Profile', icon: <FiUser /> },
  'finance': { label: 'Finance', icon: <FiHome /> },
};

export default function Breadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  useEffect(() => {
    if (pathnames.length > 0 && containerRef.current) {
      gsap.fromTo(
        '.breadcrumb-item',
        { opacity: 0, x: -10 },
        { 
          opacity: 1, 
          x: 0, 
          stagger: 0.1, 
          duration: 0.5, 
          ease: 'power2.out',
          overwrite: 'auto'
        }
      );
    }
  }, [location.pathname, pathnames.length]);

  // Don't show on homepage
  if (pathnames.length === 0) return null;

  return (
    <div className="breadcrumb-wrapper container">
      <nav className="breadcrumb-nav" ref={containerRef}>
        <div className="breadcrumb-nav-buttons">
          <button className="nav-btn" onClick={() => navigate(-1)} title="Back">
            <FiChevronLeft />
          </button>
          <button className="nav-btn" onClick={() => navigate(1)} title="Forward">
            <FiChevronRight />
          </button>
        </div>

        <div className="breadcrumb-list">
          <Link to="/" className="breadcrumb-item breadcrumb-home">
            <FiHome />
          </Link>

          {pathnames.map((value, index) => {
            const url = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const config = routeConfig[value] || { label: value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' '), icon: null };

            return (
              <span key={url} className="breadcrumb-item-container">
                <span className="breadcrumb-separator">/</span>
                <Link
                  to={url}
                  className={`breadcrumb-item ${isLast ? 'breadcrumb-item--active' : ''}`}
                >
                  <span className="breadcrumb-icon">{config.icon}</span>
                  <span className="breadcrumb-label">{config.label}</span>
                </Link>
              </span>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
