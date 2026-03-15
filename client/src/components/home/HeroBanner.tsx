import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroBanner() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Title letter-by-letter reveal
      if (titleRef.current) {
        const text = titleRef.current.textContent || '';
        titleRef.current.textContent = '';
        const chars = text.split('').map((char) => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.display = 'inline-block';
          span.style.opacity = '0';
          span.style.transform = 'translateY(30px)';
          titleRef.current!.appendChild(span);
          return span;
        });

        tl.to(chars, {
          opacity: 1,
          y: 0,
          duration: 0.04,
          stagger: 0.025,
          delay: 0.3,
        });
      }

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

      // Parallax on scroll
      gsap.to('.hero__bg-overlay', {
        yPercent: 30,
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
      <div className="hero__bg-image" />
      <div className="hero__bg-overlay" />
      <div className="hero__content">
        <div className="hero__badge">Est. 1992</div>
        <h1 ref={titleRef} className="hero__title">
          CSE ⚡ SUST
        </h1>
        <p ref={subtitleRef} className="hero__subtitle">
          Department of Computer Science & Engineering, Shahjalal University of
          Science and Technology — Shaping the future of technology since 1992.
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
      <div className="hero__scroll-indicator">
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
