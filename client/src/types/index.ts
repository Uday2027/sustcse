export type { User } from './user';
export type { StudentProfile } from './student';
export type { Notice } from './notice';
export type { Event } from './event';
export type { Achievement } from './achievement';
export type { Alumni } from './alumni';
export type { Faculty } from './faculty';
export type { SocietyMember } from './society';
export type { FiscalYear, BankStatement, ApproverConfig, CostRequest, CostApprovalLog } from './finance';
export type { WorkAssignment, ImportantData, EmailLog, AdminPermission, SessionConfig } from './admin';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}
