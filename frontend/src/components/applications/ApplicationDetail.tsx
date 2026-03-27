import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Document, Page, pdfjs } from 'react-pdf';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import AdminReviewPanel from './AdminReviewPanel';
import TeacherActionPanel from './TeacherActionPanel';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:      { label: 'Pending Review',   color: '#92400e', bg: '#fef3c7' },
  under_review: { label: 'Under Review',     color: '#1d4ed8', bg: '#dbeafe' },
  approved:     { label: 'Fully Approved',   color: '#15803d', bg: '#dcfce7' },
  rejected:     { label: 'Rejected',         color: '#b91c1c', bg: '#fee2e2' },
};

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pdfPages, setPdfPages] = useState(1);

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/applications/${id}`);
      setApp(res.data.data);
    } catch {
      toast.error('Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchDetail(); }, [id]);

  if (loading) return (
    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
  );
  if (!app) return (
    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-error)' }}>Application not found.</div>
  );

  const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
  const activePdfUrl = app.final_pdf_url || app.original_pdf_url;

  // Find current teacher's pending step
  const myPendingStep = app.approval_steps?.find(
    (s: any) => s.approver_id === user?.id && s.status === 'pending'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="skeu-card" style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '6px', background: '#e0e7ff', color: '#3730a3', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                {app.serial_number || 'APP-PENDING'}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.75rem', borderRadius: '9999px', color: statusCfg.color, background: statusCfg.bg }}>
                {statusCfg.label}
              </span>
            </div>
            <h1 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-primary)' }}>{app.title}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
              By {app.student?.full_name} · Submitted {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {activePdfUrl && (
              <a href={activePdfUrl} target="_blank" rel="noreferrer" className="skeu-btn" style={{ fontSize: '0.85rem', textDecoration: 'none' }}>
                ↓ Download PDF
              </a>
            )}
            <Link to="/applications" className="skeu-btn" style={{ fontSize: '0.85rem', textDecoration: 'none' }}>
              ← Back
            </Link>
          </div>
        </div>
      </div>

      {/* ── Teacher Action Panel ────────────────────────────────────────── */}
      {myPendingStep && (
        <TeacherActionPanel
          applicationId={id!}
          stepId={myPendingStep.id}
          stepLabel={myPendingStep.approver?.designation}
          onComplete={() => { setLoading(true); fetchDetail(); }}
        />
      )}

      {/* ── Admin Review Panel (only when pending) ──────────────────────── */}
      {user?.role === 'admin' && app.status === 'pending' && (
        <AdminReviewPanel
          applicationId={id!}
          onComplete={() => { setLoading(true); fetchDetail(); }}
        />
      )}

      {/* ── Main grid: Timeline + PDF Viewer ──────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Left: Approval Timeline ───────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="skeu-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Approval Timeline
            </h3>

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Vertical connector */}
              <div style={{ position: 'absolute', left: '11px', top: '12px', bottom: '12px', width: '2px', background: 'var(--color-border)', zIndex: 0 }} />

              {/* Submitted */}
              <TimelineNode icon="📝" label="Submitted" sublabel={new Date(app.created_at).toLocaleDateString()} done />

              {/* Admin Review */}
              {app.admin_reviews?.map((r: any) => (
                <TimelineNode
                  key={r.id}
                  icon={r.status === 'approved' ? '✓' : '✕'}
                  label="Admin Review"
                  sublabel={r.comment}
                  done={r.status === 'approved'}
                  rejected={r.status === 'rejected'}
                />
              ))}
              {app.admin_reviews?.length === 0 && <TimelineNode icon="🔍" label="Admin Review" sublabel="Awaiting admin" pending />}

              {/* Approval Steps */}
              {app.approval_steps?.map((step: any, i: number) => (
                <TimelineNode
                  key={step.id}
                  icon={step.status === 'approved' ? '✓' : step.status === 'rejected' ? '✕' : (i + 1).toString()}
                  label={step.approver?.designation || `Approver ${i + 1}`}
                  sublabel={step.approver?.full_name}
                  done={step.status === 'approved'}
                  rejected={step.status === 'rejected'}
                  pending={step.status === 'pending'}
                  signatureUrl={step.approver?.signature_url}
                  sealUrl={step.approver?.seal_url}
                  signedAt={step.signed_at}
                  comment={step.comment}
                />
              ))}

              {/* Final */}
              <TimelineNode
                icon="✅"
                label="Final Approval"
                sublabel={app.status === 'approved' ? 'Complete' : 'Pending all signatures'}
                done={app.status === 'approved'}
              />
            </div>
          </div>

          {/* Attachments */}
          {app.application_attachments?.length > 0 && (
            <div className="skeu-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                Attachments
              </h3>
              {app.application_attachments.map((att: any) => (
                <a key={att.id} href={att.file_url} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', background: 'var(--color-surface-alt)', marginBottom: '0.35rem' }}
                >
                  📎 {att.file_name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: PDF Viewer ───────────────────────────── */}
        <div className="skeu-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Document Preview
            </span>
            {app.final_pdf_url && (
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: '#dcfce7', color: '#15803d' }}>
                ✓ Fully Signed
              </span>
            )}
          </div>
          <div style={{ background: '#f1f5f9', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'center', overflowY: 'auto', maxHeight: '780px' }}>
            {activePdfUrl ? (
              <Document
                file={activePdfUrl}
                onLoadSuccess={({ numPages }) => setPdfPages(numPages)}
                loading={<div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading document...</div>}
                error={<div style={{ padding: '2rem', color: 'var(--color-error)' }}>PDF unavailable. <a href={activePdfUrl} target="_blank" rel="noreferrer">Open directly ↗</a></div>}
              >
                {Array.from({ length: pdfPages }, (_, i) => (
                  <Page key={i} pageNumber={i + 1} width={560} renderTextLayer={false} renderAnnotationLayer={false} />
                ))}
              </Document>
            ) : (
              <div style={{ padding: '3rem', color: 'var(--text-muted)', textAlign: 'center' }}>No document available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Timeline Node ──────────────────────────────────────────────────────────────
interface NodeProps {
  icon: string;
  label: string;
  sublabel?: string;
  done?: boolean;
  rejected?: boolean;
  pending?: boolean;
  signatureUrl?: string;
  sealUrl?: string;
  signedAt?: string;
  comment?: string;
}

const TimelineNode: React.FC<NodeProps> = ({ icon, label, sublabel, done, rejected, pending, signatureUrl, sealUrl, signedAt, comment }) => {
  const bgColor = rejected ? '#b91c1c' : done ? '#16a34a' : pending ? '#3b82f6' : '#d1d5db';
  return (
    <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: bgColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0, border: '3px solid white', boxShadow: '0 0 0 2px ' + bgColor }}>
        {icon}
      </div>
      <div style={{ flex: 1, paddingTop: '1px' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{label}</p>
        {sublabel && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '1px 0 0' }}>{sublabel}</p>}
        {signedAt && <p style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700, margin: '2px 0 0' }}>Signed {new Date(signedAt).toLocaleDateString()}</p>}
        {comment && <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '3px 0 0', fontStyle: 'italic' }}>"{comment}"</p>}

        {/* Signature + Seal preview for completed steps */}
        {done && (signatureUrl || sealUrl) && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
            {signatureUrl && (
              <img src={signatureUrl} alt="Signature" style={{ height: '28px', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: '4px', background: 'white', padding: '2px' }} />
            )}
            {sealUrl && (
              <img src={sealUrl} alt="Seal" style={{ height: '28px', width: '28px', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: '50%', background: 'white', padding: '1px' }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;
