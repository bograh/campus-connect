// API Constants and Configuration

// Base URLs
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// API Endpoints
export const API_ENDPOINTS = {
  // Health
  HEALTH: "/health",

  // Authentication
  AUTH: {
    SIGNUP: "/api/auth/signup",
    SIGNIN: "/api/auth/signin",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
    UPDATE_PROFILE: "/api/auth/update-profile",
  },

  // Delivery Requests
  DELIVERY_REQUESTS: {
    LIST: "/api/delivery-requests",
    CREATE: "/api/delivery-requests/create",
    OFFER: "/api/delivery-requests/offer",
    CANCEL: "/api/delivery-requests/cancel",
  },

  // Trips
  TRIPS: {
    LIST: "/api/trips",
    CREATE: "/api/trips/create",
    JOIN: "/api/trips/join",
    LEAVE: "/api/trips/leave",
    MY_TRIPS: "/api/trips/my-trips",
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Validation Constants
export const VALIDATION = {
  // Email domain restriction
  KNUST_EMAIL_DOMAIN: "@st.knust.edu.gh",

  // Password requirements
  MIN_PASSWORD_LENGTH: 6,

  // Pagination limits
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // Payment limits
  MIN_PAYMENT_AMOUNT: 0,
  MAX_PAYMENT_AMOUNT: 1000,

  // Trip limits
  MIN_AVAILABLE_SEATS: 1,
  MAX_AVAILABLE_SEATS: 20,
} as const;

// Default Values
export const DEFAULTS = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
  },
  PRIORITY: "normal" as const,
  ITEM_SIZE: "medium" as const,
  TRANSPORT_METHOD: "car" as const,
} as const;

// Request Configuration
export const REQUEST_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Cookie Configuration
export const COOKIE_CONFIG = {
  AUTH_TOKEN_NAME: "auth-token",
  MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  SAME_SITE: "strict" as const,
  HTTP_ONLY: true,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network request failed. Please check your connection.",
  UNAUTHORIZED: "Authentication required. Please log in.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  CONFLICT: "This resource already exists.",
  SERVER_ERROR: "An internal server error occurred. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  KNUST_EMAIL_REQUIRED:
    "Only KNUST student emails (@st.knust.edu.gh) are allowed",
  TRIP_FULL: "This trip is already full",
  INVALID_CREDENTIALS: "Invalid email or password",
  GENERIC_ERROR: "An unexpected error occurred",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: "User created successfully",
  LOGIN_SUCCESSFUL: "Login successful",
  LOGOUT_SUCCESSFUL: "Logout successful",
  PROFILE_UPDATED: "Profile updated successfully",
  DELIVERY_REQUEST_CREATED: "Delivery request created successfully",
  TRIP_CREATED: "Trip created successfully",
  TRIP_JOINED: "Successfully joined trip",
  TRIP_LEFT: "Successfully left trip",
  DELIVERY_OFFERED: "Delivery offer made successfully",
  DELIVERY_CANCELLED: "Delivery offer cancelled successfully",
} as const;

// Item Sizes and their display names
export const ITEM_SIZES = {
  small: { label: "Small", description: "Documents, small packages" },
  medium: { label: "Medium", description: "Food delivery, books" },
  large: { label: "Large", description: "Shopping bags, electronics" },
} as const;

// Priority levels and their display properties
export const PRIORITY_LEVELS = {
  low: { label: "Low", color: "gray", urgent: false },
  normal: { label: "Normal", color: "blue", urgent: false },
  high: { label: "High", color: "orange", urgent: true },
  urgent: { label: "Urgent", color: "red", urgent: true },
} as const;

// Transport methods and their display properties
export const TRANSPORT_METHODS = {
  car: { label: "Car", icon: "🚗", capacity: "high" },
  motorcycle: { label: "Motorcycle", icon: "🏍️", capacity: "medium" },
  bicycle: { label: "Bicycle", icon: "🚴", capacity: "low" },
  walking: { label: "Walking", icon: "🚶", capacity: "low" },
  public_transport: { label: "Public Transport", icon: "🚌", capacity: "high" },
} as const;

// Verification statuses and their display properties
export const VERIFICATION_STATUS = {
  pending: {
    label: "Pending",
    color: "yellow",
    description: "Verification in progress",
  },
  approved: {
    label: "Approved",
    color: "green",
    description: "Account verified",
  },
  rejected: {
    label: "Rejected",
    color: "red",
    description: "Verification failed",
  },
} as const;

// Trip and delivery statuses
export const DELIVERY_STATUS = {
  pending: {
    label: "Pending",
    color: "blue",
    description: "Waiting for traveler",
  },
  matched: {
    label: "Matched",
    color: "orange",
    description: "Traveler assigned",
  },
  in_transit: {
    label: "In Transit",
    color: "purple",
    description: "Being delivered",
  },
  delivered: {
    label: "Delivered",
    color: "green",
    description: "Successfully delivered",
  },
  cancelled: {
    label: "Cancelled",
    color: "red",
    description: "Delivery cancelled",
  },
} as const;

export const TRIP_STATUS = {
  active: {
    label: "Active",
    color: "green",
    description: "Available for joining",
  },
  completed: {
    label: "Completed",
    color: "blue",
    description: "Trip finished",
  },
  cancelled: {
    label: "Cancelled",
    color: "red",
    description: "Trip cancelled",
  },
} as const;
