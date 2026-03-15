import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import api from '../../lib/api';
import type { Notice } from '../../types';

export default function NoticeTicker() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await api.get('/notices?limit=10');
        setNotices(data.data || []);
      } catch {
        setNotices([]);
      }
    };
    fetchNotices();
  }, []);

  if (notices.length === 0) return null;

  return (
    <div className="notice-ticker">
      <div className="notice-ticker__label">
        <FiBell size={14} />
        <span>Notices</span>
      </div>
      <div className="notice-ticker__track">
        <div className="notice-ticker__content">
          {[...notices, ...notices].map((notice, index) => (
            <Link
              key={`${notice.id}-${index}`}
              to={`/notices/${notice.id}`}
              className="notice-ticker__item"
            >
              {notice.category && (
                <span className={`notice-ticker__badge notice-ticker__badge--${notice.category}`}>
                  {notice.category}
                </span>
              )}
              <span className="notice-ticker__title">{notice.title}</span>
              <span className="notice-ticker__separator">|</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
