import { useState, useMemo } from 'react';
import { FiSearch, FiUser, FiMapPin, FiLinkedin, FiChevronLeft, FiChevronRight, FiBriefcase } from 'react-icons/fi';
import { usePaginatedFetch } from '../hooks/usePagination';
import { useScrollReveal } from '../hooks/useGSAP';
import type { Alumni } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function AlumniPage() {
  const [search, setSearch] = useState('');
  const [session, setSession] = useState('All');
  const headerRef = useScrollReveal<HTMLDivElement>();

  const params = useMemo(() => {
    const p: Record<string, string> = {};
    if (search) p.search = search;
    if (session !== 'All') p.session_name = session;
    return p;
  }, [search, session]);

  const { data: alumni, loading, error, pagination, setPage } = usePaginatedFetch<Alumni>(
    '/alumni',
    params,
    12
  );

  // Extract unique sessions for the filter
  const sessions = useMemo(() => {
    const unique = new Set(alumni.map((a) => a.session_name).filter(Boolean));
    return ['All', ...Array.from(unique).sort().reverse()];
  }, [alumni]);

  return (
    <div className="page alumni-page">
      <section className="section">
        <div className="container">
          <div ref={headerRef} className="page-header">
            <h1 className="page-title">Alumni Network</h1>
            <p className="page-subtitle">
              Stay connected with the graduates of the Department of CSE, SUST.
            </p>
          </div>

          {/* Filters */}
          <div className="filter-bar">
            <div className="filter-bar__search">
              <FiSearch className="filter-bar__search-icon" />
              <input
                type="text"
                className="filter-bar__input"
                placeholder="Search alumni by name..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <select
              className="filter-bar__select"
              value={session}
              onChange={(e) => { setSession(e.target.value); setPage(1); }}
            >
              {sessions.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All Sessions' : s}</option>
              ))}
            </select>
          </div>

          {loading && <LoadingSpinner />}

          {error && (
            <div className="bento-card empty-state empty-state--error">
              <p>Failed to load alumni data. Please try again later.</p>
            </div>
          )}

          {!loading && !error && alumni.length === 0 && (
            <div className="bento-card empty-state">
              <FiUser size={48} className="empty-state__icon" />
              <h3>No Alumni Found</h3>
              <p className="empty-state__text">
                {search || session !== 'All' ? 'Try adjusting your search or filter.' : 'Alumni information has not been added yet.'}
              </p>
            </div>
          )}

          {/* Alumni Grid */}
          {!loading && alumni.length > 0 && (
            <div className="alumni-bento">
              {alumni.map((member) => (
                <AlumniCard key={member.id} alumni={member} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination__btn"
                onClick={() => setPage(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <FiChevronLeft /> Previous
              </button>
              <span className="pagination__info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="pagination__btn"
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

function AlumniCard({ alumni }: { alumni: Alumni }) {
  return (
    <div className="bento-card alumni-card">
      {/* Avatar */}
      <div className="alumni-card__avatar">
        {alumni.avatar_url ? (
          <img src={alumni.avatar_url} alt={alumni.full_name} />
        ) : (
          <div className="alumni-card__avatar-placeholder">
            <FiUser size={24} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="alumni-card__info">
        <h3 className="alumni-card__name">{alumni.full_name}</h3>

        {(alumni.current_position || alumni.current_company) && (
          <p className="alumni-card__position">
            <FiBriefcase size={12} className="alumni-card__position-icon" />
            <span>
              {alumni.current_position}{alumni.current_position && alumni.current_company ? ' at ' : ''}{alumni.current_company}
            </span>
          </p>
        )}

        {alumni.session_name && (
          <span className="badge badge--subtle">
            {alumni.session_name}
          </span>
        )}

        {alumni.location && (
          <p className="alumni-card__location">
            <FiMapPin size={11} /> {alumni.location}
          </p>
        )}

        {alumni.linkedin_url && (
          <a
            href={alumni.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="alumni-card__linkedin"
          >
            <FiLinkedin size={13} /> LinkedIn Profile
          </a>
        )}
      </div>
    </div>
  );
}
