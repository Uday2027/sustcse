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
          <div className="skeu-panel" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <div className="grid" style={{ gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="skeu-input"
                  placeholder="Search alumni by name..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  style={{ paddingLeft: '2.5rem', width: '100%' }}
                />
              </div>
              <select
                className="skeu-input"
                value={session}
                onChange={(e) => { setSession(e.target.value); setPage(1); }}
                style={{ minWidth: '160px' }}
              >
                {sessions.map((s) => (
                  <option key={s} value={s}>{s === 'All' ? 'All Sessions' : s}</option>
                ))}
              </select>
            </div>
          </div>

          {loading && <LoadingSpinner />}

          {error && (
            <div className="skeu-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-error)' }}>
              <p>Failed to load alumni data. Please try again later.</p>
            </div>
          )}

          {!loading && !error && alumni.length === 0 && (
            <div className="skeu-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <FiUser size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <h3>No Alumni Found</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                {search || session !== 'All' ? 'Try adjusting your search or filter.' : 'Alumni information has not been added yet.'}
              </p>
            </div>
          )}

          {/* Alumni Grid */}
          {!loading && alumni.length > 0 && (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {alumni.map((member) => (
                <AlumniCard key={member.id} alumni={member} />
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

function AlumniCard({ alumni }: { alumni: Alumni }) {
  return (
    <div className="skeu-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      {/* Avatar */}
      <div style={{
        width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0,
        overflow: 'hidden', background: 'var(--color-surface-alt, #f0f0f0)',
        border: '2px solid var(--border-color, #e0e0e0)',
      }}>
        {alumni.avatar_url ? (
          <img src={alumni.avatar_url} alt={alumni.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <FiUser size={24} style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>{alumni.full_name}</h3>

        {(alumni.current_position || alumni.current_company) && (
          <p style={{ margin: '0 0 0.35rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FiBriefcase size={12} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <span>
              {alumni.current_position}{alumni.current_position && alumni.current_company ? ' at ' : ''}{alumni.current_company}
            </span>
          </p>
        )}

        {alumni.session_name && (
          <span style={{
            display: 'inline-block', padding: '0.1rem 0.5rem', borderRadius: '9999px',
            background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.7rem', fontWeight: 600,
            marginBottom: '0.35rem',
          }}>
            {alumni.session_name}
          </span>
        )}

        {alumni.location && (
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FiMapPin size={11} /> {alumni.location}
          </p>
        )}

        {alumni.linkedin_url && (
          <a
            href={alumni.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none' }}
          >
            <FiLinkedin size={13} /> LinkedIn Profile
          </a>
        )}
      </div>
    </div>
  );
}
