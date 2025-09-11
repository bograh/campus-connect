import { useState, useEffect } from "react";
import { deliveryRequestsService, handleApiError } from "@/lib/api";
import type {
  DeliveryRequest,
  CreateDeliveryRequestRequest,
  OfferDeliveryRequest,
  CancelDeliveryRequest,
  PaginatedDeliveryRequests,
} from "@/lib/types/api";

interface DeliveryRequestsState {
  requests: DeliveryRequest[];
  totalRequests: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

interface UseDeliveryRequestsOptions {
  page?: number;
  limit?: number;
  autoLoad?: boolean;
}

export function useDeliveryRequests(options: UseDeliveryRequestsOptions = {}) {
  const { page = 1, limit = 10, autoLoad = true } = options;

  const [state, setState] = useState<DeliveryRequestsState>({
    requests: [],
    totalRequests: 0,
    currentPage: 1,
    totalPages: 0,
    loading: false,
    error: null,
  });

  // Load delivery requests
  const loadDeliveryRequests = async (pageNum?: number, limitNum?: number) => {
    try {
      console.log("useDeliveryRequests: Loading requests", {
        pageNum,
        limitNum,
      });
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const data = await deliveryRequestsService.getDeliveryRequests({
        page: pageNum || page,
        limit: limitNum || limit,
      });

      console.log("useDeliveryRequests: Loaded successfully", {
        count: data?.deliveryRequests?.length || 0,
      });
      setState((prev) => ({
        ...prev,
        requests: data.deliveryRequests,
        totalRequests: data.totalRequests,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        loading: false,
      }));
    } catch (error) {
      console.error("useDeliveryRequests: Load failed", error);
      // Don't let delivery request API errors affect authentication
      // The browse requests endpoint is public and should not cause auth issues
      const errorMessage = handleApiError(error);
      console.log("useDeliveryRequests: Error details", {
        error,
        errorMessage,
      });
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  // Create new delivery request
  const createDeliveryRequest = async (
    requestData: CreateDeliveryRequestRequest
  ) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await deliveryRequestsService.createDeliveryRequest(
        requestData
      );

      // Reload the requests list
      await loadDeliveryRequests();

      return response;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: handleApiError(error),
      }));
      throw error;
    }
  };

  // Offer to deliver a request
  const offerDelivery = async (offerData: OfferDeliveryRequest) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await deliveryRequestsService.offerDelivery(offerData);

      // Reload the requests list
      await loadDeliveryRequests();

      return response;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: handleApiError(error),
      }));
      throw error;
    }
  };

  // Cancel delivery offer
  const cancelDeliveryOffer = async (cancelData: CancelDeliveryRequest) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await deliveryRequestsService.cancelDeliveryOffer(
        cancelData
      );

      // Reload the requests list
      await loadDeliveryRequests();

      return response;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: handleApiError(error),
      }));
      throw error;
    }
  };

  // Load next page
  const loadNextPage = () => {
    if (state.currentPage < state.totalPages) {
      loadDeliveryRequests(state.currentPage + 1);
    }
  };

  // Load previous page
  const loadPreviousPage = () => {
    if (state.currentPage > 1) {
      loadDeliveryRequests(state.currentPage - 1);
    }
  };

  // Go to specific page
  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= state.totalPages) {
      loadDeliveryRequests(pageNum);
    }
  };

  // Clear error
  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadDeliveryRequests();
    }
  }, [page, limit, autoLoad]);

  return {
    requests: state.requests,
    totalRequests: state.totalRequests,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    loading: state.loading,
    error: state.error,
    hasNextPage: state.currentPage < state.totalPages,
    hasPreviousPage: state.currentPage > 1,
    loadDeliveryRequests,
    createDeliveryRequest,
    offerDelivery,
    cancelDeliveryOffer,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    clearError,
    refresh: () => loadDeliveryRequests(),
  };
}

interface UseDeliveryRequestOptions {
  requestId: string;
  autoLoad?: boolean;
}

interface DeliveryRequestState {
  request: DeliveryRequest | null;
  loading: boolean;
  error: string | null;
}

export function useDeliveryRequest(options: UseDeliveryRequestOptions) {
  const [state, setState] = useState<DeliveryRequestState>({
    request: null,
    loading: false,
    error: null,
  });

  const loadDeliveryRequest = async () => {
    if (!options.requestId) return;

    try {
      console.log("useDeliveryRequest: Loading request", options.requestId);
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const request = await deliveryRequestsService.getDeliveryRequestById(
        options.requestId
      );
      console.log(
        "useDeliveryRequest: Loaded successfully",
        request.itemDescription
      );
      setState((prev) => ({ ...prev, request, loading: false }));
    } catch (error) {
      console.error("useDeliveryRequest: Load failed", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: handleApiError(error),
      }));
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const refresh = () => {
    loadDeliveryRequest();
  };

  // Auto-load on mount if enabled
  useEffect(() => {
    if (options.autoLoad !== false && options.requestId) {
      loadDeliveryRequest();
    }
  }, [options.requestId]);

  return {
    request: state.request,
    loading: state.loading,
    error: state.error,
    loadDeliveryRequest,
    clearError,
    refresh,
  };
}
