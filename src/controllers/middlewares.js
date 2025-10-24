import { verifyUserPassword, verifyToken } from './auth.js';

/**
 * Middleware to authenticate user by email/username/userId and password.
 * Expects req.body.identifier, req.body.password, and optionally req.body.by ('email'|'username'|'userId').
 */
export async function authenticateUser(req, res, next) {
  const { identifier, password, by = 'email' } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Missing identifier or password' });
  }
  const isValid = await verifyUserPassword(identifier, password, by);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  next();
}

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
