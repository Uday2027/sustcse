import { UserRole } from '../types/enums.js';

export const ALL_ROLES = Object.values(UserRole);
export const ADMIN_ROLES = [UserRole.ADMIN, UserRole.SUPER_ADMIN];
export const STAFF_ROLES = [UserRole.TEACHER, UserRole.ADMIN, UserRole.SUPER_ADMIN];
