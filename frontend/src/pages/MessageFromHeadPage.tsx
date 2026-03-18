import { FiMessageSquare } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useGSAP';

export default function MessageFromHeadPage() {
  const contentRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="page head-message-page">
      <section className="section" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div ref={contentRef} className="head-msg-layout">

            {/* LEFT: Sticky Sidebar with Portrait */}
            <aside className="head-msg-sidebar">
              <div className="head-msg-sidebar__portrait">
                <img
                  src="/images/Faculty/Forhad_Rabbi.png"
                  alt="Professor Dr. Md. Forhad Rabbi"
                />
              </div>
              <div className="head-msg-sidebar__info">
                <h3>Prof. Dr. Md. Forhad Rabbi</h3>
                <p className="head-msg-sidebar__role">Head of Department</p>
                <div className="head-msg-sidebar__divider" />
                <p className="head-msg-sidebar__dept">
                  Department of Computer Science &amp; Engineering<br />
                  Shahjalal University of Science &amp; Technology
                </p>
              </div>
            </aside>

            {/* RIGHT: Scrollable Full Message */}
            <div className="head-msg-body">
              <div className="head-msg-body__header">
                <p className="vm-premium__label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <FiMessageSquare size={16} />
                  <span>Message From Head</span>
                </p>
                <h1 className="head-msg-body__title">
                  A Message of <span className="text-gradient">Purpose.</span>
                </h1>
              </div>

              <div className="head-msg-body__content">
                <p>It is my privilege to welcome you to the Department of Computer Science and Engineering at SUST.</p>

                <p>In an era defined by rapid technological shift, the role of a Computer Science engineer is more vital than ever. At SUST CSE, we do not just teach technology; we live it. Our department is home to a dynamic community of researchers, educators, and students who are passionate about solving real-world problems using the power of computing.</p>

                <p>We believe in a holistic approach to education. While we maintain high standards in software engineering, cybersecurity, and machine learning, we place equal emphasis on co-curricular development. Our goal is to nurture graduates who are not only industry-ready professionals but also responsible global citizens.</p>

                <p>I would like to thank to our alumni and partners. You are our bridge to the world. We look forward to your continued engagement as we take CSE at SUST to new heights. We are constantly evolving to keep pace with the global tech landscape, ensuring our research and innovation capabilities remain world-class.</p>

                <p>Thank you for visiting our website. I invite you to explore our faculty profiles, research publications, and student achievements to see the difference we are making.</p>

                <div className="head-msg-body__signature">
                  <p>With warm regards,</p>
                  <strong>Professor Dr. Md. Forhad Rabbi</strong>
                  <p>Head, Department of Computer Science &amp; Engineering<br />Shahjalal University of Science &amp; Technology</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
