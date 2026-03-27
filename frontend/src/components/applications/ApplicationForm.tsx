import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FormData {
  title: string;
  to: string;
  to_teacher_id?: string;
  medium_teacher_id?: string;
  body: string;
  department_name: string;
  attachments: File[];
}

interface Teacher {
  id: string;
  full_name: string;
  designation?: string;
}

const ApplicationForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    to: '',
    to_teacher_id: '',
    medium_teacher_id: '',
    body: '',
    department_name: 'Department of Computer Science and Engineering',
    attachments: [],
  });

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    api.get('/users/teachers').then(res => setTeachers(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    let toText = '';
    const toTeacher = teachers.find(t => t.id === formData.to_teacher_id);
    const mediumTeacher = teachers.find(t => t.id === formData.medium_teacher_id);

    if (toTeacher) {
      toText += `The ${toTeacher.designation || 'Teacher'}\n${formData.department_name}\nShahjalal University of Science and Technology`;
    }
    if (mediumTeacher) {
      toText += `\n\nThrough: The ${mediumTeacher.designation || 'Teacher'}, ${formData.department_name}, SUST`;
    }
    
    setFormData(prev => ({ ...prev, to: toText.trim() }));
  }, [formData.to_teacher_id, formData.medium_teacher_id, formData.department_name, teachers]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter(f => f.size < 5 * 1024 * 1024); // 5MB max per file
    if (valid.length < files.length) toast.error('Some files exceed 5MB and were excluded.');
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...valid].slice(0, 5) }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) {
      toast.error('Please fill in the Subject and Body');
      return;
    }
    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('to', formData.to);
      if (formData.to_teacher_id) data.append('to_teacher_id', formData.to_teacher_id);
      if (formData.medium_teacher_id) data.append('medium_teacher_id', formData.medium_teacher_id);
      data.append('body', formData.body);
      data.append('department_name', formData.department_name);
      formData.attachments.forEach(f => data.append('attachments', f));

      const res = await api.post('/applications', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`Application submitted! Ref: ${res.data.data.serial_number}`);
      navigate('/applications');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── A4 Preview Renderer ────────────────────────────────────────────────────
  const A4Preview = () => (
    <div style={{
      width: '100%',
      maxWidth: '520px',
      aspectRatio: '1 / 1.414',
      background: 'white',
      border: '1px solid #cbd5e1',
      borderRadius: '4px',
      padding: '36px 44px',
      fontFamily: "'Times New Roman', Times, serif",
      fontSize: '10.5px',
      lineHeight: 1.55,
      color: '#111',
      boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      overflowY: 'hidden',
    }}>
      {/* Letterhead */}
      <div style={{ borderBottom: '2px solid #1e3a8a', paddingBottom: '8px', marginBottom: '10px' }}>
        <div style={{ fontWeight: 700, fontSize: '12px', color: '#1e3a8a', letterSpacing: '0.03em' }}>
          SHAHJALAL UNIVERSITY OF SCIENCE AND TECHNOLOGY
        </div>
        <div style={{ fontSize: '9.5px', color: '#475569', marginTop: '2px' }}>
          {formData.department_name || 'Department of Computer Science and Engineering'}
        </div>
      </div>

      {/* Serial + Date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5px', marginBottom: '14px', color: '#374151' }}>
        <span style={{ fontWeight: 700, color: '#1e3a8a' }}>Ref: APP-{new Date().getFullYear()}-XXXX</span>
        <span>Date: {today}</span>
      </div>

      {/* To */}
      <div style={{ marginBottom: '12px', fontSize: '10px' }}>
        <div>To,</div>
        {formData.to ? formData.to.split('\n').map((line, i) => (
          <div key={i} style={{ fontWeight: i === 0 ? 700 : 400 }}>{line || ' '}</div>
        )) : <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>Addressee...</div>}
      </div>

      {/* Subject */}
      <div style={{ marginBottom: '12px', borderBottom: '0.5px solid #e2e8f0', paddingBottom: '6px', fontSize: '10px' }}>
        <span style={{ fontWeight: 700 }}>Subject: </span>
        <span style={{ fontWeight: 700, color: '#1e40af' }}>
          {formData.title || <em style={{ color: '#94a3b8', fontWeight: 400 }}>Your subject line...</em>}
        </span>
      </div>

      {/* Salutation */}
      <div style={{ marginBottom: '8px', fontStyle: 'italic', fontSize: '10px' }}>Respected Sir/Madam,</div>

      {/* Body */}
      <div style={{ flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: formData.body ? '#111' : '#94a3b8', fontStyle: formData.body ? 'normal' : 'italic', fontSize: '10px', lineHeight: 1.6 }}>
        {formData.body || 'Your application body will appear here...'}
      </div>

      {/* Closing */}
      <div style={{ marginTop: '16px', fontSize: '10px' }}>
        <div style={{ fontStyle: 'italic', marginBottom: '24px' }}>Yours sincerely,</div>
        <div style={{ borderTop: '0.5px solid #111', width: '100px', marginBottom: '4px' }} />
        <div style={{ fontWeight: 700 }}>{user?.full_name}</div>
        {(user as any)?.student_id && <div style={{ fontSize: '9px', color: '#64748b' }}>ID: {(user as any).student_id}</div>}
        {(user as any)?.session_id && <div style={{ fontSize: '9px', color: '#64748b' }}>Session: {(user as any).session_id}</div>}
      </div>

      {/* Footer */}
      <div style={{ borderTop: '0.5px solid #cbd5e1', marginTop: '12px', paddingTop: '4px', fontSize: '7px', color: '#94a3b8', textAlign: 'center' }}>
        SUST Application Portal · APP-{new Date().getFullYear()}-XXXX · {today}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 480px)', gap: '2rem', alignItems: 'start' }}>

        {/* ── Left: Form Fields ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="skeu-card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: 700 }}>
              New Application
            </h2>

            {/* Department */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                Department
              </label>
              <input
                type="text"
                className="skeu-input"
                value={formData.department_name}
                onChange={e => handleChange('department_name', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* To / Medium Selectors */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  To (Recipient) <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <select
                  className="skeu-input"
                  value={formData.to_teacher_id || ''}
                  onChange={e => handleChange('to_teacher_id', e.target.value)}
                  style={{ width: '100%' }}
                  required
                >
                  <option value="">Select a teacher...</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.full_name} {t.designation ? `(${t.designation})` : ''}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  Through (Optional)
                </label>
                <select
                  className="skeu-input"
                  value={formData.medium_teacher_id || ''}
                  onChange={e => handleChange('medium_teacher_id', e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">None</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.full_name} {t.designation ? `(${t.designation})` : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                Subject <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <input
                type="text"
                className="skeu-input"
                required
                value={formData.title}
                onChange={e => handleChange('title', e.target.value)}
                placeholder="e.g. Request for Event Permission"
                style={{ width: '100%' }}
              />
            </div>

            {/* Body */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Application Body <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formData.body.length} chars</span>
              </div>
              <textarea
                className="skeu-input"
                rows={8}
                required
                value={formData.body}
                onChange={e => handleChange('body', e.target.value)}
                placeholder="Write your application here. Start from the main request and provide all necessary details..."
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Attachments */}
          <div className="skeu-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Supporting Documents
              <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>(Optional, max 5 files, 5MB each)</span>
            </h3>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', border: '2px dashed var(--color-border)', borderRadius: '10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.875rem', transition: 'border-color 0.2s' }}>
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} style={{ display: 'none' }} />
              📎 Click to attach files (PDF, JPG, PNG)
            </label>

            {formData.attachments.length > 0 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {formData.attachments.map((f, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--color-surface-alt)', borderRadius: '8px', fontSize: '0.8rem' }}>
                    <span>📄 {f.name}</span>
                    <button type="button" onClick={() => removeAttachment(i)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontSize: '1rem' }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="skeu-btn skeu-btn--primary"
            style={{ padding: '1rem', fontSize: '1rem', width: '100%' }}
          >
            {submitting ? 'Generating & Submitting...' : 'Submit Application'}
          </button>
        </div>

        {/* ── Right: Live A4 Preview ────────────────────────────────────── */}
        <div style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Live A4 Preview
          </div>
          <A4Preview />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            The final PDF will be generated by the server in official letterhead format.
          </p>
        </div>
      </div>
    </form>
  );
};

export default ApplicationForm;
