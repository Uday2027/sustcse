import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../../lib/api';
import { formatDateTime } from '../../lib/formatters';
import type { User } from '../../types';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    approval_status: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (filters.search) params.set('search', filters.search);
      if (filters.role) params.set('role', filters.role);
      if (filters.approval_status) params.set('approval_status', filters.approval_status);

      const { data } = await api.get(`/users?${params}`);
      setUsers(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, filters.role, filters.approval_status]);

  const handleApprove = async (userId: string) => {
    try {
      await api.post(`/users/${userId}/approve`);
      toast.success('User approved');
      fetchUsers();
    } catch {
      toast.error('Failed to approve user');
    }
  };

  const handleReject = async (userId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    try {
      await api.post(`/users/${userId}/reject`, { reason: reason || 'Not approved by admin' });
      toast.success('User rejected');
      fetchUsers();
    } catch {
      toast.error('Failed to reject user');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div>
      <div className="admin-content__header">
        <h1>User Management</h1>
      </div>

      {/* Filters */}
      <div className="skeu-panel" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="skeu-input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
            <label><FiSearch size={12} /> Search</label>
            <input
              className="skeu-input"
              placeholder="Name, email, or student ID..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="skeu-input-group" style={{ marginBottom: 0 }}>
            <label><FiFilter size={12} /> Role</label>
            <select className="skeu-select" value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="skeu-input-group" style={{ marginBottom: 0 }}>
            <label>Status</label>
            <select className="skeu-select" value={filters.approval_status} onChange={(e) => setFilters({ ...filters, approval_status: e.target.value })}>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button type="submit" className="skeu-btn skeu-btn--primary">Search</button>
        </form>
      </div>

      {/* Users Table */}
      <div className="skeu-table-container">
        <table className="skeu-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Student ID</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No users found</td></tr>
            ) : users.map((user) => (
              <tr key={user.id}>
                <td style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>{user.full_name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`skeu-card__badge skeu-card__badge--${user.role === 'admin' ? 'urgent' : 'general'}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.student_id || '—'}</td>
                <td>
                  <span className={`skeu-card__badge skeu-card__badge--${
                    user.approval_status === 'approved' ? 'success' :
                    user.approval_status === 'rejected' ? 'urgent' : 'academic'
                  }`}>
                    {user.approval_status}
                  </span>
                </td>
                <td style={{ fontSize: '0.8rem' }}>{formatDateTime(user.created_at)}</td>
                <td>
                  {user.approval_status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button onClick={() => handleApprove(user.id)} className="skeu-btn skeu-btn--success skeu-btn--sm" title="Approve">
                        <FiCheck size={14} />
                      </button>
                      <button onClick={() => handleReject(user.id)} className="skeu-btn skeu-btn--danger skeu-btn--sm" title="Reject">
                        <FiX size={14} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
