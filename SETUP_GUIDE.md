# Food Donation Platform - Complete Setup Guide

## What Has Been Created

A complete, production-ready backend for a real-time food donation platform with the following features:

### Core Features
- User authentication and authorization (JWT)
- Food donation management (CRUD operations)
- Real-time notifications (Socket.io)
- Donation request system
- Location-based search
- Image upload support (Cloudinary)
- Email notifications
- Admin panel support

### Technical Features
- RESTful API architecture
- Real-time WebSocket connections
- MongoDB with geospatial queries
- Rate limiting and security
- Input validation
- Error handling
- File upload handling

## Project Structure

```
backend/
├── config/              # Configuration files
│   └── db.js           # Database connection
├── controllers/         # Business logic
│   ├── authController.js
│   ├── donationController.js
│   ├── requestController.js
│   ├── userController.js
│   └── notificationController.js
├── middleware/          # Express middleware
│   ├── auth.js         # Authentication
│   ├── errorHandler.js # Error handling
│   ├── validation.js   # Input validation
│   └── upload.js       # File uploads
├── models/             # Database schemas
│   ├── User.js
│   ├── Donation.js
│   ├── Request.js
│   └── Notification.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── donationRoutes.js
│   ├── requestRoutes.js
│   ├── userRoutes.js
│   └── notificationRoutes.js
├── socket/             # WebSocket handling
│   └── socketHandler.js
├── utils/              # Utility functions
│   ├── generateToken.js
│   ├── sendEmail.js
│   └── cloudinary.js
├── .env               # Environment variables
├── .env.example       # Environment template
├── .gitignore         # Git ignore file
├── package.json       # Dependencies
├── server.js          # Entry point
├── README.md          # Documentation
└── API_EXAMPLES.md    # API testing guide
```

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB from https://www.mongodb.com/try/download/community
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 3. Configure Environment Variables

The `.env` file has been created with default values. Update these if needed:

```env
# Required
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food-donation
JWT_SECRET=food_donation_secret_key_2024_change_in_production

# Optional (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional (for email)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

You should see:
```
╔═══════════════════════════════════════════════╗
║                                               ║
║   Food Donation Platform API Server          ║
║                                               ║
║   Server running on port 5000                 ║
║   Environment: development                    ║
║   Socket.io: Enabled                          ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

### 5. Test the API

```bash
# Health check
curl http://localhost:5000/api/health

# Response:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatepassword` - Update password

### Donations
- `GET /api/donations` - List donations (with filters)
- `POST /api/donations` - Create donation
- `GET /api/donations/:id` - Get donation details
- `PUT /api/donations/:id` - Update donation
- `DELETE /api/donations/:id` - Delete donation
- `POST /api/donations/:id/claim` - Claim donation
- `POST /api/donations/:id/complete` - Complete donation

### Requests
- `POST /api/requests` - Create request
- `GET /api/requests` - List requests
- `PUT /api/requests/:id/accept` - Accept request
- `PUT /api/requests/:id/reject` - Reject request

### Users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/donations` - Get user's donations
- `GET /api/users/stats` - Get dashboard stats

### Notifications
- `GET /api/notifications` - List notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

See `API_EXAMPLES.md` for detailed examples!

## Testing the Application

### 1. Register a Donor
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Palace",
    "email": "pizza@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "role": "donor",
    "organizationType": "restaurant"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pizza@example.com",
    "password": "password123"
  }'
```

Save the `token` from response!

### 3. Create a Donation
```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Fresh Pizza",
    "description": "10 pizzas from lunch buffet",
    "foodType": "vegetarian",
    "quantity": "10 pizzas",
    "servings": 40,
    "category": "cooked-food",
    "expiryTime": "2024-12-31T23:59:59Z",
    "availableTo": "2024-12-31T21:00:00Z",
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

## Real-time Features (Socket.io)

The backend supports real-time features via WebSocket:

- New donation notifications
- Request notifications
- Status updates
- User online/offline status

Connect using Socket.io client:
```javascript
const socket = io('http://localhost:5000', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});

socket.on('new_donation', (data) => {
  console.log('New donation:', data);
});
```

## Database Models

### User
Stores user information, location, donations history

### Donation
Stores food donation details, pickup location, status

### Request
Stores donation requests and their status

### Notification
Stores user notifications with read status

## Security Features

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting (100 requests per 15 minutes)
- Input validation
- CORS configuration
- Helmet.js security headers

## Next Steps

### For Frontend Development
1. Use the API endpoints to build your React/Next.js frontend
2. Implement Socket.io client for real-time features
3. Use the authentication token for protected routes
4. Implement maps integration for location features

### For Production Deployment
1. Change `JWT_SECRET` to a strong secret
2. Set `NODE_ENV=production`
3. Use MongoDB Atlas for database
4. Set up Cloudinary for images
5. Configure email service
6. Set up SSL/HTTPS
7. Deploy to services like:
   - Heroku
   - Railway
   - Render
   - AWS/Azure
   - DigitalOcean

### Optional Enhancements
1. Add payment integration
2. Add SMS notifications
3. Add Google Maps integration
4. Add analytics dashboard
5. Add review/rating system
6. Add scheduled pickup feature
7. Add multi-language support

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, check IP whitelist

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process using port 5000

### Authentication Errors
- Check JWT_SECRET is set
- Verify token format: `Bearer <token>`
- Check token expiration

## Resources

- **Documentation**: `README.md`
- **API Examples**: `API_EXAMPLES.md`
- **MongoDB Docs**: https://docs.mongodb.com
- **Express Docs**: https://expressjs.com
- **Socket.io Docs**: https://socket.io/docs

## Support

For issues or questions:
1. Check the documentation files
2. Review API examples
3. Check console logs for errors
4. Verify environment variables

## License

ISC

---

**Congratulations!** Your food donation platform backend is ready to use!
