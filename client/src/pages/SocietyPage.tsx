import { useState, useEffect, useMemo } from 'react';
import { FiUser, FiMail, FiPhone, FiUsers, FiCalendar } from 'react-icons/fi';
import api from '../lib/api';
import { useScrollReveal } from '../hooks/useGSAP';
import type { SocietyMember } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function SocietyPage() {
  const [currentMembers, setCurrentMembers] = useState<SocietyMember[]>([]);
  const [formerMembers, setFormerMembers] = useState<SocietyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'former'>('current');
  const headerRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const [currentRes, formerRes] = await Promise.all([
          api.get('/society-members?status=current'),
          api.get('/society-members?status=former'),
        ]);
        setCurrentMembers(currentRes.data.data || []);
        setFormerMembers(formerRes.data.data || []);
      } catch {
        setError('Failed to load society members.');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Group former members by committee year
  const formerByYear = useMemo(() => {
    const grouped: Record<string, SocietyMember[]> = {};
    formerMembers.forEach((m) => {
      const year = m.committee_year || 'Unknown';
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(m);
    });
    // Sort years descending
    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
  }, [formerMembers]);

  return (
    <div className="page society-page">
      <section className="section">
        <div className="container">
          <div ref={headerRef} className="page-header">
            <h1 className="page-title">CSE Society</h1>
            <p className="page-subtitle">
              The executive committee members of the CSE Society, SUST.
            </p>
          </div>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
            <button
              className="skeu-btn"
              onClick={() => setActiveTab('current')}
              style={{
                background: activeTab === 'current' ? 'var(--color-primary)' : undefined,
                color: activeTab === 'current' ? '#fff' : undefined,
                padding: '0.6rem 1.5rem',
                fontWeight: 600,
              }}
            >
              <FiUsers style={{ marginRight: '0.35rem' }} /> Current Members ({currentMembers.length})
            </button>
            <button
              className="skeu-btn"
              onClick={() => setActiveTab('former')}
              style={{
                background: activeTab === 'former' ? 'var(--color-primary)' : undefined,
                color: activeTab === 'former' ? '#fff' : undefined,
                padding: '0.6rem 1.5rem',
                fontWeight: 600,
              }}
            >
              <FiCalendar style={{ marginRight: '0.35rem' }} /> Former Members ({formerMembers.length})
            </button>
          </div>

          {loading && <LoadingSpinner />}

          {error && (
            <div className="skeu-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-error)' }}>
              <p>{error}</p>
            </div>
          )}

          {/* Current Members */}
          {!loading && !error && activeTab === 'current' && (
            <>
              {currentMembers.length === 0 ? (
                <div className="skeu-card" style={{ padding: '3rem', textAlign: 'center' }}>
                  <FiUsers size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
                  <h3>No Current Members</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Current committee members have not been added yet.</p>
                </div>
              ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                  {currentMembers.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Former Members */}
          {!loading && !error && activeTab === 'former' && (
            <>
              {formerMembers.length === 0 ? (
                <div className="skeu-card" style={{ padding: '3rem', textAlign: 'center' }}>
                  <FiUsers size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
                  <h3>No Former Members</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Former committee member records have not been added yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {formerByYear.map(([year, members]) => (
                    <div key={year}>
                      <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
                        <FiCalendar /> Committee {year}
                      </h2>
                      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                        {members.map((member) => (
                          <MemberCard key={member.id} member={member} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function MemberCard({ member }: { member: SocietyMember }) {
  return (
    <div className="skeu-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
      {/* Avatar */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 1rem',
        overflow: 'hidden', background: 'var(--color-surface-alt, #f0f0f0)',
        border: '2px solid var(--color-primary)',
      }}>
        {member.avatar_url ? (
          <img src={member.avatar_url} alt={member.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <FiUser size={28} style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
      </div>

      <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>{member.full_name}</h3>
      <p style={{ margin: '0 0 0.5rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
        {member.position}
      </p>
      <span style={{
        display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '9999px',
        background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.7rem', fontWeight: 600,
      }}>
        {member.committee_year}
      </span>

      {member.bio && (
        <p style={{ margin: '0.75rem 0 0', color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.4 }}>
          {member.bio.length > 80 ? member.bio.substring(0, 80) + '...' : member.bio}
        </p>
      )}

      {/* Contact */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
        {member.email && (
          <a href={`mailto:${member.email}`} title={member.email} style={{ color: 'var(--text-muted)' }}>
            <FiMail size={16} />
          </a>
        )}
        {member.phone && (
          <a href={`tel:${member.phone}`} title={member.phone} style={{ color: 'var(--text-muted)' }}>
            <FiPhone size={16} />
          </a>
        )}
      </div>
    </div>
  );
}
