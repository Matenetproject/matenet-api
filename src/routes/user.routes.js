import express from 'express';
import { requireAuth } from '../controllers/middlewares.js';
import * as User from '../controllers/user.js';
import * as Points from '../controllers/points.js';

const router = express.Router();

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

router.post('/register-nfc', requireAuth, async (req, res) => {
  try {
    const { nfcId } = req.body;
    const userId = req.user.userId;
    const user = await User.registerNFC({ userId, nfcId });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress: 
 *                 type: string
 *               username: 
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Update user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               pfp: 
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       500:
 *         description: Internal server error
 */
router.put('/', requireAuth, async (req, res) => {
  try {
    const updatedUser = await User.updateProfile(req.user.userId, req.body);
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

/**
 * @swagger
 * /user/points:
 *   get:
 *     summary: Get user points
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User points retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/points', requireAuth, async (req, res) => {
  try {
    const points = await Points.getPoints(req.params.userId);
    res.status(200).json({ points });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

export default router;