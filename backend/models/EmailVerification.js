import mongoose from 'mongoose';
import crypto from 'crypto';

const emailVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedAt: {
    type: Date
  },
  ipAddress: {
    type: String
  }
}, { timestamps: true });

// Generate verification token
emailVerificationSchema.statics.generateToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

// Check if token is valid
emailVerificationSchema.methods.isValid = function() {
  return !this.verified && Date.now() < this.expiresAt;
};

// Index for performance
emailVerificationSchema.index({ token: 1 });
emailVerificationSchema.index({ userId: 1, verified: 1 });
emailVerificationSchema.index({ expiresAt: 1 });

// Auto-delete expired tokens after 7 days
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 604800 });

export default mongoose.model('EmailVerification', emailVerificationSchema);
