import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiBookmark } from 'react-icons/fi';
import api from '../../lib/api';
import { formatDateTime } from '../../lib/formatters';
import type { Notice } from '../../types';

interface NoticeForm {
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  email_toggle: boolean;
  attachment_urls: string[];
}

const emptyForm: NoticeForm = {
  title: '',
  content: '',
  category: '',
  is_pinned: false,
  email_toggle: false,
  attachment_urls: [],
};

export default function NoticeManagement() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NoticeForm>(emptyForm);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (search) params.set('search', search);
      const { data } = await api.get(`/notices?${params}`);
      setNotices(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchNotices();
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (notice: Notice) => {
    setEditingId(notice.id);
    setForm({
      title: notice.title,
      content: notice.content,
      category: notice.category || '',
      is_pinned: notice.is_pinned,
      email_toggle: notice.email_toggle,
      attachment_urls: notice.attachment_urls || [],
    });
    setNewAttachments([]);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setNewAttachments([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('category', form.category);
      formData.append('is_pinned', String(form.is_pinned));
      formData.append('email_toggle', String(form.email_toggle));
      
      // Handle existing attachment URLs
      formData.append('attachment_urls', JSON.stringify(form.attachment_urls));

      // Handle new files
      newAttachments.forEach((file) => {
        formData.append('attachments', file);
      });

      if (editingId) {
        await api.patch(`/notices/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Notice updated');
      } else {
        await api.post('/notices', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Notice published');
      }
      closeForm();
      fetchNotices();
    } catch {
      toast.error(editingId ? 'Failed to update notice' : 'Failed to create notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      await api.delete(`/notices/${id}`);
      toast.success('Notice deleted');
      fetchNotices();
    } catch {
      toast.error('Failed to delete notice');
    }
  };

  return (
    <div>
      <div className="admin-content__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Notices</h1>
        <button className="skeu-btn skeu-btn--primary" onClick={openCreate}>
          <FiPlus size={16} /> Post Notice
        </button>
      </div>

      {/* Search */}
      <div className="skeu-panel" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="skeu-input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label><FiSearch size={12} /> Search</label>
            <input
              className="skeu-input"
              placeholder="Search by title or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="skeu-btn skeu-btn--primary">Search</button>
        </form>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="skeu-modal-overlay" onClick={closeForm}>
          <div className="skeu-modal" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="skeu-modal__header">
              <h3 className="skeu-modal__title">{editingId ? 'Edit Notice' : 'Post New Notice'}</h3>
              <button className="skeu-modal__close" onClick={closeForm}><FiX size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="skeu-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                  <label>Title *</label>
                  <input className="skeu-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Notice title" />
                </div>
                <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                  <label>Category</label>
                  <select className="skeu-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="">Select category</option>
                    <option value="academic">Academic</option>
                    <option value="exam">Exam</option>
                    <option value="event">Event</option>
                    <option value="general">General</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                  <label>Content *</label>
                  <textarea className="skeu-textarea" rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Notice content..." />
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    <input type="checkbox" checked={form.is_pinned} onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })} />
                    Pin to top
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    <input type="checkbox" checked={form.email_toggle} onChange={(e) => setForm({ ...form, email_toggle: e.target.checked })} />
                    Send email notification
                  </label>
                </div>

                <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                  <label>Attachments (PDF/Image)</label>
                  
                  {/* Existing Attachments */}
                  {form.attachment_urls.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {form.attachment_urls.map((url, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.75rem', borderRadius: '6px', background: 'var(--color-surface-alt, #f7f7f7)', fontSize: '0.8rem' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>{url.split('/').pop()}</span>
                          <button type="button" onClick={() => setForm({ ...form, attachment_urls: form.attachment_urls.filter((_, idx) => idx !== i) })} style={{ color: 'var(--color-danger)', border: 'none', background: 'transparent', cursor: 'pointer' }}><FiX size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    className="skeu-input"
                    onChange={(e) => {
                      if (e.target.files) {
                        setNewAttachments([...newAttachments, ...Array.from(e.target.files)]);
                      }
                    }}
                  />
                  
                  {/* New files preview */}
                  {newAttachments.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {newAttachments.map((file, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.75rem', borderRadius: '6px', background: 'var(--color-accent-soft, #f0f7ff)', fontSize: '0.8rem' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>{file.name}</span>
                          <button type="button" onClick={() => setNewAttachments(newAttachments.filter((_, idx) => idx !== i))} style={{ color: 'var(--color-danger)', border: 'none', background: 'transparent', cursor: 'pointer' }}><FiX size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="skeu-modal__footer">
                <button type="button" className="skeu-btn" onClick={closeForm}>Cancel</button>
                <button type="submit" className="skeu-btn skeu-btn--primary" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingId ? 'Update' : 'Publish')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notices Table */}
      <div className="skeu-table-container">
        <table className="skeu-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Pinned</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : notices.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No notices found</td></tr>
            ) : notices.map((notice) => (
              <tr key={notice.id}>
                <td style={{ fontWeight: 600, color: 'var(--color-text-heading)', maxWidth: '300px' }}>
                  {notice.title}
                </td>
                <td>
                  {notice.category ? (
                    <span className={`skeu-card__badge skeu-card__badge--${notice.category === 'urgent' ? 'urgent' : notice.category === 'academic' ? 'academic' : 'general'}`}>
                      {notice.category}
                    </span>
                  ) : '—'}
                </td>
                <td>{notice.is_pinned ? <FiBookmark size={14} style={{ color: 'var(--color-accent)' }} /> : '—'}</td>
                <td style={{ fontSize: '0.8rem' }}>{formatDateTime(notice.published_at)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button onClick={() => openEdit(notice)} className="skeu-btn skeu-btn--sm" title="Edit">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(notice.id)} className="skeu-btn skeu-btn--danger skeu-btn--sm" title="Delete">
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
