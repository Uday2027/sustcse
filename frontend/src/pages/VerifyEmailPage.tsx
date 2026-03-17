import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token');
  const type = searchParams.get('type') || 'email';

  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');

  const verifyToken = useCallback(async () => {
    setVerifying(true);
    setError('');
    try {
      await api.post('/auth/verify-email', { token_hash: token, type });
      setVerified(true);
      toast.success('Email verified successfully!');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Verification failed. The link may have expired.';
      setError(message);
      toast.error(message);
    } finally {
      setVerifying(false);
    }
  }, [token, type]);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token, verifyToken]);

  const resendVerification = async () => {
    if (!email) return;
    setResending(true);
    try {
      await api.post('/auth/resend-verification', { email });
      toast.success('Verification email sent! Check your inbox.');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Failed to resend verification email';
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  if (verifying) {
    return (
      <div className="page auth-page">
        <div className="auth-page__container">
          <div className="auth-form skeu-panel skeu-panel--elevated">
            <div className="auth-form__header">
              <h2 className="skeu-heading skeu-heading--md">Verifying Email...</h2>
              <p>Please wait while we verify your email address.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="page auth-page">
        <div className="auth-page__container">
          <div className="auth-form skeu-panel skeu-panel--elevated">
            <div className="auth-form__header">
              <h2 className="skeu-heading skeu-heading--md">Email Verified!</h2>
              <p>Your email has been verified successfully.</p>
            </div>
            <p className="auth-form__notice">
              Your account may still require admin approval before you can log in.
            </p>
            <Link to="/login" className="skeu-btn skeu-btn--primary skeu-btn--full skeu-btn--lg">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page auth-page">
        <div className="auth-page__container">
          <div className="auth-form skeu-panel skeu-panel--elevated">
            <div className="auth-form__header">
              <h2 className="skeu-heading skeu-heading--md">Verification Failed</h2>
              <p>{error}</p>
            </div>
            {email && (
              <button
                onClick={resendVerification}
                className="skeu-btn skeu-btn--primary skeu-btn--full skeu-btn--lg"
                disabled={resending}
              >
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </button>
            )}
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
            <h2 className="skeu-heading skeu-heading--md">Verify Your Email</h2>
            <p>
              We've sent a verification link to{' '}
              {email ? <strong>{email}</strong> : 'your email address'}.
              Please check your inbox and click the link to verify your account.
            </p>
          </div>

          <p className="auth-form__notice">
            Didn't receive the email? Check your spam folder or click below to resend.
          </p>

          {email && (
            <button
              onClick={resendVerification}
              className="skeu-btn skeu-btn--primary skeu-btn--full skeu-btn--lg"
              disabled={resending}
            >
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </button>
          )}

          <div className="auth-form__footer">
            <p>Already verified? <Link to="/login">Sign in here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
