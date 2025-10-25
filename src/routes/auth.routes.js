import express from 'express';
import { siweVerify } from '../controllers/auth.js';
import { generateNonce } from 'siwe';

const router = express.Router();

/**
 * @swagger
 * /auth/siwe/nonce:
 *   get:
 *     summary: Get a SIWE nonce
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Nonce generated successfully
 */
router.get('/siwe/nonce', async function (_, res) {
  res.status(200).json({ nonce: generateNonce() });
});

/**
 * @swagger
 * /auth/siwe/verify:
 *   post:
 *     summary: Verify a SIWE message
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: SIWE message verified successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/siwe/verify', async function (req, res) {
  const { message, signature } = req.body;
  try {
    const token = await siweVerify({ message, signature });
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
});

export default router;
