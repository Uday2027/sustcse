export const APP_NAME = 'CSE - SUST';
export const DEPARTMENT_NAME = 'Department of Computer Science & Engineering';
export const UNIVERSITY_NAME = 'Shahjalal University of Science and Technology';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const SUST_EMAIL_REGEX = /^20\d{2}331\d{3}@student\.sust\.edu$/;

export const SESSION_OPTIONS = [
  '2016-17', '2017-18', '2018-19', '2019-20', '2020-21',
  '2021-22', '2022-23', '2023-24', '2024-25', '2025-26',
];

export const NOTICE_CATEGORIES = ['academic', 'exam', 'general', 'urgent'] as const;
export const EVENT_TYPES = ['workshop', 'seminar', 'competition', 'meetup', 'other'] as const;
export const ACHIEVEMENT_CATEGORIES = ['research', 'competition', 'placement', 'award'] as const;
export const PRIORITY_LEVELS = ['low', 'medium', 'high', 'urgent'] as const;
export const ASSIGNMENT_STATUSES = ['pending', 'in_progress', 'completed', 'overdue'] as const;
