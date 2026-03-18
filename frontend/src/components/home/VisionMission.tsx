import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const missions = [
  {
    num: '01',
    text: 'To provide quality education in both theoretical and applied foundations of Computer Science and Engineering.',
  },
  {
    num: '02',
    text: 'To prepare highly skilled computer engineers, capable of doing research and developing solutions for the nation.',
  },
  {
    num: '03',
    text: 'To inculcate professional and ethical values among students.',
  },
  {
    num: '04',
    text: 'To support society by participating in and encouraging technology transfer.',
  },
];

export default function VisionMission() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Vision statement scale & reveal
      gsap.fromTo('.vm-premium__vision h2',
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: '.vm-premium__vision', start: 'top 80%' },
        }
      );

      // Mission cards stagger reveal
      gsap.fromTo('.vm-premium__mission-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.vm-premium__missions', start: 'top 75%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section vm-premium">
      <div className="container">
        
        {/* HUGE VISION BLOCK */}
        <div className="vm-premium__vision">
          <p className="vm-premium__label">Our Vision</p>
          <h2>
            To provide an excellent educational environment developing professionals with strong technical and research backgrounds.
          </h2>
        </div>

        {/* ELEGANT MISSION CARDS */}
        <div className="vm-premium__missions-wrapper">
          <p className="vm-premium__label vm-premium__label--center">Our Mission</p>
          <div className="vm-premium__missions">
            {missions.map((m) => (
              <div key={m.num} className="vm-premium__mission-card">
                <span className="vm-premium__mission-num">{m.num}</span>
                <p className="vm-premium__mission-text">{m.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
