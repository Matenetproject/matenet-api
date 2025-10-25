import User from '../models/user.js';
import FriendRequest from '../models/friend-request.js';
import { createInteraction } from '../components/interaction.js';
import { generateCryptoCode } from '../helpers/string-utils.js';
import { uploadFileToBucket } from '../helpers/upload-file.js';
import { INTERACTION_POINTS, INTERACTION_TYPES } from '../helpers/constants.js';

/**
 * Creates a new user
 * @param {Object} user - The user data
 * @param {string} user.nonce - The user's nonce
 * @param {string} user.walletAddress - The user's wallet address
 * @param {string} [user.referrerCode] - The referral code of the user who referred this user
 * @returns {Promise<User>} - The created user
 */
export async function create(user) {
  const { nonce, walletAddress, referrerCode } = user;
  try {
    const newUser = await User.create({
      walletAddress,
      referralCode: generateCryptoCode(),
      nonce,
    });

    await createInteraction({
      userId: newUser.userId,
      type: INTERACTION_TYPES.SIGNUP,
      pointValue: INTERACTION_POINTS.SIGNUP,
    });

    if (referrerCode) {
      const referrer = await User.findOne({ referralCode: referrerCode });
      if (!referrer) {
        return newUser;
      }
      await createInteraction({
        userId: referrer.userId,
        type: INTERACTION_TYPES.REFERRAL_BONUS,
        pointValue: INTERACTION_POINTS.REFERRAL_BONUS,
      });

      await FriendRequest.create({
        senderId: newUser.userId,
        receiverId: referrer.userId,
        status: 'PENDING',
      });
    }

    return newUser;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Updates a user's profile
 * @param {string} userId - The user's ID
 * @param {Object} profileData - The profile data to update
 * @param {String} profileData.username - The user's username
 * @param {String} profileData.fullName - The user's full name
 * @param {String} profileData.bio - The user's bio
 * @param {String} profileData.socials.twitter - The user's Twitter handle
 * @param {String} profileData.socials.instagram - The user's Instagram handle
 * @param {String} profileData.socials.linkedin - The user's LinkedIn handle
 * @param {String} profileData.socials.farcaster - The user's Farcaster handle
 * @param {String} profileData.socials.base - The user's Base handle
 * @returns {Promise<User>} - The updated user
 */
export async function updateProfile(userId, profileData) {
  return User.findOneAndUpdate({ userId }, profileData, { new: true });
}

export async function findById(userId) {
  return User.findOne({ userId });
}

export async function registerNFC(userId, nfcId) {
  const existingUser = await User.findOne({ nfcId });
  if (existingUser) {
    throw new Error('NFC ID already in use.');
  }
  return User.findOneAndUpdate({ userId }, { nfcId }, { new: true });
}

export async function uploadProfilePicture(userId, file) {
  const profilePictureUrl = await uploadFileToBucket(userId, file);
  await User.findOneAndUpdate({ userId }, { profilePictureUrl }, { new: true });
  return profilePictureUrl;
}

export async function updateUserFriendsList(userId, friendId) {
  return User.findOneAndUpdate(
    { userId },
    { $addToSet: { friends: friendId } },
    { new: true },
  );
}
