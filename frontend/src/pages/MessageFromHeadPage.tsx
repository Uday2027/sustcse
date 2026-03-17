import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useGSAP';

export default function MessageFromHeadPage() {
  const navigate = useNavigate();
  const contentRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="page head-message-page">
      <section className="section">
        <div className="container">
          {/* <button 
            onClick={() => navigate('/')} 
            className="skeu-btn" 
            style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FiArrowLeft /> Back to Home
          </button> */}

          <div ref={contentRef} className="head-message-container">
            <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 350px) 1fr', gap: '3rem' }}>
              {/* Left Column: Photo & Name */}
              <div className="head-photo-card skeu-card" style={{ textAlign: 'center', height: 'fit-content' }}>
                <div className="head-photo" style={{ width: '100%', aspectRatio: '1', borderRadius: '1rem', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
                  <img
                    src="/images/Faculty/Forhad_Rabbi.png"
                    alt="Professor Dr. Md. Forhad Rabbi"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>Professor Dr. Md. Forhad Rabbi</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Head of the Department</p>
                <div className="skeu-divider" style={{ margin: '1.5rem 0' }}></div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  Department of Computer Science and Engineering<br />
                  Shahjalal University of Science and Technology
                </p>
              </div>

              {/* Right Column: Full Message */}
              <div className="message-content-card skeu-card">
                <div className="message-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div className="icon-badge" style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--color-glass-accent)', color: 'var(--color-accent)' }}>
                    <FiMessageSquare size={24} />
                  </div>
                  <h1 className="skeu-heading" style={{ margin: 0 }}>Message From Head</h1>
                </div>

                <div className="message-body" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                  <p>It is my privilege to welcome you to the Department of Computer Science and Engineering at SUST.</p>

                  <p>In an era defined by rapid technological shift, the role of a Computer Science engineer is more vital than ever. At SUST CSE, we do not just teach technology; we live it. Our department is home to a dynamic community of researchers, educators, and students who are passionate about solving real-world problems using the power of computing.</p>

                  <p>We believe in a holistic approach to education. While we maintain high standards in software engineering, cybersecurity, and machine learning, we place equal emphasis on co-curricular development. Our goal is to nurture graduates who are not only industry-ready professionals but also responsible global citizens.</p>

                  <p>I would like to thank to our alumni and partners. You are our bridge to the world. We look forward to your continued engagement as we take CSE at SUST to new heights. We are constantly evolving to keep pace with the global tech landscape, ensuring our research and innovation capabilities remain world-class.</p>

                  <p>Thank you for visiting our website. I invite you to explore our faculty profiles, research publications, and student achievements to see the difference we are making.</p>

                  <div style={{ marginTop: '3rem' }}>
                    <p style={{ marginBottom: 0 }}>Regards,</p>
                    <p style={{ fontWeight: 'bold', color: 'var(--color-text-primary)', marginTop: '0.5rem' }}>Head,</p>
                    <p style={{ marginTop: 0 }}>
                      Department of Computer Science and Engineering<br />
                      Shahjalal University of Science and Technology
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
