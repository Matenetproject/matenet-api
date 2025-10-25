import mongoose, { Schema } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { hashAndEncryptField, decrypt } from '../helpers/crypt-utils.js';

/**
 * User Schema
 * @schema User
 */
const UserSchema = new Schema(
  {
    userId: { type: String, required: true, default: () => randomUUID() },
    walletAddress: { type: String, unique: true, sparse: true },
    nfcId: { type: String, unique: true, sparse: true },
    username: { type: String, unique: true, sparse: true },
    fullName: { type: String },
    email: { type: String, unique: true, sparse: true },
    password: {
      type: String,
    },
    profilePictureUrl: { type: String },
    bio: { type: String },
    referralCode: { type: String, unique: true },
    friends: [{ type: String }, { default: [] }], // Array of userIds
    socials: {
      twitter: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      farcaster: { type: String },
      base: { type: String },
    },
    nonce: { type: String },
    points: { type: Number, default: 0 },
  },
  { timestamps: true },
);

/**
 * Pre-save hook to hash and encrypt password if modified
 * @returns {Promise<void>}
 */
UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = hashAndEncryptField(this.password);
  }
  next();
});

/**
 * Instance method to compare input password with stored password
 * @param {string} candidatePassword - The password to compare
 * @returns {boolean} - True if passwords match, false otherwise
 */
UserSchema.methods.comparePassword = function (candidatePassword) {
  try {
    // Decrypt stored password
    const decryptedHash = decrypt(this.password);
    // Hash the candidate password and compare with decrypted hash
    // Use bcrypt to compare
    const bcrypt = require('bcrypt');
    return bcrypt.compareSync(candidatePassword, decryptedHash);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

const User = mongoose.model('User', UserSchema);

export default User;
