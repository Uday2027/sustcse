import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { usePaginatedFetch } from '../hooks/usePagination';
import { useScrollReveal } from '../hooks/useGSAP';
import { formatDate, formatDateTime } from '../lib/formatters';
import type { Event } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EVENT_TYPES = ['All', 'Seminar', 'Workshop', 'Competition', 'Cultural', 'Sports', 'Meetup', 'Other'];

export default function EventsPage() {
  const [eventType, setEventType] = useState('All');
  const headerRef = useScrollReveal<HTMLDivElement>();

  const params = useMemo(() => {
    const p: Record<string, string> = {};
    if (eventType !== 'All') p.event_type = eventType;
    return p;
  }, [eventType]);

  const { data: events, loading, error, pagination, setPage } = usePaginatedFetch<Event>(
    '/events',
    params,
    12
  );

  return (
    <div className="page events-page">
      <section className="section">
        <div className="container">
          <div ref={headerRef} className="page-header">
            <h1 className="page-title">Events</h1>
            <p className="page-subtitle">
              Discover upcoming and past events from the Department of CSE, SUST.
            </p>
          </div>

          {/* Filter */}
          <div className="filter-bar">
            <div className="filter-bar__chips">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type}
                  className={
                    eventType === type
                      ? 'filter-chip filter-chip--active'
                      : 'filter-chip'
                  }
                  onClick={() => { setEventType(type); setPage(1); }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {loading && <LoadingSpinner />}

          {error && (
            <div className="bento-card empty-state">
              <p style={{ color: 'var(--color-error)' }}>Failed to load events. Please try again later.</p>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="bento-card empty-state">
              <FiCalendar size={48} />
              <h3>No Events Found</h3>
              <p>
                {eventType !== 'All'
                  ? 'Try selecting a different event type.'
                  : 'No events have been published yet.'}
              </p>
            </div>
          )}

          {/* Events Grid */}
          {!loading && events.length > 0 && (
            <div className="events-bento">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="filter-chip"
                onClick={() => setPage(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <FiChevronLeft /> Previous
              </button>
              <span className="pagination__info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="filter-chip"
                onClick={() => setPage(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const startDate = new Date(event.start_date);
  const month = startDate.toLocaleString('en', { month: 'short' }).toUpperCase();
  const day = startDate.getDate();

  return (
    <Link to={`/events/${event.id}`} className="event-card bento-card">
      {/* Cover Image */}
      <div className="event-card__image">
        {event.cover_image_url ? (
          <img src={event.cover_image_url} alt={event.title} />
        ) : (
          <div className="event-card__image-placeholder">
            <FiCalendar size={48} />
          </div>
        )}
        {/* Date Badge */}
        <div className="event-card__date-badge">
          <span className="event-card__date-month">{month}</span>
          <span className="event-card__date-day">{day}</span>
        </div>
      </div>

      {/* Body */}
      <div className="event-card__body">
        {event.event_type && (
          <span className="badge badge--accent">{event.event_type}</span>
        )}
        <h3 className="event-card__title">{event.title}</h3>
        {event.venue && (
          <p className="event-card__venue">
            <FiMapPin size={14} /> {event.venue}
          </p>
        )}
        <p className="event-card__time">
          <FiClock size={14} /> {formatDateTime(event.start_date)}
        </p>
      </div>
    </Link>
  );
}
