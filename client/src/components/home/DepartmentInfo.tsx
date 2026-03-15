import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCountUp } from '../../hooks/useGSAP';

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
      <span ref={countRef} className="dept-stats__number">0</span>
      <span className="dept-stats__label">{label}</span>
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
              Department of Computer Science & Engineering got down to its journey along with that of
              School of Applied Science in 1992. This department has brought numerous graduates into
              reality that are speeding up not only Bangladesh but also the whole world in various IT
              fields by their skill that they have gathered from this department.
            </p>
            <p>
              CSE department mainly offers a four-year undergraduate course in Computer Science &
              Engineering where courses are designed in such a way so that students graduating from this
              department have a balance of theory and practical skills to prepare them for the highly
              competitive workplace. Now a team of full-time faculty members and staff are working
              ceaselessly under the smashing leadership of Prof. Md Masum, Head, Dept. of CSE.
            </p>
            <p>
              The department has successfully run research activities in Bangla Computerization,
              Natural Language Processing, Optical Character Recognition, Parallel Processing,
              Cluster Computing, and Cellular Phone & Computer Interfacing.
            </p>
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
