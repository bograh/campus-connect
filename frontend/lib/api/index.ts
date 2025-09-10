// Export all API services and types
export * from "./client";
export * from "./auth";
export * from "./delivery-requests";
export * from "./trips";

// Re-export types for convenience
export type {
  User,
  DeliveryRequest,
  Trip,
  CreateUserRequest,
  LoginRequest,
  UpdateProfileRequest,
  CreateDeliveryRequestRequest,
  CreateTripRequest,
  PaginatedDeliveryRequests,
  PaginatedTrips,
  VerificationStatus,
  DeliveryStatus,
  ItemSize,
  Priority,
  TripStatus,
  TransportMethod,
  ApiResponse,
  ApiErrorResponse,
  HealthCheckResponse,
} from "../types/api";

// Export service instances
export { authService } from "./auth";
export { deliveryRequestsService } from "./delivery-requests";
export { tripsService } from "./trips";
export { apiClient, handleApiError } from "./client";
