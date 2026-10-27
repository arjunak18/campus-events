export interface GmailValidationResult {
  isValid: boolean;
  error?: string;
  normalizedEmail?: string;
}

export function validateGmailAddress(rawEmail: string): GmailValidationResult {
  if (!rawEmail || !rawEmail.trim()) {
    return { isValid: false, error: 'Gmail address is required.' };
  }

  const email = rawEmail.trim().toLowerCase();

  if (!email.includes('@')) {
    return { isValid: false, error: 'Please enter a complete email address including @gmail.com.' };
  }

  if (!email.endsWith('@gmail.com')) {
    return { isValid: false, error: 'Only registered @gmail.com addresses are permitted.' };
  }

  const username = email.substring(0, email.length - '@gmail.com'.length);

  if (username.length < 6) {
    return { isValid: false, error: 'Gmail username must be at least 6 characters (before @gmail.com).' };
  }

  if (username.length > 30) {
    return { isValid: false, error: 'Gmail username cannot exceed 30 characters.' };
  }

  if (!/^[a-z0-9.]+$/.test(username)) {
    return { isValid: false, error: 'Gmail username can only contain letters, numbers, and periods (no symbols or spaces).' };
  }

  if (username.startsWith('.') || username.endsWith('.')) {
    return { isValid: false, error: 'Gmail username cannot start or end with a period.' };
  }

  if (username.includes('..')) {
    return { isValid: false, error: 'Gmail username cannot contain consecutive periods (..).' };
  }

  return { isValid: true, normalizedEmail: email };
}
