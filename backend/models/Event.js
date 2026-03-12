import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['Wedding', 'Birthday', 'Corporate', 'Conference', 'Graduation', 'Anniversary', 'Holiday', 'Party', 'Other']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  estimatedGuests: {
    type: Number,
    default: 0
  },
  budget: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['planning', 'confirmed', 'completed', 'cancelled'],
    default: 'planning'
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
eventSchema.index({ userId: 1, startDate: -1 });
eventSchema.index({ status: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;
