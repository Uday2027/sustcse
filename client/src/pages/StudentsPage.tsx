import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser, FiBriefcase, FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';
import { usePaginatedFetch } from '../hooks/usePagination';
import { useScrollReveal } from '../hooks/useGSAP';
import type { StudentProfile } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [session, setSession] = useState('All');
  const [jobSeeking, setJobSeeking] = useState('All');
  const headerRef = useScrollReveal<HTMLDivElement>();

  const params = useMemo(() => {
    const p: Record<string, string> = {};
    if (search) p.search = search;
    if (session !== 'All') p.session = session;
    if (jobSeeking !== 'All') p.is_looking_for_job = jobSeeking === 'Yes' ? 'true' : 'false';
    return p;
  }, [search, session, jobSeeking]);

  const { data: students, loading, error, pagination, setPage } = usePaginatedFetch<StudentProfile & { full_name?: string; session_name?: string; avatar_url?: string }>(
    '/students',
    params,
    12
  );

  return (
    <div className="page students-page">
      <section className="section">
        <div className="container">
          <div ref={headerRef} className="page-header">
            <h1 className="page-title">Student Directory</h1>
            <p className="page-subtitle">
              Browse student profiles of the Department of CSE, SUST.
            </p>
          </div>

          {/* Filters */}
          <div className="skeu-panel" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <div className="grid" style={{ gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="skeu-input"
                  placeholder="Search by name..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  style={{ paddingLeft: '2.5rem', width: '100%' }}
                />
              </div>
              <select
                className="skeu-input"
                value={session}
                onChange={(e) => { setSession(e.target.value); setPage(1); }}
                style={{ minWidth: '140px' }}
              >
                <option value="All">All Sessions</option>
                {/* Sessions will be populated dynamically based on available data */}
              </select>
              <select
                className="skeu-input"
                value={jobSeeking}
                onChange={(e) => { setJobSeeking(e.target.value); setPage(1); }}
                style={{ minWidth: '140px' }}
              >
                <option value="All">All Students</option>
                <option value="Yes">Job Seeking</option>
                <option value="No">Not Seeking</option>
              </select>
            </div>
          </div>

          {loading && <LoadingSpinner />}

          {error && (
            <div className="skeu-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-error)' }}>
              <p>Failed to load student directory. Please try again later.</p>
            </div>
          )}

          {!loading && !error && students.length === 0 && (
            <div className="skeu-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <FiUser size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <h3>No Students Found</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                {search || session !== 'All' || jobSeeking !== 'All'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No student profiles have been created yet.'}
              </p>
            </div>
          )}

          {/* Students Grid */}
          {!loading && students.length > 0 && (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {students.map((student) => (
                <StudentCard key={student.id} student={student} />
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

function StudentCard({ student }: { student: StudentProfile & { full_name?: string; session_name?: string; avatar_url?: string } }) {
  return (
    <Link to={`/students/${student.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="skeu-card" style={{ padding: '1.5rem', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          {/* Avatar */}
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
            overflow: 'hidden', background: 'var(--color-surface-alt, #f0f0f0)',
            border: '2px solid var(--color-primary)',
          }}>
            {student.avatar_url ? (
              <img src={student.avatar_url} alt={student.full_name || 'Student'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <FiUser size={22} style={{ color: 'var(--text-muted)' }} />
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>{student.full_name || 'Student'}</h3>
              {student.is_looking_for_job && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                  padding: '0.1rem 0.45rem', borderRadius: '9999px',
                  background: '#dcfce7', color: '#166534', fontSize: '0.65rem', fontWeight: 700,
                }}>
                  <FiBriefcase size={9} /> Open to Work
                </span>
              )}
            </div>
            {student.headline && (
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.3 }}>
                {student.headline}
              </p>
            )}
          </div>
        </div>

        {/* Skills Preview */}
        {student.skills && student.skills.length > 0 && (
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            {student.skills.slice(0, 5).map((skill, i) => (
              <span key={i} style={{
                padding: '0.1rem 0.45rem', borderRadius: '9999px',
                background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.7rem',
              }}>
                {skill.name}
              </span>
            ))}
            {student.skills.length > 5 && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                +{student.skills.length - 5} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
