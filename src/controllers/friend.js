import User from '../models/user.js';
import FriendRequest from '../models/friend-request.js';
import { createInteraction } from '../components/interaction.js';
import { INTERACTION_POINTS, INTERACTION_TYPES } from '../helpers/constants.js';

export async function getFriendRequests(userId) {
  const requests = await FriendRequest.find({ receiverId: userId, status: 'PENDING' });
  return requests;
}

/**
 * Sends a friend request to the user with the given username or referral code.
 * @param {Object} params
 * @param {User} params.sender - The user sending the friend request
 * @param {string} params.receiverWalletAddress - The wallet address of the user to send the friend request to
 * @param {string} [params.nfcId] - The NFC ID of the user to send the friend request to
 * @param {string} [params.referrerCode] - The referral code of the user who referred the sender
 */
export async function sendFriendRequest({ sender, receiverWalletAddress, referrerCode, nfcId }) {
  let receiver = null;

  if (referrerCode) {
    receiver = await User.findOne({ referralCode });
  }

  if (!receiver && nfcId) {
    receiver = await User.findOne({ nfcId });
  }

  if (!receiver && receiverWalletAddress) {
    receiver = await User.findOne({ walletAddress: receiverWalletAddress });
  }

  if (!receiver) {
    throw new Error('User not found');
  }

  if (receiver.userId === sender.userId) {
    throw new Error('You cannot send a friend request to yourself.');
  }

  return FriendRequest.create({
    senderId: sender.userId,
    receiverId: receiver.userId,
    status: 'PENDING',
  });
}

/**
 *
 * Accepts a friend request from the user
 * @param {Object} params
 * @param {User} params.senderId - The userId of the user who sent the friend request
 * @param {string} params.receiverId - The userId of the user accepting the friend request
 * @returns {Promise<User>} - The user who accepted the friend request
 */
export async function acceptFriendRequest({ senderId }) {
  const receiver = await User.findOne({ userId: receiverId });

  if (!receiver) {
    throw new Error('User not found');
  }

  const friendRequest = await FriendRequest.findOneAndUpdate(
    { senderId, receiverId: receiver.userId, status: 'PENDING' },
    { status: 'ACCEPTED' },
    { new: true },
  );
  if (!friendRequest) {
    throw new Error('Friend request not found');
  }

  Promise.all([
    createInteraction({
      userId: senderId,
      type: INTERACTION_TYPES.ADD_FRIEND,
      pointValue: INTERACTION_POINTS.ADD_FRIEND,
    }),
    createInteraction({
      userId: receiverId,
      type: INTERACTION_TYPES.ADD_FRIEND,
      pointValue: INTERACTION_POINTS.ADD_FRIEND,
    }),
  ]);

  return friendRequest;
}
