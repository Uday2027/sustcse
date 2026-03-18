import { FiBarChart2 } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useGSAP';

export default function StatisticsPage() {
  const contentRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="page statistics-page">
      <section className="section">
        <div className="container">
          <div ref={contentRef} className="statistics-content">
            <div className="about-hero-card skeu-card">
              <div className="about-hero-image">
                <img src="/images/IICT1.jpg" alt="Statistics" />
                <div className="image-overlay">
                  <h1>Academic Statistics</h1>
                  <p>Data Period: January 2024 to December 2024</p>
                </div>
              </div>
            </div>

            <div className="about-grid" style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="bento-card">
                <h2 className="section-title-sm"><FiBarChart2 /> Faculty Statistics</h2>
                <h3 style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)' }}>Headcount</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li>Number of academic staff: 19</li>
                  <li>Number of academic staff that are female: 3</li>
                  <li>Number of faculty staff with PhD: 7</li>
                </ul>
              </div>

              <div className="bento-card">
                <h2 className="section-title-sm"><FiBarChart2 /> Student Statistics</h2>
                <h3 style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)' }}>Headcount</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                  <li>Number of bachelors/undergraduate students: 525</li>
                  <li>Number of masters students: 57</li>
                  <li>Number of doctorate students: 8</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
