import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCalendar, FiPaperclip, FiChevronLeft, FiChevronRight, FiMapPin, FiFileText } from 'react-icons/fi';
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
          <div className="filter-bar">
            <div style={{ position: 'relative', flex: 1 }}>
              <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
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

          {/* Loading State */}
          {loading && <LoadingSpinner />}

          {/* Error State */}
          {error && (
            <div className="bento-card" style={{ textAlign: 'center', color: 'var(--color-danger)' }}>
              <p>Failed to load notices. Please try again later.</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && notices.length === 0 && (
            <div className="bento-card empty-state">
              <div className="empty-state__icon">
                <FiFileText size={48} />
              </div>
              <h3 className="empty-state__title">No Notices Found</h3>
              <p className="empty-state__text">
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
              <div className="notices-bento">
                {pinnedNotices.map((notice) => (
                  <NoticeCard key={notice.id} notice={notice} pinned />
                ))}
              </div>
            </div>
          )}

          {/* Regular Notices */}
          {!loading && regularNotices.length > 0 && (
            <div className="notices-bento">
              {regularNotices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="skeu-btn"
                onClick={() => setPage(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <FiChevronLeft /> Previous
              </button>
              <span className="pagination__info">
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
    <Link
      to={`/notices/${notice.id}`}
      className={`notice-card bento-card${pinned ? ' bento-card--accent-left notice-card--pinned' : ''}`}
    >
      <div className="notice-card__icon-col">
        <div className="icon-box icon-box--accent">
          <FiFileText size={20} />
        </div>
      </div>
      <div className="notice-card__content">
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          {notice.category && (
            <span className="badge badge--accent">{notice.category}</span>
          )}
          {pinned && (
            <span className="badge badge--warning">
              <FiMapPin size={10} /> Pinned
            </span>
          )}
        </div>
        <h3 className="notice-card__title">{notice.title}</h3>
        <p className="notice-card__excerpt">
          {notice.content.length > 200 ? notice.content.substring(0, 200) + '...' : notice.content}
        </p>
        <div className="notice-card__meta">
          <span className="notice-card__meta-item">
            <FiCalendar size={12} /> {formatDate(notice.published_at)}
          </span>
          <span className="notice-card__meta-item" title={formatDate(notice.published_at)}>
            {formatRelative(notice.published_at)}
          </span>
          {notice.publisher_name && (
            <span className="notice-card__meta-item">by {notice.publisher_name}</span>
          )}
          {notice.attachment_urls.length > 0 && (
            <span className="notice-card__meta-item">
              <FiPaperclip size={12} /> {notice.attachment_urls.length} attachment{notice.attachment_urls.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
