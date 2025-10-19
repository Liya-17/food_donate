# Food Donation Platform - Backend API

A real-time food donation platform built with MERN stack, featuring Socket.io for real-time notifications and updates.

## Features

- **User Authentication**: JWT-based authentication with role-based access control (Donor, Receiver, Admin)
- **Donation Management**: Create, update, delete, and manage food donations
- **Real-time Notifications**: Socket.io integration for instant updates
- **Location-based Search**: Find donations near you using geospatial queries
- **Request System**: Request and manage food donations
- **Image Upload**: Cloudinary integration for donation images
- **Email Notifications**: Nodemailer integration for email alerts
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error handling

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **Nodemailer** - Email service

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Setup

1. Clone the repository
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the backend directory (use `.env.example` as template)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/food-donation
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
FRONTEND_URL=http://localhost:3000
```

4. Start MongoDB (if running locally)
```bash
mongod
```

5. Run the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/me` | Get current user | Yes |
| PUT | `/updatepassword` | Update password | Yes |
| POST | `/logout` | Logout user | Yes |

### Donations (`/api/donations`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all donations (with filters) | No |
| GET | `/:id` | Get single donation | No |
| POST | `/` | Create donation | Yes |
| PUT | `/:id` | Update donation | Yes |
| DELETE | `/:id` | Delete donation | Yes |
| POST | `/:id/claim` | Claim a donation | Yes |
| POST | `/:id/complete` | Mark donation as complete | Yes |
| POST | `/:id/cancel` | Cancel donation | Yes |

### Requests (`/api/requests`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create donation request | Yes |
| GET | `/` | Get all requests | Yes |
| GET | `/:id` | Get single request | Yes |
| PUT | `/:id/accept` | Accept request | Yes |
| PUT | `/:id/reject` | Reject request | Yes |
| PUT | `/:id/cancel` | Cancel request | Yes |

### Users (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile/:id` | Get user profile | No |
| PUT | `/profile` | Update profile | Yes |
| GET | `/donations` | Get user's donations | Yes |
| GET | `/claimed-donations` | Get claimed donations | Yes |
| GET | `/stats` | Get dashboard stats | Yes |
| PUT | `/deactivate` | Deactivate account | Yes |
| GET | `/` | Get all users (Admin) | Yes (Admin) |

### Notifications (`/api/notifications`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all notifications | Yes |
| GET | `/unread-count` | Get unread count | Yes |
| PUT | `/:id/read` | Mark as read | Yes |
| PUT | `/read-all` | Mark all as read | Yes |
| DELETE | `/:id` | Delete notification | Yes |
| DELETE | `/clear-read` | Clear read notifications | Yes |

## Request Examples

### Register User
```bash
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
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

### Create Donation
```bash
POST /api/donations
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Fresh Sandwiches",
  "description": "20 fresh sandwiches from lunch buffet",
  "foodType": "vegetarian",
  "quantity": "20 pieces",
  "servings": 20,
  "category": "cooked-food",
  "expiryTime": "2024-12-31T23:59:59Z",
  "availableTo": "2024-12-31T20:00:00Z",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "pickupLocation": {
    "address": {
      "street": "123 Restaurant Ave",
      "city": "New York",
      "state": "NY"
    }
  }
}
```

### Get Nearby Donations
```bash
GET /api/donations?latitude=40.7128&longitude=-74.0060&distance=5000&status=available
```

## Socket.io Events

### Client to Server

- `typing` - User is typing
- `stop_typing` - User stopped typing
- `update_location` - Update user location
- `express_interest` - Express interest in donation
- `send_message` - Send direct message
- `donation_status_changed` - Donation status updated

### Server to Client

- `connected` - Connection confirmed
- `new_donation` - New donation created
- `donation_claimed` - Donation claimed
- `new_request` - New donation request
- `request_accepted` - Request accepted
- `interest_received` - Interest expressed
- `receive_message` - Message received
- `user_online` - User came online
- `user_offline` - User went offline

## Database Models

### User
- name, email, password
- role (donor/receiver/admin)
- phone, address, location
- organizationType, organizationName
- avatar, rating
- donationsGiven, donationsReceived
- totalDonations, totalReceived

### Donation
- donor, title, description
- foodType, quantity, servings, category
- images, expiryTime
- pickupLocation (with coordinates)
- availableFrom, availableTo
- status (available/claimed/completed/expired/cancelled)
- claimedBy, rating, feedback

### Request
- donation, requester, donor
- status (pending/accepted/rejected/completed/cancelled)
- message, pickupTime
- numberOfServingsNeeded, purpose
- responseMessage

### Notification
- recipient, sender
- type, title, message
- relatedDonation, relatedRequest
- isRead, priority

## Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // Optional validation errors
}
```

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet.js security headers
- Input validation and sanitization
- CORS configuration
- MongoDB injection prevention

## Testing

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- Any REST client

Import the endpoints into your preferred tool and start testing!

## Project Structure

```
backend/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── donationController.js # Donation management
│   ├── requestController.js  # Request handling
│   ├── userController.js     # User management
│   └── notificationController.js # Notifications
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Error handling
│   ├── validation.js        # Input validation
│   └── upload.js            # File upload handling
├── models/
│   ├── User.js              # User schema
│   ├── Donation.js          # Donation schema
│   ├── Request.js           # Request schema
│   └── Notification.js      # Notification schema
├── routes/
│   ├── authRoutes.js        # Auth routes
│   ├── donationRoutes.js    # Donation routes
│   ├── requestRoutes.js     # Request routes
│   ├── userRoutes.js        # User routes
│   └── notificationRoutes.js # Notification routes
├── socket/
│   └── socketHandler.js     # Socket.io configuration
├── utils/
│   ├── generateToken.js     # JWT token generation
│   ├── sendEmail.js         # Email utility
│   └── cloudinary.js        # Image upload utility
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
├── server.js               # Entry point
└── README.md               # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
