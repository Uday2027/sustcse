import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiFilter } from 'react-icons/fi';
import api from '../../lib/api';
import { formatDateTime } from '../../lib/formatters';
import type { SocietyMember } from '../../types';

interface MemberForm {
  full_name: string;
  position: string;
  committee_year: string;
  member_status: 'current' | 'former';
  student_id: string;
  email: string;
  phone: string;
  bio: string;
  sort_order: number;
}

const emptyForm: MemberForm = {
  full_name: '',
  position: '',
  committee_year: '',
  member_status: 'current',
  student_id: '',
  email: '',
  phone: '',
  bio: '',
  sort_order: 0,
};

export default function SocietyManagement() {
  const [members, setMembers] = useState<SocietyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MemberForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (statusFilter) params.set('status', statusFilter);
      if (yearFilter) params.set('year', yearFilter);
      const { data } = await api.get(`/society-members?${params}`);
      setMembers(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      toast.error('Failed to load society members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, [page, statusFilter, yearFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (member: SocietyMember) => {
    setEditingId(member.id);
    setForm({
      full_name: member.full_name,
      position: member.position,
      committee_year: member.committee_year,
      member_status: member.member_status,
      student_id: member.student_id || '',
      email: member.email || '',
      phone: member.phone || '',
      bio: member.bio || '',
      sort_order: member.sort_order,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.position.trim() || !form.committee_year.trim()) {
      toast.error('Name, position, and committee year are required');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        student_id: form.student_id || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        bio: form.bio || undefined,
      };
      if (editingId) {
        await api.patch(`/society-members/${editingId}`, payload);
        toast.success('Member updated');
      } else {
        await api.post('/society-members', payload);
        toast.success('Member added');
      }
      closeForm();
      fetchMembers();
    } catch {
      toast.error(editingId ? 'Failed to update member' : 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.delete(`/society-members/${id}`);
      toast.success('Member removed');
      fetchMembers();
    } catch {
      toast.error('Failed to remove member');
    }
  };

  return (
    <div>
      <div className="admin-content__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Society Members</h1>
        <button className="skeu-btn skeu-btn--primary" onClick={openCreate}>
          <FiPlus size={16} /> Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="skeu-panel" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="skeu-input-group" style={{ marginBottom: 0 }}>
            <label><FiFilter size={12} /> Status</label>
            <select className="skeu-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="">All</option>
              <option value="current">Current</option>
              <option value="former">Former</option>
            </select>
          </div>
          <div className="skeu-input-group" style={{ marginBottom: 0 }}>
            <label>Committee Year</label>
            <input className="skeu-input" placeholder="e.g. 2024-2025" value={yearFilter} onChange={(e) => { setYearFilter(e.target.value); setPage(1); }} />
          </div>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="skeu-modal-overlay" onClick={closeForm}>
          <div className="skeu-modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="skeu-modal__header">
              <h3 className="skeu-modal__title">{editingId ? 'Edit Member' : 'Add Society Member'}</h3>
              <button className="skeu-modal__close" onClick={closeForm}><FiX size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="skeu-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                    <label>Full Name *</label>
                    <input className="skeu-input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Member name" />
                  </div>
                  <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                    <label>Position *</label>
                    <input className="skeu-input" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="e.g. President" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                    <label>Committee Year *</label>
                    <input className="skeu-input" value={form.committee_year} onChange={(e) => setForm({ ...form, committee_year: e.target.value })} placeholder="e.g. 2024-2025" />
                  </div>
                  <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                    <label>Status</label>
                    <select className="skeu-select" value={form.member_status} onChange={(e) => setForm({ ...form, member_status: e.target.value as 'current' | 'former' })}>
                      <option value="current">Current</option>
                      <option value="former">Former</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                    <label>Student ID</label>
                    <input className="skeu-input" value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} placeholder="Student ID" />
                  </div>
                  <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                    <label>Sort Order</label>
                    <input className="skeu-input" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                    <label>Email</label>
                    <input className="skeu-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
                  </div>
                  <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                    <label>Phone</label>
                    <input className="skeu-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
                  </div>
                </div>
                <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                  <label>Bio</label>
                  <textarea className="skeu-textarea" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Short bio..." />
                </div>
              </div>
              <div className="skeu-modal__footer">
                <button type="button" className="skeu-btn" onClick={closeForm}>Cancel</button>
                <button type="submit" className="skeu-btn skeu-btn--primary" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingId ? 'Update' : 'Add Member')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="skeu-table-container">
        <table className="skeu-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Year</th>
              <th>Status</th>
              <th>Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : members.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No members found</td></tr>
            ) : members.map((member) => (
              <tr key={member.id}>
                <td style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>{member.full_name}</td>
                <td>{member.position}</td>
                <td style={{ fontSize: '0.85rem' }}>{member.committee_year}</td>
                <td>
                  <span className={`skeu-card__badge skeu-card__badge--${member.member_status === 'current' ? 'success' : 'academic'}`}>
                    {member.member_status}
                  </span>
                </td>
                <td style={{ fontSize: '0.8rem' }}>{formatDateTime(member.created_at)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button onClick={() => openEdit(member)} className="skeu-btn skeu-btn--sm" title="Edit">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(member.id)} className="skeu-btn skeu-btn--danger skeu-btn--sm" title="Delete">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
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
