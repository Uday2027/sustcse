import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiGlobe, FiBook, FiAward, FiBriefcase, FiBookOpen, FiStar, FiMic, FiUser, FiActivity, FiArchive, FiExternalLink } from 'react-icons/fi';
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
      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container">

          {/* Back button */}
          <button
            onClick={() => navigate('/faculty')}
            className="fp-back-btn"
          >
            <FiArrowLeft /> Faculty Directory
          </button>

          <div ref={contentRef} className="fp-layout">

            {/* ====== LEFT SIDEBAR ====== */}
            <aside className="fp-sidebar">

              {/* Portrait */}
              <div className="fp-portrait">
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt={member.full_name} />
                ) : (
                  <div className="fp-portrait__placeholder"><FiUser size={56} /></div>
                )}
                {member.is_on_leave && (
                  <span className="fp-leave-badge">On Leave</span>
                )}
              </div>

              {/* Name & Title */}
              <div className="fp-identity">
                <h1 className="fp-identity__name">{member.full_name}</h1>
                <p className="fp-identity__role">{member.designation}</p>
                <p className="fp-identity__dept">Dept. of CSE, SUST</p>
              </div>

              {/* Divider */}
              <div className="fp-divider" />

              {/* Contact */}
              <div className="fp-contacts">
                {member.email && (
                  <a href={`mailto:${member.email}`} className="fp-contact-item">
                    <FiMail className="fp-contact-item__icon" />
                    <span>{member.email}</span>
                  </a>
                )}
                {member.phone && (
                  <div className="fp-contact-item">
                    <FiPhone className="fp-contact-item__icon" />
                    <span>{member.phone}</span>
                  </div>
                )}
                {member.office_address && (
                  <div className="fp-contact-item">
                    <FiMapPin className="fp-contact-item__icon" />
                    <span>{member.office_address}</span>
                  </div>
                )}
                {member.office_room && (
                  <div className="fp-contact-item">
                    <FiMapPin className="fp-contact-item__icon" />
                    <span>Room {member.office_room}</span>
                  </div>
                )}
                {member.personal_website && (
                  <a href={member.personal_website} target="_blank" rel="noopener noreferrer" className="fp-contact-item">
                    <FiGlobe className="fp-contact-item__icon" />
                    <span>Personal Website <FiExternalLink size={12} style={{ verticalAlign: 'middle' }} /></span>
                  </a>
                )}
              </div>
            </aside>

            {/* ====== RIGHT CONTENT ====== */}
            <div className="fp-main">

              {/* Biography */}
              {member.biography && (
                <div className="fp-section">
                  <h2 className="fp-section__title"><FiUser /> Biography</h2>
                  <p className="fp-section__prose" style={{ whiteSpace: 'pre-line' }}>{member.biography}</p>
                </div>
              )}

              {/* Research Areas */}
              <div className="fp-section">
                <h2 className="fp-section__title"><FiBriefcase /> Research Areas</h2>
                <div className="fp-tags">
                  {member.research_areas.length > 0 ? (
                    member.research_areas.map((area, i) => (
                      <span key={i} className="fp-tag">{area}</span>
                    ))
                  ) : (
                    <p className="fp-section__empty">Research areas will be added soon.</p>
                  )}
                </div>
              </div>

              {/* Active Research */}
              {member.active_research && member.active_research.length > 0 && (
                <div className="fp-section">
                  <h2 className="fp-section__title"><FiActivity /> Active Research Projects</h2>
                  <div className="fp-list">
                    {member.active_research.map((project, i) => (
                      <div key={i} className="fp-list-item">
                        <span className="fp-list-item__num">{String(i + 1).padStart(2, '0')}</span>
                        <span className="fp-list-item__text">{project}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous Research */}
              {member.previous_research && member.previous_research.length > 0 && (
                <div className="fp-section">
                  <h2 className="fp-section__title"><FiArchive /> Previous Research Projects</h2>
                  <div className="fp-list">
                    {member.previous_research.map((project, i) => (
                      <div key={i} className="fp-list-item">
                        <span className="fp-list-item__num">{String(i + 1).padStart(2, '0')}</span>
                        <span className="fp-list-item__text">{project}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* External Affiliations */}
              {member.external_affiliations && member.external_affiliations.length > 0 && (
                <div className="fp-section">
                  <h2 className="fp-section__title"><FiGlobe /> External Affiliations</h2>
                  <div className="fp-tags">
                    {member.external_affiliations.map((affiliation, i) => (
                      <span key={i} className="fp-tag">{affiliation}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Qualifications */}
              <div className="fp-section">
                <h2 className="fp-section__title"><FiAward /> Education</h2>
                <div className="fp-list">
                  {member.qualifications.length > 0 ? (
                    member.qualifications.map((q, i) => (
                      <div key={i} className="fp-list-item">
                        <span className="fp-list-item__num">{String(i + 1).padStart(2, '0')}</span>
                        <div>
                          <div className="fp-list-item__text">{q.degree}</div>
                          <div className="fp-list-item__sub">{q.institution}{q.year ? ` — ${q.year}` : ''}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="fp-section__empty">Education details will be added soon.</p>
                  )}
                </div>
              </div>

              {/* Publications */}
              <div className="fp-section">
                <h2 className="fp-section__title"><FiBook /> Journal Publications</h2>
                <div className="fp-list">
                  {member.publications.length > 0 ? (
                    member.publications.map((p, i) => (
                      <div key={i} className="fp-list-item">
                        <span className="fp-list-item__num">{String(i + 1).padStart(2, '0')}</span>
                        <div>
                          <div className="fp-list-item__text">{p.title}</div>
                          <div className="fp-list-item__sub">{p.journal}{p.year ? ` — ${p.year}` : ''}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="fp-section__empty">Publications will be added soon.</p>
                  )}
                </div>
              </div>

              {/* Conferences */}
              {member.conferences && member.conferences.length > 0 && (
                <div className="fp-section">
                  <h2 className="fp-section__title"><FiMic /> Conference Papers</h2>
                  <div className="fp-list">
                    {member.conferences.map((c, i) => (
                      <div key={i} className="fp-list-item">
                        <span className="fp-list-item__num">{String(i + 1).padStart(2, '0')}</span>
                        <div>
                          <div className="fp-list-item__text">{c.title}</div>
                          <div className="fp-list-item__sub">{c.venue}{c.year ? ` — ${c.year}` : ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teaching */}
              {member.teaching && member.teaching.length > 0 && (
                <div className="fp-section">
                  <h2 className="fp-section__title"><FiBookOpen /> Teaching</h2>
                  <div className="fp-tags">
                    {member.teaching.map((course, i) => (
                      <span key={i} className="fp-tag">{course}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Awards */}
              {member.awards && member.awards.length > 0 && (
                <div className="fp-section">
                  <h2 className="fp-section__title"><FiStar /> Awards &amp; Recognition</h2>
                  <div className="fp-list">
                    {member.awards.map((award, i) => (
                      <div key={i} className="fp-list-item">
                        <span className="fp-list-item__num">{String(i + 1).padStart(2, '0')}</span>
                        <span className="fp-list-item__text">{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Graduate Supervision */}
              {member.graduate_supervision && member.graduate_supervision.length > 0 && (
                <div className="fp-section">
                  <h2 className="fp-section__title"><FiAward /> Graduate Supervision</h2>
                  <div className="fp-list">
                    {member.graduate_supervision.map((item, i) => (
                      <div key={i} className="fp-list-item">
                        <span className="fp-list-item__num">{String(i + 1).padStart(2, '0')}</span>
                        <span className="fp-list-item__text">{item}</span>
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
