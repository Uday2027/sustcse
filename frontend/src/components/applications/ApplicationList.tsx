import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

interface Application {
  id: string;
  title: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  created_at: string;
  student: { full_name: string };
}

const ApplicationList: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/applications');
        setApplications(response.data.data);
      } catch (error) {
        console.error('Failed to fetch applications', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusColorAndBg = (status: string) => {
    switch (status) {
      case 'approved': return { color: '#15803d', background: '#dcfce7', border: '1px solid #bbf7d0' };
      case 'rejected': return { color: '#b91c1c', background: '#fee2e2', border: '1px solid #fecaca' };
      case 'under_review': return { color: '#1d4ed8', background: '#dbeafe', border: '1px solid #bfdbfe' };
      default: return { color: '#374151', background: '#f3f4f6', border: '1px solid #e5e7eb' };
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading applications...</div>;

  return (
    <div className="skeu-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Application Requests</h2>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>{applications.length} Total</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {applications.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No applications found.</div>
        ) : (
          applications.map((app) => (
            <Link 
              key={app.id} 
              to={`/applications/${app.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1.5rem',
                borderBottom: '1px solid var(--color-border)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-alt, #f8f9fa)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem', color: 'var(--text-primary)' }}>
                  {app.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <span>By {app.student?.full_name}</span>
                  <span>•</span>
                  <span>{new Date(app.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                ...getStatusColorAndBg(app.status)
              }}>
                {app.status.replace('_', ' ')}
              </div>
              
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
export default ApplicationList;
