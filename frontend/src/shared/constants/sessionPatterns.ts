export const SUST_EMAIL_REGEX = /^20\d{2}331\d{3}@student\.sust\.edu$/;

export function isSustEmail(email: string): boolean {
  return SUST_EMAIL_REGEX.test(email);
}

export function generateSessionOptions(): { label: string; value: string }[] {
  const currentYear = new Date().getFullYear();
  const sessions: { label: string; value: string }[] = [];
  for (let year = 2010; year <= currentYear; year++) {
    const label = `${year}-${(year + 1).toString().slice(2)}`;
    sessions.push({ label, value: label });
  }
  return sessions.reverse();
}
