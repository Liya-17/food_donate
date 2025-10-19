# Complete Food Donation Platform Setup Guide

## Overview

You now have a complete, production-ready food donation platform with:
- **Backend**: Node.js + Express + MongoDB + Socket.io
- **Frontend**: React + Vite + Tailwind CSS + Socket.io Client

## Quick Start (3 Steps!)

### 1. Start the Backend

```bash
# Open Terminal 1
cd backend
npm install
npm run dev
```

The backend will start on http://localhost:5000

### 2. Start the Frontend

```bash
# Open Terminal 2
cd frontend
npm install
npm run dev
```

The frontend will start on http://localhost:3000

### 3. Open Your Browser

Go to http://localhost:3000 and you're ready!

## Complete Setup Instructions

### Backend Setup

1. **Navigate to backend**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment is already configured**:
   - `.env` file is set up with your MongoDB Atlas connection
   - JWT_SECRET is configured
   - Everything is ready to go!

4. **Start the server**:
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # OR Production mode
   npm start
   ```

5. **Verify backend is running**:
   ```bash
   curl http://localhost:5000/api/health
   ```

   You should see:
   ```json
   {
     "success": true,
     "message": "Server is running"
   }
   ```

### Frontend Setup

1. **Navigate to frontend**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment is configured**:
   - `.env` file points to http://localhost:5000
   - Socket.io configured
   - Ready to connect to backend

4. **Start the dev server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to http://localhost:3000

## Testing the Application

### 1. Create a Donor Account

1. Click "Sign Up" button
2. Fill in the registration form:
   - Name: "Pizza Palace"
   - Email: "pizza@test.com"
   - Password: "password123"
   - Role: Donor
   - Organization Type: Restaurant

3. Click "Sign Up"

### 2. Create a Donation

1. After login, click "Donate" or "Create Donation"
2. Fill in the donation form:
   - Title: "Fresh Pizza from Lunch Buffet"
   - Description: "10 large pizzas, still hot"
   - Food Type: Vegetarian
   - Servings: 40
   - Set expiry time (use a future date/time)
   - Add pickup location
   - Add contact info

3. Click "Create Donation"

### 3. Create a Receiver Account

1. Open a new incognito window or another browser
2. Go to http://localhost:3000
3. Click "Sign Up"
4. Create receiver account:
   - Name: "Hope NGO"
   - Email: "ngo@test.com"
   - Password: "password123"
   - Role: Receiver
   - Organization Type: NGO

### 4. Browse and Claim Donations

1. In the receiver account, go to "Donations"
2. You should see the donation you created
3. Click on it to view details
4. (Request functionality can be implemented similarly)

## Project Structure

```
food-donation/
├── backend/                    # Node.js Backend
│   ├── config/                # Database & config
│   ├── controllers/           # Business logic
│   ├── models/                # MongoDB models
│   ├── routes/                # API routes
│   ├── middleware/            # Auth, validation, etc.
│   ├── socket/                # Socket.io handlers
│   ├── utils/                 # Helper functions
│   ├── .env                   # Environment variables
│   ├── package.json
│   ├── server.js              # Entry point
│   └── README.md
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React Context (Auth, Socket)
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── utils/             # Helper functions
│   │   ├── App.jsx            # Main app
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── .env                   # Environment variables
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
├── SETUP_GUIDE.md             # Backend setup guide
├── API_EXAMPLES.md            # API testing examples
└── FULL_SETUP_GUIDE.md        # This file
```

## Features Implemented

### Backend Features
✅ User authentication (JWT)
✅ Role-based access control
✅ Donation CRUD operations
✅ Request management
✅ Real-time notifications (Socket.io)
✅ Location-based search
✅ Image upload support (Cloudinary ready)
✅ Email notifications (Nodemailer ready)
✅ Input validation
✅ Error handling
✅ Rate limiting
✅ Security headers

### Frontend Features
✅ User registration & login
✅ Responsive design (mobile-friendly)
✅ Donation browsing with filters
✅ Donation creation
✅ Dashboard with statistics
✅ Real-time notifications
✅ Beautiful UI with Tailwind CSS
✅ Toast notifications
✅ Protected routes
✅ Socket.io integration
✅ Loading states
✅ Error handling

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Donations
- GET `/api/donations` - List donations (with filters)
- POST `/api/donations` - Create donation
- GET `/api/donations/:id` - Get donation
- PUT `/api/donations/:id` - Update donation
- DELETE `/api/donations/:id` - Delete donation
- POST `/api/donations/:id/claim` - Claim donation

### Users
- GET `/api/users/profile/:id` - Get profile
- PUT `/api/users/profile` - Update profile
- GET `/api/users/donations` - User's donations
- GET `/api/users/stats` - Dashboard stats

### Notifications
- GET `/api/notifications` - List notifications
- PUT `/api/notifications/:id/read` - Mark as read
- GET `/api/notifications/unread-count` - Unread count

## Socket.io Events

### Client → Server
- `express_interest` - Express interest in donation
- `update_location` - Update user location
- `send_message` - Send message

### Server → Client
- `connected` - Connection confirmed
- `new_donation` - New donation available
- `donation_claimed` - Donation was claimed
- `new_request` - New request received
- `request_accepted` - Request was accepted

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Troubleshooting

### Backend Won't Start
```bash
# Check if MongoDB is accessible
# Try connecting to MongoDB URL in .env

# Check if port 5000 is available
lsof -i :5000  # On Mac/Linux
netstat -ano | findstr :5000  # On Windows

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Frontend Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check if backend is running
curl http://localhost:5000/api/health
```

### CORS Errors
- Ensure backend CORS is configured for http://localhost:3000
- Check FRONTEND_URL in backend .env
- Restart both servers

### Socket.io Not Connecting
- Check VITE_SOCKET_URL in frontend .env
- Ensure you're logged in (socket requires auth token)
- Check browser console for errors
- Restart backend server

### API Calls Failing
- Verify backend is running on port 5000
- Check browser Network tab for actual errors
- Verify JWT token is being sent in headers
- Check API endpoint URLs

## Development Tips

### Hot Reload
Both backend and frontend support hot reload:
- Backend: Using `nodemon` (npm run dev)
- Frontend: Using Vite (automatic)

### Database Management
View your data using:
- MongoDB Compass (GUI)
- MongoDB Atlas web interface
- mongo shell

### API Testing
Test APIs using:
- Browser (for GET requests)
- Thunder Client (VS Code extension)
- Postman
- curl commands (see API_EXAMPLES.md)

### Debugging

**Backend:**
```javascript
console.log('Debug:', variable);
```

**Frontend:**
```javascript
console.log('Debug:', data);
// Or use React DevTools browser extension
```

## Production Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Push code to GitHub
2. Connect repository to hosting service
3. Set environment variables
4. Deploy!

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy `dist` folder to Vercel/Netlify

3. Update environment variables with production API URL

## Next Steps

### Additional Features You Can Add

1. **Maps Integration**:
   - Add Google Maps or Mapbox
   - Show donation locations
   - Calculate distances

2. **Chat System**:
   - Direct messaging between donors/receivers
   - Already have Socket.io set up!

3. **Reviews & Ratings**:
   - Rate donors/receivers
   - Leave feedback

4. **Advanced Filters**:
   - Distance-based search
   - Time-based filtering
   - Dietary preferences

5. **Admin Dashboard**:
   - User management
   - Analytics
   - Moderation tools

6. **Mobile App**:
   - React Native
   - Use same backend API

7. **Email Notifications**:
   - Welcome emails
   - Donation alerts
   - Configure SMTP in backend .env

8. **Image Upload**:
   - Configure Cloudinary
   - Add credentials to backend .env

## Getting Help

### Documentation
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- API Examples: `API_EXAMPLES.md`

### Common Issues
Check the troubleshooting section above

### Resources
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Socket.io Docs](https://socket.io/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## License

ISC

---

**Congratulations! Your food donation platform is ready to use!** 🎉

Start helping reduce food waste and fight hunger in your community.
