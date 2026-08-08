/**
 * Password strength validation helper following OWASP password policy recommendations.
 */

export interface PasswordValidationResult {
  valid: boolean;
  score: number; // 0 (weak) to 4 (strong)
  errors: string[];
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  if (!password || typeof password !== "string") {
    return { valid: false, score: 0, errors: ["Password is required."] };
  }

  // Length check (OWASP recommends min 8, preferably 12+)
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  } else {
    score += 1;
  }

  // Upper case check
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z).");
  } else {
    score += 1;
  }

  // Lower case check
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z).");
  } else {
    score += 1;
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one numeric digit (0-9).");
  } else {
    score += 1;
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character (e.g. !@#$%^&*).");
  }

  return {
    valid: errors.length === 0,
    score,
    errors,
  };
}
