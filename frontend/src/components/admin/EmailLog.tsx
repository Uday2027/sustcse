import { useState, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import api from '../../lib/api';
import { formatDateTime } from '../../lib/formatters';
import type { EmailLog as EmailLogType } from '../../types';

export default function EmailLog() {
  const [logs, setLogs] = useState<EmailLogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: '25' });
        if (statusFilter) params.set('status', statusFilter);
        const { data } = await api.get(`/admin/email-logs?${params}`);
        setLogs(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page, statusFilter]);

  return (
    <div>
      <div className="admin-content__header">
        <h1>Email Logs</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <FiFilter size={16} />
          <select className="skeu-select" style={{ width: 'auto' }} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
            <option value="queued">Queued</option>
          </select>
        </div>
      </div>

      <div className="skeu-table-container">
        <table className="skeu-table">
          <thead>
            <tr>
              <th>Recipient</th>
              <th>Subject</th>
              <th>Template</th>
              <th>Status</th>
              <th>Error</th>
              <th>Sent At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No email logs found</td></tr>
            ) : logs.map((log) => (
              <tr key={log.id}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>{log.recipient_name || '—'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{log.recipient_email}</div>
                </td>
                <td>{log.subject}</td>
                <td><span className="skeu-label">{log.template || '—'}</span></td>
                <td>
                  <span className={`skeu-card__badge skeu-card__badge--${
                    log.status === 'sent' ? 'success' : log.status === 'failed' ? 'urgent' : 'academic'
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td style={{ maxWidth: '200px', fontSize: '0.8rem', color: 'var(--color-danger)' }}>
                  {log.error_message || '—'}
                </td>
                <td style={{ fontSize: '0.8rem' }}>
                  {log.sent_at ? formatDateTime(log.sent_at) : formatDateTime(log.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button className="skeu-btn skeu-btn--sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span style={{ padding: '0.4rem 1rem', color: 'var(--color-text-muted)' }}>Page {page} of {totalPages}</span>
          <button className="skeu-btn skeu-btn--sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
