const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: [300, 'Message cannot be more than 300 characters']
  },
  pickupTime: {
    type: Date,
    required: true
  },
  numberOfServingsNeeded: {
    type: Number,
    required: true,
    min: 1
  },
  purpose: {
    type: String,
    enum: ['personal', 'ngo', 'community-kitchen', 'elderly-care', 'orphanage', 'other'],
    required: true
  },
  responseMessage: String,
  respondedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  otp: String,
  otpVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
requestSchema.index({ donation: 1, requester: 1 });
requestSchema.index({ donor: 1, status: 1 });
requestSchema.index({ requester: 1, status: 1 });

module.exports = mongoose.model('Request', requestSchema);
