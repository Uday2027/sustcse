export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum CostStatus {
  DRAFT = 'draft',
  PENDING_L1 = 'pending_l1',
  L1_APPROVED = 'l1_approved',
  PENDING_L2 = 'pending_l2',
  L2_APPROVED = 'l2_approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export enum PriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum AssignmentStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
}

export enum EmailStatus {
  QUEUED = 'queued',
  SENT = 'sent',
  FAILED = 'failed',
}

export enum SocietyMemberStatus {
  CURRENT = 'current',
  FORMER = 'former',
}

export enum FiscalYearStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}
