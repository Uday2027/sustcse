import { FiDollarSign } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useGSAP';

export default function TuitionFeesPage() {
  const contentRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="page tuition-fees-page">
      <section className="section">
        <div className="container">
          <div ref={contentRef} className="tuition-fees-content">
            <div className="about-hero-card skeu-card">
              <div className="about-hero-image">
                <img src="/images/IICT1.jpg" alt="Tuition Fees" />
                <div className="image-overlay">
                  <h1>Tuition Fees</h1>
                  <p>Information on average annual tuition fees</p>
                </div>
              </div>
            </div>

            <div className="about-grid" style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              <div className="bento-card">
                <h2 className="section-title-sm"><FiDollarSign /> Average Annual Tuition Fees</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                  <div className="skeu-card p-4">
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>National (BDT)</h4>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                      <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}><span>Undergraduate:</span> <strong>9,000</strong></li>
                      <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}><span>Master's:</span> <strong>6,000</strong></li>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>PhD:</span> <strong>20,000</strong></li>
                    </ul>
                  </div>

                  <div className="skeu-card p-4">
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>International Undergraduate</h4>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Undergraduate (BDT):</span> <strong>17,500</strong></li>
                    </ul>
                  </div>

                  <div className="skeu-card p-4">
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>International Postgraduate (USD)</h4>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                      <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}><span>SAARC Countries:</span> <strong>500</strong></li>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Non-SAARC Countries:</span> <strong>1,200</strong></li>
                    </ul>
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
