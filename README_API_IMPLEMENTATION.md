# CampusConnect API Implementation

This project implements the CampusConnect API as documented in the API_GUIDE.md file. It provides a complete backend API for a campus delivery and trip-sharing platform.

## Features Implemented

### Authentication System

- User registration and login
- JWT token-based authentication
- Profile management
- Password hashing with bcrypt

### Database Models

- User model with comprehensive student information
- Trip model for ride-sharing functionality
- Delivery Request model for package delivery services

### API Endpoints

- **Authentication**: `/api/auth/signup`, `/api/auth/signin`, `/api/auth/me`, `/api/auth/update-profile`, `/api/auth/logout`
- **Trips**: `/api/trips`, `/api/trips/create`, `/api/trips/join`, `/api/trips/leave`
- **Delivery Requests**: `/api/delivery-requests`, `/api/delivery-requests/create`, `/api/delivery-requests/offer`, `/api/delivery-requests/cancel`

### Frontend Integration

- Custom React hooks for API integration
- Updated authentication forms
- API client utility

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DB_URI=mongodb://localhost:27017/campusconnect
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/campusconnect

# JWT Secret (use a strong, unique secret)
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Node Environment
NODE_ENV=development
```

### 3. Database Setup

Make sure you have MongoDB running locally or have access to a MongoDB Atlas cluster.

### 4. Run the Application

```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`.

## API Usage Examples

### Authentication

```typescript
// Register a new user
const response = await fetch("/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@knust.edu.gh",
    password: "password123",
    studentId: "12345678",
    phoneNumber: "+233123456789",
  }),
});

// Login
const response = await fetch("/api/auth/signin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john.doe@knust.edu.gh",
    password: "password123",
  }),
});
```

### Trips

```typescript
// Get all trips
const response = await fetch("/api/trips");

// Create a trip
const response = await fetch("/api/trips/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fromLocation: { type: "campus", campusLocation: "University Hall" },
    toLocation: { type: "campus", campusLocation: "College of Science" },
    departureDate: "2024-01-15",
    departureTime: "10:00",
    availableSeats: 3,
    pricePerDelivery: 5.0,
    vehicleType: "Car",
  }),
});
```

### Delivery Requests

```typescript
// Get all delivery requests
const response = await fetch("/api/delivery-requests");

// Create a delivery request
const response = await fetch("/api/delivery-requests/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    pickupLocation: { type: "campus", campusLocation: "University Hall" },
    dropoffLocation: { type: "campus", campusLocation: "College of Science" },
    itemDescription: "Textbook",
    itemSize: "Medium",
    paymentAmount: 5.0,
    pickupDate: "2024-01-15",
    pickupTime: "10:00 AM",
    contactInfo: "+233987654321",
  }),
});
```

## React Hooks

The implementation includes custom React hooks for easy frontend integration:

- `useAuth()` - Authentication state and methods
- `useTrips()` - Trip management
- `useDeliveryRequests()` - Delivery request management

## Security Features

- JWT token authentication with HTTP-only cookies
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting ready

## Database Schema

The implementation includes comprehensive Mongoose schemas with:

- Proper indexing for performance
- Data validation
- Relationships between models
- Timestamps and audit fields

## Error Handling

All API endpoints include proper error handling with:

- Standardized error response format
- Appropriate HTTP status codes
- Detailed error messages
- Logging for debugging

## Next Steps

1. Set up MongoDB database
2. Configure environment variables
3. Test API endpoints
4. Integrate with frontend components
5. Add additional features as needed

For more detailed API documentation, refer to the `API_GUIDE.md` file.
