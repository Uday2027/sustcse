import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import EmailLog from '../components/admin/EmailLog';
import EmailComposer from '../components/admin/EmailComposer';
import SessionConfig from '../components/admin/SessionConfig';
import SectionPermissions from '../components/admin/SectionPermissions';

export default function AdminPage() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="email-logs" element={<EmailLog />} />
        <Route path="send-email" element={<EmailComposer />} />
        <Route path="sessions" element={<SessionConfig />} />
        <Route path="permissions" element={<SectionPermissions />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}
