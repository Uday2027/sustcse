import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { loginSchema, type LoginInput } from '../../lib/validators';

interface LoginFormProps {
  onToggleMode?: () => void;
}

export default function LoginForm({ onToggleMode }: LoginFormProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err: unknown) {
      const error = err as Error & { code?: string; email?: string };
      if (error.code === 'EMAIL_NOT_VERIFIED') {
        toast.error('Please verify your email first');
        navigate(`/verify-email?email=${encodeURIComponent(error.email || data.email)}`);
        return;
      }
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form skeu-panel skeu-panel--elevated auth-form--premium">
      <div className="auth-form__header">
        <h2 className="skeu-heading skeu-heading--md">Welcome Back</h2>
        <p>Sign in to your CSE SUST account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="skeu-input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className={`skeu-input ${errors.email ? 'skeu-input--error' : ''}`}
            placeholder="your.email@sust.edu"
            {...register('email')}
          />
          {errors.email && <p className="skeu-input-error">{errors.email.message}</p>}
        </div>

        <div className="skeu-input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className={`skeu-input ${errors.password ? 'skeu-input--error' : ''}`}
            placeholder="Enter your password"
            {...register('password')}
          />
          {errors.password && <p className="skeu-input-error">{errors.password.message}</p>}
        </div>

        <button type="submit" className="skeu-btn skeu-btn--primary skeu-btn--full skeu-btn--lg" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-form__footer">
        <p><Link to="/forgot-password">Forgot your password?</Link></p>
        <p>
          Don't have an account?{' '}
          {onToggleMode ? (
            <button
              type="button"
              onClick={onToggleMode}
              className="auth-toggle-btn"
            >
              Register now
            </button>
          ) : (
            <Link to="/register">Register now</Link>
          )}
        </p>
      </div>
    </div>
  );
}
