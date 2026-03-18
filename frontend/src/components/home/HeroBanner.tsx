import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
      // Tag line chip
      gsap.fromTo('.hero__eyebrow',
        { opacity: 0, y: 20, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out', delay: 0.1 }
      );

      // Headline words stagger
      const words = textColRef.current?.querySelectorAll('.hero__title-word');
      if (words && words.length > 0) {
        gsap.fromTo(words,
          { opacity: 0, y: 60, rotate: 4 },
          { opacity: 1, y: 0, rotate: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out', delay: 0.3 }
        );
      }

      // Subtitle
      gsap.fromTo('.hero__subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.7 }
      );

      // CTAs
      gsap.fromTo('.hero__cta-group',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.9 }
      );

      // Image column
      gsap.fromTo(imageColRef.current,
        { opacity: 0, scale: 0.93, x: 40 },
        { opacity: 1, scale: 1, x: 0, duration: 1.4, ease: 'expo.out', delay: 0.2 }
      );

      // Scroll-linked parallax on hero image
      gsap.to(imageColRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        }
      });

      // Text fades on scroll
      gsap.to(textColRef.current, {
        y: -40,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '60% top',
          scrub: 2,
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <div className="hero__container">

        {/* Left Column: Text & CTAs */}
        <div ref={textColRef} className="hero__text-col">
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-badge">Est. 1991</span>
            <span className="hero__eyebrow-separator">·</span>
            <span className="hero__eyebrow-text">Department of Computer Science & Engineering</span>
          </div>

          <h1 className="hero__title">
            <span className="hero__title-word">Fostering</span>{' '}
            <span className="hero__title-word hero__title-accent">Confidence</span>
            <br />
            <span className="hero__title-word">and</span>{' '}
            <span className="hero__title-word hero__title-accent">Clarity</span>{' '}
            <span className="hero__title-word">within the</span>
            <br />
            <span className="hero__title-word">Academic Ecosystem</span>
          </h1>

          <p className="hero__subtitle">
            Acquire premium knowledge from leading educators and
            contribute to the expansion of the CSE community.
          </p>

          <div className="hero__cta-group">
            <Link to="/research" className="hero__btn hero__btn--primary">
              Start Learning
            </Link>
            <Link to="/about" className="hero__btn hero__btn--secondary">
              Explore CSE ↗
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="hero__scroll-hint">
            <span className="hero__scroll-hint-line" />
            <span className="hero__scroll-hint-text">Scroll to explore</span>
          </div>
        </div>

        {/* Right Column: Image Showcase */}
        <div ref={imageColRef} className="hero__image-col">
          <div className="hero__image-showcase">
            {/* Badge Overlay */}
            <div className="hero__image-badge">
              <div className="hero__image-badge-avatar">
                <img src="/images/IICT1.jpg" alt="avatar" />
              </div>
              <span className="hero__image-badge-text">dept_cse_sust</span>
            </div>

            {/* Sliding Images */}
            <div
              className="hero__main-img-container"
              style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                transition: 'transform 0.9s cubic-bezier(0.65, 0, 0.35, 1)',
                transform: `translateX(-${activeIndex * 100}%)`
              }}
            >
              {HERO_IMAGES.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`IICT Building ${idx + 1}`}
                  className="hero__main-img"
                  style={{ flex: '0 0 100%', width: '100%', height: '100%', objectFit: 'cover' }}
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
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
