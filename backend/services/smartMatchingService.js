const User = require('../models/User');
const Donation = require('../models/Donation');

/**
 * Smart Matching Service
 * AI-powered algorithm to match donations with receivers based on multiple factors
 */

class SmartMatchingService {
  /**
   * Calculate match score between a donation and a receiver
   * @param {Object} donation - The donation object
   * @param {Object} receiver - The receiver/user object
   * @returns {Object} Match score and breakdown
   */
  static calculateMatchScore(donation, receiver) {
    let totalScore = 0;
    let maxScore = 0;
    const breakdown = {};

    // 1. Dietary Preference Match (Weight: 30 points)
    maxScore += 30;
    if (receiver.preferences?.dietaryPreferences?.length > 0) {
      const dietMatch = receiver.preferences.dietaryPreferences.includes(donation.foodType) ||
                       receiver.preferences.dietaryPreferences.includes('mixed');
      breakdown.dietaryMatch = dietMatch ? 30 : 0;
      totalScore += breakdown.dietaryMatch;
    } else {
      // No preference set, give neutral score
      breakdown.dietaryMatch = 15;
      totalScore += 15;
    }

    // 2. Category Preference Match (Weight: 20 points)
    maxScore += 20;
    if (receiver.preferences?.preferredCategories?.length > 0) {
      const categoryMatch = receiver.preferences.preferredCategories.includes(donation.category);
      breakdown.categoryMatch = categoryMatch ? 20 : 0;
      totalScore += breakdown.categoryMatch;
    } else {
      breakdown.categoryMatch = 10;
      totalScore += 10;
    }

    // 3. Distance Score (Weight: 25 points)
    maxScore += 25;
    const distance = this.calculateDistance(
      donation.pickupLocation?.coordinates?.coordinates || donation.pickupLocation?.coordinates || [0, 0],
      receiver.location.coordinates
    );
    breakdown.distance = distance;

    const maxDistance = receiver.preferences?.maxDistance || 10;
    if (distance <= maxDistance) {
      // Closer is better - exponential decay
      const distanceScore = 25 * Math.exp(-distance / (maxDistance / 2));
      breakdown.distanceScore = Math.round(distanceScore);
      totalScore += breakdown.distanceScore;
    } else {
      breakdown.distanceScore = 0;
    }

    // 4. Quantity/Servings Match (Weight: 15 points)
    maxScore += 15;
    const minServings = receiver.preferences?.minServings || 1;
    const maxServings = receiver.preferences?.maxServings || 100;

    if (donation.servings >= minServings && donation.servings <= maxServings) {
      breakdown.servingsMatch = 15;
      totalScore += 15;
    } else if (donation.servings < minServings) {
      // Partial score if close
      breakdown.servingsMatch = Math.max(0, 15 - (minServings - donation.servings) * 2);
      totalScore += breakdown.servingsMatch;
    } else {
      breakdown.servingsMatch = 5; // Too much food, but still possible
      totalScore += 5;
    }

    // 5. Urgency/Time Sensitivity (Weight: 10 points)
    maxScore += 10;
    const hoursUntilExpiry = this.getHoursUntilExpiry(donation.expiryTime);

    if (donation.isUrgent || hoursUntilExpiry < 6) {
      breakdown.urgencyScore = 10; // Urgent matches get priority
      totalScore += 10;
    } else if (hoursUntilExpiry < 24) {
      breakdown.urgencyScore = 7;
      totalScore += 7;
    } else {
      breakdown.urgencyScore = 5;
      totalScore += 5;
    }

    // 6. Historical Success Rate (Weight: 15 points)
    maxScore += 15;
    // Boost score for receivers with good track record
    if (receiver.matchingStats?.successfulClaims > 0) {
      const successRate = receiver.matchingStats.successfulClaims /
                         (receiver.matchingStats.totalMatches || 1);
      breakdown.historicalScore = Math.round(successRate * 15);
      totalScore += breakdown.historicalScore;
    } else {
      // New users get average score
      breakdown.historicalScore = 8;
      totalScore += 8;
    }

    // 7. Donor Rating Bonus (Weight: 10 points)
    maxScore += 10;
    if (donation.donor?.rating) {
      breakdown.donorRatingBonus = Math.round((donation.donor.rating / 5) * 10);
      totalScore += breakdown.donorRatingBonus;
    } else {
      breakdown.donorRatingBonus = 5;
      totalScore += 5;
    }

    // 8. Time of Day Match (Weight: 10 points)
    maxScore += 10;
    const currentHour = new Date().getHours();
    const timeOfDay = this.getTimeOfDay(currentHour);

    if (receiver.preferences?.preferredPickupTimes?.includes(timeOfDay)) {
      breakdown.timeMatch = 10;
      totalScore += 10;
    } else {
      breakdown.timeMatch = 5;
      totalScore += 5;
    }

    // Calculate percentage score
    const percentageScore = Math.round((totalScore / maxScore) * 100);

    return {
      score: totalScore,
      maxScore: maxScore,
      percentage: percentageScore,
      breakdown: breakdown,
      recommendationLevel: this.getRecommendationLevel(percentageScore)
    };
  }

  /**
   * Get smart matches for a receiver
   * @param {String} receiverId - The receiver's user ID
   * @param {Number} limit - Maximum number of matches to return
   * @returns {Array} Array of matched donations with scores
   */
  static async getSmartMatches(receiverId, limit = 10) {
    try {
      const receiver = await User.findById(receiverId);

      if (!receiver || receiver.role !== 'receiver') {
        throw new Error('Invalid receiver');
      }

      // Get available donations
      const maxDistance = receiver.preferences?.maxDistance || 10;

      const donations = await Donation.find({
        status: 'available',
        'pickupLocation.coordinates.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: receiver.location.coordinates
            },
            $maxDistance: maxDistance * 1000 // Convert km to meters
          }
        }
      })
      .populate('donor', 'name organizationType rating avatar')
      .limit(50); // Get more than needed for better filtering

      // Calculate match scores for each donation
      const matchedDonations = donations.map(donation => {
        const matchResult = this.calculateMatchScore(donation.toObject(), receiver.toObject());

        return {
          donation: donation,
          matchScore: matchResult.score,
          matchPercentage: matchResult.percentage,
          matchBreakdown: matchResult.breakdown,
          recommendationLevel: matchResult.recommendationLevel
        };
      });

      // Sort by match score (highest first)
      matchedDonations.sort((a, b) => b.matchScore - a.matchScore);

      // Return top matches
      return matchedDonations.slice(0, limit);
    } catch (error) {
      console.error('Smart matching error:', error);
      throw error;
    }
  }

  /**
   * Get receivers that match a new donation
   * @param {String} donationId - The donation ID
   * @param {Number} limit - Maximum number of receivers to notify
   * @returns {Array} Array of matched receivers with scores
   */
  static async getMatchingReceivers(donationId, limit = 20) {
    try {
      const donation = await Donation.findById(donationId).populate('donor');

      if (!donation) {
        throw new Error('Donation not found');
      }

      // Find receivers within reasonable distance
      const donationCoords = donation.pickupLocation?.coordinates?.coordinates ||
                             donation.pickupLocation?.coordinates ||
                             [0, 0];

      const receivers = await User.find({
        role: 'receiver',
        isActive: true,
        'preferences.autoMatchEnabled': true,
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: donationCoords
            },
            $maxDistance: 50000 // 50km max radius for notifications
          }
        }
      });

      // Calculate match scores
      const matches = receivers.map(receiver => {
        const matchResult = this.calculateMatchScore(donation.toObject(), receiver.toObject());

        // Only include if match percentage is above threshold
        if (matchResult.percentage >= 50) {
          return {
            receiver: receiver,
            matchScore: matchResult.score,
            matchPercentage: matchResult.percentage,
            matchBreakdown: matchResult.breakdown,
            recommendationLevel: matchResult.recommendationLevel
          };
        }
        return null;
      }).filter(match => match !== null);

      // Sort by match score
      matches.sort((a, b) => b.matchScore - a.matchScore);

      return matches.slice(0, limit);
    } catch (error) {
      console.error('Error finding matching receivers:', error);
      throw error;
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param {Array} coords1 - [longitude, latitude]
   * @param {Array} coords2 - [longitude, latitude]
   * @returns {Number} Distance in kilometers
   */
  static calculateDistance(coords1, coords2) {
    const [lon1, lat1] = coords1;
    const [lon2, lat2] = coords2;

    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal
  }

  /**
   * Convert degrees to radians
   */
  static toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get hours until donation expires
   */
  static getHoursUntilExpiry(expiryTime) {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diff = expiry - now;
    return diff / (1000 * 60 * 60); // Convert to hours
  }

  /**
   * Get time of day category
   */
  static getTimeOfDay(hour) {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  /**
   * Get recommendation level based on percentage
   */
  static getRecommendationLevel(percentage) {
    if (percentage >= 85) return 'perfect';
    if (percentage >= 70) return 'excellent';
    if (percentage >= 55) return 'good';
    if (percentage >= 40) return 'fair';
    return 'low';
  }

  /**
   * Update matching statistics for a user
   */
  static async updateMatchingStats(userId, successful = false) {
    try {
      const user = await User.findById(userId);

      if (user) {
        user.matchingStats.totalMatches += 1;
        if (successful) {
          user.matchingStats.successfulClaims += 1;
        }
        user.matchingStats.lastMatchedAt = new Date();

        // Calculate new average
        const successRate = user.matchingStats.successfulClaims / user.matchingStats.totalMatches;
        user.matchingStats.averageMatchScore = Math.round(successRate * 100);

        await user.save();
      }
    } catch (error) {
      console.error('Error updating matching stats:', error);
    }
  }
}

module.exports = SmartMatchingService;
