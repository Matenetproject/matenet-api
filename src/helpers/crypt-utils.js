import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import config from '../config/environment.js';
import { getSecret } from './secret-manager.js';

const { authKeyCipherSecretId, projectId } = config;
const authKeyCipherSecret = await getSecret(projectId, authKeyCipherSecretId);
const SALT_ROUNDS = 10;

/**
 * Hashes a field.
 * @param {string} field - The field to hash.
 * @returns {string} - The hashed field.
 */
function hash(field) {
  return bcrypt.hashSync(field, SALT_ROUNDS);
}

/**
 * Hashes and encrypts a field.
 * @param {string} field - The field to hash and encrypt.
 * @returns {string} - The hashed and encrypted field.
 */
export function hashAndEncryptField(field) {
  const hashedField = hash(field);
  return encrypt(hashedField);
}

/**
 * Encrypts a field.
 * @param {string} field - The field to encrypt.
 * @returns {string} - The encrypted field.
 */
function encrypt(field) {
  const key = authKeyCipherSecret;
  const iv = crypto.randomBytes(16).toString('base64').slice(0, 16);
  const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
  let encrypted = cipher.update(field, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${encrypted};${iv}`;
}

/**
 * Decrypts a field.
 * @param {string} encryptedFieldAndIv
 * @returns {string} - The decrypted field.
 */
export function decrypt(encryptedFieldAndIv) {
  const [encryptedField, ivString] = encryptedFieldAndIv.split(';');
  const iv = Buffer.from(ivString);
  const key = authKeyCipherSecret;
  const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
  let decrypted = decipher.update(encryptedField, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
