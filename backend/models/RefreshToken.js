import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // ✅ good for queries by user
    },

    token: {
      type: String,
      required: true,
      unique: true, // ✅ automatically creates index
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    createdByIp: {
      type: String,
    },

    revokedAt: {
      type: Date,
    },

    revokedByIp: {
      type: String,
    },

    replacedByToken: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🔹 Virtual: check if token expired
refreshTokenSchema.virtual("isExpired").get(function () {
  return Date.now() >= this.expiresAt;
});

// 🔹 Virtual: check if token is valid
refreshTokenSchema.virtual("isValid").get(function () {
  return this.isActive && !this.isExpired && !this.revokedAt;
});

// ✅ TTL Index (ONLY ONE for expiresAt — fixes your error)
refreshTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 2592000 } // 30 days
);

// ❌ REMOVED:
// - refreshTokenSchema.index({ expiresAt: 1 })  → duplicate
// - refreshTokenSchema.index({ token: 1 })      → already indexed via unique

export default mongoose.model("RefreshToken", refreshTokenSchema);
