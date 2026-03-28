import React from 'react';
import { Link } from 'react-router-dom';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApplicationList from '../components/applications/ApplicationList';
import ApplicationForm from '../components/applications/ApplicationForm';
import ApplicationDetail from '../components/applications/ApplicationDetail';
import SignatureUploader from '../components/applications/SignatureUploader';

const ApplicationsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="page" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Page Header */}
          {!id && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 className="skeu-heading skeu-heading--lg" style={{ marginBottom: '0.2rem' }}>
                  {user.role === 'student' ? 'My Applications' : user.role === 'teacher' ? 'Pending Signatures' : 'All Applications'}
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                  {user.role === 'student' && 'Submit and track your official university requests.'}
                  {user.role === 'teacher' && 'Applications awaiting your digital signature and approval.'}
                  {user.role === 'admin' && 'Review pending submissions and assign approval chains.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {user.role === 'student' && (
                  <Link to="/applications?mode=submit" className="skeu-btn skeu-btn--primary">
                    + New Application
                  </Link>
                )}
                {user.role === 'teacher' && (
                  <Link to="/applications?mode=settings" className="skeu-btn">
                    Signature Setup
                  </Link>
                )}
                <Link to="/dashboard" className="skeu-btn">
                  ← Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* Routed Views */}
          {!id && mode === 'submit' && <ApplicationForm />}
          {!id && mode === 'settings' && <SignatureUploader />}
          {!id && (mode === 'list' || !mode) && <ApplicationList />}
          {id && <ApplicationDetail />}

        </div>
      </section>
    </div>
  );
};

export default ApplicationsPage;
