import { useEffect, useRef, useState } from 'react';
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

  const handleToggle = () => {
    const nextMode = mode === 'login' ? 'register' : 'login';
    const tl = gsap.timeline();

    tl.to(formWrapperRef.current, {
      y: -30,
      opacity: 0,
      filter: 'blur(12px)',
      duration: 0.35,
      ease: 'power3.in',
      onComplete: () => setMode(nextMode),
    });

    tl.fromTo(formWrapperRef.current,
      { y: 30, opacity: 0, filter: 'blur(12px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' }
    );
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      );
      gsap.fromTo(formWrapperRef.current,
        { opacity: 0, y: 30, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out', delay: 0.15 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="auth-page" ref={containerRef}>
      <div className="auth-page__inner">

        {/* Branding header */}
        <div className="auth-page__header">
          <p className="auth-page__tag">
            {mode === 'login' ? '// authenticate' : '// new.identity'}
          </p>
          <h1 className="auth-page__title">
            {mode === 'login' ? (
              <>Welcome<br />Back.</>
            ) : (
              <>Create<br />Account.</>
            )}
          </h1>
          <p className="auth-page__sub">
            {mode === 'login'
              ? 'Sign in to access the CSE portal and its full suite of academic resources.'
              : 'Join the Department of Computer Science & Engineering, SUST.'
            }
          </p>
        </div>

        {/* Form Card */}
        <div ref={formWrapperRef} className="auth-page__card">
          {mode === 'login' ? (
            <LoginForm onToggleMode={handleToggle} />
          ) : (
            <RegisterForm onToggleMode={handleToggle} />
          )}
        </div>

        {/* Bottom stats */}
        <div className="auth-page__metrics">
          <div className="auth-page__metric">
            <span className="auth-page__metric-value">30+</span>
            <span className="auth-page__metric-label">Years</span>
          </div>
          <div className="auth-page__metric">
            <span className="auth-page__metric-value">2k+</span>
            <span className="auth-page__metric-label">Alumni</span>
          </div>
          <div className="auth-page__metric">
            <span className="auth-page__metric-value">100%</span>
            <span className="auth-page__metric-label">Secure</span>
          </div>
        </div>

      </div>
    </div>
  );
}
