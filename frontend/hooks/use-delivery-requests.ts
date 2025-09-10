import { useState } from "react";

interface DeliveryRequest {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
  };
  requesterName: string;
  pickupLocation: {
    type: string;
    campusLocation?: string;
    offCampusAddress?: string;
  };
  dropoffLocation: {
    type: string;
    campusLocation?: string;
    offCampusAddress?: string;
  };
  itemDescription: string;
  itemSize: string;
  priority: string;
  paymentAmount: number;
  pickupDate: string;
  pickupTime: string;
  contactInfo: string;
  specialInstructions: string;
  status: string;
  matchedTripId?: string;
}

export function useDeliveryRequests() {
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const fetchDeliveryRequests = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/delivery-requests?page=${page}&limit=${limit}`
      );
      if (response.ok) {
        const data = await response.json();
        setDeliveryRequests(data.deliveryRequests);
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error("Error fetching delivery requests:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createDeliveryRequest = async (requestData: any) => {
    try {
      const response = await fetch("/api/delivery-requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, deliveryRequest: data.deliveryRequest };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      console.error("Create delivery request error:", error);
      return { success: false, error: "Network error" };
    }
  };

  const offerDelivery = async (deliveryRequestId: string, tripId: string) => {
    try {
      const response = await fetch("/api/delivery-requests/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryRequestId, tripId }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      console.error("Offer delivery error:", error);
      return { success: false, error: "Network error" };
    }
  };

  const cancelDeliveryOffer = async (
    deliveryRequestId: string,
    tripId: string
  ) => {
    try {
      const response = await fetch("/api/delivery-requests/cancel", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryRequestId, tripId }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      console.error("Cancel delivery offer error:", error);
      return { success: false, error: "Network error" };
    }
  };

  return {
    deliveryRequests,
    loading,
    fetchDeliveryRequests,
    createDeliveryRequest,
    offerDelivery,
    cancelDeliveryOffer,
  };
}
