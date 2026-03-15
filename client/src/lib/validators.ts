import { z } from 'zod';
import { SUST_EMAIL_REGEX } from '../config/constants';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const studentRegisterSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  student_id: z.string().regex(/^\d{10}$/, 'Student ID must be 10 digits'),
  email: z.string().email('Invalid email address'),
  session: z.string().min(1, 'Please select a session'),
  phone: z.string().min(11, 'Phone number must be at least 11 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export const teacherRegisterSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(11, 'Phone number must be at least 11 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['academic', 'exam', 'general', 'urgent']).optional(),
  is_pinned: z.boolean().optional(),
  email_toggle: z.boolean().optional(),
});

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  event_type: z.enum(['workshop', 'seminar', 'competition', 'meetup', 'other']).optional(),
  venue: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  registration_url: z.string().url().optional().or(z.literal('')),
  email_toggle: z.boolean().optional(),
});

export const costRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().optional(),
});

export const workAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assigned_to: z.string().uuid('Invalid user'),
  due_date: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>;
export type TeacherRegisterInput = z.infer<typeof teacherRegisterSchema>;
export type NoticeInput = z.infer<typeof noticeSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type CostRequestInput = z.infer<typeof costRequestSchema>;
export type WorkAssignmentInput = z.infer<typeof workAssignmentSchema>;
