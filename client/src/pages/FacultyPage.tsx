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
            <div className="bento-card bento-card--no-hover" style={{ textAlign: 'center', color: 'var(--color-danger)' }}>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && faculty.length === 0 && (
            <div className="bento-card bento-card--no-hover empty-state">
              <div className="empty-state__icon">
                <FiUser size={48} />
              </div>
              <h3 className="empty-state__title">No Faculty Members Found</h3>
              <p className="empty-state__text">Faculty information has not been added yet.</p>
            </div>
          )}

          {/* Active Faculty */}
          {!loading && activeFaculty.length > 0 && (
            <div className="faculty-bento">
              {activeFaculty.map((member) => (
                <FacultyCard key={member.id} member={member} onClick={() => setSelectedFaculty(member)} />
              ))}
            </div>
          )}

          {/* On Leave Faculty */}
          {!loading && onLeaveFaculty.length > 0 && (
            <div>
              <h2 style={{ marginBottom: '1.25rem', marginTop: '2.5rem', color: 'var(--color-text-muted)', fontSize: '1.15rem', fontWeight: 600 }}>
                On Leave
              </h2>
              <div className="faculty-bento">
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
  const cardClass = `bento-card faculty-card${member.is_on_leave ? ' faculty-card--on-leave' : ''}`;

  return (
    <div className={cardClass} onClick={onClick}>
      {/* Avatar */}
      <div className="faculty-card__avatar">
        {member.avatar_url ? (
          <img src={member.avatar_url} alt={member.full_name} />
        ) : (
          <div className="icon-box icon-box--accent icon-box--lg" style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}>
            <FiUser size={32} />
          </div>
        )}
      </div>

      <h3 className="faculty-card__name">{member.full_name}</h3>
      <p className="faculty-card__designation">{member.designation}</p>

      {member.is_on_leave && (
        <span className="badge badge--warning">On Leave</span>
      )}

      {/* Research Areas Tags */}
      {member.research_areas.length > 0 && (
        <div className="faculty-card__research">
          {member.research_areas.slice(0, 3).map((area, i) => (
            <span key={i} className="faculty-card__tag">{area}</span>
          ))}
          {member.research_areas.length > 3 && (
            <span className="faculty-card__tag">+{member.research_areas.length - 3} more</span>
          )}
        </div>
      )}
    </div>
  );
}

function FacultyModal({ faculty, onClose }: { faculty: Faculty; onClose: () => void }) {
  return (
    <div className="faculty-modal-overlay" onClick={onClose}>
      <div
        className="bento-card bento-card--no-hover faculty-modal"
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
        <div className="faculty-modal__header">
          <div className="faculty-modal__avatar">
            {faculty.avatar_url ? (
              <img src={faculty.avatar_url} alt={faculty.full_name} />
            ) : (
              <div className="icon-box icon-box--accent" style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}>
                <FiUser size={40} />
              </div>
            )}
          </div>
          <div className="faculty-modal__info">
            <h2 className="faculty-modal__name">{faculty.full_name}</h2>
            <p className="faculty-modal__designation">{faculty.designation}</p>
            <div className="faculty-modal__contacts">
              {faculty.email && (
                <span className="faculty-modal__contact-item">
                  <FiMail size={14} />
                  <a href={`mailto:${faculty.email}`}>{faculty.email}</a>
                </span>
              )}
              {faculty.phone && (
                <span className="faculty-modal__contact-item">
                  <FiPhone size={14} /> {faculty.phone}
                </span>
              )}
              {faculty.office_room && (
                <span className="faculty-modal__contact-item">
                  <FiMapPin size={14} /> Room: {faculty.office_room}
                </span>
              )}
              {faculty.personal_website && (
                <span className="faculty-modal__contact-item">
                  <FiGlobe size={14} />
                  <a href={faculty.personal_website} target="_blank" rel="noopener noreferrer">
                    Personal Website
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Research Areas */}
        {faculty.research_areas.length > 0 && (
          <div className="faculty-modal__section">
            <h3 className="faculty-modal__section-title">Research Areas</h3>
            <div className="faculty-modal__tags">
              {faculty.research_areas.map((area, i) => (
                <span key={i} className="badge badge--accent">{area}</span>
              ))}
            </div>
          </div>
        )}

        {/* Qualifications */}
        {faculty.qualifications.length > 0 && (
          <div className="faculty-modal__section">
            <h3 className="faculty-modal__section-title">Qualifications</h3>
            <div className="faculty-modal__list">
              {faculty.qualifications.map((q, i) => (
                <div key={i} className="bento-card bento-card--no-hover faculty-modal__item">
                  <div className="faculty-modal__item-title">{q.degree}</div>
                  <div className="faculty-modal__item-sub">
                    {q.institution}{q.year ? ` (${q.year})` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publications */}
        {faculty.publications.length > 0 && (
          <div className="faculty-modal__section">
            <h3 className="faculty-modal__section-title">
              <FiBook size={16} /> Publications ({faculty.publications.length})
            </h3>
            <div className="faculty-modal__list">
              {faculty.publications.map((pub, i) => (
                <div key={i} className="bento-card bento-card--no-hover faculty-modal__item">
                  <div className="faculty-modal__item-title">
                    {pub.title}
                    {pub.url && (
                      <a href={pub.url} target="_blank" rel="noopener noreferrer" className="faculty-modal__pub-link">
                        <FiExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <div className="faculty-modal__item-sub">
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
