import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiTarget, FiBook, FiUsers, FiGlobe } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const missions = [
  {
    icon: FiBook,
    code: 'M1',
    text: 'To provide quality education in both theoretical and applied foundations of Computer Science and Engineering.',
  },
  {
    icon: FiTarget,
    code: 'M2',
    text: 'To prepare highly skilled computer engineers, capable of doing research and also develop solutions for the betterment of the nation.',
  },
  {
    icon: FiUsers,
    code: 'M3',
    text: 'To inculcate professional and ethical values among students.',
  },
  {
    icon: FiGlobe,
    code: 'M4',
    text: 'To support society by participating in and encouraging technology transfer.',
  },
];

export default function VisionMission() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Vision card
      gsap.fromTo('.vision-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.vision-card', start: 'top 85%' },
        }
      );

      // Mission cards stagger
      gsap.fromTo('.mission-card',
        { opacity: 0, y: 40, rotateX: 10 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.6, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.missions-grid', start: 'top 80%' },
        }
      );

      // 3D tilt on hover
      const cards = sectionRef.current?.querySelectorAll('.mission-card');
      cards?.forEach((card) => {
        const el = card as HTMLElement;
        el.addEventListener('mousemove', (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(el, {
            rotateY: x * 10,
            rotateX: -y * 10,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section vision-mission">
      <div className="container">
        <div className="vision-mission__bento">
          <div className="vision-card skeu-panel skeu-panel--elevated">
            <h2 className="skeu-heading skeu-heading--lg">Our Vision</h2>
            <p>
              The Department of Computer Science and Engineering, SUST intends to provide an
              excellent educational environment in order to develop professionals with strong
              technical and research backgrounds.
            </p>
          </div>

          <h2 className="section__title skeu-heading" style={{ textAlign: 'center', margin: '3rem 0 2rem' }}>
            Our Mission
          </h2>

          <div className="missions-grid">
            {missions.map((mission) => {
              const Icon = mission.icon;
              return (
                <div key={mission.code} className="mission-card skeu-card">
                  <div className="mission-card__icon">
                    <Icon size={28} />
                  </div>
                  <div className="mission-card__code">{mission.code}</div>
                  <p className="mission-card__text">{mission.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
