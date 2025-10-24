import mongoose, { Schema } from 'mongoose';

/**
 * Friend Request Schema
 * @schema FriendRequest
 */
const FriendRequestSchema = new Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
    method: { type: String, enum: ['LINK', 'QR', 'NFC'], default: 'LINK' },
  },
  { timestamps: true },
);

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);

export default FriendRequest;
