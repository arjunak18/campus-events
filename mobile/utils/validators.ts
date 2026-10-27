export interface GmailValidationResult {
  isValid: boolean;
  error?: string;
  normalizedEmail?: string;
}

/**
 * Validates an email address against official Google Gmail account creation rules:
 * 1. Must end with '@gmail.com'.
 * 2. Username must be between 6 and 30 characters.
 * 3. Username can only contain alphanumeric characters (a-z, 0-9) and periods (.).
 * 4. Username cannot start or end with a period.
 * 5. Username cannot contain consecutive periods (..).
 */
export function validateGmailAddress(rawEmail: string): GmailValidationResult {
  if (!rawEmail || !rawEmail.trim()) {
    return { isValid: false, error: 'Gmail address is required.' };
  }

  const email = rawEmail.trim().toLowerCase();

  // Basic format check
  if (!email.includes('@')) {
    return { isValid: false, error: 'Please enter a complete email address including @gmail.com.' };
  }

  // Must strictly end with @gmail.com
  if (!email.endsWith('@gmail.com')) {
    return { isValid: false, error: 'Only registered @gmail.com addresses are permitted.' };
  }

  const username = email.substring(0, email.length - '@gmail.com'.length);

  // Check username length (Google requires 6 to 30 characters)
  if (username.length < 6) {
    return { isValid: false, error: 'Gmail username must be at least 6 characters (before @gmail.com).' };
  }

  if (username.length > 30) {
    return { isValid: false, error: 'Gmail username cannot exceed 30 characters.' };
  }

  // Check valid characters: only letters, numbers, and periods
  if (!/^[a-z0-9.]+$/.test(username)) {
    return { isValid: false, error: 'Gmail username can only contain letters, numbers, and periods (no symbols or spaces).' };
  }

  // Cannot start or end with a period
  if (username.startsWith('.') || username.endsWith('.')) {
    return { isValid: false, error: 'Gmail username cannot start or end with a period.' };
  }

  // Cannot contain consecutive periods
  if (username.includes('..')) {
    return { isValid: false, error: 'Gmail username cannot contain consecutive periods (..).' };
  }

  return { isValid: true, normalizedEmail: email };
}
