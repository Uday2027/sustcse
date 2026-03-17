import { useState, useEffect, useRef } from 'react';
import {
  FiSave, FiUser, FiPlus, FiTrash2, FiGithub, FiLinkedin, FiGlobe,
  FiFileText, FiBriefcase, FiCode, FiAward, FiBookOpen, FiEye, FiLoader,
  FiCamera, FiBell, FiLock, FiEdit, FiMail, FiPhone, FiExternalLink,
  FiCalendar, FiMapPin,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useScrollReveal } from '../hooks/useGSAP';
import type { StudentProfile } from '../types';
import type { NotificationPreferences } from '../types/user';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface SkillEntry { name: string; level: string }
interface ExperienceEntry { company: string; title: string; start: string; end?: string; description?: string }
interface ProjectEntry { name: string; description?: string; url?: string; tech_stack?: string[] }
interface EducationEntry { institution: string; degree: string; year?: string }
interface CertificationEntry { name: string; issuer?: string; date?: string; url?: string }

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headerRef = useScrollReveal<HTMLDivElement>();

  // Form fields
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [skills, setSkills] = useState<SkillEntry[]>([]);
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [certifications, setCertifications] = useState<CertificationEntry[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState('');
  const [isLookingForJob, setIsLookingForJob] = useState(false);
  const [jobType, setJobType] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobRemote, setJobRemote] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'students_only' | 'private'>('public');

  // Avatar
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Notification preferences
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>({ notices: true, events: true, achievements: true });

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // View mode toggle
  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: res } = await api.get('/students/profile');
        const p: StudentProfile = res.data;
        if (p) {
          setHeadline(p.headline || '');
          setAbout(p.about || '');
          setCgpa(p.cgpa ? String(p.cgpa) : '');
          setGithubUrl(p.github_url || '');
          setLinkedinUrl(p.linkedin_url || '');
          setPortfolioUrl(p.portfolio_url || '');
          setResumeUrl(p.resume_url || '');
          setSkills(p.skills || []);
          setExperience(p.experience || []);
          setProjects(p.projects || []);
          setEducation(p.education || []);
          setCertifications(p.certifications || []);
          setLanguages(p.languages || []);
          setIsLookingForJob(p.is_looking_for_job || false);
          setJobType(p.job_preferences?.type || '');
          setJobLocation(p.job_preferences?.location || '');
          setJobRemote(p.job_preferences?.remote || false);
          setVisibility(p.visibility || 'public');
        }
      } catch {
        setError('Failed to load profile. You may not have a profile yet - fill in the form to create one.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    // Fetch user data for avatar + notification prefs
    if (user) {
      setAvatarUrl(user.avatar_url || null);
      setNotifPrefs(user.notification_preferences || { notices: true, events: true, achievements: true });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/students/profile', {
        headline,
        about,
        cgpa: cgpa ? parseFloat(cgpa) : null,
        github_url: githubUrl || null,
        linkedin_url: linkedinUrl || null,
        portfolio_url: portfolioUrl || null,
        resume_url: resumeUrl || null,
        skills,
        experience,
        projects,
        education,
        certifications,
        languages,
        is_looking_for_job: isLookingForJob,
        job_preferences: { type: jobType || undefined, location: jobLocation || undefined, remote: jobRemote },
        visibility,
      });
      toast.success('Profile saved successfully!');
    } catch {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data: res } = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAvatarUrl(res.data.avatar_url);
      toast.success('Avatar updated!');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleNotifSave = async () => {
    try {
      await api.patch('/users/me', { notification_preferences: notifPrefs });
      toast.success('Notification preferences saved!');
    } catch {
      toast.error('Failed to save notification preferences');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setChangingPassword(true);
    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const message = axiosErr.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page profile-page">
      <section className="section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div ref={headerRef} className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="page-title">My Profile</h1>
              <p className="page-subtitle">
                {viewMode ? 'This is how others see your profile.' : 'Edit your student profile to showcase your skills and experience.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="skeu-btn"
                onClick={() => setViewMode(!viewMode)}
                style={{
                  padding: '0.6rem 1.25rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: viewMode ? 'var(--color-primary)' : 'transparent',
                  color: viewMode ? '#fff' : undefined,
                }}
              >
                {viewMode ? <><FiEdit size={16} /> Edit Profile</> : <><FiEye size={16} /> View as Others</>}
              </button>
              {!viewMode && (
                <button
                  className="skeu-btn"
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    background: 'var(--color-primary)', color: '#fff',
                    padding: '0.6rem 1.5rem', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}
                >
                  {saving ? <FiLoader className="spin" size={16} /> : <FiSave size={16} />}
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="skeu-panel" style={{ padding: '1rem', marginBottom: '1.5rem', color: 'var(--color-warning, #92400e)', background: '#fef3c7' }}>
              {error}
            </div>
          )}

          {viewMode ? (
            /* ===== PREVIEW MODE ===== */
            <>
              {/* Profile Header */}
              <div className="skeu-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '120px', height: '120px', borderRadius: '50%', flexShrink: 0,
                    overflow: 'hidden', background: 'var(--color-surface-alt, #f0f0f0)',
                    border: '3px solid var(--color-primary)',
                  }}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={user?.full_name || 'Student'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <FiUser size={44} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{user?.full_name || 'Student'}</h1>
                      {isLookingForJob && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                          padding: '0.2rem 0.6rem', borderRadius: '9999px',
                          background: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: 700,
                        }}>
                          <FiBriefcase size={11} /> Open to Work
                        </span>
                      )}
                    </div>
                    {headline && (
                      <p style={{ margin: '0 0 0.75rem', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>{headline}</p>
                    )}
                    {user?.session_name && (
                      <span style={{
                        display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '9999px',
                        background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.75rem', fontWeight: 600,
                        marginBottom: '0.75rem',
                      }}>
                        {user.session_name}
                      </span>
                    )}
                    {cgpa && (
                      <span style={{
                        display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '9999px',
                        background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.75rem', fontWeight: 600,
                        marginBottom: '0.75rem', marginLeft: '0.5rem',
                      }}>
                        CGPA: {cgpa}
                      </span>
                    )}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {user?.email && (
                        <a href={`mailto:${user.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                          <FiMail size={14} /> Email
                        </a>
                      )}
                      {user?.phone && (
                        <a href={`tel:${user.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                          <FiPhone size={14} /> Phone
                        </a>
                      )}
                      {githubUrl && (
                        <a href={githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                          <FiGithub size={14} /> GitHub
                        </a>
                      )}
                      {linkedinUrl && (
                        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                          <FiLinkedin size={14} /> LinkedIn
                        </a>
                      )}
                      {portfolioUrl && (
                        <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                          <FiGlobe size={14} /> Portfolio
                        </a>
                      )}
                      {resumeUrl && (
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                          <FiFileText size={14} /> Resume
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              {about && (
                <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>About</h2>
                  <p style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{about}</p>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiCode size={18} /> Skills
                  </h2>
                  <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
                    {skills.filter(s => s.name).map((skill, i) => (
                      <div key={i} className="skeu-panel" style={{ padding: '0.6rem 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{skill.name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{skill.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {experience.length > 0 && (
                <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiBriefcase size={18} /> Experience
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {experience.filter(e => e.title || e.company).map((exp, i) => (
                      <div key={i} className="skeu-panel" style={{ padding: '1rem', borderLeft: '3px solid var(--color-primary)' }}>
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
              {projects.length > 0 && (
                <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiCode size={18} /> Projects
                  </h2>
                  <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {projects.filter(p => p.name).map((project, i) => (
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
              {education.length > 0 && (
                <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiBookOpen size={18} /> Education
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {education.filter(e => e.degree || e.institution).map((edu, i) => (
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
              {certifications.length > 0 && (
                <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiAward size={18} /> Certifications
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {certifications.filter(c => c.name).map((cert, i) => (
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
              {isLookingForJob && (jobType || jobLocation) && (
                <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiBriefcase size={18} /> Job Preferences
                  </h2>
                  <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    {jobType && (
                      <div className="skeu-panel" style={{ padding: '0.75rem' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.2rem' }}>Type</div>
                        <div style={{ fontWeight: 500 }}>{jobType}</div>
                      </div>
                    )}
                    {jobLocation && (
                      <div className="skeu-panel" style={{ padding: '0.75rem' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.2rem' }}>Location</div>
                        <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FiMapPin size={12} /> {jobLocation}</div>
                      </div>
                    )}
                    <div className="skeu-panel" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.2rem' }}>Remote</div>
                      <div style={{ fontWeight: 500 }}>{jobRemote ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <div className="skeu-card" style={{ padding: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Languages</h2>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {languages.map((lang, i) => (
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
            </>
          ) : (
          /* ===== EDIT MODE ===== */
          <>
          {/* Avatar */}
          <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden',
                background: 'var(--color-surface-alt, #e8e8e8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '3px solid var(--color-border, #ddd)',
              }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <FiUser size={36} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'var(--color-primary)', color: '#fff', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
              >
                {uploadingAvatar ? <FiLoader className="spin" size={14} /> : <FiCamera size={14} />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{user?.full_name || 'Your Name'}</h3>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.email}</p>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Click the camera icon to upload a profile picture (max 5MB)
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiUser size={18} /> Basic Information
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.875rem' }}>Headline</label>
                <input
                  className="skeu-input"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Full-Stack Developer | ML Enthusiast"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.875rem' }}>About</label>
                <textarea
                  className="skeu-input"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Write a brief introduction about yourself..."
                  rows={4}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.875rem' }}>CGPA</label>
                  <input
                    className="skeu-input"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="e.g. 3.75"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.875rem' }}>
                    <FiEye size={13} style={{ marginRight: '0.25rem' }} /> Visibility
                  </label>
                  <select className="skeu-input" value={visibility} onChange={(e) => setVisibility(e.target.value as typeof visibility)} style={{ width: '100%' }}>
                    <option value="public">Public</option>
                    <option value="students_only">Students Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* URLs */}
          <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiGlobe size={18} /> Links
            </h2>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.875rem' }}>
                  <FiGithub size={13} /> GitHub
                </label>
                <input className="skeu-input" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.875rem' }}>
                  <FiLinkedin size={13} /> LinkedIn
                </label>
                <input className="skeu-input" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.875rem' }}>
                  <FiGlobe size={13} /> Portfolio
                </label>
                <input className="skeu-input" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://yourportfolio.com" style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.875rem' }}>
                  <FiFileText size={13} /> Resume URL
                </label>
                <input className="skeu-input" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="Link to your resume" style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiCode size={18} /> Skills
              </h2>
              <button className="skeu-btn" onClick={() => setSkills([...skills, { name: '', level: 'intermediate' }])} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                <FiPlus size={14} /> Add Skill
              </button>
            </div>
            {skills.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No skills added yet. Click "Add Skill" to get started.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {skills.map((skill, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    className="skeu-input"
                    value={skill.name}
                    onChange={(e) => { const s = [...skills]; s[i] = { ...s[i], name: e.target.value }; setSkills(s); }}
                    placeholder="Skill name"
                    style={{ flex: 1 }}
                  />
                  <select
                    className="skeu-input"
                    value={skill.level}
                    onChange={(e) => { const s = [...skills]; s[i] = { ...s[i], level: e.target.value }; setSkills(s); }}
                    style={{ width: '140px' }}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                  <button className="skeu-btn" onClick={() => setSkills(skills.filter((_, j) => j !== i))} style={{ padding: '0.5rem', color: 'var(--color-error, #dc2626)' }}>
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiBriefcase size={18} /> Experience
              </h2>
              <button className="skeu-btn" onClick={() => setExperience([...experience, { company: '', title: '', start: '', end: '', description: '' }])} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                <FiPlus size={14} /> Add Experience
              </button>
            </div>
            {experience.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No experience entries yet.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {experience.map((exp, i) => (
                <div key={i} className="skeu-panel" style={{ padding: '1rem', position: 'relative' }}>
                  <button
                    className="skeu-btn"
                    onClick={() => setExperience(experience.filter((_, j) => j !== i))}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.35rem', color: 'var(--color-error, #dc2626)' }}
                  >
                    <FiTrash2 size={14} />
                  </button>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', fontWeight: 500 }}>Title</label>
                      <input className="skeu-input" value={exp.title} onChange={(e) => { const x = [...experience]; x[i] = { ...x[i], title: e.target.value }; setExperience(x); }} placeholder="Job title" style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', fontWeight: 500 }}>Company</label>
                      <input className="skeu-input" value={exp.company} onChange={(e) => { const x = [...experience]; x[i] = { ...x[i], company: e.target.value }; setExperience(x); }} placeholder="Company name" style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', fontWeight: 500 }}>Start Date</label>
                      <input className="skeu-input" value={exp.start} onChange={(e) => { const x = [...experience]; x[i] = { ...x[i], start: e.target.value }; setExperience(x); }} placeholder="e.g. Jan 2024" style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', fontWeight: 500 }}>End Date</label>
                      <input className="skeu-input" value={exp.end || ''} onChange={(e) => { const x = [...experience]; x[i] = { ...x[i], end: e.target.value }; setExperience(x); }} placeholder="Leave blank for present" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', fontWeight: 500 }}>Description</label>
                    <textarea className="skeu-input" value={exp.description || ''} onChange={(e) => { const x = [...experience]; x[i] = { ...x[i], description: e.target.value }; setExperience(x); }} rows={2} placeholder="Describe your role..." style={{ width: '100%', resize: 'vertical' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiCode size={18} /> Projects
              </h2>
              <button className="skeu-btn" onClick={() => setProjects([...projects, { name: '', description: '', url: '', tech_stack: [] }])} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                <FiPlus size={14} /> Add Project
              </button>
            </div>
            {projects.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No projects added yet.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {projects.map((proj, i) => (
                <div key={i} className="skeu-panel" style={{ padding: '1rem', position: 'relative' }}>
                  <button
                    className="skeu-btn"
                    onClick={() => setProjects(projects.filter((_, j) => j !== i))}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.35rem', color: 'var(--color-error, #dc2626)' }}
                  >
                    <FiTrash2 size={14} />
                  </button>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', fontWeight: 500 }}>Name</label>
                      <input className="skeu-input" value={proj.name} onChange={(e) => { const x = [...projects]; x[i] = { ...x[i], name: e.target.value }; setProjects(x); }} placeholder="Project name" style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', fontWeight: 500 }}>URL</label>
                      <input className="skeu-input" value={proj.url || ''} onChange={(e) => { const x = [...projects]; x[i] = { ...x[i], url: e.target.value }; setProjects(x); }} placeholder="https://..." style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', fontWeight: 500 }}>Description</label>
                    <textarea className="skeu-input" value={proj.description || ''} onChange={(e) => { const x = [...projects]; x[i] = { ...x[i], description: e.target.value }; setProjects(x); }} rows={2} placeholder="Brief description..." style={{ width: '100%', resize: 'vertical' }} />
                  </div>
                  <div style={{ marginTop: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', fontWeight: 500 }}>Tech Stack (comma separated)</label>
                    <input
                      className="skeu-input"
                      value={(proj.tech_stack || []).join(', ')}
                      onChange={(e) => { const x = [...projects]; x[i] = { ...x[i], tech_stack: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }; setProjects(x); }}
                      placeholder="React, Node.js, PostgreSQL"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiBookOpen size={18} /> Education
              </h2>
              <button className="skeu-btn" onClick={() => setEducation([...education, { institution: '', degree: '', year: '' }])} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                <FiPlus size={14} /> Add Education
              </button>
            </div>
            {education.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No education entries yet.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {education.map((edu, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input className="skeu-input" value={edu.degree} onChange={(e) => { const x = [...education]; x[i] = { ...x[i], degree: e.target.value }; setEducation(x); }} placeholder="Degree" style={{ flex: 1 }} />
                  <input className="skeu-input" value={edu.institution} onChange={(e) => { const x = [...education]; x[i] = { ...x[i], institution: e.target.value }; setEducation(x); }} placeholder="Institution" style={{ flex: 1 }} />
                  <input className="skeu-input" value={edu.year || ''} onChange={(e) => { const x = [...education]; x[i] = { ...x[i], year: e.target.value }; setEducation(x); }} placeholder="Year" style={{ width: '80px' }} />
                  <button className="skeu-btn" onClick={() => setEducation(education.filter((_, j) => j !== i))} style={{ padding: '0.5rem', color: 'var(--color-error, #dc2626)' }}>
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiAward size={18} /> Certifications
              </h2>
              <button className="skeu-btn" onClick={() => setCertifications([...certifications, { name: '', issuer: '', date: '', url: '' }])} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                <FiPlus size={14} /> Add Certification
              </button>
            </div>
            {certifications.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No certifications added yet.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {certifications.map((cert, i) => (
                <div key={i} className="skeu-panel" style={{ padding: '0.75rem', position: 'relative' }}>
                  <button
                    className="skeu-btn"
                    onClick={() => setCertifications(certifications.filter((_, j) => j !== i))}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.35rem', color: 'var(--color-error, #dc2626)' }}
                  >
                    <FiTrash2 size={14} />
                  </button>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <input className="skeu-input" value={cert.name} onChange={(e) => { const x = [...certifications]; x[i] = { ...x[i], name: e.target.value }; setCertifications(x); }} placeholder="Certification name" style={{ width: '100%' }} />
                    <input className="skeu-input" value={cert.issuer || ''} onChange={(e) => { const x = [...certifications]; x[i] = { ...x[i], issuer: e.target.value }; setCertifications(x); }} placeholder="Issuer" style={{ width: '100%' }} />
                    <input className="skeu-input" value={cert.date || ''} onChange={(e) => { const x = [...certifications]; x[i] = { ...x[i], date: e.target.value }; setCertifications(x); }} placeholder="Date" style={{ width: '100%' }} />
                    <input className="skeu-input" value={cert.url || ''} onChange={(e) => { const x = [...certifications]; x[i] = { ...x[i], url: e.target.value }; setCertifications(x); }} placeholder="Credential URL" style={{ width: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Languages</h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {languages.map((lang, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.25rem 0.65rem', borderRadius: '9999px',
                  background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.85rem',
                }}>
                  {lang}
                  <button onClick={() => setLanguages(languages.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error, #dc2626)', padding: 0, lineHeight: 1 }}>
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="skeu-input"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && languageInput.trim()) { setLanguages([...languages, languageInput.trim()]); setLanguageInput(''); } }}
                placeholder="Type language and press Enter"
                style={{ flex: 1 }}
              />
              <button
                className="skeu-btn"
                onClick={() => { if (languageInput.trim()) { setLanguages([...languages, languageInput.trim()]); setLanguageInput(''); } }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <FiPlus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Job Preferences */}
          <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiBriefcase size={18} /> Job Preferences
            </h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isLookingForJob}
                  onChange={(e) => setIsLookingForJob(e.target.checked)}
                />
                <span style={{ fontWeight: 500 }}>I am currently looking for a job</span>
              </label>
            </div>
            {isLookingForJob && (
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.875rem' }}>Job Type</label>
                  <input className="skeu-input" value={jobType} onChange={(e) => setJobType(e.target.value)} placeholder="e.g. Full-time, Internship" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.875rem' }}>Preferred Location</label>
                  <input className="skeu-input" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} placeholder="e.g. Dhaka, Bangladesh" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.875rem' }}>Open to Remote</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={jobRemote} onChange={(e) => setJobRemote(e.target.checked)} />
                    Yes, I am open to remote positions
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Notification Preferences */}
          <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiBell size={18} /> Email Notifications
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Choose which email notifications you want to receive.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {([['notices', 'Notices & Announcements'], ['events', 'Events & Seminars'], ['achievements', 'Achievements & Awards']] as const).map(([key, label]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifPrefs[key]}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, [key]: e.target.checked })}
                  />
                  <span style={{ fontWeight: 500 }}>{label}</span>
                </label>
              ))}
            </div>
            <button
              className="skeu-btn"
              onClick={handleNotifSave}
              style={{ marginTop: '1rem', background: 'var(--color-primary)', color: '#fff', padding: '0.5rem 1.25rem', fontWeight: 600 }}
            >
              Save Preferences
            </button>
          </div>

          {/* Change Password */}
          <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiLock size={18} /> Change Password
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.875rem' }}>Current Password</label>
                <input
                  className="skeu-input"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.875rem' }}>New Password</label>
                <input
                  className="skeu-input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.875rem' }}>Confirm New Password</label>
                <input
                  className="skeu-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  style={{ width: '100%' }}
                />
              </div>
              <button
                className="skeu-btn"
                onClick={handleChangePassword}
                disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                style={{ background: 'var(--color-primary)', color: '#fff', padding: '0.5rem 1.25rem', fontWeight: 600, alignSelf: 'flex-start' }}
              >
                {changingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>

          {/* Bottom Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="skeu-btn"
              onClick={handleSave}
              disabled={saving}
              style={{
                background: 'var(--color-primary)', color: '#fff',
                padding: '0.75rem 2rem', fontWeight: 600, fontSize: '1rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}
            >
              {saving ? <FiLoader className="spin" size={16} /> : <FiSave size={16} />}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
          </>
          )}
        </div>
      </section>
    </div>
  );
}
