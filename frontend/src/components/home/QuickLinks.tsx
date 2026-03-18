import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const links = [
  { to: '/faculty', label: 'Faculty Directory' },
  { to: '/alumni', label: 'Alumni Network' },
  { to: '/students', label: 'Student Portal' },
  { to: '/society', label: 'CSE Society' },
];

export default function QuickLinks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Links stagger from bottom
      gsap.fromTo('.qlinks-premium__item',
        { opacity: 0, y: 60, rotateX: 20 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 1, stagger: 0.15, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section qlinks-premium">
      <div className="container">
        
        <div className="qlinks-premium__header">
          <p className="vm-premium__label">Directory</p>
          <h2 className="dept-editorial__title">
            Explore <span className="text-gradient">Further.</span>
          </h2>
        </div>

        <nav className="qlinks-premium__nav">
          {links.map((link, i) => (
            <Link key={link.to} to={link.to} className="qlinks-premium__item">
              <span className="qlinks-premium__num">{(i + 1).toString().padStart(2, '0')}</span>
              <span className="qlinks-premium__text">{link.label}</span>
              <span className="qlinks-premium__arrow">→</span>
            </Link>
          ))}
        </nav>

      </div>
    </section>
  );
}
