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
          <div className="filter-bar">
            <FiFilter size={18} />
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {loading && <LoadingSpinner />}

          {error && (
            <div className="bento-card empty-state">
              <p style={{ color: 'var(--color-error)' }}>{error}</p>
            </div>
          )}

          {!loading && !error && achievements.length === 0 && (
            <div className="bento-card empty-state">
              <div className="icon-box">
                <FiAward size={48} />
              </div>
              <h3>No Achievements Found</h3>
              <p>
                {category !== 'All' ? 'Try selecting a different category.' : 'No achievements have been added yet.'}
              </p>
            </div>
          )}

          {/* Featured Achievements */}
          {!loading && featured.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <FiStar style={{ color: '#d4a017' }} /> Featured Achievements
              </h2>
              <div className="achievements-bento">
                {featured.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} featured />
                ))}
              </div>
            </div>
          )}

          {/* Regular Achievements */}
          {!loading && regular.length > 0 && (
            <div>
              {featured.length > 0 && (
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  All Achievements
                </h2>
              )}
              <div className="achievements-bento">
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
    <div className={`bento-card achievement-card${featured ? ' achievement-card--featured' : ''}`}>
      {/* Image */}
      {achievement.image_urls.length > 0 ? (
        <div className="achievement-card__image">
          <img
            src={achievement.image_urls[0]}
            alt={achievement.title}
          />
        </div>
      ) : (
        <div className="achievement-card__image-placeholder">
          <FiAward size={40} />
        </div>
      )}

      <div className="achievement-card__body">
        {/* Badges */}
        <div className="achievement-card__badges">
          {featured && (
            <span className="badge badge--gold">
              <FiStar size={10} /> Featured
            </span>
          )}
          {achievement.category && (
            <span className="badge badge--subtle">
              {achievement.category}
            </span>
          )}
        </div>

        <h3 className="achievement-card__title">{achievement.title}</h3>
        <p className="achievement-card__desc">
          {achievement.description.length > 150 ? achievement.description.substring(0, 150) + '...' : achievement.description}
        </p>

        <div className="achievement-card__footer">
          <div>
            {achievement.achieved_by && <span>by {achievement.achieved_by}</span>}
          </div>
          <div>
            {achievement.achievement_date && <span>{formatDate(achievement.achievement_date)}</span>}
            {achievement.link && (
              <a href={achievement.link} target="_blank" rel="noopener noreferrer">
                <FiExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
