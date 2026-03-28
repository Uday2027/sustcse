import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';

interface Props {
  applicationId: string;
  stepId: string;
  stepLabel?: string;
  onComplete: () => void;
}

const TeacherActionPanel: React.FC<Props> = ({ applicationId, stepId, stepLabel, onComplete }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (action === 'reject' && !comment.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setLoading(action);
      await api.post(`/applications/${applicationId}/${action}/${stepId}`, { comment });
      toast.success(action === 'approve' ? 'Signed & approved successfully!' : 'Application step rejected');
      onComplete();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || `Failed to ${action} application`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="skeu-card" style={{ padding: '1.5rem', border: '2px solid var(--color-accent)', background: 'linear-gradient(135deg, rgba(204,34,0,0.04) 0%, #fff 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.25rem' }}>✍️</span>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
            Your Signature Required
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
            {stepLabel || 'This application is awaiting your review'}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
          Comment <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(required for rejection)</span>
        </label>
        <textarea
          className="skeu-input"
          rows={3}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Add your remarks or reasons here..."
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={() => handleAction('reject')}
          disabled={!!loading}
          className="skeu-btn"
          style={{ flex: 1, color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
        >
          {loading === 'reject' ? 'Rejecting...' : '✕ Reject'}
        </button>
        <button
          onClick={() => handleAction('approve')}
          disabled={!!loading}
          className="skeu-btn skeu-btn--primary"
          style={{ flex: 2 }}
        >
          {loading === 'approve' ? 'Signing & Approving...' : '✓ Sign & Approve'}
        </button>
      </div>
    </div>
  );
};

export default TeacherActionPanel;
