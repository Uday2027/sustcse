import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import api from '../../lib/api';
import type { Notice } from '../../types';

export default function NoticeTicker() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      const fallbackNotices = [
        { id: '1', title: 'CSE Festival 2026 Schedule Announced', category: 'event' },
        { id: '2', title: 'Registration for Fall Semester Open', category: 'urgent' },
        { id: '3', title: 'New Cybersecurity Research Lab Inauguration', category: 'general' },
        { id: '4', title: 'Seminar on AI in Healthcare this Thursday', category: 'event' },
      ] as Notice[];

      try {
        const { data } = await api.get('/notices?limit=10');
        if (data?.data && data.data.length > 0) {
          setNotices(data.data);
        } else {
          setNotices(fallbackNotices);
        }
      } catch {
        setNotices(fallbackNotices);
      }
    };
    fetchNotices();
  }, []);

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
