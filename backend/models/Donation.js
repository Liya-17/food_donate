const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  foodType: {
    type: String,
    required: true,
    enum: ['vegetarian', 'non-vegetarian', 'vegan', 'mixed']
  },
  quantity: {
    type: String,
    required: [true, 'Please specify quantity']
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  category: {
    type: String,
    required: true,
    enum: ['cooked-food', 'raw-food', 'packaged-food', 'fruits-vegetables', 'bakery', 'other']
  },
  images: [{
    type: String
  }],
  expiryTime: {
    type: Date,
    required: [true, 'Please provide expiry time']
  },
  pickupLocation: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  availableFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  availableTo: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'completed', 'expired', 'cancelled'],
    default: 'available'
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  claimedAt: Date,
  completedAt: Date,
  specialInstructions: String,
  contactInfo: {
    phone: String,
    alternatePhone: String,
    email: String
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  feedback: String,
  isUrgent: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
donationSchema.index({ 'pickupLocation.coordinates.coordinates': '2dsphere' });
donationSchema.index({ status: 1, expiryTime: 1 });
donationSchema.index({ donor: 1, createdAt: -1 });

// Virtual for checking if donation is expired
donationSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiryTime;
});

// Middleware to auto-expire donations
donationSchema.pre('save', function(next) {
  if (this.status === 'available' && new Date() > this.expiryTime) {
    this.status = 'expired';
  }
  next();
});

module.exports = mongoose.model('Donation', donationSchema);
