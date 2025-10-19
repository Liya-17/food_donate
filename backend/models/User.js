const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['donor', 'receiver', 'admin'],
    default: 'donor'
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  organizationType: {
    type: String,
    enum: ['individual', 'restaurant', 'hotel', 'ngo', 'other'],
    default: 'individual'
  },
  organizationName: String,
  donationsGiven: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }],
  donationsReceived: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalDonations: {
    type: Number,
    default: 0
  },
  totalReceived: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  // Smart Matching Preferences
  preferences: {
    // Dietary preferences
    dietaryPreferences: [{
      type: String,
      enum: ['vegetarian', 'non-vegetarian', 'vegan', 'mixed']
    }],
    // Preferred food categories
    preferredCategories: [{
      type: String,
      enum: ['cooked food', 'raw food', 'packaged', 'fruits & vegetables', 'bakery items', 'other']
    }],
    // Maximum distance willing to travel (in km)
    maxDistance: {
      type: Number,
      default: 10,
      min: 1,
      max: 100
    },
    // Preferred pickup times
    preferredPickupTimes: [{
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night']
    }],
    // Quantity preferences
    minServings: {
      type: Number,
      default: 1
    },
    maxServings: {
      type: Number,
      default: 100
    },
    // Notification preferences for matches
    notifyOnMatch: {
      type: Boolean,
      default: true
    },
    // Auto-match enabled
    autoMatchEnabled: {
      type: Boolean,
      default: true
    }
  },
  // Matching history and analytics
  matchingStats: {
    totalMatches: {
      type: Number,
      default: 0
    },
    successfulClaims: {
      type: Number,
      default: 0
    },
    lastMatchedAt: Date,
    averageMatchScore: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Create geospatial index
userSchema.index({ location: '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
