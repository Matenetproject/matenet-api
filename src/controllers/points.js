import Interaction from '../models/Interaction.js';

export async function getPoints(userId) {
  const points = await Interaction.aggregate([
    {
      $match: {
        userId,
      },
    },
    {
      $group: {
        _id: '$userId',
        totalPoints: {
          $sum: '$pointValue',
        },
      },
    },
  ]);

  return points[0]?.totalPoints || 0;
}
