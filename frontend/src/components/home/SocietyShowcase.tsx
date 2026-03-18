import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../../lib/api';
import type { SocietyMember } from '../../types';

gsap.registerPlugin(ScrollTrigger);

export default function SocietyShowcase() {
  const [members, setMembers] = useState<SocietyMember[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await api.get('/society-members?status=current&limit=8');
        setMembers(data.data || []);
      } catch {
        setMembers([]);
      }
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    if (!sectionRef.current || members.length === 0) return;
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo('.society-premium__header',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );

      // Members stagger
      gsap.fromTo('.society-premium__member',
        { opacity: 0, y: 40, filter: 'grayscale(100%)' },
        {
          opacity: 1, y: 0, filter: 'grayscale(0%)',
          duration: 0.8, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.society-premium__grid', start: 'top 75%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [members]);

  return (
    <section ref={sectionRef} className="section society-premium">
      <div className="container">
        
        <div className="society-premium__header">
          <h2 className="dept-editorial__title" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            CSE<br />
            <span className="text-gradient">Society.</span>
          </h2>
          <p className="vm-premium__label vm-premium__label--center">Current Committee</p>
        </div>

        {members.length > 0 ? (
          <div className="society-premium__grid">
            {members.map((member) => (
              <div key={member.id} className="society-premium__member">
                <div className="society-premium__avatar">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt={member.full_name} />
                  ) : (
                    <div className="society-premium__avatar-fallback">
                      {member.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="society-premium__info">
                  <h4 className="society-premium__name">{member.full_name}</h4>
                  <p className="society-premium__position">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="society-premium__empty">
            <p>CSE Society members will be showcased here.</p>
            <a href="/society" className="dept-editorial__btn" style={{ marginTop: '2rem' }}>
              View Society Page →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
