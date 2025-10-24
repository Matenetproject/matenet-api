import crypto from 'node:crypto';

/**
 * Generates a unique crypto code
 * @returns {string} - A unique crypto code
 */
export function generateCryptoCode() {
  const uuid = crypto.randomUUID();
  // Take a slice of the UUID and remove the hyphens for a shorter code
  return uuid.replaceAll('-', '').substring(0, 8);
}
