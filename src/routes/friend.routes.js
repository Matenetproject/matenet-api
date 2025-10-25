import express from 'express';
import { requireAuth } from '../controllers/middlewares.js';
import * as FriendRequest from '../controllers/friend.js';

const router = express.Router();

router.post('/scan-nfc', requireAuth, async (req, res) => {
  try {
    const { nfcId } = req.body;
    const sender = req.user;
    const user = await FriendRequest.sendFriendRequest({ sender, nfcId });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

router.get('/requests', requireAuth, async (req, res) => {
  try {
    const requests = await FriendRequest.getFriendRequests(req.user.userId);
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

/**
 * @swagger
 * /friend/request:
 *   post:
 *     summary: Send a friend request
 *     tags:
 *       - Friend
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *               referrerCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Friend request sent successfully
 *       500:
 *         description: Internal server error
 */
router.post('/requests', requireAuth, async (req, res) => {
  try {
    const { walletAddress, referrerCode } = req.body;
    const user = await FriendRequest.sendFriendRequest({
      sender: req.user,
      receiverWalletAddress: walletAddress,
      referrerCode,
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

/**
 * @swagger
 * /friend/accept:
 *   post:
 *     summary: Accept a friend request
 *     tags:
 *       - Friend
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
 *       500:
 *         description: Internal server error
 */
router.post('/accept', requireAuth, async (req, res) => {
  try {
    const { senderId } = req.body;
    const receiverId = req.user.userId;
    const user = await FriendRequest.acceptFriendRequest({ senderId, receiverId });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

export default router;
