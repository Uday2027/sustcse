import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiDownload, FiPaperclip, FiMapPin, FiUser } from 'react-icons/fi';
import api from '../lib/api';
import { formatDate, formatRelative } from '../lib/formatters';
import { useScrollReveal } from '../hooks/useGSAP';
import type { Notice } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function NoticeDetailPage() {
  const { id } = useParams();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const fetchNotice = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: res } = await api.get(`/notices/${id}`);
        setNotice(res.data);
      } catch {
        setError('Failed to load notice. It may have been removed or does not exist.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchNotice();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (error || !notice) {
    return (
      <div className="page notice-detail-page">
        <section className="section">
          <div className="container">
            <Link to="/notices" className="skeu-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <FiArrowLeft /> Back to Notices
            </Link>
            <div className="skeu-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <h2>Notice Not Found</h2>
              <p style={{ color: 'var(--text-muted)' }}>{error || 'The notice you are looking for does not exist.'}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page notice-detail-page">
      <section className="section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link to="/notices" className="skeu-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <FiArrowLeft /> Back to Notices
          </Link>

          <div ref={contentRef} className="skeu-card" style={{ padding: '2rem' }}>
            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {notice.is_pinned && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                  padding: '0.2rem 0.6rem', borderRadius: '9999px',
                  background: 'var(--color-primary)', color: '#fff', fontSize: '0.75rem', fontWeight: 600,
                }}>
                  <FiMapPin size={10} /> Pinned
                </span>
              )}
              {notice.category && (
                <span style={{
                  padding: '0.2rem 0.6rem', borderRadius: '9999px',
                  background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.75rem', fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}>
                  {notice.category}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 style={{ margin: '0 0 1rem', fontSize: '1.75rem', lineHeight: 1.3 }}>{notice.title}</h1>

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FiCalendar size={14} /> {formatDate(notice.published_at)}
              </span>
              <span>{formatRelative(notice.published_at)}</span>
              {notice.publisher_name && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <FiUser size={14} /> {notice.publisher_name}
                </span>
              )}
            </div>

            {/* Divider */}
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color, #e0e0e0)', margin: '0 0 2rem' }} />

            {/* Content */}
            <div
              className="notice-content"
              style={{ lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-wrap' }}
            >
              {notice.content}
            </div>

            {/* Attachments */}
            {notice.attachment_urls.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color, #e0e0e0)', margin: '0 0 1.5rem' }} />
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <FiPaperclip /> Attachments ({notice.attachment_urls.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {notice.attachment_urls.map((url, i) => {
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

            {/* Expiry */}
            {notice.expires_at && (
              <div style={{ marginTop: '2rem', padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--color-surface-alt, #fff3cd)', fontSize: '0.875rem' }}>
                This notice expires on {formatDate(notice.expires_at)}.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
