# AI-Powered Smart Matching System

## Overview

The Smart Matching System is an intelligent, AI-powered feature that automatically matches food donations with receivers based on multiple factors including dietary preferences, location, food categories, quantity needs, and historical success patterns.

This feature makes your food donation platform unique and significantly improves the efficiency of food distribution.

---

## Key Features

### 1. **Intelligent Matching Algorithm**

The system uses a sophisticated scoring algorithm that considers:

- **Dietary Preferences** (30% weight): Matches vegetarian, non-vegetarian, vegan, or mixed food types
- **Food Categories** (20% weight): Matches specific categories like cooked food, raw food, packaged items, etc.
- **Distance** (25% weight): Prioritizes nearby donations with exponential decay for farther locations
- **Quantity/Servings** (15% weight): Matches based on receiver's min/max serving requirements
- **Urgency** (10% weight): Boosts urgent donations and those expiring soon
- **Historical Success** (15% weight): Rewards receivers with good claim history
- **Donor Rating** (10% weight): Promotes donations from highly-rated donors
- **Time of Day** (10% weight): Matches preferred pickup times (morning, afternoon, evening, night)

**Total Match Score**: Up to 155 points (normalized to percentage)

### 2. **Match Levels**

- **Perfect Match** (85-100%): 🎯 Ideal matches with very high compatibility
- **Excellent Match** (70-84%): ⭐ Great options with strong alignment
- **Good Match** (55-69%): 👍 Suitable matches worth considering
- **Fair Match** (40-54%): ✓ Possible options with some alignment

### 3. **User Preferences**

Receivers can customize their preferences:

- **Dietary Preferences**: Select multiple dietary types
- **Preferred Categories**: Choose favorite food categories
- **Maximum Distance**: Set travel distance limit (1-100 km)
- **Preferred Pickup Times**: Select convenient time slots
- **Servings Range**: Define min/max serving requirements
- **Notification Settings**: Enable/disable match notifications
- **Auto-Match**: Automatically find matches for new donations

### 4. **Real-Time Notifications**

When a new donation is posted:
- System automatically finds top 20 matching receivers
- Receivers with 50%+ match score get notified
- Socket.io real-time notifications
- Shows match percentage and recommendation level

### 5. **Analytics & Statistics**

Track matching performance:
- Total matches received
- Successful claims
- Average match score
- Last matched donation
- Success rate percentage

---

## Technical Architecture

### Backend Components

#### 1. **SmartMatchingService** (`backend/services/smartMatchingService.js`)

Core matching logic with methods:
- `calculateMatchScore(donation, receiver)`: Calculates match score
- `getSmartMatches(receiverId, limit)`: Gets matches for a receiver
- `getMatchingReceivers(donationId, limit)`: Finds receivers for a donation
- `calculateDistance(coords1, coords2)`: Haversine distance calculation
- `updateMatchingStats(userId, successful)`: Updates user statistics

#### 2. **Matching Controller** (`backend/controllers/matchingController.js`)

API endpoints:
- `GET /api/matching/smart-matches`: Get personalized matches
- `GET /api/matching/score/:donationId`: Get match score for specific donation
- `GET /api/matching/preferences`: Get user preferences
- `PUT /api/matching/preferences`: Update user preferences
- `POST /api/matching/notify/:donationId`: Notify matching receivers
- `GET /api/matching/stats`: Get matching statistics

#### 3. **Enhanced User Model**

Added fields:
```javascript
preferences: {
  dietaryPreferences: [String],
  preferredCategories: [String],
  maxDistance: Number,
  preferredPickupTimes: [String],
  minServings: Number,
  maxServings: Number,
  notifyOnMatch: Boolean,
  autoMatchEnabled: Boolean
},
matchingStats: {
  totalMatches: Number,
  successfulClaims: Number,
  lastMatchedAt: Date,
  averageMatchScore: Number
}
```

### Frontend Components

#### 1. **SmartMatches Page** (`frontend/src/pages/SmartMatches.jsx`)

Features:
- Display AI-recommended donations
- Visual match percentage badges
- Match breakdown details
- Sorting by match score
- Quick access to donation details
- Statistics dashboard

#### 2. **Preferences Page** (`frontend/src/pages/Preferences.jsx`)

Allows users to:
- Set dietary preferences
- Select food categories
- Adjust distance slider
- Choose pickup times
- Define serving ranges
- Configure notifications

#### 3. **Matching API** (`frontend/src/services/api.js`)

Frontend API methods:
```javascript
matchingAPI.getSmartMatches(limit)
matchingAPI.getMatchScore(donationId)
matchingAPI.getPreferences()
matchingAPI.updatePreferences(data)
matchingAPI.notifyMatchingReceivers(donationId)
matchingAPI.getMatchingStats()
```

---

## How It Works

### For Receivers

1. **Set Preferences**
   - Navigate to Preferences page
   - Configure dietary needs, categories, distance, etc.
   - Save preferences

2. **View Smart Matches**
   - Click "Smart Matches" in navigation
   - See AI-recommended donations sorted by match score
   - View match breakdown to understand why it matches
   - Click to view full donation details and claim

3. **Get Notifications**
   - Receive real-time notifications for new matching donations
   - Notifications show match percentage
   - High-priority for perfect matches (85%+)

### For Donors

1. **Create Donation**
   - Post donation as usual
   - System automatically finds matching receivers

2. **Notify Matches**
   - Backend automatically notifies top matching receivers
   - Increases visibility to interested receivers
   - Higher chance of quick claims

---

## Scoring Algorithm Explained

### Example Calculation

**Donation:**
- Type: Vegetarian
- Category: Cooked Food
- Location: 3 km away
- Servings: 15
- Urgent: Yes
- Donor Rating: 4.5/5

**Receiver Preferences:**
- Dietary: [vegetarian, vegan]
- Categories: [cooked food, packaged]
- Max Distance: 10 km
- Min/Max Servings: 10-50
- Preferred Time: Evening

**Score Breakdown:**
- Dietary Match: 30/30 (perfect match)
- Category Match: 20/20 (cooked food preferred)
- Distance: 22/25 (3km is very close)
- Servings: 15/15 (within range)
- Urgency: 10/10 (urgent donation)
- Historical: 12/15 (good receiver history)
- Donor Rating: 9/10 (4.5/5 rating)
- Time Match: 10/10 (evening pickup)

**Total: 128/155 = 83% (Excellent Match)**

---

## API Usage Examples

### Get Smart Matches

```javascript
const response = await matchingAPI.getSmartMatches(15);
// Returns top 15 matches sorted by score
```

### Update Preferences

```javascript
const preferences = {
  dietaryPreferences: ['vegetarian', 'vegan'],
  preferredCategories: ['cooked food', 'fruits & vegetables'],
  maxDistance: 15,
  preferredPickupTimes: ['morning', 'evening'],
  minServings: 5,
  maxServings: 50,
  notifyOnMatch: true,
  autoMatchEnabled: true
};

await matchingAPI.updatePreferences(preferences);
```

### Get Match Score for Specific Donation

```javascript
const response = await matchingAPI.getMatchScore(donationId);
// Returns detailed match score and breakdown
```

---

## Benefits

### For Receivers
- ✅ Find donations that match their needs faster
- ✅ Less time browsing irrelevant donations
- ✅ Get notified about perfect matches immediately
- ✅ Better food preferences alignment
- ✅ Reduce travel distance with nearby matches

### For Donors
- ✅ Donations reach interested receivers quickly
- ✅ Higher claim rates
- ✅ Reduced food waste
- ✅ Automatic match notifications
- ✅ Better visibility for urgent donations

### For Platform
- ✅ Unique competitive advantage
- ✅ Improved user engagement
- ✅ Higher success rates
- ✅ Better user experience
- ✅ Data-driven insights
- ✅ Scalable matching system

---

## Future Enhancements

### Potential Improvements

1. **Machine Learning Integration**
   - Learn from successful matches
   - Personalize weights based on user behavior
   - Predict optimal donation times

2. **Advanced Analytics**
   - Match success trends
   - Popular food categories by area
   - Peak donation/claim times

3. **Smart Suggestions**
   - Suggest optimal donation quantities
   - Recommend best posting times
   - Predict demand patterns

4. **Team Matching**
   - Match bulk donations with multiple receivers
   - Coordinate group pickups
   - Organization-to-organization matching

5. **Route Optimization**
   - Multi-donation pickup routes
   - Delivery coordination
   - Shared transportation suggestions

---

## Testing the Feature

### 1. As a Receiver

```bash
# Login as receiver
# Navigate to /preferences
# Set your preferences:
- Dietary: vegetarian
- Categories: cooked food, packaged
- Distance: 10 km
- Servings: 5-20

# Go to /smart-matches
# View AI-recommended donations
```

### 2. As a Donor

```bash
# Login as donor
# Create a new donation
# System automatically notifies matching receivers
# Check if receivers claim quickly
```

### 3. Testing Match Scores

```bash
# API endpoint test
GET /api/matching/smart-matches?limit=10

# Response includes:
- Match percentage
- Match breakdown
- Recommendation level
- Distance from user
```

---

## Configuration

### Adjust Match Weights

Edit `backend/services/smartMatchingService.js`:

```javascript
// Current weights:
// Dietary: 30 points
// Category: 20 points
// Distance: 25 points
// Servings: 15 points
// Urgency: 10 points
// Historical: 15 points
// Donor Rating: 10 points
// Time Match: 10 points

// Modify as needed for your use case
```

### Notification Threshold

Edit `matchingController.js`:

```javascript
// Current: 50% minimum match for notifications
if (matchResult.percentage >= 50) {
  // Send notification
}
```

---

## Performance Considerations

### Database Indexes

Ensure indexes on:
- `location.coordinates` (geospatial index)
- `status` on Donation model
- `role` on User model
- `preferences.autoMatchEnabled` on User model

### Optimization

- Limit nearby search radius (default: 50km)
- Batch process match notifications
- Cache user preferences
- Use MongoDB aggregation pipeline for complex queries

---

## Monitoring & Metrics

Track these metrics:
- Average match percentage
- Match-to-claim conversion rate
- Time to claim for matched vs non-matched
- User preference completion rate
- Notification click-through rate
- Feature usage statistics

---

## Support & Troubleshooting

### Common Issues

**No matches showing:**
- Check if preferences are set
- Verify location coordinates are valid
- Ensure there are available donations nearby

**Low match scores:**
- Adjust preferences to be less restrictive
- Increase maximum distance
- Broaden dietary/category preferences

**Not receiving notifications:**
- Check `notifyOnMatch` setting
- Verify `autoMatchEnabled` is true
- Check socket connection

---

## Conclusion

The Smart Matching System transforms your food donation platform by:
- Providing personalized recommendations
- Increasing efficiency
- Reducing food waste
- Improving user satisfaction
- Creating a unique competitive advantage

This AI-powered feature sets your platform apart and delivers real value to both donors and receivers.

---

**Feature Status**: ✅ Production Ready
**Last Updated**: October 2025
**Version**: 1.0.0
