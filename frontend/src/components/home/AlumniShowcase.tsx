import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';
import { useScrollReveal } from '../../hooks/useGSAP';

export default function AlumniShowcase() {
  const navigate = useNavigate();
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <section ref={revealRef} className="section alumni-premium">
      <div className="container">

        {/* Section label */}
        <p className="vm-premium__label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
          <span style={{ display: 'block', width: 28, height: 1, background: 'var(--color-accent)' }} />
          <span>Alumni Network</span>
        </p>

        {/* Editorial two-column grid */}
        <div className="alumni-premium__grid">

          {/* Left: Large editorial heading + stats */}
          <div className="alumni-premium__content">
            <h2 className="alumni-premium__headline">
              A Global<br />Community of<br />
              <span className="text-gradient">Innovators.</span>
            </h2>

            <div className="alumni-premium__stats">
              <div className="alumni-premium__stat-item">
                <span className="alumni-premium__stat-value">1500+</span>
                <span className="alumni-premium__stat-label">Graduates</span>
              </div>
              <div className="alumni-premium__stat-item">
                <span className="alumni-premium__stat-value">30+</span>
                <span className="alumni-premium__stat-label">Years</span>
              </div>
              <div className="alumni-premium__stat-item">
                <span className="alumni-premium__stat-value">50+</span>
                <span className="alumni-premium__stat-label">Countries</span>
              </div>
            </div>
          </div>

          {/* Right: Description + links */}
          <div className="alumni-premium__right">
            <p className="alumni-premium__body">
              Since 1992, our graduates have been pushing the boundaries of technology 
              at top-tier companies and research institutions worldwide. From Silicon 
              Valley to Dhaka, the CSE SUST legacy continues to grow — building bridges 
              across continents and disciplines.
            </p>

            <div className="alumni-premium__links">
              <button
                onClick={() => navigate('/alumni')}
                className="dept-editorial__btn"
              >
                Browse Directory <FiArrowRight />
              </button>
              <a
                href="http://www.cseaasust.org"
                target="_blank"
                rel="noopener noreferrer"
                className="alumni-premium__ext-link"
              >
                Alumni Association <FiExternalLink size={13} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
