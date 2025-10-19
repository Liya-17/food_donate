# 🍲 Food Donation Platform

A full-stack real-time food donation platform that connects food donors with receivers, reducing food waste and fighting hunger. Built with the MERN stack featuring Socket.io for live updates, AI-powered smart matching, and comprehensive geospatial features.

![Platform Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![License](https://img.shields.io/badge/License-ISC-yellow)

---

## 🌟 Key Features

### For Donors
- 🎁 **Create Donations** - Post available food with images, details, and location
- 📍 **Location Tracking** - Automatic geocoding with Google Maps integration
- 📊 **Impact Dashboard** - Track donations, servings, and environmental impact
- 🤖 **Smart Matches** - AI-powered matching with receivers based on 8 factors
- 🔔 **Real-time Notifications** - Instant updates when donations are claimed
- ⭐ **Ratings & Reviews** - Build reputation through receiver feedback
- 📸 **Profile Management** - Upload profile pictures and manage details

### For Receivers
- 🔍 **Advanced Search** - Find donations by type, category, location, and distance
- 🗺️ **Interactive Maps** - View donations on Google Maps with clustering
- 📍 **Nearby Donations** - Geolocation-based search within customizable radius
- 🎯 **Smart Matching** - Get personalized donation recommendations
- ⚙️ **Preferences** - Set dietary preferences, distance limits, and servings range
- 💬 **Direct Messaging** - Communicate with donors in real-time
- 🏆 **Success Stories** - View and share completed donation impacts

### Platform-wide
- 🔴 **Live Updates** - Real-time donation status, claims, and completions
- 🌍 **Environmental Impact** - Calculate CO₂, water, and energy savings
- 🎊 **Celebration Animations** - Confetti effects for completed donations
- 🔐 **Secure Authentication** - JWT-based auth with role-based access control
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- ♿ **Accessible** - WCAG AA compliant with keyboard navigation
- 🎨 **Modern UI** - Beautiful gradients, animations, and smooth transitions

---

## 🚀 Tech Stack

### Frontend
- **React 18** - UI framework with hooks and context
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Socket.io Client** - Real-time communication
- **React Hot Toast** - Elegant notifications
- **Lucide React** - Icon library
- **Google Maps API** - Maps and geocoding
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database with geospatial indexing
- **Mongoose** - ODM with schema validation
- **Socket.io** - Real-time bidirectional communication
- **JWT** - Stateless authentication
- **Bcrypt.js** - Password hashing
- **Cloudinary** - Image storage and optimization
- **Multer** - File upload handling
- **Nodemailer** - Email notifications

### Services & APIs
- **MongoDB Atlas** - Cloud database
- **Cloudinary** - Image CDN
- **Google Maps Platform** - Maps, geocoding, places
- **Render** - Backend hosting (recommended)
- **Vercel/Netlify** - Frontend hosting (recommended)

---

## 📦 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** v14+ and npm
- **MongoDB** (local or Atlas account)
- **Git**

### Environment Variables

Create `.env` files in both frontend and backend directories:

#### Backend `.env`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-donation
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/food-donation.git
cd food-donation
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Start MongoDB** (if running locally)
```bash
mongod
```

5. **Start Backend Server**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

6. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:5173`

7. **Open your browser**
Navigate to `http://localhost:5173`

---

## 🎯 Core Features Explained

### 1. AI-Powered Smart Matching

The platform uses an intelligent 8-factor algorithm to match receivers with donations:

**Matching Factors:**
- 🥗 **Dietary Preferences** (30 points) - Vegetarian, vegan, non-veg matching
- 📦 **Category Match** (20 points) - Cooked, raw, packaged food alignment
- 📍 **Distance** (25 points) - Proximity-based scoring
- 👥 **Servings** (15 points) - Quantity alignment with needs
- ⏰ **Urgency** (10 points) - Expiry time consideration
- 📊 **Historical Data** (15 points) - Past successful matches
- ⭐ **Donor Rating** (10 points) - Reputation scoring
- 🕐 **Time Preferences** (10 points) - Pickup time compatibility

**Score Ranges:**
- 🎯 90-100%: Perfect Match
- ⭐ 70-89%: Excellent Match
- 👍 50-69%: Good Match
- 📌 Below 50%: Basic Match

### 2. Geospatial Search

**Technologies:**
- MongoDB 2dsphere indexes for efficient spatial queries
- Haversine formula for distance calculations
- Google Maps Geocoding API for address conversion
- Real-time location tracking

**Features:**
- Find donations within 1km to 100km radius
- Automatic sorting by distance
- Map view with donation markers
- Current location detection

### 3. Real-Time Communication

**Socket.io Events:**

**Client → Server:**
- `join_room` - Join chat room
- `send_message` - Send direct message
- `typing` - Typing indicator
- `express_interest` - Show interest in donation

**Server → Client:**
- `new_donation` - New donation created
- `donation_completed` - Donation fulfilled
- `donation_claimed` - Donation claimed
- `receive_message` - New message received
- `notification` - System notification

### 4. Success Stories with Impact Tracking

**Environmental Impact Calculations:**
```javascript
Food Saved (kg) = Servings × 0.4
CO₂ Reduced (kg) = Food Saved × 2.5
Water Saved (L) = Food Saved × 250
Energy Saved (kWh) = Servings × 0.5
Waste Diverted (kg) = Servings × 0.35
```

**Features:**
- Live donation completions with confetti
- Filter by food type, time, location
- Environmental metrics dashboard
- Recent completions tracker

---

## 📂 Project Structure

```
food-donation/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── donationController.js    # Donation CRUD
│   │   ├── userController.js        # User management
│   │   ├── requestController.js     # Requests handling
│   │   ├── notificationController.js
│   │   └── messageController.js     # Messaging
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   ├── errorHandler.js          # Error handling
│   │   └── upload.js                # Multer config
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Donation.js              # Donation schema
│   │   ├── Request.js               # Request schema
│   │   ├── Notification.js          # Notification schema
│   │   └── Message.js               # Message schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── donationRoutes.js
│   │   ├── userRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── messageRoutes.js
│   ├── services/
│   │   └── smartMatchingService.js  # AI matching algorithm
│   ├── socket/
│   │   └── socketHandler.js         # Socket.io setup
│   ├── utils/
│   │   ├── cloudinary.js            # Image uploads
│   │   ├── geocoding.js             # Google Maps API
│   │   └── generateToken.js         # JWT tokens
│   ├── scripts/
│   │   ├── checkDonationLocations.js
│   │   └── updateIndexes.js
│   ├── .env
│   ├── package.json
│   └── server.js                    # Entry point
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── DonationCard.jsx
│   │   │   ├── DonationMap.jsx      # Google Maps integration
│   │   │   ├── AdvancedSearch.jsx
│   │   │   ├── LiveImpactTracker.jsx
│   │   │   ├── EnvironmentalImpact.jsx
│   │   │   ├── StoryFilters.jsx
│   │   │   ├── CelebrationConfetti.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # User authentication
│   │   │   └── SocketContext.jsx    # Socket.io connection
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── CreateDonation.jsx
│   │   │   ├── DonationsList.jsx
│   │   │   ├── DonationDetail.jsx
│   │   │   ├── SmartMatches.jsx     # AI matching
│   │   │   ├── Preferences.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── SuccessStories.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js               # API client
│   │   ├── utils/
│   │   │   └── helpers.js           # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── DEPLOYMENT_GUIDE.md              # Production deployment
├── PROFILE_FEATURE.md               # Profile feature docs
├── SUCCESS_STORIES_FEATURE.md       # Success stories docs
└── README.md                        # This file
```

---

## 🔐 Authentication & Authorization

### User Roles

**Donor:**
- Create and manage donations
- View claims and requests
- Accept/reject donation requests
- Rate receivers
- View donation history and impact

**Receiver:**
- Browse and search donations
- Claim available donations
- Submit donation requests
- Rate donors
- Track claimed donations

**Admin:**
- All donor and receiver permissions
- Manage users
- View platform statistics
- Monitor system activity

### JWT Authentication Flow

1. User registers/logs in
2. Server generates JWT token with user ID and role
3. Token stored in localStorage
4. Token sent in Authorization header for protected routes
5. Middleware verifies token and attaches user to request
6. Token expires after 7 days (configurable)

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "donor",
  "organizationType": "restaurant",
  "address": {
    "street": "123 Main St",
    "city": "Hyderabad",
    "state": "Telangana",
    "zipCode": "500001",
    "country": "India"
  },
  "latitude": 17.3850,
  "longitude": 78.4867
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Donation Endpoints

#### Create Donation
```http
POST /api/donations
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Fresh Vegetable Biryani",
  "description": "Delicious vegetable biryani with raita",
  "foodType": "vegetarian",
  "quantity": "5 kg",
  "servings": 20,
  "category": "cooked-food",
  "expiryTime": "2025-10-20T20:00:00Z",
  "availableTo": "2025-10-20T18:00:00Z",
  "latitude": 17.3850,
  "longitude": 78.4867,
  "pickupLocation": {
    "address": {
      "street": "123 Restaurant St",
      "city": "Hyderabad",
      "state": "Telangana"
    }
  },
  "images": [<File>, <File>]
}
```

#### Get Donations (with filters)
```http
GET /api/donations?status=available&foodType=vegetarian&latitude=17.3850&longitude=78.4867&distance=5000
```

#### Claim Donation
```http
POST /api/donations/:id/claim
Authorization: Bearer <token>
```

#### Complete Donation
```http
POST /api/donations/:id/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "feedback": "Great quality food!"
}
```

### Smart Matching Endpoint

```http
GET /api/matching/smart-matches
Authorization: Bearer <token>
```

### User Endpoints

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "John Updated",
  "phone": "+9876543210",
  "avatar": <File>,
  "address": {...}
}
```

#### Get Dashboard Stats
```http
GET /api/users/stats
Authorization: Bearer <token>
```

---

## 🗺️ Google Maps Integration

### Required APIs
Enable these in Google Cloud Console:
- Maps JavaScript API
- Geocoding API
- Places API
- Geolocation API

### Setup Steps
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the required APIs
4. Create API credentials (API Key)
5. Add API key to both frontend and backend `.env` files
6. (Optional) Add billing account for production use

### API Key Restrictions (Recommended)
- **Application restrictions**: HTTP referrers for frontend
- **API restrictions**: Limit to Maps, Geocoding, Places APIs
- **Usage limits**: Set daily quotas

---

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Production deployment
vercel --prod
```

**Environment Variables:**
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
VITE_GOOGLE_MAPS_API_KEY=your_api_key
```

### Backend Deployment (Render)

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Add Environment Variables** from `.env`

### MongoDB Atlas Setup

1. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster (Free M0 tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string
6. Update `MONGODB_URI` in backend `.env`

### Post-Deployment

1. Update `FRONTEND_URL` in backend `.env` to deployed frontend URL
2. Update `VITE_API_URL` in frontend `.env` to deployed backend URL
3. Test all features thoroughly
4. Monitor logs for errors
5. Set up MongoDB indexes:
   ```bash
   cd backend/scripts
   node updateIndexes.js
   ```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] User registration (donor/receiver)
- [ ] User login
- [ ] Password validation
- [ ] Token persistence
- [ ] Logout functionality

**Donations:**
- [ ] Create donation with images
- [ ] Location auto-detection
- [ ] View donation list
- [ ] Filter by type/category/status
- [ ] Search by location
- [ ] Claim donation
- [ ] Complete donation with rating
- [ ] Cancel donation

**Smart Matching:**
- [ ] Set preferences
- [ ] View matched donations
- [ ] Match score calculation
- [ ] Match breakdown display

**Real-time Features:**
- [ ] Live donation updates
- [ ] Notification pop-ups
- [ ] Success story celebrations
- [ ] Message delivery

**Maps:**
- [ ] Donation map markers
- [ ] Current location marker
- [ ] Marker clustering
- [ ] Info windows

### API Testing

Use Postman or similar:
```bash
# Import collection
postman import backend/postman_collection.json

# Run tests
postman run food-donation-tests
```

---

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running (`mongod`) or check Atlas connection string

**2. Geospatial Query Fails**
```
Error: failed to load donations
```
**Solution:** Run `node backend/scripts/updateIndexes.js` to create 2dsphere indexes

**3. Image Upload Fails**
```
Error: Upload to Cloudinary failed
```
**Solution:** Verify Cloudinary credentials in `.env`

**4. Google Maps Not Loading**
```
Error: Google Maps JavaScript API error
```
**Solution:** Check API key and ensure Maps JavaScript API is enabled

**5. Socket.io Connection Issues**
```
WebSocket connection failed
```
**Solution:** Ensure backend server is running and `VITE_SOCKET_URL` is correct

**6. CORS Errors**
```
Access-Control-Allow-Origin error
```
**Solution:** Add frontend URL to CORS whitelist in `backend/server.js`

---

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (donor/receiver/admin),
  phone: String,
  organizationType: String,
  organizationName: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  location: {
    type: "Point",
    coordinates: [lng, lat]
  },
  avatar: String (Cloudinary URL),
  rating: Number,
  totalDonations: Number,
  completedDonations: Number,
  preferences: {
    dietaryPreferences: [String],
    preferredCategories: [String],
    maxDistance: Number,
    preferredPickupTimes: [String],
    minServings: Number,
    maxServings: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Donation Collection
```javascript
{
  _id: ObjectId,
  donor: ObjectId (ref: User),
  title: String,
  description: String,
  foodType: String (vegetarian/non-vegetarian/vegan/mixed),
  category: String,
  quantity: String,
  servings: Number,
  images: [String] (Cloudinary URLs),
  expiryTime: Date,
  pickupLocation: {
    address: {
      street: String,
      city: String,
      state: String
    },
    coordinates: {
      type: "Point",
      coordinates: [lng, lat]
    }
  },
  availableFrom: Date,
  availableTo: Date,
  status: String (available/claimed/completed/expired/cancelled),
  claimedBy: ObjectId (ref: User),
  claimedAt: Date,
  completedAt: Date,
  rating: Number,
  feedback: String,
  views: Number,
  isUrgent: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
```javascript
// User
{ "location": "2dsphere" }
{ "email": 1 } (unique)

// Donation
{ "pickupLocation.coordinates.coordinates": "2dsphere" }
{ "status": 1, "expiryTime": 1 }
{ "donor": 1, "createdAt": -1 }
```

---

## 🎨 UI/UX Features

### Design System
- **Primary Color**: Green (#16a34a) - Growth, sustainability
- **Accent Color**: Blue (#3b82f6) - Trust, reliability
- **Typography**: System fonts for performance
- **Spacing**: 4px grid system
- **Shadows**: Soft shadows with subtle elevation

### Animations
- Fade-in on page load
- Slide-in for notifications
- Confetti on donation completion
- Smooth hover transitions
- Loading spinners
- Skeleton screens

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 🔒 Security Best Practices

✅ **Implemented:**
- JWT authentication with expiry
- Password hashing with bcrypt (salt rounds: 10)
- Input validation and sanitization
- CORS configuration
- Rate limiting on auth endpoints
- MongoDB injection prevention
- XSS protection
- File upload validation (size, type)
- Secure headers with helmet.js

❌ **Not Implemented (Add for production):**
- HTTPS enforcement
- CSRF tokens
- Session management
- API rate limiting (global)
- Content Security Policy
- Database encryption at rest
- Two-factor authentication
- OAuth integration

---

## 📈 Performance Optimizations

**Frontend:**
- Code splitting with React.lazy()
- Image lazy loading
- Memoization with useMemo/useCallback
- Debounced search inputs
- Virtualized lists for large datasets
- CDN for images (Cloudinary)

**Backend:**
- Database indexing (geospatial, compound)
- Pagination for API responses
- Query optimization (selective population)
- Connection pooling
- Caching frequently accessed data
- Compression middleware

**Monitoring:**
- MongoDB Atlas monitoring
- Render metrics dashboard
- Google Analytics (optional)
- Error logging (Winston/Morgan)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation
- Test your changes thoroughly
- Keep PRs focused on single features

---

## 📝 License

This project is licensed under the ISC License.

---

## 👥 Team

**Development Team:**
- Full-stack Development
- UI/UX Design
- Database Architecture
- API Development
- Testing & QA

---

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Cloudinary for image management
- Google Maps Platform for geospatial features
- Render for backend deployment
- Lucide React for beautiful icons
- Tailwind CSS for rapid styling
- Socket.io for real-time features

---

## 📞 Support & Contact

**Issues:** Create an issue in the repository
**Email:** support@fooddonation.com (if applicable)
**Documentation:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🗺️ Roadmap

### Version 2.1 (Planned)
- [ ] Email notifications for claims
- [ ] SMS notifications integration
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] Progressive Web App (PWA)
- [ ] Mobile app (React Native)

### Version 2.2 (Future)
- [ ] Donation scheduling
- [ ] Recurring donations
- [ ] Driver/delivery integration
- [ ] Analytics dashboard for admins
- [ ] Export reports (PDF/CSV)
- [ ] Social media sharing

### Version 3.0 (Vision)
- [ ] Blockchain for transparency
- [ ] AI-powered demand prediction
- [ ] Route optimization for pickups
- [ ] Integration with food banks APIs
- [ ] Gamification with badges
- [ ] Community forums

---

## 📖 Additional Documentation

- [Profile Feature Guide](./PROFILE_FEATURE.md)
- [Success Stories Feature](./SUCCESS_STORIES_FEATURE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Backend API Documentation](./backend/README.md)

---

**Made with ❤️ to reduce food waste and fight hunger**

⭐ Star this repository if you find it helpful!
