import { apiClient } from "./client";
import {
  User,
  CreateUserRequest,
  LoginRequest,
  UpdateProfileRequest,
  ApiResponse,
} from "@/lib/types/api";

export interface SignUpResponse {
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
    verificationStatus: string;
  };
}

export interface SignInResponse {
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    verificationStatus: string;
  };
}

export interface MeResponse {
  user: User;
}

export interface UpdateProfileResponse {
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
    verificationStatus: string;
    gender: string | null;
    indexNumber: string | null;
    programmeOfStudy: string | null;
    currentYear: number | null;
  };
}

export class AuthService {
  /**
   * Register a new KNUST student account
   * Only @st.knust.edu.gh emails are accepted
   */
  async signUp(userData: CreateUserRequest): Promise<SignUpResponse> {
    return apiClient.post<SignUpResponse>("/api/auth/signup", userData);
  }

  /**
   * Authenticate user and receive JWT token
   * Token is stored as HTTP-only cookie automatically
   */
  async signIn(credentials: LoginRequest): Promise<SignInResponse> {
    return apiClient.post<SignInResponse>("/api/auth/signin", credentials);
  }

  /**
   * Logout user and clear authentication token
   */
  async logout(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/api/auth/logout");
  }

  /**
   * Get current authenticated user's profile information
   */
  async me(): Promise<MeResponse> {
    return apiClient.get<MeResponse>("/api/auth/me");
  }

  /**
   * Update user profile information
   */
  async updateProfile(
    updates: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    return apiClient.put<UpdateProfileResponse>(
      "/api/auth/update-profile",
      updates
    );
  }

  /**
   * Check if user is authenticated by trying to get current user
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.me();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current user or null if not authenticated
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.me();
      return response.user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Upload verification document (multipart/form-data)
   * docType: "student_id" | "selfie" | "other"
   */
  async uploadVerificationDocument(
    docType: "student_id" | "selfie" | "other",
    file: File
  ): Promise<{ url: string; docType: string }> {
    const formData = new FormData();
    formData.append("docType", docType);
    formData.append("file", file);

    return apiClient.post<{ url: string; docType: string }>(
      "/api/auth/upload-verification",
      formData as any
    );
  }
}

// Default auth service instance
export const authService = new AuthService();
