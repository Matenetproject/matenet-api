import jsonwebtoken from 'jsonwebtoken';
import { SiweMessage } from 'siwe';
import User from '../models/user.js';
import { create } from './user.js';
import config from '../config/environment.js';
import { getSecret } from '../helpers/secret-manager.js';

const { jwtSecretId, projectId } = config;
const jwtSecret = await getSecret(projectId, jwtSecretId);

/**
 * Compares a candidate password with the stored password for a user.
 * @param {string} identifier - The user's email or username or userId.
 * @param {string} candidatePassword - The password to check.
 * @param {'email'|'username'|'userId'} [by='email'] - The field to search by.
 * @returns {Promise<boolean>} - True if the password matches, false otherwise.
 */
export async function verifyUserPassword(identifier, candidatePassword, by = 'email') {
  let user;
  if (by === 'email') {
    user = await User.findOne({ email: identifier });
  } else if (by === 'username') {
    user = await User.findOne({ username: identifier });
  } else if (by === 'userId') {
    user = await User.findOne({ userId: identifier });
  }
  if (!user) return false;
  return user.comparePassword(candidatePassword);
}

/**
 * Generates a JWT token for a user.
 * @param {User} user - The user object.
 * @returns {string} - The generated JWT token.
 */
export function generateToken(user) {
  const payload = {
    userId: user.userId,
    username: user.username,
    walletAddress: user.walletAddress,
    email: user.email,
  };
  return jsonwebtoken.sign(payload, jwtSecret, { expiresIn: '30d' });
}

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} token
 */
export function verifyToken(token) {
  return jsonwebtoken.verify(token, jwtSecret);
}

/**
 * Verifies a SIWE message and signature, and returns a JWT token if valid.
 * @param {Object} param0
 * @param {string} param0.message - The SIWE message.
 * @param {string} param0.signature - The SIWE signature.
 * @returns {Promise<string>} - The generated JWT token.
 */
export async function siweVerify({ message, signature }) {
  const siweMessage = new SiweMessage(message);
  const { data } = await siweMessage.verify({ signature });

  let user;
  user = await User.findOne({ walletAddress: data.address });

  if (!user) {
    user = await create({
      walletAddress: data.address,
      nonce: data.nonce,
    });
  }

  const token = generateToken({
    userId: user.userId,
    walletAddress: data.address,
    nonce: data.nonce,
  });

  return token;
}
