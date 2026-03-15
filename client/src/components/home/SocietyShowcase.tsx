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
        // Use placeholder data if API not ready
        setMembers([]);
      }
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    if (!sectionRef.current || members.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.society-member-card',
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: '.society-showcase__grid', start: 'top 85%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [members]);

  return (
    <section ref={sectionRef} className="section society-showcase">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title skeu-heading">CSE Society</h2>
          <p className="section__subtitle">Current Committee Members</p>
        </div>

        {members.length > 0 ? (
          <div className="society-showcase__grid grid grid--4">
            {members.map((member) => (
              <div key={member.id} className="society-member-card skeu-card">
                <div className="society-member-card__avatar">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt={member.full_name} />
                  ) : (
                    <div className="society-member-card__avatar-placeholder">
                      {member.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                <h4 className="society-member-card__name">{member.full_name}</h4>
                <p className="society-member-card__position">{member.position}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="society-showcase__empty skeu-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>CSE Society members will be showcased here.</p>
            <a href="/society" className="skeu-btn skeu-btn--primary" style={{ marginTop: '1rem' }}>
              View Society Page
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
