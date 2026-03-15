import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ===== Reveal Animations =====
export const fadeInUp = (element: gsap.TweenTarget, delay = 0) =>
  gsap.fromTo(element,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out' }
  );

export const fadeInLeft = (element: gsap.TweenTarget, delay = 0) =>
  gsap.fromTo(element,
    { opacity: 0, x: -60 },
    { opacity: 1, x: 0, duration: 0.8, delay, ease: 'power3.out' }
  );

export const fadeInRight = (element: gsap.TweenTarget, delay = 0) =>
  gsap.fromTo(element,
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.8, delay, ease: 'power3.out' }
  );

export const fadeIn = (element: gsap.TweenTarget, delay = 0) =>
  gsap.fromTo(element,
    { opacity: 0 },
    { opacity: 1, duration: 0.6, delay, ease: 'power2.out' }
  );

// ===== Stagger Animations =====
export const staggerChildren = (parent: string, childSelector: string, staggerDelay = 0.1) =>
  gsap.fromTo(`${parent} ${childSelector}`,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.6,
      stagger: staggerDelay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    }
  );

// ===== Counter Animation =====
export const counterAnimation = (element: HTMLElement, targetValue: number, duration = 2) => {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: targetValue,
    duration,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toLocaleString();
    },
  });
};

// ===== Parallax Scroll =====
export const parallaxScroll = (element: gsap.TweenTarget, speed = 0.3) =>
  gsap.to(element, {
    yPercent: -speed * 100,
    ease: 'none',
    scrollTrigger: {
      trigger: element as gsap.DOMTarget,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

// ===== Magnetic Hover =====
export const magneticHover = (element: HTMLElement, strength = 0.3) => {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// ===== Page Transition =====
export const pageTransitionIn = (element: gsap.TweenTarget) =>
  gsap.fromTo(element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
  );

// ===== Hero Text Split =====
export const heroTextReveal = (element: HTMLElement) => {
  const text = element.textContent || '';
  element.textContent = '';
  const chars = text.split('').map((char) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    element.appendChild(span);
    return span;
  });

  return gsap.to(chars, {
    opacity: 1,
    y: 0,
    duration: 0.05,
    stagger: 0.03,
    ease: 'power2.out',
    delay: 0.3,
  });
};

// ===== Scroll-triggered reveal for any element =====
export const scrollReveal = (element: gsap.TweenTarget, options?: gsap.TweenVars) =>
  gsap.fromTo(element,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element as gsap.DOMTarget,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      ...options,
    }
  );
