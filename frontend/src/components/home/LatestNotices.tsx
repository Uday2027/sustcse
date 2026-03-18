import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight } from 'react-icons/fi';
import api from '../../lib/api';
import { formatRelative } from '../../lib/formatters';
import type { Notice } from '../../types';

gsap.registerPlugin(ScrollTrigger);

export default function LatestNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

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
    if (!listRef.current || notices.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.notice-premium__item',
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0,
          duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: listRef.current, start: 'top 85%' },
        }
      );
    }, listRef);
    return () => ctx.revert();
  }, [notices]);

  return (
    <div className="updates-premium__col">
      <div className="updates-premium__header">
        <h3 className="skeu-heading skeu-heading--sm" style={{ letterSpacing: '0.15em' }}>Latest Notices</h3>
        <Link to="/notices" className="updates-premium__link">View All <FiArrowRight /></Link>
      </div>

      <div ref={listRef} className="updates-premium__list">
        {notices.length > 0 ? notices.map((notice) => (
          <Link key={notice.id} to={`/notices/${notice.id}`} className="notice-premium__item">
            <span className="notice-premium__date">{formatRelative(notice.published_at)}</span>
            <div className="notice-premium__content">
              {notice.category && (
                <span className={`notice-premium__badge notice-premium__badge--${notice.category}`}>
                  {notice.category}
                </span>
              )}
              <h4 className="notice-premium__title">{notice.title}</h4>
            </div>
          </Link>
        )) : (
          <div className="updates-premium__empty">No notices yet.</div>
        )}
      </div>
    </div>
  );
}
