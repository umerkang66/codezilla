/**
 * Helper to parse environment variable `ADMIN` which can be in the form of:
 * - 'ADMIN=admin@example.com'
 * - 'ADMIN=admin1@example.com,admin2@example.com,admin3@example.com'
 */
export function getAdminEmails(): string[] {
  const adminEnv = process.env.ADMIN || "";
  return adminEnv
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.trim().toLowerCase());
}
