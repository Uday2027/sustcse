import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroBanner from '../components/home/HeroBanner';
import ResearchAreas from '../components/home/ResearchAreas';
import NoticeTicker from '../components/home/NoticeTicker';
import DepartmentInfo from '../components/home/DepartmentInfo';
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
      gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="home-page">
      <HeroBanner />
      <NoticeTicker />
      <ResearchAreas />
      <DepartmentInfo />
      <VisionMission />
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
