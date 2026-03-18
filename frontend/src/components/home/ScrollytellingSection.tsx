import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { number: '30+', label: 'Years of Excellence' },
  { number: '2000+', label: 'Alumni Worldwide' },
  { number: '30+', label: 'Faculty Members' },
  { number: '15+', label: 'Research Areas' },
];

const BEATS = [
  {
    tag: 'Our Mission',
    title: 'Excellence in Education, Innovation in Research.',
    body: 'The Department of Computer Science and Engineering at SUST has been at the forefront of technological education since 1991, shaping the next generation of engineers and researchers.',
    align: 'left',
  },
  {
    tag: 'Research & Innovation',
    title: 'Pushing the Boundaries of What\'s Possible.',
    body: 'Our faculty and students are engaged in cutting-edge research across AI, machine learning, networking, and software engineering — contributing to global advancements in technology.',
    align: 'right',
  },
  {
    tag: 'Community',
    title: 'A Network Built for the Future.',
    body: 'Over 2,000 alumni are making their mark across the globe. Our community is a lifelong bond — connecting students, educators, and industry leaders in a shared pursuit of excellence.',
    align: 'left',
  },
];

export default function ScrollytellingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate each "beat" on scroll
      gsap.utils.toArray<HTMLElement>('.scrolly-beat').forEach((beat) => {
        const inner = beat.querySelector('.scrolly-beat__inner');
        const tag = beat.querySelector('.scrolly-beat__tag');
        const title = beat.querySelector('.scrolly-beat__title');
        const body = beat.querySelector('.scrolly-beat__body');
        const isRight = beat.classList.contains('scrolly-beat--right');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: beat,
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse',
          }
        });

        tl.fromTo(inner, 
          { opacity: 0, x: isRight ? 60 : -60 },
          { opacity: 1, x: 0, duration: 1.1, ease: 'expo.out' }
        );
        tl.fromTo(tag, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.8'
        );
        tl.fromTo(title, 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' },
          '-=0.6'
        );
        tl.fromTo(body, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.5'
        );
      });

      // Stats count-up
      gsap.utils.toArray<HTMLElement>('.scrolly-stats__number').forEach((el) => {
        const target = parseFloat(el.getAttribute('data-value') || '0');
        const isPlus = el.getAttribute('data-suffix') === '+';

        ScrollTrigger.create({
          trigger: el,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.fromTo({ val: 0 },
              { val: target },
              {
                val: target,
                duration: 2.5,
                ease: 'power2.out',
                onUpdate: function () {
                  el.textContent = Math.round((this as any).targets()[0].val) + (isPlus ? '+' : '');
                }
              }
            );
          }
        });
      });

      // Stats container reveal
      gsap.fromTo('.scrolly-stats',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.scrolly-stats',
            start: 'top 75%',
          }
        }
      );

      // CTA section
      gsap.fromTo('.scrolly-cta__inner',
        { opacity: 0, scale: 0.97, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.scrolly-cta',
            start: 'top 70%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="scrolly-section">

      {/* === Storytelling Beats === */}
      {BEATS.map((beat, i) => (
        <div
          key={i}
          className={`scrolly-beat ${beat.align === 'right' ? 'scrolly-beat--right' : ''}`}
        >
          <div className="scrolly-beat__inner">
            <div className="scrolly-beat__tag">{beat.tag}</div>
            <h2 className="scrolly-beat__title">{beat.title}</h2>
            <p className="scrolly-beat__body">{beat.body}</p>
          </div>
          <div className="scrolly-beat__line" />
        </div>
      ))}

      {/* === Animated Stats === */}
      <div className="scrolly-stats">
        <p className="scrolly-stats__label">By the numbers</p>
        <div className="scrolly-stats__grid">
          {STATS.map((s, i) => {
            const num = parseFloat(s.number);
            const isPlus = s.number.includes('+');
            return (
              <div key={i} className="scrolly-stats__item">
                <span
                  className="scrolly-stats__number"
                  data-value={num}
                  data-suffix={isPlus ? '+' : ''}
                >
                  {s.number}
                </span>
                <span className="scrolly-stats__desc">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* === CTA === */}
      <div className="scrolly-cta">
        <div className="scrolly-cta__inner">
          <div className="scrolly-cta__tag">Start Your Journey</div>
          <h2 className="scrolly-cta__title">
            Shape the Future with<br />SUST CSE
          </h2>
          <p className="scrolly-cta__body">
            Join a community of brilliant minds. Experience education that goes beyond the classroom.
          </p>
          <div className="scrolly-cta__buttons">
            <Link to="/auth" className="hero__btn hero__btn--primary">Apply Now →</Link>
            <Link to="/about" className="hero__btn hero__btn--secondary">Learn More</Link>
          </div>
        </div>
      </div>

    </section>
  );
}
