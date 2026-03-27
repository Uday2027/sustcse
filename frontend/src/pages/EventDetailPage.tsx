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
        <div className="container" style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <Link to="/events" className="hero__btn hero__btn--secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem', padding: '0.6rem 1.2rem' }}>
            <FiArrowLeft /> Back to Events
          </Link>

          <div ref={contentRef} className="event-detail-header">
            {event.type && (
              <span className="event-detail-type">{event.type}</span>
            )}
            <h1 className="event-detail-title">{event.title}</h1>
          </div>

          <div className="event-detail-layout">
            <aside className="event-detail-left">
              <div className="event-sidebar-card">
                <span className="event-sidebar-label">Global Details</span>
                
                <div className="event-meta-item">
                  <div className="event-meta-icon"><FiCalendar /></div>
                  <div className="event-meta-content">
                    <h4>Timeline</h4>
                    <p>{formatDateTime(event.start_date)}</p>
                    {event.end_date && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>to {formatDateTime(event.end_date)}</p>}
                  </div>
                </div>

                {event.venue && (
                  <div className="event-meta-item">
                    <div className="event-meta-icon"><FiMapPin /></div>
                    <div className="event-meta-content">
                      <h4>Location</h4>
                      <p>{event.venue}</p>
                    </div>
                  </div>
                )}

                <div className="event-meta-item">
                  <div className="event-meta-icon"><FiUsers /></div>
                  <div className="event-meta-content">
                    <h4>Host</h4>
                    <p>{event.organized_by}</p>
                  </div>
                </div>
              </div>
            </aside>

            <main className="event-detail-main">
              {event.cover_image_url && (
                <div className="event-detail-image-box">
                  <img src={event.cover_image_url} alt={event.title} />
                </div>
              )}

              <div className="event-detail-content">
                {event.description}
              </div>
            </main>

            <aside className="event-detail-right">
              {event.registration_url && (
                <div className="event-sidebar-card" style={{ background: 'var(--color-bg-secondary)', border: 'none' }}>
                  <span className="event-sidebar-label">Action</span>
                  <a href={event.registration_url} target="_blank" rel="noopener noreferrer" className="event-reg-btn">
                    Register Now <FiExternalLink />
                  </a>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                    Join this conversation.
                  </p>
                </div>
              )}

              {event.attachment_urls.length > 0 && (
                <div className="event-sidebar-card">
                  <span className="event-sidebar-label">Resources</span>
                  <div className="event-attachments-list" style={{ marginTop: '0' }}>
                    {event.attachment_urls.map((url, i) => {
                      const rawFilename = url.split('/').pop() || `Resource ${i + 1}`;
                      const filename = decodeURIComponent(rawFilename);
                      return (
                        <a 
                          key={i} 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="event-attachment-item"
                          download={filename}
                          title={filename}
                        >
                          <FiPaperclip size={16} style={{ flexShrink: 0 }} />
                          <span className="event-attachment-name">{filename}</span>
                          <FiDownload size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
