import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  vendorType: {
    type: String,
    required: true,
    enum: ['Catering', 'Decoration', 'Entertainment', 'Photography', 'Venue', 'General']
  },
  description: {
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
  website: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  image_url: {
    type: String,
    default: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500' // default image
  },
  services: [{
    id: String,
    name: String,
    description: String,
    price: String,
    category: String,
    isAvailable: { type: Boolean, default: true },
    bookings: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  }]
}, {
  timestamps: true
});

// Index for search
vendorSchema.index({ companyName: 'text', description: 'text' });
vendorSchema.index({ vendorType: 1, isVerified: 1 });

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;
