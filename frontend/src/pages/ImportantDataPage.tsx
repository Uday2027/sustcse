import { useState, useEffect, useMemo } from 'react';
import { FiFile, FiImage, FiFilter, FiExternalLink, FiX, FiDownload } from 'react-icons/fi';
import api from '../lib/api';
import { formatDate } from '../lib/formatters';
import { useScrollReveal } from '../hooks/useGSAP';
import type { ImportantData } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CATEGORIES = ['All', 'Forms', 'Syllabus', 'Regulations', 'Templates', 'Curriculum', 'Other'];

export default function ImportantDataPage() {
  const [items, setItems] = useState<ImportantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('All');
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const headerRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (category !== 'All') params.set('category', category);
        const { data: res } = await api.get(`/important-data?${params}`);
        setItems(res.data || []);
      } catch {
        setError('Failed to load important data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  const handleItemClick = (item: ImportantData) => {
    if (item.file_type === 'image') {
      setViewingImage(item.file_url);
    } else {
      window.open(item.file_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="page important-data-page">
      <section className="section">
        <div className="container">
          <div ref={headerRef} className="page-header">
            <h1 className="page-title">Important Data</h1>
            <p className="page-subtitle">
              Access important documents, forms, and resources.
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

          {!loading && !error && items.length === 0 && (
            <div className="skeu-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <FiFile size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <h3>No Data Found</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                {category !== 'All' ? 'Try selecting a different category.' : 'No important data items have been added yet.'}
              </p>
            </div>
          )}

          {/* Items Grid */}
          {!loading && items.length > 0 && (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="skeu-card"
                  onClick={() => handleItemClick(item)}
                  style={{
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* File Type Icon */}
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '10px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: item.file_type === 'pdf' ? '#fee2e2' : '#dbeafe',
                    color: item.file_type === 'pdf' ? '#dc2626' : '#2563eb',
                  }}>
                    {item.file_type === 'pdf' ? <FiFile size={24} /> : <FiImage size={24} />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', lineHeight: 1.3 }}>{item.title}</h3>
                    {item.description && (
                      <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        {item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.category && (
                        <span style={{
                          padding: '0.1rem 0.4rem', borderRadius: '9999px',
                          background: 'var(--color-surface-alt, #e8e8e8)', fontWeight: 600,
                        }}>
                          {item.category}
                        </span>
                      )}
                      <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{item.file_type}</span>
                      {item.file_size && <span>{(item.file_size / 1024 / 1024).toFixed(2)} MB</span>}
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </div>

                  <FiExternalLink size={16} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Viewer Modal */}
      {viewingImage && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
          }}
          onClick={() => setViewingImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <button
              className="skeu-btn"
              onClick={() => setViewingImage(null)}
              style={{ position: 'absolute', top: '-40px', right: '0', background: '#fff', padding: '0.5rem' }}
            >
              <FiX size={18} />
            </button>
            <img
              src={viewingImage}
              alt="Document"
              style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px' }}
              onClick={(e) => e.stopPropagation()}
            />
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <a
                href={viewingImage}
                target="_blank"
                rel="noopener noreferrer"
                className="skeu-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none', background: '#fff' }}
              >
                <FiDownload size={14} /> Open Full Size
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
