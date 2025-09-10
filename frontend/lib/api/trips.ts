import { apiClient } from "./client";
import {
  Trip,
  CreateTripRequest,
  JoinTripRequest,
  LeaveTripRequest,
  PaginatedTrips,
} from "@/lib/types/api";

export interface CreateTripResponse {
  message: string;
  trip: Trip;
}

export interface TripsParams {
  page?: number;
  limit?: number;
}

export class TripsService {
  /**
   * Get paginated list of active trips
   * Public endpoint with optional authentication
   */
  async getTrips(params?: TripsParams): Promise<PaginatedTrips> {
    const searchParams: Record<string, string> = {};

    if (params?.page) {
      searchParams.page = params.page.toString();
    }
    if (params?.limit) {
      searchParams.limit = params.limit.toString();
    }

    const response = await apiClient.get<PaginatedTrips>(
      "/api/trips",
      searchParams
    );

    return {
      trips: response?.trips || [],
      totalTrips: response?.totalTrips || 0,
      currentPage: response?.currentPage || 1,
      totalPages: response?.totalPages || 1,
    };
  }

  /**
   * Create a new trip offering
   * Requires authentication
   */
  async createTrip(tripData: CreateTripRequest): Promise<CreateTripResponse> {
    return apiClient.post<CreateTripResponse>("/api/trips/create", tripData);
  }

  /**
   * Join an existing trip as a passenger
   * Requires authentication
   */
  async joinTrip(joinData: JoinTripRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/api/trips/join", joinData);
  }

  /**
   * Leave a trip you've joined
   * Requires authentication
   */
  async leaveTrip(leaveData: LeaveTripRequest): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>("/api/trips/leave", leaveData);
  }

  /**
   * Get trips created by the authenticated user
   * Requires authentication
   */
  async getMyTrips(): Promise<Trip[]> {
    const response = await apiClient.get<Trip[]>("/api/trips/my-trips");
    return Array.isArray(response) ? response : [];
  }

  /**
   * Helper method to get trips with default pagination
   */
  async getTripsPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedTrips> {
    return this.getTrips({ page, limit });
  }

  /**
   * Helper method to create trip with validation
   */
  async createValidatedTrip(
    tripData: CreateTripRequest
  ): Promise<CreateTripResponse> {
    // Add any client-side validation here
    if (tripData.availableSeats <= 0) {
      throw new Error("Available seats must be greater than 0");
    }

    if (tripData.pricePerDelivery < 0) {
      throw new Error("Price per delivery must be positive");
    }

    // Validate departure date is in the future
    const departureDateTime = new Date(
      `${tripData.departureDate}T${tripData.departureTime}`
    );
    if (departureDateTime <= new Date()) {
      throw new Error("Departure time must be in the future");
    }

    return this.createTrip(tripData);
  }

  /**
   * Helper method to check if user can join a trip
   */
  canJoinTrip(
    trip: Trip,
    currentUserId?: string
  ): { canJoin: boolean; reason?: string } {
    if (!currentUserId) {
      return { canJoin: false, reason: "Authentication required" };
    }

    if (trip.travelerId === currentUserId) {
      return { canJoin: false, reason: "Cannot join your own trip" };
    }

    if (trip.currentDeliveries >= trip.maxDeliveries) {
      return { canJoin: false, reason: "Trip is full" };
    }

    if (trip.status !== "active") {
      return { canJoin: false, reason: "Trip is not active" };
    }

    // Check if departure time has passed
    const departureTime = new Date(trip.departureTime);
    if (departureTime <= new Date()) {
      return { canJoin: false, reason: "Trip departure time has passed" };
    }

    // Check if user is already joined (if joinedUsers is populated)
    if (trip.joinedUsers?.some((user) => user.id === currentUserId)) {
      return { canJoin: false, reason: "Already joined this trip" };
    }

    return { canJoin: true };
  }

  /**
   * Helper method to format departure time for display
   */
  formatDepartureTime(departureTime: string): string {
    const date = new Date(departureTime);
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Helper method to calculate available spots
   */
  getAvailableSpots(trip: Trip): number {
    return Math.max(0, trip.maxDeliveries - trip.currentDeliveries);
  }
}

// Default trips service instance
export const tripsService = new TripsService();
