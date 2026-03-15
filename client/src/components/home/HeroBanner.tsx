import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroBanner() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const imageColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Text column animation
      tl.fromTo(textColRef.current?.children ? Array.from(textColRef.current.children) : [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 0.2 }
      );

      // Image column animation
      tl.fromTo(imageColRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1 },
        '-=0.6'
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <div className="hero__container">

        {/* Left Column: Text & CTAs */}
        <div ref={textColRef} className="hero__text-col">
          <h1 className="hero__title">
            Fostering <span className="hero__title-accent">Confidence</span><br />
            and <span className="hero__title-accent">Clarity</span> within the<br />
            Academic Ecosystem
          </h1>

          <p className="hero__subtitle">
            Acquire premium knowledge from leading educators and<br />
            contribute to the expansion of the CSE community.
          </p>

          <div className="hero__cta-group">
            <a href="/research" className="hero__btn hero__btn--primary">
              Start Learning
            </a>
            <a href="/about" className="hero__btn hero__btn--secondary">
              Learn How
            </a>
          </div>
        </div>

        {/* Right Column: Image Showcase */}
        <div ref={imageColRef} className="hero__image-col">
          <div className="hero__image-showcase">
            {/* Top Badge Overlay */}
            <div className="hero__image-badge">
              <div className="hero__image-badge-avatar">
                <img src="/images/IICT1.jpg" alt="avatar" />
              </div>
              <span className="hero__image-badge-text">dept_cse_sust</span>
            </div>

            {/* Main Image */}
            <img
              src="/images/IICT1.jpg"
              alt="IICT Building"
              className="hero__main-img"
            />
          </div>

          {/* Slider Indicators */}
          <div className="hero__slider-indicators">
            <div className="hero__slider-dot hero__slider-dot--active"></div>
            <div className="hero__slider-dot"></div>
            <div className="hero__slider-dot"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
