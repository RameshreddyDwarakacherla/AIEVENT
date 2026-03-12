import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  rsvpStatus: {
    type: String,
    enum: ['invited', 'confirmed', 'declined', 'maybe', 'attended'],
    default: 'invited'
  },
  plusOnes: {
    type: Number,
    default: 0
  },
  tableNumber: {
    type: String,
    trim: true
  },
  mealPreference: {
    type: String,
    enum: ['standard', 'vegetarian', 'vegan', 'gluten-free', 'none'],
    default: 'standard'
  },
  notes: {
    type: String,
    trim: true
  },
  group: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

guestSchema.index({ eventId: 1, userId: 1 });
guestSchema.index({ email: 1 });

const Guest = mongoose.model('Guest', guestSchema);

export default Guest;
