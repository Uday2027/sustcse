import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';

interface User {
  id: string;
  full_name: string;
  designation: string;
}

interface ChainStep {
  approver_id: string;
  step_order: number;
  full_name: string;
  designation: string;
}

const AdminReviewPanel: React.FC<{ applicationId: string, onComplete: () => void }> = ({ applicationId, onComplete }) => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [chain, setChain] = useState<ChainStep[]>([]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await api.get('/users?role=teacher&approval_status=approved');
      setTeachers(response.data.data);
    };
    fetchTeachers();
  }, []);

  const addToChain = (teacher: User) => {
    if (chain.find(c => c.approver_id === teacher.id)) {
      toast.error('Teacher already in chain');
      return;
    }
    setChain([...chain, { ...teacher, approver_id: teacher.id, step_order: chain.length + 1 }]);
  };

  const removeFromChain = (id: string) => {
    setChain(chain.filter(c => c.approver_id !== id).map((c, i) => ({ ...c, step_order: i + 1 })));
  };

  const handleSubmit = async (status: 'approved' | 'rejected') => {
    if (status === 'approved' && chain.length === 0) {
      toast.error('Please assign at least one approver');
      return;
    }

    try {
      setSubmitting(true);
      await api.patch(`/applications/${applicationId}/admin-review`, {
        status,
        comment,
        approver_chain: status === 'approved' ? chain.map(c => ({ approver_id: c.approver_id, step_order: c.step_order })) : []
      });
      toast.success(status === 'approved' ? 'Chain assigned and forwarded' : 'Application rejected');
      onComplete();
    } catch (error) {
      toast.error('Failed to process review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="skeu-card" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>Admin Review & Chain Assignment</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Review Comments</label>
        <textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your assessment of this application..."
          className="skeu-input"
          style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Step 1: Select Teachers */}
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Select Approvers</h3>
          <div style={{ maxHeight: '16rem', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'white' }}>
            {teachers.map(t => (
              <div key={t.id} style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>{t.full_name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{t.designation}</p>
                </div>
                <button 
                  onClick={() => addToChain(t)}
                  className="skeu-btn"
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Sequence Builder */}
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Approval Sequence</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {chain.length === 0 && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No approvers assigned yet.</p>}
            {chain.map((c, idx) => (
              <div key={c.approver_id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--color-surface-alt)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <span style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                  {idx + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{c.full_name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{c.designation}</p>
                </div>
                <button onClick={() => removeFromChain(c.approver_id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-error)', cursor: 'pointer', padding: '0.25rem' }}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
        <button 
          onClick={() => handleSubmit('rejected')}
          disabled={submitting}
          className="skeu-btn"
          style={{ flex: 1, color: 'var(--color-error)' }}
        >
          Reject Application
        </button>
        <button 
          onClick={() => handleSubmit('approved')}
          disabled={submitting}
          className="skeu-btn skeu-btn--primary"
          style={{ flex: 1 }}
        >
          {submitting ? 'Processing...' : 'Approve & Start Chain'}
        </button>
      </div>
    </div>
  );
};

export default AdminReviewPanel;
