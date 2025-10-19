# API Testing Examples

This document provides example API calls you can use to test the Food Donation Platform backend.

## Setup

1. Make sure MongoDB is running
2. Start the server: `npm run dev`
3. Server will be running on `http://localhost:5000`

## Testing with curl

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
    "organizationType": "restaurant",
    "organizationName": "Pizza Palace Restaurant",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    }
  }'
```

### 2. Register a Receiver

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hope NGO",
    "email": "ngo@example.com",
    "password": "password123",
    "phone": "+9876543210",
    "role": "receiver",
    "organizationType": "ngo",
    "organizationName": "Hope Foundation"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pizza@example.com",
    "password": "password123"
  }'
```

**Save the token from the response for authenticated requests!**

### 4. Create a Donation

```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Fresh Pizza - End of Day",
    "description": "10 large pizzas from our daily leftover. Still fresh and hot!",
    "foodType": "vegetarian",
    "quantity": "10 large pizzas",
    "servings": 40,
    "category": "cooked-food",
    "expiryTime": "2024-12-31T23:59:59Z",
    "availableFrom": "2024-12-31T18:00:00Z",
    "availableTo": "2024-12-31T21:00:00Z",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "pickupLocation": {
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      }
    },
    "specialInstructions": "Please bring containers. Pickup from back door.",
    "contactInfo": {
      "phone": "+1234567890",
      "email": "pizza@example.com"
    },
    "isUrgent": false
  }'
```

### 5. Get All Donations

```bash
# Get all available donations
curl http://localhost:5000/api/donations?status=available

# Get donations near a location (within 10km)
curl "http://localhost:5000/api/donations?latitude=40.7128&longitude=-74.0060&distance=10000"

# Get vegetarian donations
curl "http://localhost:5000/api/donations?foodType=vegetarian&status=available"

# Pagination
curl "http://localhost:5000/api/donations?page=1&limit=10"
```

### 6. Get Single Donation

```bash
curl http://localhost:5000/api/donations/DONATION_ID_HERE
```

### 7. Claim a Donation

```bash
curl -X POST http://localhost:5000/api/donations/DONATION_ID_HERE/claim \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_RECEIVER_TOKEN_HERE"
```

### 8. Create a Donation Request

```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_RECEIVER_TOKEN_HERE" \
  -d '{
    "donationId": "DONATION_ID_HERE",
    "pickupTime": "2024-12-31T19:00:00Z",
    "numberOfServingsNeeded": 30,
    "purpose": "ngo",
    "message": "We run a community kitchen and would love to pick up this donation."
  }'
```

### 9. Accept a Request (Donor)

```bash
curl -X PUT http://localhost:5000/api/requests/REQUEST_ID_HERE/accept \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_DONOR_TOKEN_HERE" \
  -d '{
    "responseMessage": "Request accepted! Please pick up between 7-8 PM."
  }'
```

### 10. Get User's Donations

```bash
curl http://localhost:5000/api/users/donations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by status
curl "http://localhost:5000/api/users/donations?status=available" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 11. Get Claimed Donations

```bash
curl http://localhost:5000/api/users/claimed-donations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 12. Complete a Donation (Donor)

```bash
curl -X POST http://localhost:5000/api/donations/DONATION_ID_HERE/complete \
  -H "Authorization: Bearer YOUR_DONOR_TOKEN_HERE"
```

### 13. Get Notifications

```bash
# Get all notifications
curl http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get unread notifications only
curl "http://localhost:5000/api/notifications?isRead=false" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get unread count
curl http://localhost:5000/api/notifications/unread-count \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 14. Mark Notification as Read

```bash
curl -X PUT http://localhost:5000/api/notifications/NOTIFICATION_ID_HERE/read \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 15. Get Dashboard Stats

```bash
curl http://localhost:5000/api/users/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 16. Update Profile

```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Updated Name",
    "phone": "+1111111111",
    "address": {
      "street": "456 New St",
      "city": "Boston",
      "state": "MA"
    }
  }'
```

### 17. Get User Profile

```bash
curl http://localhost:5000/api/users/profile/USER_ID_HERE
```

## Testing with Postman

1. Import these endpoints into Postman
2. Create an environment with variables:
   - `base_url`: `http://localhost:5000`
   - `token`: (set after login)
   - `donor_token`: (set after donor login)
   - `receiver_token`: (set after receiver login)

3. Use `{{base_url}}/api/auth/login` format for URLs
4. Set Authorization header: `Bearer {{token}}`

## Socket.io Testing

You can test Socket.io connections using:

### Using JavaScript (Browser Console or Node.js)

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:5000', {
  auth: {
    token: 'YOUR_JWT_TOKEN_HERE'
  }
});

socket.on('connected', (data) => {
  console.log('Connected:', data);
});

socket.on('new_donation', (data) => {
  console.log('New donation:', data);
});

socket.on('donation_claimed', (data) => {
  console.log('Donation claimed:', data);
});

socket.on('new_request', (data) => {
  console.log('New request:', data);
});

// Express interest
socket.emit('express_interest', {
  donationId: 'DONATION_ID',
  donorId: 'DONOR_ID'
});
```

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [
    // Array of items
  ]
}
```

## Testing Workflow

1. **Register two users** - one donor and one receiver
2. **Login both users** - save their tokens
3. **Create donations** as donor
4. **Browse donations** as receiver
5. **Create request** as receiver for a donation
6. **Accept request** as donor
7. **Complete donation** as donor
8. **Check notifications** for both users
9. **View dashboard stats** for both users

## Notes

- Replace `YOUR_TOKEN_HERE` with actual JWT token from login response
- Replace `DONATION_ID_HERE`, `REQUEST_ID_HERE`, etc. with actual IDs
- Dates should be in ISO 8601 format
- Coordinates: longitude comes before latitude in MongoDB
- For image uploads, use `multipart/form-data` content type
- Socket.io requires authentication token in handshake

## Health Check

```bash
# Check if server is running
curl http://localhost:5000/api/health

# Response:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

Happy Testing!
