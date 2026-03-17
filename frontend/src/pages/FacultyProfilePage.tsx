import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiGlobe, FiBook, FiAward, FiBriefcase, FiBookOpen, FiStar, FiMic, FiUser, FiActivity, FiArchive } from 'react-icons/fi';
import { facultyData } from '../data/facultyData';
import { useScrollReveal } from '../hooks/useGSAP';

export default function FacultyProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const contentRef = useScrollReveal<HTMLDivElement>();

  const member = facultyData.find((f) => f.slug === slug);

  if (!member) {
    return (
      <div className="page not-found-page">
        <div className="container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
          <h2>Faculty Member Not Found</h2>
          <p>The faculty member you are looking for does not exist.</p>
          <Link to="/faculty" className="skeu-btn" style={{ marginTop: '2rem', display: 'inline-flex' }}>
            <FiArrowLeft style={{ marginRight: '0.5rem' }} /> Back to Faculty
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page faculty-profile-page">
      <section className="section">
        <div className="container">
          <button 
            onClick={() => navigate('/faculty')} 
            className="skeu-btn" 
            style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FiArrowLeft /> Back to Faculty
          </button>

          <div ref={contentRef} className="faculty-profile__grid">
            {/* Left Column: Avatar & Quick Info */}
            <div className="faculty-profile__sidebar">
              <div className="bento-card faculty-profile__avatar-card">
                <div className="faculty-profile__avatar">
                  <img src={member.avatar_url} alt={member.full_name} />
                </div>
                <h1 className="faculty-profile__name">{member.full_name}</h1>
                <p className="faculty-profile__designation">{member.designation}</p>
                {member.is_on_leave && (
                  <span className="badge badge--warning" style={{ marginTop: '0.5rem' }}>On Leave</span>
                )}
              </div>

              <div className="bento-card faculty-profile__contact-card">
                <h3 className="card-title-sm">Contact Information</h3>
                <div className="faculty-profile__contacts">
                  {member.office_address && (
                    <div className="contact-item">
                      <FiMapPin className="contact-icon" />
                      <p>{member.office_address}</p>
                    </div>
                  )}
                  {member.email && (
                    <div className="contact-item">
                      <FiMail className="contact-icon" />
                      <a href={`mailto:${member.email}`}>{member.email}</a>
                    </div>
                  )}
                  {member.phone && (
                    <div className="contact-item">
                      <FiPhone className="contact-icon" />
                      <p>{member.phone}</p>
                    </div>
                  )}
                  {member.office_room && (
                    <div className="contact-item">
                      <FiMapPin className="contact-icon" />
                      <p>Room: {member.office_room}</p>
                    </div>
                  )}
                  {member.personal_website && (
                    <div className="contact-item">
                      <FiGlobe className="contact-icon" />
                      <a href={member.personal_website} target="_blank" rel="noopener noreferrer">
                        Personal Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Info */}
            <div className="faculty-profile__main">
              {/* Biography */}
              {member.biography && (
                <div className="bento-card faculty-profile__section">
                  <h2 className="section-title-sm">
                    <FiUser style={{ color: 'var(--color-accent)' }} /> Biography
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                    {member.biography}
                  </p>
                </div>
              )}

              {/* Research Areas */}
              <div className="bento-card faculty-profile__section">
                <h2 className="section-title-sm">
                  <FiBriefcase style={{ color: 'var(--color-accent)' }} /> Research Areas
                </h2>
                <div className="faculty-profile__tags">
                  {member.research_areas.length > 0 ? (
                    member.research_areas.map((area, i) => (
                      <span key={i} className="badge badge--accent">{area}</span>
                    ))
                  ) : (
                    <p className="text-muted">Research areas details will be added soon.</p>
                  )}
                </div>
              </div>

              {/* Active Research */}
              {member.active_research && member.active_research.length > 0 && (
                <div className="bento-card faculty-profile__section">
                  <h2 className="section-title-sm">
                    <FiActivity style={{ color: 'var(--color-accent)' }} /> Active Research Projects
                  </h2>
                  <div className="faculty-profile__list">
                    {member.active_research.map((project, i) => (
                      <div key={i} className="profile-list-item">
                        <div className="profile-list-item__title">{i + 1}. {project}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous Research */}
              {member.previous_research && member.previous_research.length > 0 && (
                <div className="bento-card faculty-profile__section">
                  <h2 className="section-title-sm">
                    <FiArchive style={{ color: 'var(--color-accent)' }} /> Previous Research Projects
                  </h2>
                  <div className="faculty-profile__list">
                    {member.previous_research.map((project, i) => (
                      <div key={i} className="profile-list-item">
                        <div className="profile-list-item__title">{i + 1}. {project}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* External Affiliations */}
              {member.external_affiliations && member.external_affiliations.length > 0 && (
                <div className="bento-card faculty-profile__section">
                  <h2 className="section-title-sm">
                    <FiGlobe style={{ color: 'var(--color-accent)' }} /> External Affiliations
                  </h2>
                  <div className="faculty-profile__tags">
                    {member.external_affiliations.map((affiliation, i) => (
                      <span key={i} className="badge badge--accent">{affiliation}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Qualifications */}
              <div className="bento-card faculty-profile__section">
                <h2 className="section-title-sm">
                  <FiAward style={{ color: 'var(--color-accent)' }} /> Education
                </h2>
                <div className="faculty-profile__list">
                  {member.qualifications.length > 0 ? (
                    member.qualifications.map((q, i) => (
                      <div key={i} className="profile-list-item">
                        <div className="profile-list-item__title">{q.degree}</div>
                        <div className="profile-list-item__sub">
                          {q.institution}{q.year ? ` (${q.year})` : ''}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">Education details will be added soon.</p>
                  )}
                </div>
              </div>

              {/* Publications */}
              <div className="bento-card faculty-profile__section">
                <h2 className="section-title-sm">
                  <FiBook style={{ color: 'var(--color-accent)' }} /> Journal Publications
                </h2>
                <div className="faculty-profile__list">
                  {member.publications.length > 0 ? (
                    member.publications.map((p, i) => (
                      <div key={i} className="profile-list-item">
                        <div className="profile-list-item__title">{i + 1}. {p.title}</div>
                        <div className="profile-list-item__sub">
                          {p.journal}{p.year ? ` (${p.year})` : ''}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">Publications will be added soon.</p>
                  )}
                </div>
              </div>

              {/* Conferences */}
              {member.conferences && member.conferences.length > 0 && (
                <div className="bento-card faculty-profile__section">
                  <h2 className="section-title-sm">
                    <FiMic style={{ color: 'var(--color-accent)' }} /> Conference Papers
                  </h2>
                  <div className="faculty-profile__list">
                    {member.conferences.map((c, i) => (
                      <div key={i} className="profile-list-item">
                        <div className="profile-list-item__title">{i + 1}. {c.title}</div>
                        <div className="profile-list-item__sub">
                          {c.venue}{c.year ? ` (${c.year})` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teaching */}
              {member.teaching && member.teaching.length > 0 && (
                <div className="bento-card faculty-profile__section">
                  <h2 className="section-title-sm">
                    <FiBookOpen style={{ color: 'var(--color-accent)' }} /> Teaching
                  </h2>
                  <div className="faculty-profile__tags">
                    {member.teaching.map((course, i) => (
                      <span key={i} className="badge badge--accent">{course}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Awards */}
              {member.awards && member.awards.length > 0 && (
                <div className="bento-card faculty-profile__section">
                  <h2 className="section-title-sm">
                    <FiStar style={{ color: 'var(--color-accent)' }} /> Awards & Recognition
                  </h2>
                  <div className="faculty-profile__list">
                    {member.awards.map((award, i) => (
                      <div key={i} className="profile-list-item">
                        <div className="profile-list-item__title">{award}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Graduate Supervision */}
              {member.graduate_supervision && member.graduate_supervision.length > 0 && (
                <div className="bento-card faculty-profile__section">
                  <h2 className="section-title-sm">
                    <FiAward style={{ color: 'var(--color-accent)' }} /> Graduate Supervision
                  </h2>
                  <div className="faculty-profile__list">
                    {member.graduate_supervision.map((item, i) => (
                      <div key={i} className="profile-list-item">
                        <div className="profile-list-item__title">{i + 1}. {item}</div>
                      </div>
                    ))}
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

