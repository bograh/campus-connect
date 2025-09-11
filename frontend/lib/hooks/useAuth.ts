import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService, handleApiError, ApiError } from "@/lib/api";
import type {
  User,
  CreateUserRequest,
  LoginRequest,
  UpdateProfileRequest,
} from "@/lib/types/api";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    loadUser();

    const timeout = setTimeout(() => {
      if (authState.loading) {
        console.log("useAuth: Timeout reached, stopping loading");
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: "",
        }));
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const loadUser = async () => {
    try {
      console.log("useAuth: Starting loadUser");
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      console.log("useAuth: Token exists:", !!token);

      if (!token) {
        console.log("useAuth: No token found, setting user to null");
        setAuthState((prev) => ({ ...prev, user: null, loading: false }));
        return;
      }

      console.log("useAuth: Fetching current user");
      const user = await authService.getCurrentUser();
      console.log("useAuth: User loaded successfully:", user?.firstName);
      setAuthState((prev) => ({ ...prev, user, loading: false }));
    } catch (error) {
      console.error("useAuth: loadUser failed:", error);
      // Only clear token on 401 errors from the /me endpoint specifically
      // Don't clear token for network errors or other API failures
      if (error instanceof ApiError && error.status === 401) {
        console.log(
          "useAuth: 401 error from /me endpoint, removing invalid token"
        );
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
        }
        setAuthState((prev) => ({
          ...prev,
          user: null,
          loading: false,
          error: handleApiError(error),
        }));
      } else {
        // For other errors, don't clear the user but show the error
        console.log("useAuth: Non-401 error, keeping current auth state");
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: handleApiError(error),
        }));
      }
    }
  };

  const signUp = async (userData: CreateUserRequest) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await authService.signUp(userData);
      if (response && (response as any).token) {
        localStorage.setItem("auth_token", (response as any).token);
      }

      await loadUser();

      return response;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const signIn = async (credentials: LoginRequest) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await authService.signIn(credentials);
      if (response && (response as any).token) {
        localStorage.setItem("auth_token", (response as any).token);
      }

      await loadUser();

      return response;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.logout();
      localStorage.removeItem("auth_token");
      setAuthState({ user: null, loading: false, error: null });
      router.push("/");
    } catch (error) {
      const errorMessage = handleApiError(error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const updateProfile = async (updates: UpdateProfileRequest) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await authService.updateProfile(updates);

      await loadUser();

      return response;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  const uploadVerificationDocument = async (
    docType: "student_id" | "selfie" | "other",
    file: File
  ) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.uploadVerificationDocument(docType, file);
      await loadUser();
    } catch (error) {
      const errorMessage = handleApiError(error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.verifyEmail(email, code);
      await loadUser();
    } catch (error) {
      const errorMessage = handleApiError(error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const isAuthenticated = !!authState.user;
  const isVerified = authState.user?.verificationStatus === "approved";

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated,
    isVerified,
    signUp,
    signIn,
    logout,
    updateProfile,
    uploadVerificationDocument,
    verifyEmail,
    loadUser,
    clearError,
  };
}
