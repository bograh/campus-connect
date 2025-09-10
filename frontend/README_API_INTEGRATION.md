# CampusConnect Frontend API Integration

This document explains how to integrate the frontend with the Go backend API documented in `backend/API_USAGE.md`.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in the frontend root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 2. Basic Usage

```typescript
import { authService, useAuth } from "@/lib/api";

// In a React component
function LoginForm() {
  const { signIn, user, loading, error } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn({ email, password });
      // User is now authenticated
    } catch (error) {
      // Error handling is automatic
    }
  };

  // Component JSX...
}
```

## 📁 Project Structure

```
frontend/
├── lib/
│   ├── api/
│   │   ├── client.ts          # API client with error handling
│   │   ├── auth.ts            # Authentication service
│   │   ├── delivery-requests.ts # Delivery requests service
│   │   ├── trips.ts           # Trips service
│   │   └── index.ts           # Exports all services
│   ├── hooks/
│   │   ├── useAuth.ts         # Authentication hook
│   │   ├── useDeliveryRequests.ts # Delivery requests hook
│   │   ├── useTrips.ts        # Trips hook
│   │   └── index.ts           # Exports all hooks
│   └── types/
│       └── api.ts             # TypeScript types from API
├── components/examples/       # Example components
└── app/api-examples/         # Demo page
```

## 🔧 API Services

### Authentication Service

```typescript
import { authService } from "@/lib/api";

// Register new user (only @st.knust.edu.gh emails)
const response = await authService.signUp({
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@st.knust.edu.gh",
  password: "securePassword123",
  studentId: "20230001",
  phoneNumber: "+233123456789",
});

// Login
await authService.signIn({
  email: "john.doe@st.knust.edu.gh",
  password: "securePassword123",
});

// Get current user
const user = await authService.getCurrentUser();

// Update profile
await authService.updateProfile({
  firstName: "Johnny",
  currentYear: 4,
});

// Logout
await authService.logout();
```

### Delivery Requests Service

```typescript
import { deliveryRequestsService } from "@/lib/api";

// Get paginated delivery requests (public)
const requests = await deliveryRequestsService.getDeliveryRequests({
  page: 1,
  limit: 10,
});

// Create delivery request (requires auth)
await deliveryRequestsService.createDeliveryRequest({
  pickupLocation: "Central Cafeteria",
  dropoffLocation: "Unity Hall",
  itemDescription: "Food delivery",
  itemSize: "medium",
  priority: "normal",
  paymentAmount: 15.5,
  pickupDate: "2025-01-15",
  pickupTime: "14:30",
  contactInfo: "Call when you arrive",
});

// Offer to deliver (requires auth)
await deliveryRequestsService.offerDelivery({
  deliveryRequestId: "request-uuid",
  tripId: "trip-uuid",
});
```

### Trips Service

```typescript
import { tripsService } from "@/lib/api";

// Get paginated trips (public)
const trips = await tripsService.getTrips({ page: 1, limit: 10 });

// Create trip (requires auth)
await tripsService.createTrip({
  fromLocation: "KNUST Campus",
  toLocation: "Kejetia Market",
  departureDate: "2025-01-15",
  departureTime: "08:00",
  availableSeats: 5,
  pricePerDelivery: 20.0,
  vehicleType: "car",
});

// Join trip (requires auth)
await tripsService.joinTrip({ tripId: "trip-uuid" });

// Get my trips (requires auth)
const myTrips = await tripsService.getMyTrips();
```

## 🎣 React Hooks

### useAuth Hook

```typescript
import { useAuth } from "@/lib/hooks";

function AuthComponent() {
  const {
    user, // Current user or null
    loading, // Loading state
    error, // Error message
    isAuthenticated, // Boolean
    isVerified, // User verification status
    signUp, // Register function
    signIn, // Login function
    logout, // Logout function
    updateProfile, // Update profile function
    clearError, // Clear error function
  } = useAuth();

  // Automatic user loading and state management
  // Authentication state persists across page refreshes
}
```

### useDeliveryRequests Hook

```typescript
import { useDeliveryRequests } from "@/lib/hooks";

function DeliveryRequestsComponent() {
  const {
    requests, // Array of delivery requests
    totalRequests, // Total count
    currentPage, // Current page number
    totalPages, // Total pages
    loading, // Loading state
    error, // Error message
    hasNextPage, // Boolean
    hasPreviousPage, // Boolean
    createDeliveryRequest, // Create function
    offerDelivery, // Offer function
    loadNextPage, // Pagination function
    loadPreviousPage, // Pagination function
    refresh, // Refresh data
  } = useDeliveryRequests({ page: 1, limit: 10 });

  // Automatic pagination and data management
}
```

### useTrips Hook

```typescript
import { useTrips, useMyTrips, useTripUtils } from "@/lib/hooks";

function TripsComponent() {
  const {
    trips,
    loading,
    createTrip,
    joinTrip,
    // ... other properties
  } = useTrips();

  const { myTrips } = useMyTrips();

  const { formatDepartureTime, getAvailableSpots, canJoinTrip } =
    useTripUtils();
}
```

## 🔒 Authentication

The API uses JWT tokens stored as HTTP-only cookies for security:

- Tokens are automatically included in requests
- No manual token management required
- Secure cookie-based authentication
- Automatic session handling

```typescript
// Authentication is handled automatically
const response = await fetch("/api/some-endpoint", {
  credentials: "include", // This is set automatically by the API client
});
```

## 🔍 TypeScript Types

All API responses are fully typed:

```typescript
import type {
  User,
  DeliveryRequest,
  Trip,
  CreateUserRequest,
  CreateDeliveryRequestRequest,
  CreateTripRequest,
} from "@/lib/types/api";

// Full IntelliSense support
const user: User = {
  id: "uuid",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@st.knust.edu.gh",
  // ... fully typed
};
```

## 🚨 Error Handling

Comprehensive error handling is built-in:

```typescript
import { handleApiError, ApiError } from "@/lib/api";

try {
  await authService.signIn(credentials);
} catch (error) {
  if (error instanceof ApiError) {
    console.log("Status:", error.status);
    console.log("Error:", error.error);
    console.log("Message:", error.message);
  }

  // Or use the utility function
  const message = handleApiError(error);
  showErrorToUser(message);
}
```

## 📄 Pagination

Built-in pagination support:

```typescript
const {
  requests,
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  loadNextPage,
  loadPreviousPage,
  goToPage,
} = useDeliveryRequests({ page: 1, limit: 20 });

// Navigation
<Button onClick={loadNextPage} disabled={!hasNextPage}>
  Next Page
</Button>;
```

## 🎨 Example Components

Check out the example components:

- `/app/api-examples` - Live demo page
- `/components/examples/auth-example.tsx` - Authentication UI
- `/components/examples/delivery-requests-example.tsx` - Full CRUD UI
- `/components/examples/trips-example.tsx` - Trip management UI

## 🔧 Configuration

### API Client Configuration

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Custom configuration
const client = new ApiClient("https://your-api-domain.com");
```

### Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:8080

# Optional
NEXT_PUBLIC_APP_NAME=CampusConnect
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🐛 Debugging

Enable debug mode by checking network requests:

```typescript
// The API client logs all requests in development
// Check browser dev tools -> Network tab
```

## 🚀 Production Deployment

1. Update `NEXT_PUBLIC_API_URL` to your production API URL
2. Ensure CORS is configured correctly in the Go backend
3. Verify SSL/TLS certificates for HTTPS
4. Test authentication flow in production environment

## 📚 Additional Resources

- [Backend API Documentation](../backend/API_USAGE.md)
- [Go Backend Setup](../backend/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Hooks Guide](https://react.dev/reference/react)

---

**Need help?** Check the example components or create an issue in the repository.
