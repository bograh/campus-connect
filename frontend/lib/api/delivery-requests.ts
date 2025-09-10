import { apiClient } from "./client";
import {
  DeliveryRequest,
  CreateDeliveryRequestRequest,
  OfferDeliveryRequest,
  CancelDeliveryRequest,
  PaginatedDeliveryRequests,
} from "@/lib/types/api";

export interface CreateDeliveryRequestResponse {
  message: string;
  deliveryRequest: DeliveryRequest;
}

export interface DeliveryRequestsParams {
  page?: number;
  limit?: number;
}

export class DeliveryRequestsService {
  /**
   * Get paginated list of pending delivery requests
   * Public endpoint with optional authentication
   */
  async getDeliveryRequests(
    params?: DeliveryRequestsParams
  ): Promise<PaginatedDeliveryRequests> {
    const searchParams: Record<string, string> = {};

    if (params?.page) {
      searchParams.page = params.page.toString();
    }
    if (params?.limit) {
      searchParams.limit = params.limit.toString();
    }

    const response = await apiClient.get<PaginatedDeliveryRequests>(
      "/api/delivery-requests",
      searchParams
    );

    return {
      deliveryRequests: response?.deliveryRequests || [],
      totalRequests: response?.totalRequests || 0,
      currentPage: response?.currentPage || 1,
      totalPages: response?.totalPages || 1,
    };
  }

  /**
   * Create a new delivery request
   * Requires authentication
   */
  async createDeliveryRequest(
    requestData: CreateDeliveryRequestRequest
  ): Promise<CreateDeliveryRequestResponse> {
    return apiClient.post<CreateDeliveryRequestResponse>(
      "/api/delivery-requests/create",
      requestData
    );
  }

  /**
   * Offer to fulfill a delivery request (traveler only)
   * Requires authentication
   */
  async offerDelivery(
    offerData: OfferDeliveryRequest
  ): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      "/api/delivery-requests/offer",
      offerData
    );
  }

  /**
   * Cancel a delivery offer (traveler only)
   * Requires authentication
   */
  async cancelDeliveryOffer(
    cancelData: CancelDeliveryRequest
  ): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(
      "/api/delivery-requests/cancel",
      cancelData
    );
  }

  /**
   * Helper method to get delivery requests with default pagination
   */
  async getDeliveryRequestsPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedDeliveryRequests> {
    return this.getDeliveryRequests({ page, limit });
  }

  /**
   * Helper method to create delivery request with validation
   */
  async createValidatedDeliveryRequest(
    requestData: CreateDeliveryRequestRequest
  ): Promise<CreateDeliveryRequestResponse> {
    // Validate KNUST email domain if needed (frontend validation)
    // Add any client-side validation here

    // Set default priority if not provided
    const validatedData: CreateDeliveryRequestRequest = {
      ...requestData,
      priority: requestData.priority || "normal",
    };

    return this.createDeliveryRequest(validatedData);
  }
}

// Default delivery requests service instance
export const deliveryRequestsService = new DeliveryRequestsService();
