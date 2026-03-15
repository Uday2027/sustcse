import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Failed to send reset email';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="page auth-page">
        <div className="auth-page__container">
          <div className="auth-form skeu-panel skeu-panel--elevated">
            <div className="auth-form__header">
              <h2 className="skeu-heading skeu-heading--md">Check Your Email</h2>
              <p>We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.</p>
            </div>
            <div className="auth-form__footer">
              <p><Link to="/login">Back to Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page auth-page">
      <div className="auth-page__container">
        <div className="auth-form skeu-panel skeu-panel--elevated">
          <div className="auth-form__header">
            <h2 className="skeu-heading skeu-heading--md">Forgot Password</h2>
            <p>Enter your email and we'll send you a reset link.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="skeu-input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="skeu-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@sust.edu"
              />
            </div>
            <button
              type="submit"
              className="skeu-btn skeu-btn--primary skeu-btn--full skeu-btn--lg"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <div className="auth-form__footer">
            <p><Link to="/login">Back to Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
