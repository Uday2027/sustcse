import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroBanner() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Title lines fade in
      tl.fromTo('.hero__title-line',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, delay: 0.2 }
      );

      // Subtitle fade in
      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.3'
      );

      // CTA buttons
      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      );

      // Card slide in from right
      tl.fromTo(cardRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.8 },
        '-=0.8'
      );

      // Parallax on scroll
      gsap.to('.hero__card', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <div className="hero__bg-grid" />
      <div className="hero__content">
        <div className="hero__text">
          <div className="hero__badge">Est. 1992</div>
          <h1 ref={titleRef} className="hero__title">
            <span className="hero__title-line">Learn, Build &</span>
            <span className="hero__title-line">Innovate with</span>
            <span className="hero__title-line"><span className="hero__title-accent">Confidence</span> &</span>
            <span className="hero__title-line"><span className="hero__title-accent">Clarity</span></span>
          </h1>
          <p ref={subtitleRef} className="hero__subtitle">
            Department of Computer Science & Engineering, SUST — Shaping the
            future of technology since 1992. Explore our academic programs,
            research initiatives, and vibrant community.
          </p>
          <div ref={ctaRef} className="hero__cta">
            <a href="/notices" className="skeu-btn skeu-btn--primary skeu-btn--lg">
              Latest Notices
            </a>
            <a href="/events" className="skeu-btn skeu-btn--lg">
              Upcoming Events
            </a>
          </div>
        </div>
        <div ref={cardRef} className="hero__card">
          <div className="hero__card-image">
            <img src="/images/IICT1.jpg" alt="IICT Building" />
          </div>
          <div className="hero__card-footer">
            <div className="hero__card-info">
              <div className="hero__card-avatar">CSE</div>
              <div>
                <span className="hero__card-name">CSE SUST</span>
                <span className="hero__card-handle">@cse.sust.edu</span>
              </div>
            </div>
            <div className="hero__card-dots">
              <span className="hero__card-dot hero__card-dot--active" />
              <span className="hero__card-dot" />
              <span className="hero__card-dot" />
            </div>
          </div>
        </div>
      </div>
      <div className="hero__scroll-indicator">
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
