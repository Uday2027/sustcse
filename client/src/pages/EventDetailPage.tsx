import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiMapPin, FiExternalLink, FiUsers, FiClock, FiDownload, FiPaperclip } from 'react-icons/fi';
import api from '../lib/api';
import { formatDate, formatDateTime } from '../lib/formatters';
import { useScrollReveal } from '../hooks/useGSAP';
import type { Event } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: res } = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (error || !event) {
    return (
      <div className="page event-detail-page">
        <section className="section">
          <div className="container">
            <Link to="/events" className="skeu-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <FiArrowLeft /> Back to Events
            </Link>
            <div className="skeu-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <h2>Event Not Found</h2>
              <p style={{ color: 'var(--text-muted)' }}>{error || 'The event you are looking for does not exist.'}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page event-detail-page">
      <section className="section">
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link to="/events" className="skeu-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <FiArrowLeft /> Back to Events
          </Link>

          <div ref={contentRef}>
            {/* Cover Image */}
            {event.cover_image_url && (
              <div className="skeu-card" style={{ overflow: 'hidden', marginBottom: '1.5rem', padding: 0 }}>
                <img
                  src={event.cover_image_url}
                  alt={event.title}
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            )}

            <div className="skeu-card" style={{ padding: '2rem' }}>
              {/* Badges */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {event.event_type && (
                  <span style={{
                    padding: '0.2rem 0.6rem', borderRadius: '9999px',
                    background: 'var(--color-primary)', color: '#fff', fontSize: '0.75rem', fontWeight: 600,
                  }}>
                    {event.event_type}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 style={{ margin: '0 0 1.5rem', fontSize: '1.75rem', lineHeight: 1.3 }}>{event.title}</h1>

              {/* Meta Grid */}
              <div className="skeu-panel" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FiCalendar size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Start Date</div>
                      <div style={{ fontWeight: 500 }}>{formatDateTime(event.start_date)}</div>
                    </div>
                  </div>
                  {event.end_date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <FiClock size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>End Date</div>
                        <div style={{ fontWeight: 500 }}>{formatDateTime(event.end_date)}</div>
                      </div>
                    </div>
                  )}
                  {event.venue && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <FiMapPin size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Venue</div>
                        <div style={{ fontWeight: 500 }}>{event.venue}</div>
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FiUsers size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Organized by</div>
                      <div style={{ fontWeight: 500 }}>{event.organized_by}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
                {event.description}
              </div>

              {/* Registration Link */}
              {event.registration_url && (
                <div style={{ marginBottom: '2rem' }}>
                  <a
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="skeu-btn"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      background: 'var(--color-primary)', color: '#fff', padding: '0.75rem 1.5rem',
                      textDecoration: 'none', fontSize: '1rem', fontWeight: 600,
                    }}
                  >
                    <FiExternalLink /> Register Now
                  </a>
                </div>
              )}

              {/* Attachments */}
              {event.attachment_urls.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-color, #e0e0e0)', margin: '0 0 1.5rem' }} />
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <FiPaperclip /> Attachments
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {event.attachment_urls.map((url, i) => {
                      const filename = url.split('/').pop() || `Attachment ${i + 1}`;
                      return (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="skeu-btn"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', width: 'fit-content' }}
                        >
                          <FiDownload size={14} /> {filename}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
