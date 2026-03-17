import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiCheck } from 'react-icons/fi';
import api from '../../lib/api';
import type { SessionConfig as SessionType } from '../../types';

export default function SessionConfig() {
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ session_name: '', start_year: '', end_year: '' });

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/sessions');
      setSessions(data.data || []);
    } catch {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/sessions', {
        session_name: formData.session_name,
        start_year: parseInt(formData.start_year),
        end_year: parseInt(formData.end_year),
      });
      toast.success('Session created');
      setShowForm(false);
      setFormData({ session_name: '', start_year: '', end_year: '' });
      fetchSessions();
    } catch {
      toast.error('Failed to create session');
    }
  };

  const handleGraduate = async (sessionId: string) => {
    if (!confirm('Mark this session as graduated? This will auto-add students to alumni.')) return;
    try {
      await api.post(`/alumni/auto-add`, { session_id: sessionId });
      toast.success('Session marked as graduated and alumni added');
      fetchSessions();
    } catch {
      toast.error('Failed to graduate session');
    }
  };

  return (
    <div>
      <div className="admin-content__header">
        <h1>Session Configuration</h1>
        <button className="skeu-btn skeu-btn--primary" onClick={() => setShowForm(!showForm)}>
          <FiPlus size={16} /> Add Session
        </button>
      </div>

      {showForm && (
        <div className="skeu-panel" style={{ marginBottom: '1.5rem', maxWidth: '500px' }}>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeu-input-group" style={{ marginBottom: 0 }}>
              <label>Session Name</label>
              <input className="skeu-input" placeholder="e.g., 2025-26" value={formData.session_name} onChange={(e) => setFormData({ ...formData, session_name: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="skeu-input-group" style={{ flex: 1, marginBottom: 0 }}>
                <label>Start Year</label>
                <input className="skeu-input" type="number" placeholder="2025" value={formData.start_year} onChange={(e) => setFormData({ ...formData, start_year: e.target.value })} required />
              </div>
              <div className="skeu-input-group" style={{ flex: 1, marginBottom: 0 }}>
                <label>End Year</label>
                <input className="skeu-input" type="number" placeholder="2026" value={formData.end_year} onChange={(e) => setFormData({ ...formData, end_year: e.target.value })} required />
              </div>
            </div>
            <button type="submit" className="skeu-btn skeu-btn--primary">Create Session</button>
          </form>
        </div>
      )}

      <div className="skeu-table-container">
        <table className="skeu-table">
          <thead>
            <tr>
              <th>Session</th>
              <th>Start Year</th>
              <th>End Year</th>
              <th>Graduated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : sessions.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.session_name}</td>
                <td>{s.start_year}</td>
                <td>{s.end_year}</td>
                <td>
                  <span className={`skeu-card__badge skeu-card__badge--${s.is_graduated ? 'success' : 'academic'}`}>
                    {s.is_graduated ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  {!s.is_graduated && (
                    <button onClick={() => handleGraduate(s.id)} className="skeu-btn skeu-btn--success skeu-btn--sm">
                      <FiCheck size={14} /> Graduate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
