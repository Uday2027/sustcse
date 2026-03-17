import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiSend } from 'react-icons/fi';
import api from '../../lib/api';

interface EmailFormData {
  to: string;
  subject: string;
  template: string;
  message: string;
}

export default function EmailComposer() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmailFormData>();

  const onSubmit = async (data: EmailFormData) => {
    setLoading(true);
    try {
      const recipients = data.to.split(',').map((e) => e.trim()).filter(Boolean);
      await api.post('/admin/send-email', {
        to: recipients.length === 1 ? recipients[0] : recipients,
        subject: data.subject,
        template: 'welcome',
        data: { content: data.message },
      });
      toast.success(`Email sent to ${recipients.length} recipient(s)`);
      reset();
    } catch {
      toast.error('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-content__header">
        <h1>Send Email</h1>
      </div>

      <div className="skeu-panel" style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="skeu-input-group">
            <label htmlFor="to">Recipients (comma-separated)</label>
            <input
              id="to"
              className={`skeu-input ${errors.to ? 'skeu-input--error' : ''}`}
              placeholder="user1@example.com, user2@example.com"
              {...register('to', { required: 'At least one recipient is required' })}
            />
            {errors.to && <p className="skeu-input-error">{errors.to.message}</p>}
            <p className="skeu-input-hint">Separate multiple emails with commas. Max 500 recipients.</p>
          </div>

          <div className="skeu-input-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              className={`skeu-input ${errors.subject ? 'skeu-input--error' : ''}`}
              placeholder="Email subject"
              {...register('subject', { required: 'Subject is required' })}
            />
            {errors.subject && <p className="skeu-input-error">{errors.subject.message}</p>}
          </div>

          <div className="skeu-input-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              className={`skeu-textarea ${errors.message ? 'skeu-input--error' : ''}`}
              placeholder="Write your message here..."
              rows={8}
              {...register('message', { required: 'Message is required' })}
            />
            {errors.message && <p className="skeu-input-error">{errors.message.message}</p>}
          </div>

          <button type="submit" className="skeu-btn skeu-btn--primary skeu-btn--lg" disabled={loading}>
            <FiSend size={16} />
            {loading ? 'Sending...' : 'Send Email'}
          </button>
        </form>
      </div>
    </div>
  );
}
