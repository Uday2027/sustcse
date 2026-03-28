import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import AdminReviewPanel from './AdminReviewPanel';
import TeacherActionPanel from './TeacherActionPanel';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:      { label: 'Pending Review',  color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  under_review: { label: 'Under Review',    color: '#1d4ed8', bg: '#dbeafe', border: '#bfdbfe' },
  approved:     { label: 'Fully Approved',  color: '#15803d', bg: '#dcfce7', border: '#bbf7d0' },
  rejected:     { label: 'Rejected',        color: '#b91c1c', bg: '#fee2e2', border: '#fecaca' },
};

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDetail = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.get(`/applications/${id}`);
      setApp(res.data.data);
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message;
      const status = err?.response?.status;
      let msg = 'Could not load application.';
      if (status === 404) msg = `Application with ID "${id}" was not found. It may have been deleted.`;
      else if (status === 403) msg = 'You do not have permission to view this application.';
      else if (status === 401) msg = 'You are not logged in. Please sign in and try again.';
      else if (serverMsg) msg = serverMsg;
      else if (!navigator.onLine) msg = 'No internet connection. Please check your network.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchDetail(); }, [id]);

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: 'var(--color-accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
      <p style={{ color: 'var(--color-text-muted)' }}>Loading application...</p>
    </div>
  );

  if (errorMsg || !app) return (
    <div style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>⚠️</div>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Unable to Load Application</h2>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{errorMsg || 'An unknown error occurred.'}</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <button onClick={fetchDetail} className="skeu-btn skeu-btn--primary">Try Again</button>
        <Link to="/applications" className="skeu-btn" style={{ textDecoration: 'none' }}>Back to List</Link>
      </div>
    </div>
  );

  const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
  const activePdfUrl = app.final_pdf_url || app.original_pdf_url;

  const myPendingStep = app.approval_steps?.find(
    (s: any) => s.approver_id === user?.id && s.status === 'pending'
  );

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="skeu-card" style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '6px', background: '#e0e7ff', color: '#3730a3', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                {app.serial_number || 'Pending Serial'}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.75rem', borderRadius: '9999px', color: statusCfg.color, background: statusCfg.bg, border: `1px solid ${statusCfg.border}` }}>
                {statusCfg.label}
              </span>
            </div>
            <h1 style={{ fontSize: '1.35rem', margin: '0 0 0.25rem', color: 'var(--color-text-primary)', fontWeight: 700 }}>{app.title}</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', margin: 0 }}>
              Submitted by <strong>{app.student?.full_name}</strong> · {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {activePdfUrl && (
              <a href={activePdfUrl} target="_blank" rel="noreferrer" className="skeu-btn" style={{ fontSize: '0.85rem', textDecoration: 'none' }}>
                ↓ Download PDF
              </a>
            )}
            <Link to="/applications" className="skeu-btn" style={{ fontSize: '0.85rem', textDecoration: 'none' }}>← Back</Link>
          </div>
        </div>
      </div>

      {/* ── Teacher Action Panel ────────────────────────────────────── */}
      {myPendingStep && (
        <TeacherActionPanel
          applicationId={id!}
          stepId={myPendingStep.id}
          stepLabel={myPendingStep.approver?.designation}
          onComplete={() => fetchDetail()}
        />
      )}

      {/* ── Admin Review Panel ──────────────────────────────────────── */}
      {isAdmin && app.status === 'pending' && (
        <AdminReviewPanel
          applicationId={id!}
          onComplete={() => fetchDetail()}
        />
      )}

      {/* ── Main Grid: Timeline + PDF ──────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="skeu-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1.5rem' }}>
              Approval Timeline
            </h3>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ position: 'absolute', left: '11px', top: '12px', bottom: '12px', width: '2px', background: 'var(--color-border)', zIndex: 0 }} />

              <TimelineNode icon="📝" label="Submitted" sublabel={new Date(app.created_at).toLocaleDateString()} done />

              {(!app.admin_reviews || app.admin_reviews.length === 0) && (
                <TimelineNode icon="🔍" label="Admin Review" sublabel="Awaiting admin" pending />
              )}
              {app.admin_reviews?.map((r: any) => (
                <TimelineNode key={r.id} icon={r.status === 'approved' ? '✓' : '✕'}
                  label="Admin Review" sublabel={r.comment || 'No comment'}
                  done={r.status === 'approved'} rejected={r.status === 'rejected'} />
              ))}

              {app.approval_steps?.map((step: any, i: number) => (
                <TimelineNode key={step.id}
                  icon={step.status === 'approved' ? '✓' : step.status === 'rejected' ? '✕' : String(i + 1)}
                  label={step.approver?.designation || `Approver ${i + 1}`}
                  sublabel={step.approver?.full_name}
                  done={step.status === 'approved'} rejected={step.status === 'rejected'}
                  pending={step.status === 'pending'}
                  signatureUrl={step.approver?.signature_url} sealUrl={step.approver?.seal_url}
                  signedAt={step.signed_at} comment={step.comment}
                />
              ))}

              <TimelineNode icon="✅" label="Final Approval"
                sublabel={app.status === 'approved' ? 'Complete — all signatures collected' : 'Pending all signatures'}
                done={app.status === 'approved'} />
            </div>
          </div>

          {app.application_attachments?.length > 0 && (
            <div className="skeu-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
                Attachments
              </h3>
              {app.application_attachments.map((att: any) => (
                <a key={att.id} href={att.file_url} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--color-accent)', textDecoration: 'none', background: 'var(--color-bg-secondary)', marginBottom: '0.35rem' }}>
                  📎 {att.file_name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* PDF Viewer using iframe — avoids react-pdf version issues */}
        <div className="skeu-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Document Preview
            </span>
            {app.final_pdf_url && (
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }}>
                ✓ Fully Signed
              </span>
            )}
          </div>
          {activePdfUrl ? (
            <iframe
              src={activePdfUrl}
              title="Application PDF"
              style={{ width: '100%', height: '780px', border: 'none', borderRadius: '8px', background: '#f1f5f9' }}
            />
          ) : (
            <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
              <span style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📄</span>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>PDF will appear here once generated</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Timeline Node ──────────────────────────────────────────────────────────
interface NodeProps {
  icon: string; label: string; sublabel?: string;
  done?: boolean; rejected?: boolean; pending?: boolean;
  signatureUrl?: string; sealUrl?: string; signedAt?: string; comment?: string;
}

const TimelineNode: React.FC<NodeProps> = ({ icon, label, sublabel, done, rejected, pending, signatureUrl, sealUrl, signedAt, comment }) => {
  const bg = rejected ? '#b91c1c' : done ? '#16a34a' : pending ? 'var(--color-accent)' : '#d1d5db';
  return (
    <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: bg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0, border: '3px solid white', boxShadow: `0 0 0 2px ${bg}` }}>
        {icon}
      </div>
      <div style={{ flex: 1, paddingTop: '1px' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>{label}</p>
        {sublabel && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '1px 0 0' }}>{sublabel}</p>}
        {signedAt && <p style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700, margin: '2px 0 0' }}>Signed {new Date(signedAt).toLocaleDateString()}</p>}
        {comment && <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: '3px 0 0', fontStyle: 'italic' }}>"{comment}"</p>}
        {done && (signatureUrl || sealUrl) && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
            {signatureUrl && <img src={signatureUrl} alt="Signature" style={{ height: '28px', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: '4px', background: 'white', padding: '2px' }} />}
            {sealUrl && <img src={sealUrl} alt="Seal" style={{ height: '28px', width: '28px', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: '50%', background: 'white', padding: '1px' }} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;
