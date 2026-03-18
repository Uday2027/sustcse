import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';
import api from '../../lib/api';
import { formatDate } from '../../lib/formatters';
import type { Event } from '../../types';

gsap.registerPlugin(ScrollTrigger);

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events?limit=4&upcoming=true');
        setEvents(data.data || []);
      } catch {
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!listRef.current || events.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.event-premium__item',
        { opacity: 0, x: 30 },
        {
          opacity: 1, x: 0,
          duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: listRef.current, start: 'top 85%' },
        }
      );
    }, listRef);
    return () => ctx.revert();
  }, [events]);

  return (
    <div className="updates-premium__col">
      <div className="updates-premium__header">
        <h3 className="skeu-heading skeu-heading--sm" style={{ letterSpacing: '0.15em' }}>Upcoming Events</h3>
        <Link to="/events" className="updates-premium__link">View All <FiArrowRight /></Link>
      </div>

      <div ref={listRef} className="updates-premium__list">
        {events.length > 0 ? events.map((event) => {
          const d = new Date(event.start_date);
          return (
            <Link key={event.id} to={`/events/${event.id}`} className="event-premium__item">
              <div className="event-premium__date-block">
                <span className="event-premium__day">{d.getDate()}</span>
                <span className="event-premium__month">{d.toLocaleString('en', { month: 'short' })}</span>
              </div>
              <div className="event-premium__content">
                <h4 className="event-premium__title">{event.title}</h4>
                <div className="event-premium__meta">
                  <span>{formatDate(event.start_date)}</span>
                  {event.venue && <span><FiMapPin /> {event.venue}</span>}
                </div>
              </div>
            </Link>
          );
        }) : (
          <div className="updates-premium__empty">No upcoming events.</div>
        )}
      </div>
    </div>
  );
}
