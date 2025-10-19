# Testing the Smart Matching Feature

## Quick Start Guide

Follow these steps to test the new AI-Powered Smart Matching System.

---

## Prerequisites

1. Backend server running on `http://localhost:5000`
2. Frontend running on `http://localhost:3000`
3. MongoDB connected with migrated data
4. At least 2 accounts: 1 donor + 1 receiver

---

## Step-by-Step Testing

### Part 1: Set Up Test Accounts

#### Create Receiver Account (if needed)

1. Go to `http://localhost:3000/register`
2. Fill in details:
   - Name: Test Receiver
   - Email: receiver@test.com
   - Password: password123
   - Phone: 1234567890
   - **Role: Receiver** (Important!)
   - Address: Any address
3. Register and login

#### Create Donor Account (if needed)

1. Logout and register again:
   - Name: Test Donor
   - Email: donor@test.com
   - Password: password123
   - **Role: Donor** (Important!)
2. Register and login

---

### Part 2: Configure Receiver Preferences

1. **Login as Receiver** (receiver@test.com)

2. **Navigate to Preferences**
   - Click "Smart Matches" in navigation
   - Click "Customize" or go to `/preferences`

3. **Set Preferences**:
   - ✅ Dietary: Check "vegetarian" and "vegan"
   - ✅ Categories: Check "cooked food" and "fruits & vegetables"
   - ✅ Distance: Set to 15 km (use slider)
   - ✅ Pickup Times: Check "morning" and "evening"
   - ✅ Servings: Min 5, Max 30
   - ✅ Enable "Smart Match Notifications"
   - ✅ Enable "Auto-Match"

4. **Save Preferences**

Expected Result: ✅ "Preferences updated successfully!" message

---

### Part 3: Create Test Donations (as Donor)

1. **Logout and Login as Donor** (donor@test.com)

2. **Create Donation 1 - Perfect Match**:
   - Title: "Fresh Vegetarian Lunch"
   - Description: "Homemade vegetarian food"
   - Food Type: **Vegetarian**
   - Category: **Cooked Food**
   - Quantity: 5 kg
   - Servings: **15**
   - Expiry Time: Tomorrow 6 PM
   - Pickup Location: Use your current location
   - Check "Mark as Urgent"
   - Upload image (optional)
   - Submit

3. **Create Donation 2 - Good Match**:
   - Title: "Packaged Snacks"
   - Food Type: **Vegetarian**
   - Category: **Packaged**
   - Servings: **20**
   - Expiry Time: Tomorrow
   - Submit

4. **Create Donation 3 - Low Match**:
   - Title: "Non-Veg Meal"
   - Food Type: **Non-Vegetarian**
   - Category: **Cooked Food**
   - Servings: 50
   - Submit

Expected Result: All 3 donations created successfully

---

### Part 4: Test Smart Matches (as Receiver)

1. **Logout and Login as Receiver**

2. **Navigate to Smart Matches**
   - Click "Smart Matches" in navigation
   - OR go to `/smart-matches`

3. **Verify Results**:

   Expected display:
   - ✅ Donations sorted by match score (highest first)
   - ✅ "Fresh Vegetarian Lunch" should be at top (85-95% match)
   - ✅ Green "Perfect Match" or Blue "Excellent Match" badge
   - ✅ Match percentage displayed prominently
   - ✅ "Packaged Snacks" should be second (60-75% match)
   - ✅ "Non-Veg Meal" might not appear (low match) or be last

4. **Check Match Details**:

   Click on top match, verify you see:
   - Match breakdown scores:
     - Dietary: 30/30 (perfect)
     - Category: 20/20 (perfect)
     - Distance: 15-25/25 (depends on location)
     - Servings: 15/15 (within range)
     - Urgency: 10/10 (marked urgent)
   - Distance in km
   - Donor information
   - "View Details" button

5. **Check Statistics Dashboard**:

   At top of Smart Matches page:
   - Total Matches: Should increase
   - Match percentages displayed
   - Link to customize preferences

---

### Part 5: Test Match Score API

#### Option 1: Using Browser DevTools

1. While on Smart Matches page, open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for `/api/matching/smart-matches` request
5. Check response shows:
   ```json
   {
     "success": true,
     "count": 2-3,
     "data": [
       {
         "matchScore": 120-140,
         "matchPercentage": 70-95,
         "recommendationLevel": "excellent" or "perfect"
       }
     ]
   }
   ```

#### Option 2: Using curl

```bash
# Get your auth token from browser localStorage
# Then run:

curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/matching/smart-matches?limit=10
```

---

### Part 6: Test Real-Time Notifications

1. **Open Two Browser Windows**:
   - Window 1: Login as Receiver
   - Window 2: Login as Donor

2. **In Window 1 (Receiver)**:
   - Keep on Dashboard or Smart Matches page
   - Watch for notifications

3. **In Window 2 (Donor)**:
   - Create a new donation matching receiver preferences:
     - Food Type: Vegetarian
     - Category: Cooked Food
     - Servings: 10-20
   - Submit donation

4. **Verify in Window 1**:
   - ✅ Notification appears (top-right)
   - ✅ Shows match percentage
   - ✅ Says "Smart Match Found!"

---

### Part 7: Test Preference Changes

1. **As Receiver, go to Preferences**

2. **Change Distance to 1 km** (very small)

3. **Save and return to Smart Matches**

Expected Result:
- ✅ Fewer matches (only very nearby ones)
- ✅ Or no matches if all donations are far

4. **Change back to 20 km**

Expected Result:
- ✅ More matches appear again

5. **Uncheck "Vegetarian" dietary preference**

Expected Result:
- ✅ Match scores change
- ✅ Vegetarian donations now have lower dietary match scores

---

### Part 8: Test Edge Cases

#### Test 1: No Preferences Set

1. Create a new receiver account
2. Don't set any preferences
3. Go to Smart Matches

Expected:
- ✅ Still shows matches
- ✅ Neutral scores applied (around 50-60%)

#### Test 2: Very Restrictive Preferences

1. Set:
   - Only "vegan"
   - Only "raw food"
   - Distance: 1 km
   - Servings: 100-200

Expected:
- ✅ Few or no matches
- ✅ Message suggesting to adjust preferences

#### Test 3: Disable Auto-Match

1. Go to Preferences
2. Uncheck "Auto-Match Enabled"
3. Save
4. Create donation as donor

Expected:
- ✅ Receiver doesn't get notification
- ✅ Can still manually view Smart Matches

---

## API Endpoint Testing

### 1. Get Smart Matches
```bash
GET /api/matching/smart-matches?limit=10
Headers: Authorization: Bearer <token>

Expected: 200 OK
{
  "success": true,
  "count": number,
  "data": [match objects]
}
```

### 2. Get Match Score for Donation
```bash
GET /api/matching/score/:donationId
Headers: Authorization: Bearer <token>

Expected: 200 OK
{
  "success": true,
  "data": {
    "matchScore": number,
    "matchPercentage": number,
    "breakdown": object,
    "recommendationLevel": string
  }
}
```

### 3. Update Preferences
```bash
PUT /api/matching/preferences
Headers: Authorization: Bearer <token>
Body: {
  "dietaryPreferences": ["vegetarian"],
  "maxDistance": 10,
  ...
}

Expected: 200 OK
{
  "success": true,
  "message": "Preferences updated successfully"
}
```

### 4. Get Matching Stats
```bash
GET /api/matching/stats
Headers: Authorization: Bearer <token>

Expected: 200 OK
{
  "success": true,
  "data": {
    "totalMatches": number,
    "successfulClaims": number,
    "averageMatchScore": number
  }
}
```

---

## Verification Checklist

### Backend
- [ ] Server starts without errors
- [ ] Matching routes are registered
- [ ] User model includes preferences fields
- [ ] Smart matching service calculates scores correctly
- [ ] MongoDB geospatial queries work
- [ ] Notifications are created for matches

### Frontend
- [ ] Smart Matches page loads
- [ ] Preferences page loads
- [ ] Navigation shows Smart Matches link (for receivers only)
- [ ] Match percentages display correctly
- [ ] Match badges show correct colors
- [ ] Statistics cards show data
- [ ] Preferences save successfully

### Features
- [ ] Match scores are accurate
- [ ] Sorting works (highest match first)
- [ ] Distance calculations are correct
- [ ] Dietary preferences filter properly
- [ ] Category preferences work
- [ ] Servings range is respected
- [ ] Urgent donations get priority
- [ ] Real-time notifications work
- [ ] Match breakdown is detailed

---

## Troubleshooting

### Issue: No matches showing

**Solutions:**
1. Check if there are available donations in the database
2. Verify receiver has location coordinates set
3. Increase max distance in preferences
4. Check console for errors
5. Verify MongoDB geospatial index exists

### Issue: Match scores seem incorrect

**Solutions:**
1. Check SmartMatchingService calculation logic
2. Verify preference values are being read correctly
3. Check donation foodType and category values
4. Review breakdown object in API response

### Issue: Notifications not appearing

**Solutions:**
1. Check socket connection (browser console)
2. Verify `notifyOnMatch` is true in preferences
3. Ensure `autoMatchEnabled` is true
4. Check backend socket.io configuration
5. Look for errors in backend logs

### Issue: Preferences not saving

**Solutions:**
1. Check network tab for API errors
2. Verify authentication token
3. Check backend validation rules
4. Review matchingController logs

---

## Performance Testing

### Load Test

Create many donations and receivers:
- 100+ donations
- 50+ receivers
- Measure response time for `/api/matching/smart-matches`

Target: < 500ms response time

### Distance Calculation Test

Create donations at various distances:
- 0.5 km away
- 5 km away
- 15 km away
- 50 km away

Verify distance scores decay properly.

---

## Success Criteria

✅ **Feature is working if:**

1. Receivers can set and save preferences
2. Smart Matches page shows relevant donations
3. Match percentages are displayed (40-100%)
4. Higher matches appear first
5. Match breakdown shows detailed scoring
6. Real-time notifications work for new matches
7. Statistics update correctly
8. No console errors
9. API endpoints return correct data
10. Feature enhances user experience

---

## Next Steps After Testing

1. ✅ Gather user feedback
2. ✅ Monitor match-to-claim conversion rate
3. ✅ Fine-tune match weights based on data
4. ✅ Add more preference options if needed
5. ✅ Implement machine learning for personalization
6. ✅ Create admin analytics dashboard

---

**Testing Status**: Ready for QA
**Feature Version**: 1.0.0
**Last Updated**: October 2025

Happy Testing! 🎉
