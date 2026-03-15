import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCalendar, FiPaperclip, FiChevronLeft, FiChevronRight, FiMapPin } from 'react-icons/fi';
import { usePaginatedFetch } from '../hooks/usePagination';
import { useScrollReveal } from '../hooks/useGSAP';
import { formatDate, formatRelative } from '../lib/formatters';
import type { Notice } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CATEGORIES = ['All', 'Academic', 'Administrative', 'Event', 'Exam', 'Result', 'Scholarship', 'Other'];

export default function NoticesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const headerRef = useScrollReveal<HTMLDivElement>();

  const params = useMemo(() => {
    const p: Record<string, string> = {};
    if (search) p.search = search;
    if (category !== 'All') p.category = category;
    return p;
  }, [search, category]);

  const { data: notices, loading, error, pagination, setPage } = usePaginatedFetch<Notice>(
    '/notices',
    params,
    12
  );

  const pinnedNotices = notices.filter((n) => n.is_pinned);
  const regularNotices = notices.filter((n) => !n.is_pinned);

  return (
    <div className="page notices-page">
      {/* Page Header */}
      <section className="section">
        <div className="container">
          <div ref={headerRef} className="page-header">
            <h1 className="page-title">Notices &amp; Announcements</h1>
            <p className="page-subtitle">
              Stay updated with the latest notices from the Department of CSE, SUST.
            </p>
          </div>

          {/* Filters */}
          <div className="skeu-panel" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <div className="grid" style={{ gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="skeu-input"
                  placeholder="Search notices..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  style={{ paddingLeft: '2.5rem', width: '100%' }}
                />
              </div>
              <select
                className="skeu-input"
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                style={{ minWidth: '160px' }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && <LoadingSpinner />}

          {/* Error State */}
          {error && (
            <div className="skeu-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-error)' }}>
              <p>Failed to load notices. Please try again later.</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && notices.length === 0 && (
            <div className="skeu-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <FiCalendar size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <h3>No Notices Found</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                {search || category !== 'All'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'There are no notices published yet.'}
              </p>
            </div>
          )}

          {/* Pinned Notices */}
          {!loading && pinnedNotices.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiMapPin /> Pinned Notices
              </h2>
              <div className="grid" style={{ gap: '1rem' }}>
                {pinnedNotices.map((notice) => (
                  <NoticeCard key={notice.id} notice={notice} pinned />
                ))}
              </div>
            </div>
          )}

          {/* Regular Notices */}
          {!loading && regularNotices.length > 0 && (
            <div className="grid" style={{ gap: '1rem' }}>
              {regularNotices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
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

function NoticeCard({ notice, pinned = false }: { notice: Notice; pinned?: boolean }) {
  return (
    <Link to={`/notices/${notice.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        className="skeu-card"
        style={{
          padding: '1.5rem',
          borderLeft: pinned ? '4px solid var(--color-primary)' : undefined,
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              {pinned && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                  padding: '0.15rem 0.5rem', borderRadius: '9999px',
                  background: 'var(--color-primary)', color: '#fff', fontSize: '0.75rem', fontWeight: 600,
                }}>
                  <FiMapPin size={10} /> Pinned
                </span>
              )}
              {notice.category && (
                <span style={{
                  padding: '0.15rem 0.5rem', borderRadius: '9999px',
                  background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.75rem', fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}>
                  {notice.category}
                </span>
              )}
            </div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>{notice.title}</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              {notice.content.length > 200 ? notice.content.substring(0, 200) + '...' : notice.content}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FiCalendar size={12} /> {formatDate(notice.published_at)}
          </span>
          <span title={formatDate(notice.published_at)}>{formatRelative(notice.published_at)}</span>
          {notice.publisher_name && <span>by {notice.publisher_name}</span>}
          {notice.attachment_urls.length > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <FiPaperclip size={12} /> {notice.attachment_urls.length} attachment{notice.attachment_urls.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
