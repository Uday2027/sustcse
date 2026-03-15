import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase puts tokens in the hash fragment: #access_token=...&type=recovery
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { access_token: accessToken, new_password: newPassword });
      toast.success('Password reset successfully! You can now log in.');
      navigate('/login');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Failed to reset password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!accessToken) {
    return (
      <div className="page auth-page">
        <div className="auth-page__container">
          <div className="auth-form skeu-panel skeu-panel--elevated">
            <div className="auth-form__header">
              <h2 className="skeu-heading skeu-heading--md">Invalid Reset Link</h2>
              <p>This password reset link is invalid or has expired.</p>
            </div>
            <Link to="/forgot-password" className="skeu-btn skeu-btn--primary skeu-btn--full skeu-btn--lg">
              Request New Reset Link
            </Link>
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
            <h2 className="skeu-heading skeu-heading--md">Reset Password</h2>
            <p>Enter your new password below.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="skeu-input-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                className="skeu-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>
            <div className="skeu-input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="skeu-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>
            <button
              type="submit"
              className="skeu-btn skeu-btn--primary skeu-btn--full skeu-btn--lg"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
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
