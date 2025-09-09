# CampusConnect API Integration Guide

## Overview

CampusConnect is a campus delivery and trip-sharing platform built with Next.js, MongoDB, and JWT authentication. This guide provides comprehensive documentation for integrating the CampusConnect API into your own project.

## Table of Contents

1. [Setup & Prerequisites](#setup--prerequisites)
2. [Database Schema](#database-schema)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Integration Examples](#integration-examples)
7. [Error Handling](#error-handling)
8. [Security Considerations](#security-considerations)

## Setup & Prerequisites

### Environment Variables

Create a `.env.local` file with the following variables:

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
```

### Dependencies

```json
{
  "dependencies": {
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "next": "^14.0.0"
  },
  "devDependencies": {
    "@types/jsonwebtoken": "^9.0.0",
    "@types/bcryptjs": "^2.4.0"
  }
}
```

## Database Schema

### User Model

```typescript
interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  studentId: string;
  phoneNumber: string;
  phoneVerified: boolean;
  phoneVerificationCode?: string;
  phoneVerificationExpires?: Date;
  studentIdValidated: boolean;
  studentIdValidationScore?: number;
  verificationStatus: "pending_verification" | "verified" | "rejected";
  profileImage?: string;
  studentIdImage?: {
    url: string;
    publicId: string;
  };
  selfieImage?: {
    url: string;
    publicId: string;
  };
  gender?: "male" | "female" | "other";
  indexNumber?: string;
  programmeOfStudy?: string;
  currentYear?: number;
  rating: number;
  totalDeliveries: number;
  joinedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Trip Model

```typescript
interface ITrip {
  travelerId: mongoose.Types.ObjectId;
  fromLocation: ILocation;
  toLocation: ILocation;
  departureTime: Date;
  transportMethod: string;
  maxDeliveries: number;
  currentDeliveries: number;
  pricePerDelivery: number; // Price in Ghana Cedi (GHC)
  isRecurring: boolean;
  status: "active" | "completed" | "cancelled";
  matchedRequests: mongoose.Types.ObjectId[];
  joinedUsers: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

interface ILocation {
  type: "campus" | "off-campus";
  campusLocation?: CampusLocation;
  offCampusAddress?: string;
}
```

### Delivery Request Model

```typescript
interface IDeliveryRequest {
  userId: mongoose.Types.ObjectId;
  pickupLocation: ILocation;
  dropoffLocation: ILocation;
  itemDescription: string;
  itemSize: "Small" | "Medium" | "Large";
  priority: "normal" | "high" | "urgent";
  paymentAmount: number; // Payment in Ghana Cedi (GHC)
  pickupDate: Date;
  pickupTime: string;
  contactInfo: string;
  specialInstructions: string;
  status: "pending" | "matched" | "in-transit" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}
```

## Authentication

### JWT Token Structure

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  verificationStatus: string;
}
```

### Authentication Flow

1. User signs up/signs in
2. Server generates JWT token with 7-day expiration
3. Token is stored in HTTP-only cookie named `auth-token`
4. All protected endpoints verify the token

### Token Verification

```typescript
import { verifyToken } from "@/lib/auth";

// In your API route
const token = request.cookies.get("auth-token")?.value;
if (!token) {
  return NextResponse.json(
    { error: "Authentication required" },
    { status: 401 }
  );
}

const decoded = verifyToken(token);
if (!decoded) {
  return NextResponse.json({ error: "Invalid token" }, { status: 401 });
}
```

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/signup`

Register a new user.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@knust.edu.gh",
  "password": "password123",
  "studentId": "12345678",
  "phoneNumber": "+233123456789",
  "gender": "male",
  "indexNumber": "1234567890",
  "programmeOfStudy": "Computer Science",
  "currentYear": 3
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@knust.edu.gh",
    "studentId": "12345678",
    "verificationStatus": "pending_verification"
  }
}
```

#### POST `/api/auth/signin`

Authenticate user and return JWT token.

**Request Body:**

```json
{
  "email": "john.doe@knust.edu.gh",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@knust.edu.gh",
    "verificationStatus": "verified"
  }
}
```

#### GET `/api/auth/me`

Get current user information.

**Headers:** `Cookie: auth-token=jwt_token`

**Response:**

```json
{
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@knust.edu.gh",
    "studentId": "12345678",
    "verificationStatus": "verified",
    "rating": 5.0,
    "totalDeliveries": 0
  }
}
```

#### PUT `/api/auth/update-profile`

Update user profile information.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "gender": "male",
  "indexNumber": "1234567890",
  "programmeOfStudy": "Computer Science",
  "currentYear": 3
}
```

### Trip Endpoints

#### GET `/api/trips`

Get all active trips.

**Query Parameters:**

- `page` (optional): Page number for pagination
- `limit` (optional): Number of trips per page (default: 10)

**Response:**

```json
{
  "trips": [
    {
      "_id": "trip_id",
      "travelerId": {
        "_id": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@knust.edu.gh",
        "studentId": "12345678"
      },
      "travelerName": "John Doe",
      "fromLocation": {
        "type": "campus",
        "campusLocation": "University Hall"
      },
      "toLocation": {
        "type": "campus",
        "campusLocation": "College of Science"
      },
      "departureTime": "2024-01-15T10:00:00.000Z",
      "transportMethod": "Car",
      "maxDeliveries": 3,
      "currentDeliveries": 1,
      "pricePerDelivery": 5.0,
      "status": "active",
      "joinedUsers": [
        {
          "_id": "user_id",
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane.smith@knust.edu.gh",
          "studentId": "87654321"
        }
      ]
    }
  ],
  "totalTrips": 25,
  "currentPage": 1,
  "totalPages": 3
}
```

#### POST `/api/trips`

Create a new trip.

**Request Body:**

```json
{
  "fromLocation": {
    "type": "campus",
    "campusLocation": "University Hall"
  },
  "toLocation": {
    "type": "campus",
    "campusLocation": "College of Science"
  },
  "departureDate": "2024-01-15",
  "departureTime": "10:00",
  "availableSeats": 3,
  "pricePerDelivery": 5.0,
  "vehicleType": "Car",
  "description": "Going to College of Science",
  "contactInfo": "+233123456789"
}
```

#### POST `/api/trips/join`

Join an existing trip.

**Request Body:**

```json
{
  "tripId": "trip_id"
}
```

#### DELETE `/api/trips/join`

Leave a trip.

**Request Body:**

```json
{
  "tripId": "trip_id"
}
```

### Delivery Request Endpoints

#### GET `/api/delivery-requests`

Get all delivery requests.

**Query Parameters:**

- `page` (optional): Page number for pagination
- `limit` (optional): Number of requests per page (default: 10)

**Response:**

```json
{
  "deliveryRequests": [
    {
      "_id": "request_id",
      "userId": {
        "_id": "user_id",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@knust.edu.gh",
        "studentId": "87654321"
      },
      "requesterName": "Jane Smith",
      "pickupLocation": {
        "type": "campus",
        "campusLocation": "University Hall"
      },
      "dropoffLocation": {
        "type": "campus",
        "campusLocation": "College of Science"
      },
      "itemDescription": "Textbook",
      "itemSize": "Medium",
      "priority": "normal",
      "paymentAmount": 5.0,
      "pickupDate": "2024-01-15T10:00:00.000Z",
      "pickupTime": "10:00 AM",
      "contactInfo": "+233987654321",
      "specialInstructions": "Handle with care",
      "status": "pending"
    }
  ],
  "totalRequests": 15,
  "currentPage": 1,
  "totalPages": 2
}
```

#### POST `/api/delivery-requests`

Create a new delivery request.

**Request Body:**

```json
{
  "pickupLocation": {
    "type": "campus",
    "campusLocation": "University Hall"
  },
  "dropoffLocation": {
    "type": "campus",
    "campusLocation": "College of Science"
  },
  "itemDescription": "Textbook",
  "itemSize": "Medium",
  "priority": "normal",
  "paymentAmount": 5.0,
  "pickupDate": "2024-01-15",
  "pickupTime": "10:00 AM",
  "contactInfo": "+233987654321",
  "specialInstructions": "Handle with care"
}
```

#### POST `/api/delivery-requests/offer`

Offer delivery service for a request.

**Request Body:**

```json
{
  "deliveryRequestId": "request_id",
  "tripId": "trip_id"
}
```

#### DELETE `/api/delivery-requests/offer`

Cancel delivery offer.

**Request Body:**

```json
{
  "deliveryRequestId": "request_id",
  "tripId": "trip_id"
}
```

## Integration Examples

### Frontend Integration (React/Next.js)

#### 1. Authentication Hook

```typescript
import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      await fetchUser();
      return true;
    }
    return false;
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return { user, loading, login, logout };
}
```

#### 2. Trip Management

```typescript
export function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/trips");
      const data = await response.json();
      setTrips(data.trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData: any) => {
    const response = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tripData),
    });

    if (response.ok) {
      await fetchTrips();
      return true;
    }
    return false;
  };

  const joinTrip = async (tripId: string) => {
    const response = await fetch("/api/trips/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripId }),
    });

    if (response.ok) {
      await fetchTrips();
      return true;
    }
    return false;
  };

  return { trips, loading, fetchTrips, createTrip, joinTrip };
}
```

### Backend Integration (Express.js)

#### 1. Database Connection

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### 2. Authentication Middleware

```javascript
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token =
    req.cookies["auth-token"] || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
```

#### 3. API Route Example

```javascript
const express = require("express");
const router = express.Router();

// Get trips
router.get("/trips", async (req, res) => {
  try {
    const trips = await Trip.find({ status: "active" })
      .populate("travelerId", "firstName lastName email studentId")
      .populate("joinedUsers", "firstName lastName email studentId")
      .sort({ createdAt: -1 });

    res.json({ trips });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create trip
router.post("/trips", authenticateToken, async (req, res) => {
  try {
    const trip = new Trip({
      ...req.body,
      travelerId: req.user.userId,
    });

    await trip.save();
    res.status(201).json({ trip });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)",
  "code": "ERROR_CODE (optional)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

### Error Handling Example

```typescript
try {
  const response = await fetch("/api/trips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tripData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Request failed");
  }

  const data = await response.json();
  return data;
} catch (error) {
  console.error("API Error:", error);
  // Handle error appropriately
}
```

## Security Considerations

### 1. Authentication

- Always verify JWT tokens on protected endpoints
- Use HTTP-only cookies for token storage
- Implement token expiration and refresh mechanisms
- Validate user permissions for sensitive operations

### 2. Input Validation

- Validate all input data on both client and server
- Sanitize user inputs to prevent injection attacks
- Use proper data types and constraints

### 3. Database Security

- Use parameterized queries to prevent injection
- Implement proper indexing for performance
- Regular database backups and monitoring

### 4. Rate Limiting

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
```

### 5. CORS Configuration

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
```

## Testing

### Unit Tests Example

```javascript
const request = require("supertest");
const app = require("../app");

describe("Trip API", () => {
  test("GET /api/trips should return trips", async () => {
    const response = await request(app).get("/api/trips").expect(200);

    expect(response.body.trips).toBeDefined();
    expect(Array.isArray(response.body.trips)).toBe(true);
  });

  test("POST /api/trips should create a trip", async () => {
    const tripData = {
      fromLocation: { type: "campus", campusLocation: "University Hall" },
      toLocation: { type: "campus", campusLocation: "College of Science" },
      departureDate: "2024-01-15",
      departureTime: "10:00",
      availableSeats: 3,
      pricePerDelivery: 5.0,
    };

    const response = await request(app)
      .post("/api/trips")
      .set("Cookie", "auth-token=valid_jwt_token")
      .send(tripData)
      .expect(201);

    expect(response.body.trip).toBeDefined();
  });
});
```

## Deployment

### Environment Setup

1. Set up MongoDB database (local or Atlas)
2. Configure environment variables
3. Set up Cloudinary for image uploads
4. Configure CORS for your frontend domain

### Production Considerations

- Use environment-specific JWT secrets
- Implement proper logging and monitoring
- Set up database backups
- Configure SSL/TLS certificates
- Implement proper error handling and logging

## Support

For additional support or questions about integration:

- Check the console logs for debugging information
- Verify environment variables are set correctly
- Ensure database connection is working
- Test API endpoints using tools like Postman or curl

## Changelog

### Version 1.0.0

- Initial API release
- User authentication and profile management
- Trip creation and management
- Delivery request system
- Basic matching functionality
