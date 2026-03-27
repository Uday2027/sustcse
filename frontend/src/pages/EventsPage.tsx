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
    if (eventType !== 'All') p.type = eventType;
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
    <Link to={`/events/${event.id}`} className="event-card">
      <div className="event-card__image-wrapper">
        {event.cover_image_url ? (
          <img src={event.cover_image_url} alt={event.title} loading="lazy" />
        ) : (
          <div className="event-card__image-placeholder">
            <FiCalendar size={40} opacity={0.3} />
          </div>
        )}
        <div className="event-card__date-overlay">
          <span className="event-card__date-day">{day}</span>
          <span className="event-card__date-month">{month}</span>
        </div>
      </div>

      <div className="event-card__content">
        {event.type && (
          <span className="event-card__type-badge">{event.type}</span>
        )}
        <h3 className="event-card__title">{event.title}</h3>

        {event.venue && (
          <div className="event-card__info-row">
            <FiMapPin size={14} />
            <span>{event.venue}</span>
          </div>
        )}

        <div className="event-card__info-row">
          <FiClock size={14} />
          <span>{formatDateTime(event.start_date)}</span>
        </div>

        <div className="event-card__footer">
          <span className="event-card__learn-more">
            View Details <FiChevronRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
