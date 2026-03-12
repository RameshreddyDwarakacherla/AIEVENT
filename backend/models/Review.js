import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true
  },
  comment: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  vendorReply: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

reviewSchema.index({ vendorId: 1, rating: -1 });
reviewSchema.index({ userId: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
