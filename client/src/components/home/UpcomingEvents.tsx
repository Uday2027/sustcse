import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiCalendar, FiArrowRight, FiMapPin } from 'react-icons/fi';
import api from '../../lib/api';
import { formatDate } from '../../lib/formatters';
import type { Event } from '../../types';

gsap.registerPlugin(ScrollTrigger);

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events?limit=3&upcoming=true');
        setEvents(data.data || []);
      } catch {
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.event-preview-card',
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0,
          duration: 0.5, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [events]);

  return (
    <div ref={sectionRef} className="upcoming-events">
      <div className="upcoming-events__header">
        <h3 className="skeu-heading skeu-heading--md">
          <FiCalendar /> Upcoming Events
        </h3>
        <Link to="/events" className="skeu-btn skeu-btn--sm">View All <FiArrowRight /></Link>
      </div>

      <div className="upcoming-events__list">
        {events.length > 0 ? events.map((event) => (
          <Link key={event.id} to={`/events/${event.id}`} className="event-preview-card skeu-card skeu-card--flat">
            <div className="event-preview-card__date-badge">
              <span className="event-preview-card__date-day">
                {new Date(event.start_date).getDate()}
              </span>
              <span className="event-preview-card__date-month">
                {new Date(event.start_date).toLocaleString('en', { month: 'short' })}
              </span>
            </div>
            <div className="event-preview-card__info">
              <h4>{event.title}</h4>
              {event.venue && <p><FiMapPin size={14} /> {event.venue}</p>}
              <p className="event-preview-card__time">{formatDate(event.start_date)}</p>
            </div>
          </Link>
        )) : (
          <div className="skeu-card skeu-card--flat" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>No upcoming events.</p>
          </div>
        )}
      </div>
    </div>
  );
}
