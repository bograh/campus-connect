import { useState, useEffect } from "react";
import { tripsService, handleApiError } from "@/lib/api";
import type {
  Trip,
  CreateTripRequest,
  JoinTripRequest,
  LeaveTripRequest,
  PaginatedTrips,
} from "@/lib/types/api";

interface TripsState {
  trips: Trip[];
  totalTrips: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

interface MyTripsState {
  myTrips: Trip[];
  loading: boolean;
  error: string | null;
}

interface UseTripsOptions {
  page?: number;
  limit?: number;
  autoLoad?: boolean;
}

export function useTrips(options: UseTripsOptions = {}) {
  const { page = 1, limit = 10, autoLoad = true } = options;

  const [state, setState] = useState<TripsState>({
    trips: [],
    totalTrips: 0,
    currentPage: 1,
    totalPages: 0,
    loading: false,
    error: null,
  });

  // Load trips
  const loadTrips = async (pageNum?: number, limitNum?: number) => {
    try {
      console.log("useTrips: Loading trips", { pageNum, limitNum });
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const data = await tripsService.getTrips({
        page: pageNum || page,
        limit: limitNum || limit,
      });

      console.log("useTrips: Loaded successfully", {
        count: data?.trips?.length || 0,
      });
      setState((prev) => ({
        ...prev,
        trips: data.trips,
        totalTrips: data.totalTrips,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        loading: false,
      }));
    } catch (error) {
      console.error("useTrips: Load failed", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: handleApiError(error),
      }));
    }
  };

  // Create new trip
  const createTrip = async (tripData: CreateTripRequest) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await tripsService.createTrip(tripData);

      // Reload the trips list
      await loadTrips();

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

  // Join a trip
  const joinTrip = async (joinData: JoinTripRequest) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await tripsService.joinTrip(joinData);

      // Reload the trips list
      await loadTrips();

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

  // Leave a trip
  const leaveTrip = async (leaveData: LeaveTripRequest) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await tripsService.leaveTrip(leaveData);

      // Reload the trips list
      await loadTrips();

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
      loadTrips(state.currentPage + 1);
    }
  };

  // Load previous page
  const loadPreviousPage = () => {
    if (state.currentPage > 1) {
      loadTrips(state.currentPage - 1);
    }
  };

  // Go to specific page
  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= state.totalPages) {
      loadTrips(pageNum);
    }
  };

  // Clear error
  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadTrips();
    }
  }, [page, limit, autoLoad]);

  return {
    trips: state.trips,
    totalTrips: state.totalTrips,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    loading: state.loading,
    error: state.error,
    hasNextPage: state.currentPage < state.totalPages,
    hasPreviousPage: state.currentPage > 1,
    loadTrips,
    createTrip,
    joinTrip,
    leaveTrip,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    clearError,
    refresh: () => loadTrips(),
  };
}

export function useMyTrips() {
  const [state, setState] = useState<MyTripsState>({
    myTrips: [],
    loading: false,
    error: null,
  });

  const loadMyTrips = async () => {
    try {
      console.log("useMyTrips: Loading user trips");
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const trips = await tripsService.getMyTrips();

      setState((prev) => ({
        ...prev,
        myTrips: trips,
        loading: false,
      }));
    } catch (error) {
      console.error("useMyTrips: Load failed", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: handleApiError(error),
      }));
    }
  };

  // Clear error
  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  // Auto-load on mount
  useEffect(() => {
    loadMyTrips();
  }, []);

  return {
    myTrips: state.myTrips,
    loading: state.loading,
    error: state.error,
    loadMyTrips,
    clearError,
    refresh: loadMyTrips,
  };
}

// Hook for trip utilities
export function useTripUtils() {
  return {
    canJoinTrip: tripsService.canJoinTrip,
    formatDepartureTime: tripsService.formatDepartureTime,
    getAvailableSpots: tripsService.getAvailableSpots,
  };
}
