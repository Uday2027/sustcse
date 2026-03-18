import { FiBook } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useGSAP';

export default function ProgramPage() {
  const contentRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="page program-page">
      <section className="section">
        <div className="container">
          <div ref={contentRef} className="program-content">
            <div className="about-hero-card skeu-card">
              <div className="about-hero-image">
                <img src="/images/lab-students.jpg" alt="Students studying" onError={(e) => { e.currentTarget.src = '/images/.jpg'; }} />
                <div className="image-overlay">
                  <h1>Academic Program</h1>
                  <p>Shaping the future of technology</p>
                </div>
              </div>
            </div>

            <div className="about-grid" style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              <div className="bento-card">
                <h2 className="section-title-sm"><FiBook /> Program Overview</h2>
                <p>
                  CSE department mainly offers four-year undergraduate course in Computer Science & Engineering where courses are designed in such a way so that students graduating from this department have a balance of theory and practical skills to prepare them for the highly competitive workplace.
                </p>
                <p style={{ marginTop: '1rem' }}>
                  A one year Masters by Course Work, one-and-half year Masters by Mixed Mode and two year Masters by Research programs in Computer Science and Engineering are also being run by the department. Usually, every year we advertise in the national news papers for admission in the Masters programs.
                </p>
                <p style={{ marginTop: '1rem' }}>
                  Besides, the department also offers DR degrees in the relevant fields. Students fulfilling the requirements can apply for admission in the DR program Admission notice every year August-September. Here is the application form for DR. admission. Besides undergraduate and Masters and DR. programs, this department is also successfully running one year (four semesters) certification program CCNA (CISCO Certified Network Associate) in collaboration with UNDP and CISCO).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
