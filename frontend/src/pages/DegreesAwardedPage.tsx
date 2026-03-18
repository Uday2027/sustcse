import { FiAward } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useGSAP';

export default function DegreesAwardedPage() {
  const contentRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="page degrees-awarded-page">
      <section className="section">
        <div className="container">
          <div ref={contentRef} className="degrees-awarded-content">
            <div className="about-hero-card skeu-card">
              <div className="about-hero-image">
                <img src="/images/IICT1.jpg" alt="Degrees Awarded" />
                <div className="image-overlay">
                  <h1>Degrees Awarded</h1>
                  <p>Celebrating the success of our graduates</p>
                </div>
              </div>
            </div>

            <div className="about-grid" style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              <div className="bento-card">
                <h2 className="section-title-sm"><FiAward /> Degrees Information</h2>
                <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1.5rem' }}>
                  <li style={{ padding: '0.8rem 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem' }}>Undergraduate degrees awarded:</span>
                    <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>1670</strong>
                  </li>
                  <li style={{ padding: '0.8rem 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem' }}>Master's degrees awarded:</span>
                    <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>62</strong>
                  </li>
                  <li style={{ padding: '0.8rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem' }}>Doctorates awarded:</span>
                    <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>6</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
