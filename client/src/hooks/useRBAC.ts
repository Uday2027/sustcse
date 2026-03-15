import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Permission {
  section: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export function useRBAC() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) return;

    const fetchPermissions = async () => {
      try {
        const { data } = await api.get(`/admin/permissions?user_id=${user.id}`);
        setPermissions(data.data || []);
      } catch {
        setPermissions([]);
      }
    };
    fetchPermissions();
  }, [user]);

  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'admin' || isSuperAdmin;

  const hasPermission = (section: string, operation: 'create' | 'read' | 'update' | 'delete' = 'read') => {
    if (isSuperAdmin) return true;
    const perm = permissions.find((p) => p.section === section);
    if (!perm) return false;
    return perm[`can_${operation}`];
  };

  return { isAdmin, isSuperAdmin, hasPermission, permissions };
}
