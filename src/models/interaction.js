import mongoose, { Schema } from 'mongoose';

const InteractionSchema = new Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true }, // 'SIGNUP', 'ADD_FRIEND', 'NFT_REDEEM', 'REFERRAL_BONUS'
    pointValue: { type: Number, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

const Interaction = mongoose.model('Interaction', InteractionSchema);

export default Interaction;
