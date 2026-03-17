import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import { useScrollReveal } from '../../hooks/useGSAP';

export default function MessageFromHead() {
  const navigate = useNavigate();
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section head-message-summary">
      <div className="container">
        <div ref={revealRef} className="head-message-card skeu-card glass">
          <div className="head-message-card__grid">
            <div className="head-message-card__photo">
              <img src="/images/Faculty/Forhad_Rabbi.png" alt="Head of Department" />
              <div className="head-message-card__name-tag">
                <h3>Prof. Dr. Md. Forhad Rabbi</h3>
                <p>Head of Department</p>
              </div>
            </div>
            
            <div className="head-message-card__content">
              <div className="section-title-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--color-accent)' }}>
                <FiMessageSquare size={20} />
                <span>Message From Head</span>
              </div>
              
              <blockquote className="head-message-quote">
                "In an era defined by rapid technological shift, the role of a Computer Science engineer 
                is more vital than ever. At SUST CSE, we do not just teach technology; we live it."
              </blockquote>
              
              <p className="head-message-excerpt">
                We believe in a holistic approach to education. While we maintain high standards 
                in software engineering, cybersecurity, and machine learning, we place equal 
                emphasis on co-curricular development...
              </p>
              
              <button 
                onClick={() => navigate('/message-from-head')}
                className="skeu-btn skeu-btn--accent" 
                style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Read Full Message <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
