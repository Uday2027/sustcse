import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { ADMIN_SECTIONS } from '@shared/constants/permissions';
import type { AdminPermission, User } from '../../types';

export default function SectionPermissions() {
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [perms, setPerms] = useState({ can_create: false, can_read: true, can_update: false, can_delete: false });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [permRes, userRes] = await Promise.all([
        api.get('/admin/permissions'),
        api.get('/users?role=admin&limit=100'),
      ]);
      setPermissions(permRes.data.data || []);
      setUsers(userRes.data.data || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedSection) {
      toast.error('Please select a user and section');
      return;
    }
    try {
      await api.post('/admin/permissions', {
        user_id: selectedUser,
        section: selectedSection,
        ...perms,
      });
      toast.success('Permission assigned');
      fetchData();
      setSelectedUser('');
      setSelectedSection('');
      setPerms({ can_create: false, can_read: true, can_update: false, can_delete: false });
    } catch {
      toast.error('Failed to assign permission');
    }
  };

  return (
    <div>
      <div className="admin-content__header">
        <h1>Section Permissions</h1>
      </div>

      {/* Assign form */}
      <div className="skeu-panel" style={{ marginBottom: '1.5rem' }}>
        <h3 className="skeu-heading skeu-heading--sm" style={{ marginBottom: '1rem' }}>Assign Permission</h3>
        <form onSubmit={handleAssign}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div className="skeu-input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label>User</label>
              <select className="skeu-select" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="">Select user</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
              </select>
            </div>
            <div className="skeu-input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label>Section</label>
              <select className="skeu-select" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                <option value="">Select section</option>
                {ADMIN_SECTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {(['can_create', 'can_read', 'can_update', 'can_delete'] as const).map((perm) => (
              <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                <div className="skeu-toggle">
                  <input
                    type="checkbox"
                    checked={perms[perm]}
                    onChange={(e) => setPerms({ ...perms, [perm]: e.target.checked })}
                  />
                  <span className="skeu-toggle__slider" />
                </div>
                {perm.replace('can_', '').charAt(0).toUpperCase() + perm.replace('can_', '').slice(1)}
              </label>
            ))}
          </div>

          <button type="submit" className="skeu-btn skeu-btn--primary">Assign Permission</button>
        </form>
      </div>

      {/* Existing permissions table */}
      <div className="skeu-table-container">
        <table className="skeu-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Section</th>
              <th>Create</th>
              <th>Read</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : permissions.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No permissions assigned yet</td></tr>
            ) : permissions.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>{p.user_name || p.user_id}</td>
                <td><span className="skeu-label">{p.section.replace('_', ' ')}</span></td>
                <td>{p.can_create ? '✓' : '—'}</td>
                <td>{p.can_read ? '✓' : '—'}</td>
                <td>{p.can_update ? '✓' : '—'}</td>
                <td>{p.can_delete ? '✓' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
