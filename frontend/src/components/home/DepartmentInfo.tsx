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

function StatCounter({ label, value, index }: { label: string; value: number, index: number }) {
  const countRef = useCountUp(value);
  return (
    <div className={`dept-stats-raw__item dept-stats-raw__item--${index}`}>
      <span ref={countRef} className="dept-stats-raw__number">0</span>
      <span className="dept-stats-raw__label">{label}</span>
    </div>
  );
}

export default function DepartmentInfo() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Massive text parallax
      gsap.to('.dept-editorial__watermark', {
        y: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });

      // Text reveal
      gsap.fromTo('.dept-editorial__lead',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.dept-editorial__lead', start: 'top 80%' },
        }
      );

      // Stats stagger
      gsap.fromTo('.dept-stats-raw__item',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.dept-editorial__stats', start: 'top 85%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section dept-editorial">
      <div className="container">
        
        <div className="dept-editorial__grid">
          {/* Left Column: Big Statement */}
          <div className="dept-editorial__left">
            <div className="dept-editorial__watermark">1992</div>
            <h2 className="dept-editorial__title">
              Pioneering<br />
              <span className="text-gradient">Excellence.</span>
            </h2>
            <p className="dept-editorial__lead">
              Since 1992, the Department of Computer Science & Engineering has been at the forefront of technological innovation and rigorous academic excellence. Under the leadership of Prof. Dr. Md. Forhad Rabbi, we shape world-class engineers destined to lead the global tech industry.
            </p>
            <button 
              onClick={() => window.location.href = '/about'}
              className="dept-editorial__btn" 
            >
              Explore Our History →
            </button>
          </div>

          {/* Right Column: Clean Numbers */}
          <div className="dept-editorial__right">
            <div className="dept-editorial__stats">
              {stats.map((stat, i) => (
                <StatCounter key={stat.label} label={stat.label} value={stat.value} index={i} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
