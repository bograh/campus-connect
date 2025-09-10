import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService, handleApiError } from "@/lib/api";
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

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const user = await authService.getCurrentUser();
      setAuthState((prev) => ({ ...prev, user, loading: false }));
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        user: null,
        loading: false,
        error: handleApiError(error),
      }));
    }
  };

  const signUp = async (userData: CreateUserRequest) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await authService.signUp(userData);

      // After successful signup, load the full user data
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

      // After successful signin, load the full user data
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

      // Reload user data after update
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
    loadUser,
    clearError,
  };
}
