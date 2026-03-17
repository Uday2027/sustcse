import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiFileText, FiArrowRight } from 'react-icons/fi';
import api from '../../lib/api';
import { formatRelative } from '../../lib/formatters';
import type { Notice } from '../../types';

gsap.registerPlugin(ScrollTrigger);

export default function LatestNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await api.get('/notices?limit=5');
        setNotices(data.data || []);
      } catch {
        setNotices([]);
      }
    };
    fetchNotices();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.notice-item',
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0,
          duration: 0.5, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [notices]);

  return (
    <div ref={sectionRef} className="latest-notices">
      <div className="latest-notices__header">
        <h3 className="skeu-heading skeu-heading--md">
          <FiFileText /> Latest Notices
        </h3>
        <Link to="/notices" className="skeu-btn skeu-btn--sm">View All <FiArrowRight /></Link>
      </div>

      <div className="latest-notices__list">
        {notices.length > 0 ? notices.map((notice) => (
          <Link key={notice.id} to={`/notices/${notice.id}`} className="notice-item skeu-card skeu-card--flat">
            {notice.category && (
              <span className={`skeu-card__badge skeu-card__badge--${notice.category}`}>
                {notice.category}
              </span>
            )}
            <h4 className="notice-item__title">{notice.title}</h4>
            <span className="notice-item__date">{formatRelative(notice.published_at)}</span>
          </Link>
        )) : (
          <div className="skeu-card skeu-card--flat" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>No notices yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
