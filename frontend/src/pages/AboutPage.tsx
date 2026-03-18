import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiInfo, FiBook, FiUsers, FiCpu } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useGSAP';

export default function AboutPage() {
  const navigate = useNavigate();
  const contentRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="page about-page">
      <section className="section">
        <div className="container">
          {/* <button 
            onClick={() => navigate('/')} 
            className="skeu-btn" 
            style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FiArrowLeft /> Back to Home
          </button> */}

          <div ref={contentRef} className="about-content">
            <div className="about-hero-card skeu-card">
              <div className="about-hero-image">
                <img src="/images/IICT1.jpg" alt="IICT Building" />
                <div className="image-overlay">
                  <h1>About the Department</h1>
                </div>
              </div>
            </div>

            <div className="about-grid" style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="bento-card">
                <h2 className="section-title-sm"><FiInfo /> Our Journey</h2>
                <p>
                  Department of Computer Science & Engineering got down to its journey along with that of School of Applied Science in 1992. This department has brought numerous graduates into reality that are speeding up not only Bangladesh but also the whole world in various IT fields by their skill that they have gathered from this department.
                </p>
              </div>

              <div className="bento-card">
                <h2 className="section-title-sm"><FiBook /> Academic Excellence</h2>
                <p>
                  CSE department mainly offers a four-year undergraduate course in Computer Science & Engineering where courses are designed in such a way so that students graduating from this department have a balance of theory and practical skills to prepare them for the highly competitive workplace.
                </p>
              </div>

              <div className="bento-card">
                <h2 className="section-title-sm"><FiUsers /> Leadership</h2>
                <p>
                  Now a team of full-time faculty members and staff are working ceaselessly under the smashing leadership of Prof. Dr. Md. Forhad Rabbi, Head, Dept. of CSE.
                </p>
              </div>

              <div className="bento-card">
                <h2 className="section-title-sm"><FiCpu /> Research Focus</h2>
                <p>
                  The department has successfully run research activities in Bangla Computerization, Natural Language Processing, Optical Character Recognition, Parallel Processing, Cluster Computing, and Cellular Phone & Computer Interfacing.
                </p>
              </div>
            </div>

            <div className="bento-card" style={{ marginTop: '2rem' }}>
              <p>
                Our vision is to be a leader in computer science education and research, producing graduates who can solve the complex problems of the modern world. We are committed to fostering a culture of innovation, critical thinking, and social responsibility.
              </p>
              <p>
                Whether you are a prospective student, a parent, an alumnus, or a corporate partner, we invite you to be part of our vibrant community as we continue to push the boundaries of technology.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
