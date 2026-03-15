import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (date: string | Date) =>
  format(typeof date === 'string' ? parseISO(date) : date, 'dd MMM yyyy');

export const formatDateTime = (date: string | Date) =>
  format(typeof date === 'string' ? parseISO(date) : date, 'dd MMM yyyy, hh:mm a');

export const formatRelative = (date: string | Date) =>
  formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, { addSuffix: true });

export const formatCurrency = (amount: number, currency = 'BDT') =>
  new Intl.NumberFormat('en-BD', { style: 'currency', currency }).format(amount);

export const formatStudentId = (id: string) => id;
