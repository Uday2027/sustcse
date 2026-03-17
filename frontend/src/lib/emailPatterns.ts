import { SUST_EMAIL_REGEX } from '../config/constants';

export const isSustEmail = (email: string): boolean => SUST_EMAIL_REGEX.test(email);
