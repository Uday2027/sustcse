import { useState, useEffect, useMemo } from 'react';
import { FiAward, FiExternalLink, FiStar, FiFilter } from 'react-icons/fi';
import api from '../lib/api';
import { formatDate } from '../lib/formatters';
import { useScrollReveal } from '../hooks/useGSAP';
import type { Achievement } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CATEGORIES = ['All', 'Academic', 'Research', 'Competition', 'Innovation', 'Community', 'Sports', 'Other'];

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('All');
  const headerRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (category !== 'All') params.set('category', category);
        const { data: res } = await api.get(`/achievements?${params}`);
        setAchievements(res.data || []);
      } catch {
        setError('Failed to load achievements.');
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, [category]);

  const featured = achievements.filter((a) => a.is_featured);
  const regular = achievements.filter((a) => !a.is_featured);

  return (
    <div className="page achievements-page">
      <section className="section">
        <div className="container">
          <div ref={headerRef} className="page-header">
            <h1 className="page-title">Achievements</h1>
            <p className="page-subtitle">
              Celebrating the accomplishments of students and faculty of CSE, SUST.
            </p>
          </div>

          {/* Filter */}
          <div className="skeu-panel" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <FiFilter size={18} />
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Category:</label>
              <select
                className="skeu-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ minWidth: '160px' }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {loading && <LoadingSpinner />}

          {error && (
            <div className="skeu-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-error)' }}>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && achievements.length === 0 && (
            <div className="skeu-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <FiAward size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <h3>No Achievements Found</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                {category !== 'All' ? 'Try selecting a different category.' : 'No achievements have been added yet.'}
              </p>
            </div>
          )}

          {/* Featured Achievements */}
          {!loading && featured.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiStar style={{ color: '#d4a017' }} /> Featured Achievements
              </h2>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {featured.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} featured />
                ))}
              </div>
            </div>
          )}

          {/* Regular Achievements */}
          {!loading && regular.length > 0 && (
            <div>
              {featured.length > 0 && <h2 style={{ marginBottom: '1rem' }}>All Achievements</h2>}
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {regular.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function AchievementCard({ achievement, featured = false }: { achievement: Achievement; featured?: boolean }) {
  return (
    <div
      className="skeu-card"
      style={{
        overflow: 'hidden',
        border: featured ? '2px solid #d4a017' : undefined,
        boxShadow: featured ? '0 0 12px rgba(212, 160, 23, 0.2)' : undefined,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      {achievement.image_urls.length > 0 ? (
        <div style={{ height: '200px', overflow: 'hidden' }}>
          <img
            src={achievement.image_urls[0]}
            alt={achievement.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface-alt, #f0f0f0)' }}>
          <FiAward size={40} style={{ color: featured ? '#d4a017' : 'var(--text-muted)' }} />
        </div>
      )}

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Badges */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          {featured && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
              padding: '0.15rem 0.5rem', borderRadius: '9999px',
              background: '#d4a017', color: '#fff', fontSize: '0.7rem', fontWeight: 700,
            }}>
              <FiStar size={10} /> Featured
            </span>
          )}
          {achievement.category && (
            <span style={{
              padding: '0.15rem 0.5rem', borderRadius: '9999px',
              background: 'var(--color-surface-alt, #e8e8e8)', fontSize: '0.7rem', fontWeight: 600,
            }}>
              {achievement.category}
            </span>
          )}
        </div>

        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', lineHeight: 1.3 }}>{achievement.title}</h3>
        <p style={{ margin: '0 0 0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, flex: 1 }}>
          {achievement.description.length > 150 ? achievement.description.substring(0, 150) + '...' : achievement.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
          <div>
            {achievement.achieved_by && <span>by {achievement.achieved_by}</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {achievement.achievement_date && <span>{formatDate(achievement.achievement_date)}</span>}
            {achievement.link && (
              <a href={achievement.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                <FiExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
