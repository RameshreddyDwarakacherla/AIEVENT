import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
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
  createdByIp: {
    type: String
  },
  revokedAt: {
    type: Date
  },
  revokedByIp: {
    type: String
  },
  replacedByToken: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Virtual for checking if token is expired
refreshTokenSchema.virtual('isExpired').get(function() {
  return Date.now() >= this.expiresAt;
});

// Virtual for checking if token is active
refreshTokenSchema.virtual('isValid').get(function() {
  return this.isActive && !this.isExpired && !this.revokedAt;
});

// Index for performance
refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ expiresAt: 1 });

// Auto-delete expired tokens after 30 days
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.model('RefreshToken', refreshTokenSchema);
