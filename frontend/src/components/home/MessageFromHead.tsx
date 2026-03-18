import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import { useScrollReveal } from '../../hooks/useGSAP';

export default function MessageFromHead() {
  const navigate = useNavigate();
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <section ref={revealRef} className="section msg-premium">
      <div className="container msg-premium__container">

        <div className="msg-premium__grid">
          {/* Left: Portrait */}
          <div className="msg-premium__visual">
            <div className="msg-premium__portrait">
              <img src="/images/Faculty/Forhad_Rabbi.png" alt="Prof. Dr. Md. Forhad Rabbi" />
              <div className="msg-premium__caption">
                <h4>Prof. Dr. Md. Forhad Rabbi</h4>
                <p>Head of Department</p>
              </div>
            </div>
          </div>

          {/* Right: Text */}
          <div className="msg-premium__content">
            <p className="vm-premium__label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <FiMessageSquare size={16} />
              <span>Message From Head</span>
            </p>

            <blockquote className="msg-premium__quote">
              In an era defined by rapid technological shift, the role of a
              Computer Science engineer is{' '}
              <span className="text-gradient">more vital than ever.</span>
            </blockquote>

            <p className="dept-editorial__lead" style={{ marginBottom: '2.5rem' }}>
              At SUST CSE, we do not just teach technology — we live it. Our department
              is home to a dynamic community of researchers, educators, and students
              passionate about solving real-world problems.
            </p>

            <button
              onClick={() => navigate('/message-from-head')}
              className="dept-editorial__btn"
            >
              Read Full Message <FiArrowRight />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
