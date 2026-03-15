import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiSearch, FiChevronLeft, FiChevronRight, FiExternalLink } from 'react-icons/fi';
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
          <div className="skeu-panel" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Filter by type:</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type}
                    className="skeu-btn"
                    onClick={() => { setEventType(type); setPage(1); }}
                    style={{
                      background: eventType === type ? 'var(--color-primary)' : undefined,
                      color: eventType === type ? '#fff' : undefined,
                      fontSize: '0.85rem',
                      padding: '0.4rem 0.85rem',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading && <LoadingSpinner />}

          {error && (
            <div className="skeu-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-error)' }}>
              <p>Failed to load events. Please try again later.</p>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="skeu-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <FiCalendar size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <h3>No Events Found</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                {eventType !== 'All' ? 'Try selecting a different event type.' : 'No events have been published yet.'}
              </p>
            </div>
          )}

          {/* Events Grid */}
          {!loading && events.length > 0 && (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button
                className="skeu-btn"
                onClick={() => setPage(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <FiChevronLeft /> Previous
              </button>
              <span style={{ color: 'var(--text-muted)' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="skeu-btn"
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
    <Link to={`/events/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="skeu-card" style={{ overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Cover Image */}
        <div style={{ position: 'relative', height: '180px', background: 'var(--color-surface-alt, #f0f0f0)', overflow: 'hidden' }}>
          {event.cover_image_url ? (
            <img
              src={event.cover_image_url}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              <FiCalendar size={48} />
            </div>
          )}
          {/* Date Badge */}
          <div style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'var(--color-primary)', color: '#fff',
            borderRadius: '8px', padding: '0.5rem 0.75rem', textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)', lineHeight: 1.2,
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' }}>{month}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{day}</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {event.event_type && (
              <span style={{
                padding: '0.15rem 0.5rem', borderRadius: '9999px',
                background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.7rem', fontWeight: 600,
              }}>
                {event.event_type}
              </span>
            )}
          </div>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', lineHeight: 1.3 }}>{event.title}</h3>
          {event.venue && (
            <p style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <FiMapPin size={12} /> {event.venue}
            </p>
          )}
          <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 'auto' }}>
            {formatDateTime(event.start_date)}
          </p>
        </div>
      </div>
    </Link>
  );
}
