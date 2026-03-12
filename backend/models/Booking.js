import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: false
  },
  eventName: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  serviceType: {
    type: String,
    trim: true
  },
  serviceName: {
    type: String,
    trim: true
  },
  eventDate: {
    type: Date
  },
  amount: {
    type: Number,
    default: 0
  },
  guestCount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid', 'refunded'],
    default: 'unpaid'
  },
  vendorResponse: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ vendorId: 1, status: 1 });
bookingSchema.index({ eventId: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
