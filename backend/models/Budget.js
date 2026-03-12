import mongoose from 'mongoose';

const budgetItemSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'venue',
      'catering',
      'decoration',
      'entertainment',
      'photography',
      'videography',
      'music',
      'transportation',
      'invitations',
      'flowers',
      'security',
      'lighting',
      'av_equipment',
      'staff',
      'accommodation',
      'gifts_favors',
      'miscellaneous',
    ],
    default: 'miscellaneous',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  estimatedAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  actualAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    default: null,
  },
  status: {
    type: String,
    enum: ['planned', 'quoted', 'paid', 'cancelled'],
    default: 'planned',
  },
  paidDate: {
    type: Date,
  },
  receiptUrl: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

budgetItemSchema.index({ eventId: 1, category: 1 });
budgetItemSchema.index({ userId: 1 });

const Budget = mongoose.model('Budget', budgetItemSchema);
export default Budget;
