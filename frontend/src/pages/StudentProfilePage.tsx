import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiArrowLeft, FiUser, FiMail, FiPhone, FiGithub, FiLinkedin, FiGlobe,
  FiFileText, FiBriefcase, FiCode, FiAward, FiBookOpen, FiMapPin,
  FiExternalLink, FiCalendar,
} from 'react-icons/fi';
import api from '../lib/api';
import { formatDate } from '../lib/formatters';
import { useScrollReveal } from '../hooks/useGSAP';
import type { StudentProfile } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function StudentProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<StudentProfile & { full_name?: string; email?: string; phone?: string; session_name?: string; avatar_url?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const headerRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: res } = await api.get(`/api/students/${id}`);
        setProfile(res.data);
      } catch {
        setError('Failed to load student profile.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (error || !profile) {
    return (
      <div className="page student-profile-page">
        <section className="section">
          <div className="container">
            <Link to="/students" className="skeu-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <FiArrowLeft /> Back to Students
            </Link>
            <div className="skeu-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <h2>Profile Not Found</h2>
              <p style={{ color: 'var(--text-muted)' }}>{error || 'The student profile does not exist or is not visible.'}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page student-profile-page">
      <section className="section">
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link to="/students" className="skeu-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <FiArrowLeft /> Back to Students
          </Link>

          {/* Profile Header */}
          <div ref={headerRef} className="skeu-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {/* Avatar */}
              <div style={{
                width: '120px', height: '120px', borderRadius: '50%', flexShrink: 0,
                overflow: 'hidden', background: 'var(--color-surface-alt, #f0f0f0)',
                border: '3px solid var(--color-primary)',
              }}>
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name || 'Student'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <FiUser size={44} style={{ color: 'var(--text-muted)' }} />
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                  <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{profile.full_name || 'Student'}</h1>
                  {profile.is_looking_for_job && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                      padding: '0.2rem 0.6rem', borderRadius: '9999px',
                      background: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: 700,
                    }}>
                      <FiBriefcase size={11} /> Open to Work
                    </span>
                  )}
                </div>
                {profile.headline && (
                  <p style={{ margin: '0 0 0.75rem', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                    {profile.headline}
                  </p>
                )}
                {profile.session_name && (
                  <span style={{
                    display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '9999px',
                    background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.75rem', fontWeight: 600,
                    marginBottom: '0.75rem',
                  }}>
                    {profile.session_name}
                  </span>
                )}
                {profile.cgpa && (
                  <span style={{
                    display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '9999px',
                    background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.75rem', fontWeight: 600,
                    marginBottom: '0.75rem', marginLeft: '0.5rem',
                  }}>
                    CGPA: {profile.cgpa}
                  </span>
                )}

                {/* Contact Links */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                      <FiMail size={14} /> Email
                    </a>
                  )}
                  {profile.phone && (
                    <a href={`tel:${profile.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                      <FiPhone size={14} /> Phone
                    </a>
                  )}
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                      <FiGithub size={14} /> GitHub
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                      <FiLinkedin size={14} /> LinkedIn
                    </a>
                  )}
                  {profile.portfolio_url && (
                    <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                      <FiGlobe size={14} /> Portfolio
                    </a>
                  )}
                  {profile.resume_url && (
                    <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                      <FiFileText size={14} /> Resume
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          {profile.about && (
            <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>About</h2>
              <p style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
                {profile.about}
              </p>
            </div>
          )}

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiCode size={18} /> Skills
              </h2>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
                {profile.skills.map((skill, i) => (
                  <div key={i} className="skeu-panel" style={{ padding: '0.6rem 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{skill.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{skill.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {profile.experience && profile.experience.length > 0 && (
            <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiBriefcase size={18} /> Experience
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {profile.experience.map((exp, i) => (
                  <div key={i} className="skeu-panel" style={{ padding: '1rem', position: 'relative', borderLeft: '3px solid var(--color-primary)' }}>
                    <h3 style={{ margin: '0 0 0.15rem', fontSize: '1rem' }}>{exp.title}</h3>
                    <p style={{ margin: '0 0 0.25rem', fontWeight: 500, color: 'var(--color-primary)', fontSize: '0.9rem' }}>{exp.company}</p>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <FiCalendar size={11} /> {exp.start}{exp.end ? ` - ${exp.end}` : ' - Present'}
                    </p>
                    {exp.description && (
                      <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiCode size={18} /> Projects
              </h2>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {profile.projects.map((project, i) => (
                  <div key={i} className="skeu-panel" style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '0.95rem' }}>{project.name}</h3>
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', flexShrink: 0 }}>
                          <FiExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    {project.description && (
                      <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{project.description}</p>
                    )}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {project.tech_stack.map((tech, j) => (
                          <span key={j} style={{
                            padding: '0.1rem 0.4rem', borderRadius: '4px',
                            background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.65rem',
                          }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiBookOpen size={18} /> Education
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {profile.education.map((edu, i) => (
                  <div key={i} className="skeu-panel" style={{ padding: '0.85rem' }}>
                    <h3 style={{ margin: '0 0 0.15rem', fontSize: '0.95rem' }}>{edu.degree}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {edu.institution}{edu.year ? ` (${edu.year})` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {profile.certifications && profile.certifications.length > 0 && (
            <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiAward size={18} /> Certifications
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {profile.certifications.map((cert, i) => (
                  <div key={i} className="skeu-panel" style={{ padding: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.15rem', fontSize: '0.95rem' }}>{cert.name}</h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {cert.issuer}{cert.date ? ` - ${cert.date}` : ''}
                      </p>
                    </div>
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', flexShrink: 0 }}>
                        <FiExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Job Preferences */}
          {profile.is_looking_for_job && profile.job_preferences && (
            <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiBriefcase size={18} /> Job Preferences
              </h2>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {profile.job_preferences.type && (
                  <div className="skeu-panel" style={{ padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.2rem' }}>Type</div>
                    <div style={{ fontWeight: 500 }}>{profile.job_preferences.type}</div>
                  </div>
                )}
                {profile.job_preferences.location && (
                  <div className="skeu-panel" style={{ padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.2rem' }}>Location</div>
                    <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FiMapPin size={12} /> {profile.job_preferences.location}</div>
                  </div>
                )}
                {profile.job_preferences.remote !== undefined && (
                  <div className="skeu-panel" style={{ padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.2rem' }}>Remote</div>
                    <div style={{ fontWeight: 500 }}>{profile.job_preferences.remote ? 'Yes' : 'No'}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Languages */}
          {profile.languages && profile.languages.length > 0 && (
            <div className="skeu-card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Languages</h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {profile.languages.map((lang, i) => (
                  <span key={i} style={{
                    padding: '0.25rem 0.65rem', borderRadius: '9999px',
                    background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.85rem', fontWeight: 500,
                  }}>
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
