// API Response Types
export interface ApiResponse<T = any> {
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
}

// User Types
export type VerificationStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  phoneNumber: string;
  phoneVerified: boolean;
  gender: string | null;
  indexNumber: string | null;
  programmeOfStudy: string | null;
  currentYear: number | null;
  verificationStatus: VerificationStatus;
  rating: number;
  totalDeliveries: number;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  studentId: string;
  phoneNumber: string;
  gender?: string;
  indexNumber?: string;
  programmeOfStudy?: string;
  currentYear?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  gender?: string;
  indexNumber?: string;
  programmeOfStudy?: string;
  currentYear?: number;
}

// Delivery Request Types
export type DeliveryStatus =
  | "pending"
  | "matched"
  | "in_transit"
  | "delivered"
  | "cancelled";
export type ItemSize = "small" | "medium" | "large";
export type Priority = "low" | "normal" | "high" | "urgent";

export interface DeliveryRequest {
  id: string;
  userId: string;
  pickupLocation: string;
  dropoffLocation: string;
  itemDescription: string;
  itemSize: ItemSize;
  priority: Priority;
  paymentAmount: number;
  pickupDate: string;
  pickupTime: string;
  contactInfo: string;
  specialInstructions: string | null;
  status: DeliveryStatus;
  matchedTripId: string | null;
  createdAt: string;
  updatedAt: string;
  requesterName?: string;
  user?: User;
}

export interface CreateDeliveryRequestRequest {
  pickupLocation: string;
  dropoffLocation: string;
  itemDescription: string;
  itemSize: ItemSize;
  priority?: Priority;
  paymentAmount: number;
  pickupDate: string;
  pickupTime: string;
  contactInfo: string;
  specialInstructions?: string;
}

export interface OfferDeliveryRequest {
  deliveryRequestId: string;
  tripId: string;
}

export interface CancelDeliveryRequest {
  deliveryRequestId: string;
  tripId: string;
}

// Trip Types
export type TripStatus = "active" | "completed" | "cancelled";
export type TransportMethod =
  | "car"
  | "motorcycle"
  | "bicycle"
  | "walking"
  | "public_transport";

export interface Trip {
  id: string;
  travelerId: string;
  fromLocation: string;
  toLocation: string;
  departureTime: string;
  transportMethod: TransportMethod;
  maxDeliveries: number;
  currentDeliveries: number;
  pricePerDelivery: number;
  isRecurring: boolean;
  status: TripStatus;
  description: string | null;
  contactInfo: string | null;
  createdAt: string;
  updatedAt: string;
  traveler?: User;
  travelerName?: string;
  joinedUsers?: User[];
  matchedRequests?: DeliveryRequest[];
}

export interface CreateTripRequest {
  fromLocation: string;
  toLocation: string;
  departureDate: string;
  departureTime: string;
  availableSeats: number;
  pricePerDelivery: number;
  vehicleType: TransportMethod;
  description?: string;
  contactInfo?: string;
}

export interface JoinTripRequest {
  tripId: string;
}

export interface LeaveTripRequest {
  tripId: string;
}

// Paginated Response Types
export interface PaginatedDeliveryRequests {
  deliveryRequests: DeliveryRequest[];
  totalRequests: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedTrips {
  trips: Trip[];
  totalTrips: number;
  currentPage: number;
  totalPages: number;
}

// Health Check Response
export interface HealthCheckResponse {
  status: string;
  service: string;
  version?: string;
  timestamp?: string;
}
