import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiFilter } from 'react-icons/fi';
import api from '../../lib/api';
import { formatDateTime } from '../../lib/formatters';
import type { Event } from '../../types';

interface EventForm {
  title: string;
  description: string;
  event_type: string;
  venue: string;
  start_date: string;
  end_date: string;
  registration_url: string;
  organized_by: string;
  email_toggle: boolean;
  is_published: boolean;
}

const emptyForm: EventForm = {
  title: '',
  description: '',
  event_type: '',
  venue: '',
  start_date: '',
  end_date: '',
  registration_url: '',
  organized_by: 'CSE Society',
  email_toggle: false,
  is_published: true,
};

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (typeFilter) params.set('type', typeFilter);
      const { data } = await api.get(`/events?${params}`);
      setEvents(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [page, typeFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (event: Event) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      event_type: event.event_type || '',
      venue: event.venue || '',
      start_date: event.start_date ? event.start_date.slice(0, 16) : '',
      end_date: event.end_date ? event.end_date.slice(0, 16) : '',
      registration_url: event.registration_url || '',
      organized_by: event.organized_by || 'CSE Society',
      email_toggle: event.email_toggle,
      is_published: event.is_published,
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
    if (!form.title.trim() || !form.description.trim() || !form.start_date) {
      toast.error('Title, description, and start date are required');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        end_date: form.end_date || undefined,
        registration_url: form.registration_url || undefined,
      };
      if (editingId) {
        await api.patch(`/events/${editingId}`, payload);
        toast.success('Event updated');
      } else {
        await api.post('/events', payload);
        toast.success('Event created');
      }
      closeForm();
      fetchEvents();
    } catch {
      toast.error(editingId ? 'Failed to update event' : 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted');
      fetchEvents();
    } catch {
      toast.error('Failed to delete event');
    }
  };

  return (
    <div>
      <div className="admin-content__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Events</h1>
        <button className="skeu-btn skeu-btn--primary" onClick={openCreate}>
          <FiPlus size={16} /> Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="skeu-panel" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="skeu-input-group" style={{ marginBottom: 0 }}>
            <label><FiFilter size={12} /> Type</label>
            <select className="skeu-select" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
              <option value="">All Types</option>
              <option value="seminar">Seminar</option>
              <option value="workshop">Workshop</option>
              <option value="competition">Competition</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="skeu-modal-overlay" onClick={closeForm}>
          <div className="skeu-modal" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="skeu-modal__header">
              <h3 className="skeu-modal__title">{editingId ? 'Edit Event' : 'Create New Event'}</h3>
              <button className="skeu-modal__close" onClick={closeForm}><FiX size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="skeu-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                  <label>Title *</label>
                  <input className="skeu-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                    <label>Type</label>
                    <select className="skeu-select" value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })}>
                      <option value="">Select type</option>
                      <option value="seminar">Seminar</option>
                      <option value="workshop">Workshop</option>
                      <option value="competition">Competition</option>
                      <option value="cultural">Cultural</option>
                      <option value="sports">Sports</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                    <label>Venue</label>
                    <input className="skeu-input" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="Event venue" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                    <label>Start Date *</label>
                    <input className="skeu-input" type="datetime-local" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                  </div>
                  <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                    <label>End Date</label>
                    <input className="skeu-input" type="datetime-local" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                  </div>
                </div>
                <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                  <label>Description *</label>
                  <textarea className="skeu-textarea" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Event description..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                    <label>Organized By</label>
                    <input className="skeu-input" value={form.organized_by} onChange={(e) => setForm({ ...form, organized_by: e.target.value })} />
                  </div>
                  <div className="skeu-input-group" style={{ marginBottom: 0 }}>
                    <label>Registration URL</label>
                    <input className="skeu-input" value={form.registration_url} onChange={(e) => setForm({ ...form, registration_url: e.target.value })} placeholder="https://..." />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
                    Published
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    <input type="checkbox" checked={form.email_toggle} onChange={(e) => setForm({ ...form, email_toggle: e.target.checked })} />
                    Send email notification
                  </label>
                </div>
              </div>
              <div className="skeu-modal__footer">
                <button type="button" className="skeu-btn" onClick={closeForm}>Cancel</button>
                <button type="submit" className="skeu-btn skeu-btn--primary" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events Table */}
      <div className="skeu-table-container">
        <table className="skeu-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Venue</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : events.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No events found</td></tr>
            ) : events.map((event) => (
              <tr key={event.id}>
                <td style={{ fontWeight: 600, color: 'var(--color-text-heading)', maxWidth: '250px' }}>{event.title}</td>
                <td>
                  {event.event_type ? (
                    <span className="skeu-card__badge skeu-card__badge--general">{event.event_type}</span>
                  ) : '—'}
                </td>
                <td style={{ fontSize: '0.85rem' }}>{event.venue || '—'}</td>
                <td style={{ fontSize: '0.8rem' }}>{formatDateTime(event.start_date)}</td>
                <td>
                  <span className={`skeu-card__badge skeu-card__badge--${event.is_published ? 'success' : 'academic'}`}>
                    {event.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button onClick={() => openEdit(event)} className="skeu-btn skeu-btn--sm" title="Edit">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="skeu-btn skeu-btn--danger skeu-btn--sm" title="Delete">
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
