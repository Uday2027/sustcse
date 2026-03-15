import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiUsers, FiAward, FiBookOpen, FiUserCheck } from 'react-icons/fi';
import { magneticHover } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

const links = [
  { to: '/faculty', label: 'Faculty', icon: FiBookOpen, desc: 'Meet our professors' },
  { to: '/alumni', label: 'Alumni', icon: FiAward, desc: 'Our graduates' },
  { to: '/students', label: 'Student Portal', icon: FiUserCheck, desc: 'Login to access' },
  { to: '/society', label: 'CSE Society', icon: FiUsers, desc: 'Activities & members' },
];

export default function QuickLinks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cleanups: (() => void)[] = [];
    const ctx = gsap.context(() => {
      gsap.fromTo('.quick-link-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: '.quick-links__grid', start: 'top 85%' },
        }
      );

      // Magnetic hover on each card
      const cards = sectionRef.current?.querySelectorAll('.quick-link-card');
      cards?.forEach((card) => {
        const cleanup = magneticHover(card as HTMLElement, 0.15);
        cleanups.push(cleanup);
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section ref={sectionRef} className="section quick-links">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title skeu-heading">Explore More</h2>
        </div>

        <div className="quick-links__grid grid grid--4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.to} to={link.to} className="quick-link-card skeu-card">
                <div className="quick-link-card__icon">
                  <Icon size={32} />
                </div>
                <h3 className="quick-link-card__label">{link.label}</h3>
                <p className="quick-link-card__desc">{link.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
