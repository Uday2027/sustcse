import { useState, useEffect, useMemo } from 'react';
import {
  FiCheckCircle, FiClock, FiAlertTriangle, FiLoader, FiX, FiUser,
  FiCalendar, FiChevronRight, FiPaperclip, FiArrowRight,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { formatDate, formatRelative } from '../lib/formatters';
import { useAuth } from '../context/AuthContext';
import { useScrollReveal } from '../hooks/useGSAP';
import type { WorkAssignment } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: 'Low', color: '#6b7280', bg: '#f3f4f6' },
  medium: { label: 'Medium', color: '#d97706', bg: '#fef3c7' },
  high: { label: 'High', color: '#dc2626', bg: '#fee2e2' },
  urgent: { label: 'Urgent', color: '#fff', bg: '#dc2626' },
};

const COLUMN_CONFIG = {
  pending: { title: 'Pending', icon: FiClock, color: '#d97706' },
  in_progress: { title: 'In Progress', icon: FiLoader, color: '#2563eb' },
  completed: { title: 'Completed', icon: FiCheckCircle, color: '#059669' },
};

type ColumnKey = 'pending' | 'in_progress' | 'completed';

export default function WorkAssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<WorkAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<WorkAssignment | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const headerRef = useScrollReveal<HTMLDivElement>();

  const fetchAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await api.get('/work-assignments');
      setAssignments(res.data || []);
    } catch {
      setError('Failed to load work assignments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const columns = useMemo(() => {
    const pending = assignments.filter((a) => a.status === 'pending' || a.status === 'overdue');
    const inProgress = assignments.filter((a) => a.status === 'in_progress');
    const completed = assignments.filter((a) => a.status === 'completed');
    return { pending, in_progress: inProgress, completed };
  }, [assignments]);

  const handleStatusChange = async (assignmentId: string, newStatus: ColumnKey) => {
    setActionLoading(assignmentId);
    try {
      await api.patch(`/work-assignments/${assignmentId}`, { status: newStatus });
      toast.success(`Assignment moved to "${COLUMN_CONFIG[newStatus].title}"`);
      await fetchAssignments();
      if (selectedAssignment?.id === assignmentId) {
        setSelectedAssignment(null);
      }
    } catch {
      toast.error('Failed to update assignment status.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="page work-assignments-page">
      <section className="section">
        <div className="container">
          <div ref={headerRef} className="page-header">
            <h1 className="page-title">Work Assignments</h1>
            <p className="page-subtitle">
              Track and manage assigned tasks with the Kanban board.
            </p>
          </div>

          {loading && <LoadingSpinner />}

          {error && (
            <div className="skeu-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-error)' }}>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && assignments.length === 0 && (
            <div className="skeu-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <FiCheckCircle size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <h3>No Assignments</h3>
              <p style={{ color: 'var(--text-muted)' }}>There are no work assignments at the moment.</p>
            </div>
          )}

          {/* Kanban Board */}
          {!loading && assignments.length > 0 && (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', alignItems: 'flex-start' }}>
              {(Object.keys(COLUMN_CONFIG) as ColumnKey[]).map((colKey) => {
                const config = COLUMN_CONFIG[colKey];
                const colAssignments = columns[colKey];
                const IconComp = config.icon;

                return (
                  <div key={colKey} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Column Header */}
                    <div className="skeu-panel" style={{
                      padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      borderTop: `3px solid ${config.color}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                        <IconComp size={18} style={{ color: config.color }} />
                        {config.title}
                      </div>
                      <span style={{
                        padding: '0.1rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem',
                        background: config.color, color: '#fff', fontWeight: 700,
                      }}>
                        {colAssignments.length}
                      </span>
                    </div>

                    {/* Cards */}
                    {colAssignments.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', border: '2px dashed var(--border-color, #d0d0d0)', borderRadius: '8px' }}>
                        No items
                      </div>
                    ) : (
                      colAssignments.map((assignment) => (
                        <AssignmentCard
                          key={assignment.id}
                          assignment={assignment}
                          currentColumn={colKey}
                          onClick={() => setSelectedAssignment(assignment)}
                          onStatusChange={handleStatusChange}
                          actionLoading={actionLoading}
                        />
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedAssignment && (
        <AssignmentDetailModal
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          onStatusChange={handleStatusChange}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
}

function AssignmentCard({
  assignment,
  currentColumn,
  onClick,
  onStatusChange,
  actionLoading,
}: {
  assignment: WorkAssignment;
  currentColumn: ColumnKey;
  onClick: () => void;
  onStatusChange: (id: string, status: ColumnKey) => void;
  actionLoading: string | null;
}) {
  const priorityCfg = PRIORITY_CONFIG[assignment.priority] || PRIORITY_CONFIG.low;
  const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date() && assignment.status !== 'completed';
  const isLoading = actionLoading === assignment.id;

  const nextStatuses: ColumnKey[] = [];
  if (currentColumn === 'pending') nextStatuses.push('in_progress');
  if (currentColumn === 'in_progress') nextStatuses.push('completed', 'pending');
  if (currentColumn === 'completed') nextStatuses.push('in_progress');

  return (
    <div
      className="skeu-card"
      style={{
        padding: '1rem',
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
        borderLeft: isOverdue ? '3px solid #dc2626' : undefined,
      }}
      onClick={onClick}
    >
      {/* Priority Badge and Title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.3, flex: 1 }}>{assignment.title}</h4>
        <span style={{
          padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700,
          color: priorityCfg.color, background: priorityCfg.bg, whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {priorityCfg.label}
        </span>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        {assignment.due_date && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: isOverdue ? '#dc2626' : undefined }}>
            <FiCalendar size={11} />
            {isOverdue && <FiAlertTriangle size={11} />}
            Due: {formatDate(assignment.due_date)}
          </span>
        )}
        {assignment.assignee_name && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FiUser size={11} /> {assignment.assignee_name}
          </span>
        )}
        {assignment.attachments && assignment.attachments.length > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FiPaperclip size={11} /> {assignment.attachments.length} file{assignment.attachments.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Status Change Buttons */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
        {nextStatuses.map((status) => (
          <button
            key={status}
            className="skeu-btn"
            onClick={() => onStatusChange(assignment.id, status)}
            disabled={isLoading}
            style={{
              fontSize: '0.7rem', padding: '0.25rem 0.5rem',
              display: 'flex', alignItems: 'center', gap: '0.2rem',
            }}
          >
            {isLoading ? <FiLoader className="spin" size={10} /> : <FiArrowRight size={10} />}
            {COLUMN_CONFIG[status].title}
          </button>
        ))}
      </div>
    </div>
  );
}

function AssignmentDetailModal({
  assignment,
  onClose,
  onStatusChange,
  actionLoading,
}: {
  assignment: WorkAssignment;
  onClose: () => void;
  onStatusChange: (id: string, status: ColumnKey) => void;
  actionLoading: string | null;
}) {
  const priorityCfg = PRIORITY_CONFIG[assignment.priority] || PRIORITY_CONFIG.low;
  const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date() && assignment.status !== 'completed';
  const isLoading = actionLoading === assignment.id;

  const currentColumn = assignment.status === 'overdue' ? 'pending' : (assignment.status as ColumnKey);
  const nextStatuses: ColumnKey[] = [];
  if (currentColumn === 'pending') nextStatuses.push('in_progress');
  if (currentColumn === 'in_progress') nextStatuses.push('completed', 'pending');
  if (currentColumn === 'completed') nextStatuses.push('in_progress');

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
      }}
      onClick={onClose}
    >
      <div
        className="skeu-card"
        style={{ maxWidth: '600px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="skeu-btn"
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem' }}
        >
          <FiX size={18} />
        </button>

        {/* Title and badges */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
            color: priorityCfg.color, background: priorityCfg.bg,
          }}>
            {priorityCfg.label} Priority
          </span>
          {isOverdue && (
            <span style={{
              padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
              color: '#dc2626', background: '#fee2e2',
              display: 'flex', alignItems: 'center', gap: '0.2rem',
            }}>
              <FiAlertTriangle size={10} /> Overdue
            </span>
          )}
          <span style={{
            padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
            color: COLUMN_CONFIG[currentColumn]?.color || '#6b7280',
            background: 'var(--color-surface-alt, #f0f0f0)',
          }}>
            {COLUMN_CONFIG[currentColumn]?.title || assignment.status}
          </span>
        </div>

        <h2 style={{ margin: '0.5rem 0 1rem' }}>{assignment.title}</h2>

        {/* Meta */}
        <div className="skeu-panel" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {assignment.assignee_name && (
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Assigned To</div>
                <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FiUser size={13} /> {assignment.assignee_name}</div>
              </div>
            )}
            {assignment.assigner_name && (
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Assigned By</div>
                <div style={{ fontWeight: 500 }}>{assignment.assigner_name}</div>
              </div>
            )}
            {assignment.due_date && (
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Due Date</div>
                <div style={{ fontWeight: 500, color: isOverdue ? '#dc2626' : undefined, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <FiCalendar size={13} /> {formatDate(assignment.due_date)}
                </div>
              </div>
            )}
            {assignment.completed_at && (
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Completed</div>
                <div style={{ fontWeight: 500, color: '#059669' }}>{formatDate(assignment.completed_at)}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Created</div>
              <div style={{ fontWeight: 500 }}>{formatRelative(assignment.created_at)}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        {assignment.description && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Description</h3>
            <p style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{assignment.description}</p>
          </div>
        )}

        {/* Notes */}
        {assignment.notes && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Notes</h3>
            <div className="skeu-panel" style={{ padding: '0.75rem', fontSize: '0.875rem', lineHeight: 1.5 }}>
              {assignment.notes}
            </div>
          </div>
        )}

        {/* Attachments */}
        {assignment.attachments && assignment.attachments.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FiPaperclip size={15} /> Attachments
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {assignment.attachments.map((url, i) => {
                const filename = url.split('/').pop() || `Attachment ${i + 1}`;
                return (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="skeu-btn"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none', width: 'fit-content', fontSize: '0.85rem' }}
                  >
                    <FiPaperclip size={12} /> {filename}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Status Change Actions */}
        {nextStatuses.length > 0 && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--border-color, #e0e0e0)' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', alignSelf: 'center' }}>Move to:</span>
            {nextStatuses.map((status) => {
              const cfg = COLUMN_CONFIG[status];
              return (
                <button
                  key={status}
                  className="skeu-btn"
                  onClick={() => onStatusChange(assignment.id, status)}
                  disabled={isLoading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    background: cfg.color, color: '#fff', padding: '0.5rem 1rem', fontWeight: 600,
                  }}
                >
                  {isLoading ? <FiLoader className="spin" size={14} /> : <FiChevronRight size={14} />}
                  {cfg.title}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
