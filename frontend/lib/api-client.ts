// API client utility functions
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication methods
  async signup(userData: any) {
    return this.request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async signin(email: string, password: string) {
    return this.request("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request("/api/auth/me");
  }

  async updateProfile(profileData: any) {
    return this.request("/api/auth/update-profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async logout() {
    return this.request("/api/auth/logout", {
      method: "POST",
    });
  }

  // Trip methods
  async getTrips(page = 1, limit = 10) {
    return this.request(`/api/trips?page=${page}&limit=${limit}`);
  }

  async createTrip(tripData: any) {
    return this.request("/api/trips/create", {
      method: "POST",
      body: JSON.stringify(tripData),
    });
  }

  async joinTrip(tripId: string) {
    return this.request("/api/trips/join", {
      method: "POST",
      body: JSON.stringify({ tripId }),
    });
  }

  async leaveTrip(tripId: string) {
    return this.request("/api/trips/leave", {
      method: "DELETE",
      body: JSON.stringify({ tripId }),
    });
  }

  // Delivery request methods
  async getDeliveryRequests(page = 1, limit = 10) {
    return this.request(`/api/delivery-requests?page=${page}&limit=${limit}`);
  }

  async createDeliveryRequest(requestData: any) {
    return this.request("/api/delivery-requests/create", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  }

  async offerDelivery(deliveryRequestId: string, tripId: string) {
    return this.request("/api/delivery-requests/offer", {
      method: "POST",
      body: JSON.stringify({ deliveryRequestId, tripId }),
    });
  }

  async cancelDeliveryOffer(deliveryRequestId: string, tripId: string) {
    return this.request("/api/delivery-requests/cancel", {
      method: "DELETE",
      body: JSON.stringify({ deliveryRequestId, tripId }),
    });
  }
}

// Export a default instance
export const apiClient = new ApiClient();
