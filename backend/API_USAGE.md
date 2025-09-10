# Campus Connect API Documentation

A comprehensive REST API for the Campus Connect platform - connecting KNUST students for safe and verified deliveries.

## Base URL

```
Local Development: http://localhost:8080
Production: https://your-domain.com
```

## Authentication

The API uses JWT tokens for authentication with HTTP-only cookies. All protected routes require authentication.

### Authentication Flow

1. Register or login to receive JWT token
2. Token is automatically stored as HTTP-only cookie
3. Include token in requests via cookie or Authorization header

### Headers

```
Content-Type: application/json
Authorization: Bearer <token> (optional, if not using cookies)
```

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Endpoints

### Health Check

#### GET /health

Check API health status.

**Response:**

```json
{
  "status": "ok",
  "service": "campus-connect-api",
  "version": "1.0.0",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

---

## Authentication Endpoints

### 1. User Registration

#### POST /api/auth/signup

Register a new KNUST student account.

**⚠️ Important:** Only `@st.knust.edu.gh` emails are accepted.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@st.knust.edu.gh",
  "password": "securePassword123",
  "studentId": "20230001",
  "phoneNumber": "+233123456789",
  "gender": "Male",
  "indexNumber": "7890123",
  "programmeOfStudy": "Computer Science",
  "currentYear": 3
}
```

**Response (201):**

```json
{
  "message": "User created successfully",
  "data": {
    "message": "User created successfully",
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@st.knust.edu.gh",
      "studentId": "20230001",
      "verificationStatus": "pending"
    }
  }
}
```

### 2. User Login

#### POST /api/auth/signin

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "email": "john.doe@st.knust.edu.gh",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "data": {
    "message": "Login successful",
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@st.knust.edu.gh",
      "verificationStatus": "pending"
    }
  }
}
```

### 3. User Logout

#### POST /api/auth/logout

🔒 **Requires Authentication**

Logout user and clear authentication token.

**Response (200):**

```json
{
  "message": "Logout successful",
  "data": null
}
```

### 4. Get Current User

#### GET /api/auth/me

🔒 **Requires Authentication**

Get current authenticated user's profile information.

**Response (200):**

```json
{
  "message": "User data retrieved successfully",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@st.knust.edu.gh",
      "studentId": "20230001",
      "verificationStatus": "approved",
      "rating": 4.5,
      "totalDeliveries": 12,
      "profileImage": null,
      "gender": "Male",
      "indexNumber": "7890123",
      "programmeOfStudy": "Computer Science",
      "currentYear": 3,
      "phoneNumber": "+233123456789",
      "phoneVerified": false
    }
  }
}
```

### 5. Update User Profile

#### PUT /api/auth/update-profile

🔒 **Requires Authentication**

Update user profile information.

**Request Body:**

```json
{
  "firstName": "Johnny",
  "lastName": "Doe",
  "gender": "Male",
  "indexNumber": "7890123",
  "programmeOfStudy": "Computer Science",
  "currentYear": 4
}
```

### 6. Upload Verification Document

#### POST /api/auth/upload-verification

🔒 **Requires Authentication**

Upload a verification document (e.g., student ID or selfie). Files are stored in Cloudinary. Uploading a document will set your `verificationStatus` to `pending`.

**Content-Type:** `multipart/form-data`

**Form Fields:**

- `docType` (required): One of `student_id`, `selfie`, `other`
- `file` (required): The document/image file to upload

**Response (200):**

```json
{
  "message": "Verification document uploaded",
  "data": {
    "url": "https://res.cloudinary.com/.../image/upload/.../file.jpg",
    "docType": "student_id"
  }
}
```

**Response (200):**

```json
{
  "message": "Profile updated successfully",
  "data": {
    "message": "Profile updated successfully",
    "user": {
      "id": "uuid",
      "firstName": "Johnny",
      "lastName": "Doe",
      "email": "john.doe@st.knust.edu.gh",
      "studentId": "20230001",
      "verificationStatus": "approved",
      "gender": "Male",
      "indexNumber": "7890123",
      "programmeOfStudy": "Computer Science",
      "currentYear": 4
    }
  }
}
```

---

## Delivery Request Endpoints

### 1. Get Delivery Requests

#### GET /api/delivery-requests

🔓 **Public** (Optional Authentication)

Retrieve paginated list of pending delivery requests.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Example:** `/api/delivery-requests?page=2&limit=20`

**Response (200):**

```json
{
  "message": "Delivery requests retrieved successfully",
  "data": {
    "deliveryRequests": [
      {
        "id": "uuid",
        "userId": "uuid",
        "pickupLocation": "Central Cafeteria",
        "dropoffLocation": "Unity Hall",
        "itemDescription": "Food delivery from cafeteria",
        "itemSize": "medium",
        "priority": "normal",
        "paymentAmount": 15.5,
        "pickupDate": "2025-01-15T14:30:00Z",
        "pickupTime": "14:30",
        "contactInfo": "Call when you arrive",
        "specialInstructions": "Handle with care",
        "status": "pending",
        "matchedTripId": null,
        "createdAt": "2025-01-15T10:00:00Z",
        "updatedAt": "2025-01-15T10:00:00Z",
        "requesterName": "Jane Smith"
      }
    ],
    "totalRequests": 25,
    "currentPage": 1,
    "totalPages": 3
  }
}
```

### 2. Create Delivery Request

#### POST /api/delivery-requests/create

🔒 **Requires Authentication**

Create a new delivery request.

**Request Body:**

```json
{
  "pickupLocation": "Central Cafeteria",
  "dropoffLocation": "Unity Hall",
  "itemDescription": "Food delivery from cafeteria",
  "itemSize": "medium",
  "priority": "normal",
  "paymentAmount": 15.5,
  "pickupDate": "2025-01-15",
  "pickupTime": "14:30",
  "contactInfo": "Call when you arrive",
  "specialInstructions": "Handle with care"
}
```

**Valid Values:**

- `itemSize`: "small", "medium", "large"
- `priority`: "low", "normal", "high", "urgent"

**Response (201):**

```json
{
  "message": "Delivery request created successfully",
  "data": {
    "message": "Delivery request created successfully",
    "deliveryRequest": {
      "id": "uuid",
      "userId": "uuid",
      "pickupLocation": "Central Cafeteria",
      "dropoffLocation": "Unity Hall",
      "itemDescription": "Food delivery from cafeteria",
      "itemSize": "medium",
      "priority": "normal",
      "paymentAmount": 15.5,
      "pickupDate": "2025-01-15T14:30:00Z",
      "pickupTime": "14:30",
      "contactInfo": "Call when you arrive",
      "specialInstructions": "Handle with care",
      "status": "pending",
      "matchedTripId": null,
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  }
}
```

### 3. Offer Delivery Service

#### POST /api/delivery-requests/offer

🔒 **Requires Authentication**

Offer to fulfill a delivery request (traveler only).

**Request Body:**

```json
{
  "deliveryRequestId": "uuid",
  "tripId": "uuid"
}
```

**Response (200):**

```json
{
  "message": "Delivery offer made successfully",
  "data": null
}
```

### 4. Cancel Delivery Offer

#### DELETE /api/delivery-requests/cancel

🔒 **Requires Authentication**

Cancel a delivery offer (traveler only).

**Request Body:**

```json
{
  "deliveryRequestId": "uuid",
  "tripId": "uuid"
}
```

**Response (200):**

```json
{
  "message": "Delivery offer cancelled successfully",
  "data": null
}
```

---

## Trip Endpoints

### 1. Get Trips

#### GET /api/trips

🔓 **Public** (Optional Authentication)

Retrieve paginated list of active trips.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response (200):**

```json
{
  "message": "Trips retrieved successfully",
  "data": {
    "trips": [
      {
        "id": "uuid",
        "travelerId": "uuid",
        "fromLocation": "Kumasi",
        "toLocation": "Accra",
        "departureTime": "2025-01-15T08:00:00Z",
        "transportMethod": "car",
        "maxDeliveries": 5,
        "currentDeliveries": 2,
        "pricePerDelivery": 20.0,
        "isRecurring": false,
        "status": "active",
        "description": "Weekly trip to Accra",
        "contactInfo": "WhatsApp: +233123456789",
        "createdAt": "2025-01-15T07:00:00Z",
        "updatedAt": "2025-01-15T07:00:00Z",
        "travelerName": "John Traveler"
      }
    ],
    "totalTrips": 15,
    "currentPage": 1,
    "totalPages": 2
  }
}
```

### 2. Create Trip

#### POST /api/trips/create

🔒 **Requires Authentication**

Create a new trip offering.

**Request Body:**

```json
{
  "fromLocation": "Kumasi",
  "toLocation": "Accra",
  "departureDate": "2025-01-15",
  "departureTime": "08:00",
  "availableSeats": 5,
  "pricePerDelivery": 20.0,
  "vehicleType": "car",
  "description": "Weekly trip to Accra",
  "contactInfo": "WhatsApp: +233123456789"
}
```

**Valid Values:**

- `vehicleType`: "car", "motorcycle", "bicycle", "walking", "public_transport"

**Response (201):**

```json
{
  "message": "Trip created successfully",
  "data": {
    "message": "Trip created successfully",
    "trip": {
      "id": "uuid",
      "travelerId": "uuid",
      "fromLocation": "Kumasi",
      "toLocation": "Accra",
      "departureTime": "2025-01-15T08:00:00Z",
      "transportMethod": "car",
      "maxDeliveries": 5,
      "currentDeliveries": 0,
      "pricePerDelivery": 20.0,
      "isRecurring": false,
      "status": "active",
      "description": "Weekly trip to Accra",
      "contactInfo": "WhatsApp: +233123456789",
      "createdAt": "2025-01-15T07:00:00Z",
      "updatedAt": "2025-01-15T07:00:00Z",
      "travelerName": "John Traveler"
    }
  }
}
```

### 3. Join Trip

#### POST /api/trips/join

🔒 **Requires Authentication**

Join an existing trip as a passenger.

**Request Body:**

```json
{
  "tripId": "uuid"
}
```

**Response (200):**

```json
{
  "message": "Successfully joined trip",
  "data": null
}
```

### 4. Leave Trip

#### DELETE /api/trips/leave

🔒 **Requires Authentication**

Leave a trip you've joined.

**Request Body:**

```json
{
  "tripId": "uuid"
}
```

**Response (200):**

```json
{
  "message": "Successfully left trip",
  "data": null
}
```

### 5. Get My Trips

#### GET /api/trips/my-trips

🔒 **Requires Authentication**

Get trips created by the authenticated user.

**Response (200):**

```json
{
  "message": "User trips retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "travelerId": "uuid",
      "fromLocation": "Kumasi",
      "toLocation": "Accra",
      "departureTime": "2025-01-15T08:00:00Z",
      "transportMethod": "car",
      "maxDeliveries": 5,
      "currentDeliveries": 2,
      "pricePerDelivery": 20.0,
      "isRecurring": false,
      "status": "active",
      "description": "Weekly trip to Accra",
      "contactInfo": "WhatsApp: +233123456789",
      "createdAt": "2025-01-15T07:00:00Z",
      "updatedAt": "2025-01-15T07:00:00Z"
    }
  ]
}
```

---

## Data Models

### User Model

```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string (@st.knust.edu.gh)",
  "studentId": "string",
  "phoneNumber": "string",
  "phoneVerified": "boolean",
  "gender": "string|null",
  "indexNumber": "string|null",
  "programmeOfStudy": "string|null",
  "currentYear": "number|null",
  "verificationStatus": "pending|approved|rejected",
  "rating": "number",
  "totalDeliveries": "number",
  "profileImage": "string|null",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Delivery Request Model

```json
{
  "id": "uuid",
  "userId": "uuid",
  "pickupLocation": "string",
  "dropoffLocation": "string",
  "itemDescription": "string",
  "itemSize": "small|medium|large",
  "priority": "low|normal|high|urgent",
  "paymentAmount": "number",
  "pickupDate": "datetime",
  "pickupTime": "string",
  "contactInfo": "string",
  "specialInstructions": "string|null",
  "status": "pending|matched|in_transit|delivered|cancelled",
  "matchedTripId": "uuid|null",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Trip Model

```json
{
  "id": "uuid",
  "travelerId": "uuid",
  "fromLocation": "string",
  "toLocation": "string",
  "departureTime": "datetime",
  "transportMethod": "car|motorcycle|bicycle|walking|public_transport",
  "maxDeliveries": "number",
  "currentDeliveries": "number",
  "pricePerDelivery": "number",
  "isRecurring": "boolean",
  "status": "active|completed|cancelled",
  "description": "string|null",
  "contactInfo": "string|null",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

## Error Handling

### Common Error Responses

#### Validation Error (400)

```json
{
  "error": "Bad Request",
  "message": "firstName is required"
}
```

#### Authentication Error (401)

```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

#### KNUST Email Error (400)

```json
{
  "error": "Bad Request",
  "message": "Only KNUST student emails (@st.knust.edu.gh) are allowed"
}
```

#### Resource Not Found (404)

```json
{
  "error": "Not Found",
  "message": "Trip not found"
}
```

#### Conflict Error (409)

```json
{
  "error": "Conflict",
  "message": "User with this email already exists"
}
```

---

## Usage Examples

### JavaScript/Fetch

```javascript
// Register new user
const registerUser = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookies
      body: JSON.stringify({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@st.knust.edu.gh",
        password: "securePassword123",
        studentId: "20230001",
        phoneNumber: "+233123456789",
      }),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Registration failed:", error);
  }
};

// Create delivery request
const createDeliveryRequest = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/delivery-requests/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          pickupLocation: "Central Cafeteria",
          dropoffLocation: "Unity Hall",
          itemDescription: "Food delivery",
          itemSize: "medium",
          priority: "normal",
          paymentAmount: 15.5,
          pickupDate: "2025-01-15",
          pickupTime: "14:30",
          contactInfo: "Call when you arrive",
        }),
      }
    );

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Request failed:", error);
  }
};
```

### cURL Examples

```bash
# Register user
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@st.knust.edu.gh",
    "password": "securePassword123",
    "studentId": "20230001",
    "phoneNumber": "+233123456789"
  }'

# Get delivery requests
curl -X GET "http://localhost:8080/api/delivery-requests?page=1&limit=10"

# Create trip (requires authentication)
curl -X POST http://localhost:8080/api/trips/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "fromLocation": "Kumasi",
    "toLocation": "Accra",
    "departureDate": "2025-01-15",
    "departureTime": "08:00",
    "availableSeats": 5,
    "pricePerDelivery": 20.00,
    "vehicleType": "car"
  }'
```

---

## Rate Limiting

The API may implement rate limiting in the future. Current limits:

- **No limits** in development
- **Production limits** TBD

---

## Important Notes

1. **Email Restriction**: Only `@st.knust.edu.gh` emails are accepted for registration
2. **Authentication**: JWT tokens are stored as HTTP-only cookies by default
3. **CORS**: Configured for `http://localhost:3000` in development
4. **Validation**: All input data is validated before processing
5. **Pagination**: Default limit is 10, maximum is 100 items per page
6. **Timestamps**: All timestamps are in ISO 8601 format with timezone

---

## Support

For API support or questions:

- **Email**: support@campusconnect.knust.edu.gh
- **GitHub**: [Repository Issues](https://github.com/your-org/campus-connect/issues)

**Version**: 1.0.0  
**Last Updated**: January 2025
