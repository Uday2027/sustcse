import { useState, useEffect, useMemo } from 'react';
import {
  FiDollarSign, FiFileText, FiCheckCircle, FiXCircle, FiClock,
  FiPlus, FiChevronDown, FiExternalLink, FiLoader, FiFilter,
  FiArrowRight, FiUpload, FiAlertCircle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatCurrency } from '../lib/formatters';
import { useScrollReveal } from '../hooks/useGSAP';
import type { FiscalYear, BankStatement, CostRequest } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: '#6b7280', bg: '#f3f4f6' },
  pending_l1: { label: 'Pending L1', color: '#d97706', bg: '#fef3c7' },
  l1_approved: { label: 'L1 Approved', color: '#2563eb', bg: '#dbeafe' },
  pending_l2: { label: 'Pending L2', color: '#d97706', bg: '#fef3c7' },
  l2_approved: { label: 'L2 Approved', color: '#059669', bg: '#d1fae5' },
  rejected: { label: 'Rejected', color: '#dc2626', bg: '#fee2e2' },
  completed: { label: 'Completed', color: '#059669', bg: '#d1fae5' },
};

const COST_CATEGORIES = ['Office Supplies', 'Events', 'Equipment', 'Travel', 'Food', 'Printing', 'Other'];

export default function FinancePage() {
  const { user } = useAuth();
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
  const [selectedFY, setSelectedFY] = useState<string>('');
  const [bankStatements, setBankStatements] = useState<BankStatement[]>([]);
  const [costRequests, setCostRequests] = useState<CostRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'statements' | 'costs'>('overview');
  const headerRef = useScrollReveal<HTMLDivElement>();

  // New cost request form
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newProofUrls, setNewProofUrls] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Approval form
  const [approvalRemarks, setApprovalRemarks] = useState<Record<string, string>>({});
  const [checkNumber, setCheckNumber] = useState<Record<string, string>>({});
  const [checkDate, setCheckDate] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch fiscal years
  useEffect(() => {
    const fetchFYs = async () => {
      try {
        const { data: res } = await api.get('/finance/fiscal-years');
        const fys: FiscalYear[] = res.data || [];
        setFiscalYears(fys);
        const active = fys.find((f) => f.status === 'active');
        if (active) setSelectedFY(active.id);
        else if (fys.length > 0) setSelectedFY(fys[0].id);
      } catch {
        setError('Failed to load fiscal years.');
      }
    };
    fetchFYs();
  }, []);

  // Fetch data for selected FY
  useEffect(() => {
    if (!selectedFY) { setLoading(false); return; }
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statementsRes, costsRes] = await Promise.all([
          api.get(`/finance/bank-statements?fiscal_year_id=${selectedFY}`),
          api.get(`/finance/cost-requests?fiscal_year_id=${selectedFY}`),
        ]);
        setBankStatements(statementsRes.data.data || []);
        setCostRequests(costsRes.data.data || []);
      } catch {
        setError('Failed to load finance data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedFY]);

  const currentFY = fiscalYears.find((f) => f.id === selectedFY);
  const totalCosts = costRequests.filter((c) => c.status !== 'rejected' && c.status !== 'draft').reduce((sum, c) => sum + c.amount, 0);
  const approvedCosts = costRequests.filter((c) => ['l2_approved', 'completed'].includes(c.status)).reduce((sum, c) => sum + c.amount, 0);

  const handleSubmitCost = async () => {
    if (!newTitle || !newAmount) {
      toast.error('Title and amount are required.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/finance/cost-requests', {
        fiscal_year_id: selectedFY,
        title: newTitle,
        amount: parseFloat(newAmount),
        description: newDescription || undefined,
        category: newCategory || undefined,
        proof_urls: newProofUrls ? newProofUrls.split(',').map((u) => u.trim()).filter(Boolean) : [],
      });
      toast.success('Cost request submitted successfully!');
      setShowNewForm(false);
      setNewTitle(''); setNewAmount(''); setNewDescription(''); setNewCategory(''); setNewProofUrls('');
      // Refresh
      const { data: res } = await api.get(`/finance/cost-requests?fiscal_year_id=${selectedFY}`);
      setCostRequests(res.data.data || []);
    } catch {
      toast.error('Failed to submit cost request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproval = async (costId: string, action: 'approve' | 'reject') => {
    setActionLoading(costId);
    try {
      await api.post(`/finance/cost-requests/${costId}/${action}`, {
        remarks: approvalRemarks[costId] || undefined,
      });
      toast.success(`Cost request ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      const { data: res } = await api.get(`/finance/cost-requests?fiscal_year_id=${selectedFY}`);
      setCostRequests(res.data.data || []);
    } catch {
      toast.error(`Failed to ${action} cost request.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddCheck = async (costId: string) => {
    if (!checkNumber[costId]) {
      toast.error('Check number is required.');
      return;
    }
    setActionLoading(costId);
    try {
      await api.post(`/finance/cost-requests/${costId}/check`, {
        check_number: checkNumber[costId],
        check_date: checkDate[costId] || undefined,
      });
      toast.success('Check number added successfully!');
      const { data: res } = await api.get(`/finance/cost-requests?fiscal_year_id=${selectedFY}`);
      setCostRequests(res.data.data || []);
    } catch {
      toast.error('Failed to add check number.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="page finance-page">
      <section className="section">
        <div className="container">
          <div ref={headerRef} className="page-header" style={{ marginBottom: '2rem' }}>
            <h1 className="page-title" style={{ color: 'var(--color-text-heading)' }}>Finance Dashboard</h1>
            <p className="page-subtitle" style={{ color: 'var(--color-text-secondary)' }}>
              Manage fiscal year budgets, bank statements, and cost requests.
            </p>
          </div>

          {/* Fiscal Year Selector */}
          <div className="skeu-panel" style={{ marginBottom: '2rem', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FiFilter size={18} style={{ color: 'var(--color-text-muted)' }} />
              <label style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Fiscal Year:</label>
              <select
                className="skeu-input"
                value={selectedFY}
                onChange={(e) => setSelectedFY(e.target.value)}
                style={{ minWidth: '200px' }}
              >
                {fiscalYears.map((fy) => (
                  <option key={fy.id} value={fy.id}>
                    {fy.name} {fy.status === 'active' ? '(Active)' : '(Closed)'}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="skeu-btn"
              onClick={() => { setShowNewForm(true); setActiveTab('costs'); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--color-accent)', color: '#fff', padding: '0.5rem 1rem', fontWeight: 600 }}
            >
              <FiPlus size={16} /> New Cost Request
            </button>
          </div>

          {loading && <LoadingSpinner />}
          {error && (
            <div className="skeu-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-error)' }}><p>{error}</p></div>
          )}

          {!loading && !error && (
            <>
              {/* Tab Navigation */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0' }}>
                {(['overview', 'statements', 'costs'] as const).map((tab) => (
                  <button
                    key={tab}
                    className="skeu-btn"
                    onClick={() => setActiveTab(tab)}
                    style={{
                      borderRadius: '8px 8px 0 0',
                      background: activeTab === tab ? 'var(--color-accent)' : 'transparent',
                      color: activeTab === tab ? '#fff' : 'var(--color-text-secondary)',
                      padding: '0.6rem 1.25rem',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      border: 'none',
                      fontSize: '0.875rem',
                    }}
                  >
                    {tab === 'overview' && <FiDollarSign style={{ marginRight: '0.35rem' }} />}
                    {tab === 'statements' && <FiFileText style={{ marginRight: '0.35rem' }} />}
                    {tab === 'costs' && <FiCheckCircle style={{ marginRight: '0.35rem' }} />}
                    {tab === 'costs' ? 'Cost Requests' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && currentFY && (
                <div>
                  {/* Stat Cards */}
                  <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    {[
                      { label: 'Opening Balance', value: formatCurrency(currentFY.opening_balance), icon: <FiDollarSign size={24} />, color: 'var(--color-accent)' },
                      { label: 'Total Requested', value: formatCurrency(totalCosts), icon: <FiClock size={24} />, color: '#d97706' },
                      { label: 'Approved Costs', value: formatCurrency(approvedCosts), icon: <FiCheckCircle size={24} />, color: '#059669' },
                      { label: 'Remaining Balance', value: formatCurrency(currentFY.opening_balance - approvedCosts), icon: <FiDollarSign size={24} />, color: '#2563eb' },
                    ].map(({ label, value, icon, color }) => (
                      <div key={label} className="skeu-card" style={{ padding: '1.5rem', borderTop: `3px solid ${color}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color }}>{icon}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '0.3rem' }}>{label}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="skeu-panel" style={{ padding: '1rem' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      Fiscal period: {formatDate(currentFY.start_date)} to {formatDate(currentFY.end_date)}
                      &nbsp;&middot;&nbsp;Status: <strong style={{ color: currentFY.status === 'active' ? '#059669' : 'var(--color-text-secondary)' }}>{currentFY.status}</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Bank Statements Tab */}
              {activeTab === 'statements' && (
                <div>
                  {bankStatements.length === 0 ? (
                    <div className="skeu-card" style={{ padding: '3rem', textAlign: 'center' }}>
                      <FiFileText size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
                      <h3>No Bank Statements</h3>
                      <p style={{ color: 'var(--text-muted)' }}>No bank statements have been uploaded for this fiscal year.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {bankStatements.map((stmt) => (
                        <div key={stmt.id} className="skeu-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <div>
                            <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>
                              {stmt.description || `Statement - ${formatDate(stmt.statement_date)}`}
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {formatDate(stmt.statement_date)} {stmt.uploader_name ? `- Uploaded by ${stmt.uploader_name}` : ''}
                            </p>
                          </div>
                          <a
                            href={stmt.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="skeu-btn"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                          >
                            <FiExternalLink size={14} /> View PDF
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Cost Requests Tab */}
              {activeTab === 'costs' && (
                <div>
                  {/* New Cost Request Form */}
                  {showNewForm && (
                    <div className="skeu-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '2px solid var(--color-primary)' }}>
                      <h3 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiPlus /> New Cost Request
                      </h3>
                      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.85rem' }}>Title *</label>
                          <input className="skeu-input" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Cost request title" style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.85rem' }}>Amount (BDT) *</label>
                          <input className="skeu-input" type="number" min="0" step="0.01" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="0.00" style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.85rem' }}>Category</label>
                          <select className="skeu-input" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ width: '100%' }}>
                            <option value="">Select category</option>
                            {COST_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.85rem' }}>Proof URLs (comma separated)</label>
                          <input className="skeu-input" value={newProofUrls} onChange={(e) => setNewProofUrls(e.target.value)} placeholder="URL to receipt/proof images" style={{ width: '100%' }} />
                        </div>
                      </div>
                      <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.85rem' }}>Description</label>
                        <textarea className="skeu-input" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={3} placeholder="Describe the expense..." style={{ width: '100%', resize: 'vertical' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                        <button className="skeu-btn" onClick={() => setShowNewForm(false)}>Cancel</button>
                        <button
                          className="skeu-btn"
                          onClick={handleSubmitCost}
                          disabled={submitting}
                          style={{ background: 'var(--color-accent)', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          {submitting ? <FiLoader className="spin" size={14} /> : <FiUpload size={14} />}
                          {submitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Cost Requests List */}
                  {costRequests.length === 0 && !showNewForm ? (
                    <div className="skeu-card" style={{ padding: '3rem', textAlign: 'center' }}>
                      <FiDollarSign size={48} style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }} />
                      <h3>No Cost Requests</h3>
                      <p style={{ color: 'var(--color-text-muted)' }}>No cost requests have been submitted for this fiscal year.</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="skeu-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Title</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Amount</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Category</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Requested By</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Date</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {costRequests.map((cr) => {
                            const statusCfg = STATUS_CONFIG[cr.status] || STATUS_CONFIG.draft;
                            return (
                              <CostRequestRow
                                key={cr.id}
                                cr={cr}
                                statusCfg={statusCfg}
                                user={user}
                                actionLoading={actionLoading}
                                approvalRemarks={approvalRemarks}
                                setApprovalRemarks={setApprovalRemarks}
                                checkNumber={checkNumber}
                                setCheckNumber={setCheckNumber}
                                checkDate={checkDate}
                                setCheckDate={setCheckDate}
                                onApprove={(id) => handleApproval(id, 'approve')}
                                onReject={(id) => handleApproval(id, 'reject')}
                                onAddCheck={handleAddCheck}
                              />
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

interface CostRequestRowProps {
  cr: CostRequest;
  statusCfg: { label: string; color: string; bg: string };
  user: { id: string; role: string } | null;
  actionLoading: string | null;
  approvalRemarks: Record<string, string>;
  setApprovalRemarks: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  checkNumber: Record<string, string>;
  setCheckNumber: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  checkDate: Record<string, string>;
  setCheckDate: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onAddCheck: (id: string) => void;
}

function CostRequestRow({
  cr, statusCfg, user, actionLoading,
  approvalRemarks, setApprovalRemarks,
  checkNumber, setCheckNumber,
  checkDate, setCheckDate,
  onApprove, onReject, onAddCheck,
}: CostRequestRowProps) {
  const [expanded, setExpanded] = useState(false);
  const isLoading = actionLoading === cr.id;

  return (
    <>
      <tr style={{ cursor: 'pointer', borderBottom: '1px solid var(--color-border)' }} onClick={() => setExpanded(!expanded)}>
        <td style={{ padding: '0.75rem', fontWeight: 500 }}>{cr.title}</td>
        <td style={{ padding: '0.75rem' }}>{formatCurrency(cr.amount)}</td>
        <td style={{ padding: '0.75rem' }}>{cr.category || '-'}</td>
        <td style={{ padding: '0.75rem' }}>
          <span style={{
            padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700,
            color: statusCfg.color, background: statusCfg.bg,
          }}>
            {statusCfg.label}
          </span>
        </td>
        <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{cr.requester_name || '-'}</td>
        <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{formatDate(cr.created_at)}</td>
        <td style={{ padding: '0.75rem' }}>
          <FiChevronDown size={14} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} style={{ padding: '1rem 0.75rem', background: 'var(--color-bg-secondary)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cr.description && <p style={{ margin: 0, fontSize: '0.875rem' }}>{cr.description}</p>}

              {/* Approval Trail */}
              <div className="skeu-panel" style={{ padding: '0.75rem', fontSize: '0.8rem' }}>
                <strong>Approval Trail:</strong>
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {cr.l1_approver_name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiArrowRight size={12} /> L1: {cr.l1_approver_name}
                      {cr.l1_approver_designation && ` (${cr.l1_approver_designation})`}
                      {cr.l1_approved_at && ` - ${formatDate(cr.l1_approved_at)}`}
                      {cr.l1_remarks && <span style={{ color: 'var(--text-muted)' }}> - "{cr.l1_remarks}"</span>}
                    </div>
                  )}
                  {cr.l2_approver_name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiArrowRight size={12} /> L2: {cr.l2_approver_name}
                      {cr.l2_approver_designation && ` (${cr.l2_approver_designation})`}
                      {cr.l2_approved_at && ` - ${formatDate(cr.l2_approved_at)}`}
                      {cr.l2_remarks && <span style={{ color: 'var(--text-muted)' }}> - "{cr.l2_remarks}"</span>}
                    </div>
                  )}
                  {cr.status === 'rejected' && cr.rejection_reason && (
                    <div style={{ color: 'var(--color-error, #dc2626)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiXCircle size={12} /> Rejected: {cr.rejection_reason}
                    </div>
                  )}
                  {cr.check_number && (
                    <div style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiCheckCircle size={12} /> Check #{cr.check_number}{cr.check_date ? ` (${formatDate(cr.check_date)})` : ''}
                    </div>
                  )}
                </div>
              </div>

              {/* Proof URLs */}
              {cr.proof_urls.length > 0 && (
                <div>
                  <strong style={{ fontSize: '0.85rem' }}>Proof:</strong>{' '}
                  {cr.proof_urls.map((url, j) => (
                    <a key={j} href={url} target="_blank" rel="noopener noreferrer" className="skeu-btn" style={{ fontSize: '0.75rem', marginLeft: '0.35rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <FiExternalLink size={11} /> Proof {j + 1}
                    </a>
                  ))}
                </div>
              )}

              {/* Actions for Approvers */}
              {(cr.status === 'pending_l1' || cr.status === 'pending_l2' || cr.status === 'l1_approved') && user && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    className="skeu-input"
                    placeholder="Remarks (optional)"
                    value={approvalRemarks[cr.id] || ''}
                    onChange={(e) => setApprovalRemarks({ ...approvalRemarks, [cr.id]: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    style={{ maxWidth: '400px' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="skeu-btn"
                      onClick={(e) => { e.stopPropagation(); onApprove(cr.id); }}
                      disabled={isLoading}
                      style={{ background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}
                    >
                      {isLoading ? <FiLoader className="spin" size={12} /> : <FiCheckCircle size={12} />} Approve
                    </button>
                    <button
                      className="skeu-btn"
                      onClick={(e) => { e.stopPropagation(); onReject(cr.id); }}
                      disabled={isLoading}
                      style={{ background: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}
                    >
                      {isLoading ? <FiLoader className="spin" size={12} /> : <FiXCircle size={12} />} Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Check Number for Approved Items */}
              {cr.status === 'l2_approved' && !cr.check_number && user && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    className="skeu-input"
                    placeholder="Check Number"
                    value={checkNumber[cr.id] || ''}
                    onChange={(e) => setCheckNumber({ ...checkNumber, [cr.id]: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '160px' }}
                  />
                  <input
                    className="skeu-input"
                    type="date"
                    value={checkDate[cr.id] || ''}
                    onChange={(e) => setCheckDate({ ...checkDate, [cr.id]: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '160px' }}
                  />
                  <button
                    className="skeu-btn"
                    onClick={(e) => { e.stopPropagation(); onAddCheck(cr.id); }}
                    disabled={isLoading}
                    style={{ background: 'var(--color-accent)', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}
                  >
                    {isLoading ? <FiLoader className="spin" size={12} /> : <FiCheckCircle size={12} />} Add Check
                  </button>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
