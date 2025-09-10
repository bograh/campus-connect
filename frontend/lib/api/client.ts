import { ApiErrorResponse } from "@/lib/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class ApiError extends Error {
  constructor(public status: number, public error: string, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const isFormData = options.body instanceof FormData;
    const headers: HeadersInit = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    };

    const config: RequestInit = {
      headers,
      credentials: "include",
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ApiErrorResponse;
        throw new ApiError(
          response.status,
          errorData.error || "Unknown Error",
          errorData.message || "An error occurred"
        );
      }

      if (data.data !== undefined) {
        return data.data as T;
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        0,
        "Network Error",
        error instanceof Error ? error.message : "Network request failed"
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;
    return this.request<T>(endpoint, {
      method: "POST",
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;
    return this.request<T>(endpoint, {
      method: "PUT",
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, data?: any): Promise<T> {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;
    return this.request<T>(endpoint, {
      method: "DELETE",
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  }

  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.get<{ status: string; service: string }>("/health");
  }
}

export const apiClient = new ApiClient();

export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};
