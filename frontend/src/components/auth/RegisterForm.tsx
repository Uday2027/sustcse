import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { studentRegisterSchema, teacherRegisterSchema, type StudentRegisterInput, type TeacherRegisterInput } from '../../lib/validators';
import { SESSION_OPTIONS } from '../../config/constants';

type RegisterType = 'student' | 'teacher';

interface RegisterFormProps {
  onToggleMode?: () => void;
}

export default function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [type, setType] = useState<RegisterType>('student');
  const [loading, setLoading] = useState(false);

  const studentForm = useForm<StudentRegisterInput>({
    resolver: zodResolver(studentRegisterSchema),
  });

  const teacherForm = useForm<TeacherRegisterInput>({
    resolver: zodResolver(teacherRegisterSchema),
  });

  const currentForm = type === 'student' ? studentForm : teacherForm;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, formState: { errors } } = currentForm as any;

  const onSubmit = async (data: StudentRegisterInput | TeacherRegisterInput) => {
    setLoading(true);
    try {
      await registerUser(data as Record<string, unknown>, type);
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form auth-form--register skeu-panel skeu-panel--elevated">
      <div className="auth-form__header">
        <h2 className="skeu-heading skeu-heading--md">Create Account</h2>
        <p>Join the CSE SUST community</p>
      </div>

      <div className="auth-form__type-toggle">
        <button
          className={`skeu-btn ${type === 'student' ? 'skeu-btn--primary' : ''}`}
          onClick={() => setType('student')}
          type="button"
        >
          Student
        </button>
        <button
          className={`skeu-btn ${type === 'teacher' ? 'skeu-btn--primary' : ''}`}
          onClick={() => setType('teacher')}
          type="button"
        >
          Teacher
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="skeu-input-group">
          <label htmlFor="full_name">Full Name</label>
          <input
            id="full_name"
            className={`skeu-input ${errors.full_name ? 'skeu-input--error' : ''}`}
            placeholder="Enter your full name"
            {...register('full_name')}
          />
          {errors.full_name && <p className="skeu-input-error">{errors.full_name.message}</p>}
        </div>

        {type === 'student' && (
          <>
            <div className="skeu-input-group">
              <label htmlFor="student_id">Student ID</label>
              <input
                id="student_id"
                className={`skeu-input ${(errors as Record<string, { message?: string }>).student_id ? 'skeu-input--error' : ''}`}
                placeholder="e.g., 2021331001"
                {...register('student_id' as 'full_name')}
              />
              {(errors as Record<string, { message?: string }>).student_id && (
                <p className="skeu-input-error">{(errors as Record<string, { message?: string }>).student_id?.message}</p>
              )}
            </div>

            <div className="skeu-input-group">
              <label htmlFor="session">Session</label>
              <select
                id="session"
                className="skeu-select"
                {...register('session' as 'full_name')}
              >
                <option value="">Select your session</option>
                {SESSION_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {(errors as Record<string, { message?: string }>).session && (
                <p className="skeu-input-error">{(errors as Record<string, { message?: string }>).session?.message}</p>
              )}
            </div>
          </>
        )}

        <div className="skeu-input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className={`skeu-input ${errors.email ? 'skeu-input--error' : ''}`}
            placeholder={type === 'student' ? '2021331xxx@student.sust.edu' : 'your.email@sust.edu'}
            {...register('email')}
          />
          {errors.email && <p className="skeu-input-error">{errors.email.message}</p>}
          {type === 'student' && (
            <p className="skeu-input-hint">SUST emails are auto-approved. Others need admin approval.</p>
          )}
        </div>

        <div className="skeu-input-group">
          <label htmlFor="phone">Phone (WhatsApp preferable)</label>
          <input
            id="phone"
            type="tel"
            className={`skeu-input ${errors.phone ? 'skeu-input--error' : ''}`}
            placeholder="+880 1XXX-XXXXXX"
            {...register('phone')}
          />
          {errors.phone && <p className="skeu-input-error">{errors.phone.message}</p>}
        </div>

        <div className="auth-form__row">
          <div className="skeu-input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={`skeu-input ${errors.password ? 'skeu-input--error' : ''}`}
              placeholder="Min. 6 characters"
              {...register('password')}
            />
            {errors.password && <p className="skeu-input-error">{errors.password.message}</p>}
          </div>

          <div className="skeu-input-group">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              id="confirm_password"
              type="password"
              className={`skeu-input ${errors.confirm_password ? 'skeu-input--error' : ''}`}
              placeholder="Re-enter password"
              {...register('confirm_password')}
            />
            {errors.confirm_password && <p className="skeu-input-error">{errors.confirm_password.message}</p>}
          </div>
        </div>

        {type === 'teacher' && (
          <p className="auth-form__notice">
            Teacher accounts require admin approval after email verification.
          </p>
        )}

        <button type="submit" className="skeu-btn skeu-btn--primary skeu-btn--full skeu-btn--lg" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <div className="auth-form__footer">
        <p>
          Already have an account?{' '}
          {onToggleMode ? (
            <button 
              type="button" 
              onClick={onToggleMode}
              className="text-accent hover:underline bg-transparent border-none p-0 cursor-pointer font-semibold"
            >
              Login now
            </button>
          ) : (
            <Link to="/login">Login now</Link>
          )}
        </p>
      </div>
    </div>
  );
}
