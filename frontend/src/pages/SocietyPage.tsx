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
          <div className="tab-switcher">
            <button
              className={`tab-btn ${activeTab === 'current' ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab('current')}
            >
              <FiUsers /> Current Members ({currentMembers.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'former' ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab('former')}
            >
              <FiCalendar /> Former Members ({formerMembers.length})
            </button>
          </div>

          {loading && <LoadingSpinner />}

          {error && (
            <div className="bento-card empty-state empty-state--error">
              <p>{error}</p>
            </div>
          )}

          {/* Current Members */}
          {!loading && !error && activeTab === 'current' && (
            <>
              {currentMembers.length === 0 ? (
                <div className="bento-card empty-state">
                  <FiUsers size={48} className="empty-state__icon" />
                  <h3>No Current Members</h3>
                  <p className="empty-state__text">Current committee members have not been added yet.</p>
                </div>
              ) : (
                <div className="society-bento">
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
                <div className="bento-card empty-state">
                  <FiUsers size={48} className="empty-state__icon" />
                  <h3>No Former Members</h3>
                  <p className="empty-state__text">Former committee member records have not been added yet.</p>
                </div>
              ) : (
                <div className="society-former">
                  {formerByYear.map(([year, members]) => (
                    <div key={year}>
                      <h2 className="year-header">
                        <FiCalendar /> Committee {year}
                      </h2>
                      <div className="society-bento">
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
    <div className="bento-card society-card">
      {/* Avatar */}
      <div className="society-card__avatar">
        {member.avatar_url ? (
          <img src={member.avatar_url} alt={member.full_name} />
        ) : (
          <div className="society-card__avatar-placeholder">
            <FiUser size={28} />
          </div>
        )}
      </div>

      <h3 className="society-card__name">{member.full_name}</h3>
      <p className="society-card__position">{member.position}</p>
      <span className="badge badge--subtle">{member.committee_year}</span>

      {member.bio && (
        <p className="society-card__bio">
          {member.bio.length > 80 ? member.bio.substring(0, 80) + '...' : member.bio}
        </p>
      )}

      {/* Contact */}
      <div className="society-card__contact">
        {member.email && (
          <a href={`mailto:${member.email}`} title={member.email} className="society-card__contact-link">
            <FiMail size={16} />
          </a>
        )}
        {member.phone && (
          <a href={`tel:${member.phone}`} title={member.phone} className="society-card__contact-link">
            <FiPhone size={16} />
          </a>
        )}
      </div>
    </div>
  );
}
