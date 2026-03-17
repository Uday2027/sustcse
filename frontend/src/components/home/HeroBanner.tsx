import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGES = [
  '/images/IICT1.jpg',
  '/images/IICT2.jpg',
  '/images/IICT3.jpeg',
  '/images/iict.jpg'
];

export default function HeroBanner() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const imageColRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

            {/* Sliding Images Container */}
            <div 
              className="hero__main-img-container"
              style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                transition: 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
                transform: `translateX(-${activeIndex * 100}%)`
              }}
            >
              {HERO_IMAGES.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`IICT Building ${idx + 1}`}
                  className="hero__main-img"
                  style={{
                    flex: '0 0 100%',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="hero__slider-indicators">
            {HERO_IMAGES.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`hero__slider-dot ${activeIndex === idx ? 'hero__slider-dot--active' : ''}`}
              ></div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

