import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiExternalLink, FiBook, FiX, FiGlobe } from 'react-icons/fi';
import api from '../lib/api';
import { useScrollReveal } from '../hooks/useGSAP';
import type { Faculty } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const headerRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: res } = await api.get('/faculty');
        setFaculty(res.data || []);
      } catch {
        setError('Failed to load faculty members.');
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  const activeFaculty = faculty.filter((f) => !f.is_on_leave);
  const onLeaveFaculty = faculty.filter((f) => f.is_on_leave);

  return (
    <div className="page faculty-page">
      <section className="section">
        <div className="container">
          <div ref={headerRef} className="page-header">
            <h1 className="page-title">Faculty Members</h1>
            <p className="page-subtitle">
              Meet the distinguished faculty of the Department of CSE, SUST.
            </p>
          </div>

          {loading && <LoadingSpinner />}

          {error && (
            <div className="skeu-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-error)' }}>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && faculty.length === 0 && (
            <div className="skeu-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <FiUser size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <h3>No Faculty Members Found</h3>
              <p style={{ color: 'var(--text-muted)' }}>Faculty information has not been added yet.</p>
            </div>
          )}

          {/* Active Faculty */}
          {!loading && activeFaculty.length > 0 && (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {activeFaculty.map((member) => (
                <FacultyCard key={member.id} member={member} onClick={() => setSelectedFaculty(member)} />
              ))}
            </div>
          )}

          {/* On Leave Faculty */}
          {!loading && onLeaveFaculty.length > 0 && (
            <div>
              <h2 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>On Leave</h2>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {onLeaveFaculty.map((member) => (
                  <FacultyCard key={member.id} member={member} onClick={() => setSelectedFaculty(member)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedFaculty && (
        <FacultyModal faculty={selectedFaculty} onClose={() => setSelectedFaculty(null)} />
      )}
    </div>
  );
}

function FacultyCard({ member, onClick }: { member: Faculty; onClick: () => void }) {
  return (
    <div
      className="skeu-card"
      onClick={onClick}
      style={{
        padding: '1.5rem',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        opacity: member.is_on_leave ? 0.7 : 1,
      }}
    >
      {/* Avatar */}
      <div style={{
        width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 1rem',
        overflow: 'hidden', background: 'var(--color-surface-alt, #f0f0f0)',
        border: '3px solid var(--color-primary)',
      }}>
        {member.avatar_url ? (
          <img src={member.avatar_url} alt={member.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <FiUser size={36} style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
      </div>

      <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem' }}>{member.full_name}</h3>
      <p style={{ margin: '0 0 0.75rem', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 500 }}>
        {member.designation}
      </p>

      {member.is_on_leave && (
        <span style={{
          display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '9999px',
          background: '#fef3c7', color: '#92400e', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem',
        }}>
          On Leave
        </span>
      )}

      {/* Research Areas Tags */}
      {member.research_areas.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {member.research_areas.slice(0, 3).map((area, i) => (
            <span key={i} style={{
              padding: '0.15rem 0.5rem', borderRadius: '9999px',
              background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.7rem',
            }}>
              {area}
            </span>
          ))}
          {member.research_areas.length > 3 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              +{member.research_areas.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function FacultyModal({ faculty, onClose }: { faculty: Faculty; onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
      }}
      onClick={onClose}
    >
      <div
        className="skeu-card"
        style={{ maxWidth: '700px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="skeu-btn"
          style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem' }}
        >
          <FiX size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
            background: 'var(--color-surface-alt, #f0f0f0)', border: '3px solid var(--color-primary)',
          }}>
            {faculty.avatar_url ? (
              <img src={faculty.avatar_url} alt={faculty.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <FiUser size={40} style={{ color: 'var(--text-muted)' }} />
              </div>
            )}
          </div>
          <div>
            <h2 style={{ margin: '0 0 0.25rem' }}>{faculty.full_name}</h2>
            <p style={{ margin: '0 0 0.75rem', color: 'var(--color-primary)', fontWeight: 500 }}>{faculty.designation}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
              {faculty.email && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiMail size={14} /> <a href={`mailto:${faculty.email}`} style={{ color: 'var(--color-primary)' }}>{faculty.email}</a>
                </span>
              )}
              {faculty.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiPhone size={14} /> {faculty.phone}
                </span>
              )}
              {faculty.office_room && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiMapPin size={14} /> Room: {faculty.office_room}
                </span>
              )}
              {faculty.personal_website && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiGlobe size={14} />
                  <a href={faculty.personal_website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                    Personal Website
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Research Areas */}
        {faculty.research_areas.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Research Areas</h3>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {faculty.research_areas.map((area, i) => (
                <span key={i} style={{
                  padding: '0.25rem 0.65rem', borderRadius: '9999px',
                  background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.8rem', fontWeight: 500,
                }}>
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Qualifications */}
        {faculty.qualifications.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Qualifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {faculty.qualifications.map((q, i) => (
                <div key={i} className="skeu-panel" style={{ padding: '0.75rem' }}>
                  <div style={{ fontWeight: 600 }}>{q.degree}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {q.institution}{q.year ? ` (${q.year})` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publications */}
        {faculty.publications.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiBook size={16} /> Publications ({faculty.publications.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {faculty.publications.map((pub, i) => (
                <div key={i} className="skeu-panel" style={{ padding: '0.75rem' }}>
                  <div style={{ fontWeight: 500, display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    {pub.title}
                    {pub.url && (
                      <a href={pub.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', flexShrink: 0 }}>
                        <FiExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {pub.journal}{pub.year ? ` (${pub.year})` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
