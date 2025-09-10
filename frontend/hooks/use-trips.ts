import { useState } from "react";

interface Trip {
  _id: string;
  travelerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
  };
  travelerName: string;
  fromLocation: {
    type: string;
    campusLocation?: string;
    offCampusAddress?: string;
  };
  toLocation: {
    type: string;
    campusLocation?: string;
    offCampusAddress?: string;
  };
  departureTime: string;
  transportMethod: string;
  maxDeliveries: number;
  currentDeliveries: number;
  pricePerDelivery: number;
  status: string;
  joinedUsers: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
  }>;
}

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrips = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/trips?page=${page}&limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        setTrips(data.trips);
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData: any) => {
    try {
      const response = await fetch("/api/trips/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, trip: data.trip };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      console.error("Create trip error:", error);
      return { success: false, error: "Network error" };
    }
  };

  const joinTrip = async (tripId: string) => {
    try {
      const response = await fetch("/api/trips/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      console.error("Join trip error:", error);
      return { success: false, error: "Network error" };
    }
  };

  const leaveTrip = async (tripId: string) => {
    try {
      const response = await fetch("/api/trips/leave", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      console.error("Leave trip error:", error);
      return { success: false, error: "Network error" };
    }
  };

  return { trips, loading, fetchTrips, createTrip, joinTrip, leaveTrip };
}
