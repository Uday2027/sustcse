import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroBanner from '../components/home/HeroBanner';
import ResearchAreas from '../components/home/ResearchAreas';
import NoticeTicker from '../components/home/NoticeTicker';
import DepartmentInfo from '../components/home/DepartmentInfo';
import MessageFromHead from '../components/home/MessageFromHead';
import AlumniShowcase from '../components/home/AlumniShowcase';
import VisionMission from '../components/home/VisionMission';
import SocietyShowcase from '../components/home/SocietyShowcase';
import DepartmentServices from '../components/home/DepartmentServices';
import LatestNotices from '../components/home/LatestNotices';
import UpcomingEvents from '../components/home/UpcomingEvents';
import QuickLinks from '../components/home/QuickLinks';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      // Page entrance
      gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });

      // Global parallax: "camera moving down, elements float up"
      gsap.utils.toArray<HTMLElement>('.parallax-section').forEach((section) => {
        const inner = section.querySelector('.parallax-inner');
        if (!inner) return;
        gsap.fromTo(inner,
          { y: 40 },
          {
            y: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.8,
            }
          }
        );
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="home-page">
      <HeroBanner />
      <NoticeTicker />

      <div className="parallax-section">
        <div className="parallax-inner">
          <DepartmentInfo />
        </div>
      </div>

      <div className="parallax-section">
        <div className="parallax-inner">
          <MessageFromHead />
        </div>
      </div>

      <div className="parallax-section">
        <div className="parallax-inner">
          <AlumniShowcase />
        </div>
      </div>

      <div className="parallax-section">
        <div className="parallax-inner">
          <ResearchAreas />
        </div>
      </div>
      <div className="parallax-section">
        <div className="parallax-inner">
          <VisionMission />
        </div>
      </div>

      <SocietyShowcase />
      <DepartmentServices />
      <div className="home-page__content-row">
        <LatestNotices />
        <UpcomingEvents />
      </div>
      <QuickLinks />
    </div>
  );
}
