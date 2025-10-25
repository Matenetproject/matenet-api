import User from '../models/user.js';
import Interaction from '../models/interaction.js';

/**
 * Creates a new interaction for a user.
 * @param {Object} params
 * @param {string} params.userId - The ID of the user
 * @param {string} params.type - The type of interaction
 * @param {number} params.pointValue - The point value of the interaction
 * @returns {Promise<Interaction>} - The created interaction
 */
export async function createInteraction({ userId, type, pointValue }) {
  await User.findOneAndUpdate(
    { userId },
    { $inc: { points: pointValue } },
    { new: true },
  );

  const interaction = await Interaction.create({
    userId,
    type,
    pointValue,
  });
  return interaction;
}
