import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import gsap from 'gsap';

type AuthMode = 'login' | 'register';

export default function LoginPage() {
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>(
    location.pathname === '/register' ? 'register' : 'login'
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const brandingRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const nextMode = mode === 'login' ? 'register' : 'login';
    
    // "Air-Blow" Animation
    const tl = gsap.timeline();
    
    // 1. Blow away current form to the right (since it's on the left)
    tl.to(formWrapperRef.current, {
      x: 100,
      scale: 1.2,
      opacity: 0,
      filter: 'blur(15px)',
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        setMode(nextMode);
      }
    });

    // 2. Subtle branding pulse
    tl.to(brandingRef.current, {
      opacity: 0.7,
      x: 10,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut'
    }, "-=0.4");

    // 3. New form drifts in from the left
    tl.fromTo(formWrapperRef.current, 
      { x: -100, scale: 0.8, opacity: 0, filter: 'blur(15px)' },
      { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out' }
    );
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation
      gsap.from(containerRef.current, {
        scale: 1.1,
        duration: 2,
        ease: 'power2.out'
      });

      gsap.fromTo('.auth-page--animated__split', 
        { x: '100%', opacity: 0 },
        { x: '10%', opacity: 1, duration: 1.5, ease: 'power4.out', delay: 0.2 }
      );

      gsap.from('.auth-branding > *', {
        opacity: 0,
        x: -100,
        stagger: 0.2,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.5
      });
      
      gsap.from(formWrapperRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.8
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      className="auth-page--animated" 
      ref={containerRef}
      style={{ backgroundImage: 'url("/images/login.png")' }}
    >
      <div className="auth-page--animated__split" />
      
      <div className="auth-page--animated__left">
        <div ref={formWrapperRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {mode === 'login' ? (
            <LoginForm onToggleMode={handleToggle} />
          ) : (
            <RegisterForm onToggleMode={handleToggle} />
          )}
        </div>
      </div>

      <div className="auth-page--animated__right">
        <div className="auth-branding" ref={brandingRef}>
          <p>{mode === 'login' ? 'Welcome Back' : 'Get Started'}</p>
          <h1>{mode === 'login' ? 'Login' : 'Register'}<br />Page</h1>
          <p style={{ color: 'white', opacity: 0.6, fontSize: '0.9rem', marginTop: '1rem', letterSpacing: '0.1em' }}>
            {mode === 'login' ? 'Start your journey now' : 'Join our community today'}
          </p>
        </div>
      </div>
    </div>
  );
}
