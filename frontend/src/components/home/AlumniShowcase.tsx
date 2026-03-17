import { useNavigate } from 'react-router-dom';
import { FiUsers, FiArrowRight, FiExternalLink } from 'react-icons/fi';
import { useScrollReveal } from '../../hooks/useGSAP';

export default function AlumniShowcase() {
  const navigate = useNavigate();
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section alumni-showcase">
      <div className="container">
        <div ref={revealRef} className="alumni-showcase__grid">
          <div className="alumni-showcase__content">
            <div className="section-title-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--color-accent)' }}>
              <FiUsers size={20} />
              <span>Alumni Network</span>
            </div>
            
            <h2 className="skeu-heading" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
              A Global Community of <span style={{ color: 'var(--color-accent)' }}>Innovators</span>
            </h2>
            
            <p className="alumni-showcase__text" style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Since 1992, our graduates have been pushing the boundaries of technology at top-tier companies 
              and research institutions worldwide. From Silicon Valley to Dhaka, the CSE SUST legacy continue to grow.
            </p>

            <div className="alumni-showcase__stats" style={{ display: 'flex', gap: '3rem', marginBottom: '2.5rem' }}>
              <div>
                <span style={{ display: 'block', fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>1500+</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Success Stories</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>30+</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Years of Legacy</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <button 
                onClick={() => navigate('/alumni')}
                className="skeu-btn skeu-btn--accent"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Browse Directory <FiArrowRight />
              </button>
              <a 
                href="http://www.cseaasust.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="skeu-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Official Site <FiExternalLink />
              </a>
            </div>
          </div>

          <div className="alumni-showcase__visual bento-card glass">
            {/* Visual representation of alumni network - simplified grid of "pioneers" */}
            <div className="alumni-visual-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div key={i} className="alumni-dot-card" style={{ 
                  aspectRatio: '1', 
                  borderRadius: '0.75rem', 
                  background: `rgba(248, 186, 121, ${0.1 + (i * 0.05)})`,
                  border: '1px solid rgba(248, 186, 121, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.2)',
                  fontSize: '1.5rem'
                }}>
                  <FiUsers />
                </div>
              ))}
            </div>
            <div className="alumni-visual-overlay" style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'linear-gradient(to bottom, transparent 60%, var(--glass-bg) 95%)',
              pointerEvents: 'none'
            }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
