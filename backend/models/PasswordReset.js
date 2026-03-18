import mongoose from 'mongoose';
import crypto from 'crypto';

const passwordResetSchema = new mongoose.Schema({
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
  used: {
    type: Boolean,
    default: false
  },
  usedAt: {
    type: Date
  },
  ipAddress: {
    type: String
  }
}, { timestamps: true });

// Generate reset token
passwordResetSchema.statics.generateToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

// Check if token is valid
passwordResetSchema.methods.isValid = function() {
  return !this.used && Date.now() < this.expiresAt;
};

// Index for performance
passwordResetSchema.index({ token: 1 });
passwordResetSchema.index({ userId: 1, used: 1 });
passwordResetSchema.index({ expiresAt: 1 });

// Auto-delete expired tokens after 24 hours
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model('PasswordReset', passwordResetSchema);
