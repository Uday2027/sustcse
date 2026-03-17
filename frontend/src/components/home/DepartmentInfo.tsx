import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCountUp } from '../../hooks/useGSAP';
import { FiUsers, FiUser, FiAward, FiFileText, FiBookOpen } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: 'Faculty Members', value: 19 },
  { label: 'Undergraduate Students', value: 525 },
  { label: 'Masters Students', value: 57 },
  { label: 'Doctorate Students', value: 8 },
  { label: 'Faculty with PhD', value: 7 },
  { label: 'Degrees Awarded', value: 1670 },
];

function StatCounter({ label, value }: { label: string; value: number }) {
  const countRef = useCountUp(value);
  return (
    <div className="dept-stats__item">
      <div className="dept-stats__content">
        <span ref={countRef} className="dept-stats__number">0</span>
        <span className="dept-stats__label">{label}</span>
      </div>
    </div>
  );
}

export default function DepartmentInfo() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.dept-info__about-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.dept-info__about-card', start: 'top 85%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section dept-info">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title skeu-heading">About the Department</h2>
          <p className="section__subtitle">Pioneering Computer Science Education Since 1992</p>
        </div>

        <div className="dept-info__bento">
          <div className="dept-info__about-card skeu-card">
            <p>
              Department of Computer Science & Engineering began its journey in 1992. Over the decades, 
              it has produced world-class graduates who are leading the IT industry globally.
            </p>
            <p>
              Under the leadership of <strong>Prof. Dr. Md. Forhad Rabbi</strong>, the department 
              offers a balance of theory and practical skills, preparing students for highly competitive 
              global workplaces while fostering innovation in research areas like AI and NLP.
            </p>
            <button 
              onClick={() => window.location.href = '/about'}
              className="skeu-btn skeu-btn--small" 
              style={{ marginTop: '1rem' }}
            >
              See more
            </button>
          </div>

          <div className="dept-stats">
            {stats.map((stat) => (
              <StatCounter key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
