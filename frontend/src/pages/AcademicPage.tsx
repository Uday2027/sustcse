import { FiUserCheck } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useGSAP';

export default function AcademicPage() {
  const contentRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="page academic-page">
      <section className="section">
        <div className="container">
          <div ref={contentRef} className="academic-content">
            <div className="about-hero-card skeu-card">
              <div className="about-hero-image">
                <img src="/images/IICT1.jpg" alt="Admission" />
                <div className="image-overlay">
                  <h1>Admission</h1>
                  <p>Join our academic programs</p>
                </div>
              </div>
            </div>

            <div className="about-grid" style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              <div className="bento-card">
                <h2 className="section-title-sm"><FiUserCheck /> Admission Process</h2>
                <p>
                  The admission committee as per the rules of the university will conduct the admission process. The student will be admitted in the first semester of an academic year in the individual discipline of different schools.
                </p>
                <p style={{ marginTop: '1rem' }}>
                  A student will be eligible for readmission in the first year first semester of the subsequent session if s/he was present in at least 25% of the classes or appeared at the semester final examination and his/her admission/semester fees was clear in the past semester/session. Readmitted students will always be assigned the original Registration Number.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
