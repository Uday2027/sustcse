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
              Celebrating the legacy and achievements of CSE SUST graduates worldwide.
            </p>
          </div>

          {/* About Association */}
          <div className="alumni-about-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '2rem', marginBottom: '4rem' }}>
            <div className="bento-card">
              <h2 className="section-title-sm">About the Association</h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                As the Department of CSE has grown since 1993, there were demands for a platform for collaboration
                based on common pride. In 2018, during the grand reunion for the silver jubilee, the
                CSE Alumni Association was formed.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginTop: '1rem' }}>
                The purpose is to foster a spirit of loyalty and promote the general welfare of the Department.
                This association exists to support the department's goals and strengthen the ties between alumni and current students.
              </p>
              <a href="http://www.cseaasust.org" target="_blank" rel="noopener noreferrer" className="skeu-btn skeu-btn--small" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                Visit Official Website
              </a>
            </div>

            <div className="bento-card">
              <h2 className="section-title-sm">Our Objectives</h2>
              <div className="objectives-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>Social</h4>
                  <ul style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', listStyle: 'none', padding: 0 }}>
                    <li>• Uphold image of department</li>
                    <li>• Create bridges for alumni</li>
                    <li>• Social/Health crisis assist</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>Professional</h4>
                  <ul style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', listStyle: 'none', padding: 0 }}>
                    <li>• Seminars & Workshops</li>
                    <li>• Educational collaboration</li>
                    <li>• Job-related networking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Committee */}
          <div className="alumni-section" style={{ marginBottom: '5rem' }}>
            <h2 className="faculty-section__title">Executive Committee 2025–26</h2>
            <div className="committee-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[
                { name: 'Mohd. Raihan Habib', role: 'President & Director, Corporate Partnership', initials: 'RH' },
                { name: 'Mohammad Musa', role: 'Vice President & Director, Policy and Admin', initials: 'MM' },
                { name: 'Pritam Jyoti Ray', role: 'General Secretary & Director, Digital Platform Engagement', initials: 'PR' },
                { name: 'Md. Mahadi Masud Faisal', role: 'Treasurer & Director, Governance and Finance', initials: 'MF' },
                { name: 'Khaled Satter', role: 'Director, Member Engagement', initials: 'KS' },
                { name: 'Abul Kalam Ahsanul Azad', role: 'Director, R&D and Innovation', initials: 'AA' },
                { name: 'Forkan Uddin', role: 'Director, Collaboration and Social Welfare', initials: 'FU' },
                { name: 'Md. Mafidul Islam', role: 'Director, Professional Development', initials: 'MI' },
                { name: 'Tasnim Haider Chaudhury', role: 'Director, Inclusion and Diversity', initials: 'TH' },
                { name: 'Shafikul Islam', role: 'Director, Communication and Public Relations', initials: 'SI' },
              ].map((member, i) => (
                <div key={i} className="bento-card committee-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div className="committee-avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-glass-accent)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0 }}>
                    {member.initials}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{member.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>



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
