package middleware

import (
	"context"
	"net/http"
	"strings"

	"campus-connect/internal/auth"
	"campus-connect/internal/models"
	"campus-connect/internal/utils"
)

type contextKey string

const UserContextKey contextKey = "user"

type AuthMiddleware struct {
	authService *auth.AuthService
}

func NewAuthMiddleware(authService *auth.AuthService) *AuthMiddleware {
	return &AuthMiddleware{
		authService: authService,
	}
}

func (am *AuthMiddleware) RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var tokenString string

		if cookie, err := r.Cookie("auth-token"); err == nil {
			tokenString = cookie.Value
		} else {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				utils.WriteErrorResponse(w, http.StatusUnauthorized, "Authentication required")
				return
			}

			bearerToken := strings.Split(authHeader, " ")
			if len(bearerToken) != 2 || bearerToken[0] != "Bearer" {
				utils.WriteErrorResponse(w, http.StatusUnauthorized, "Invalid authorization header format")
				return
			}
			tokenString = bearerToken[1]
		}

		claims, err := am.authService.ValidateToken(tokenString)
		if err != nil {
			if err == auth.ErrTokenExpired {
				utils.WriteErrorResponse(w, http.StatusUnauthorized, "Token expired")
			} else {
				utils.WriteErrorResponse(w, http.StatusUnauthorized, "Invalid token")
			}
			return
		}

		user := &models.User{
			ID:                 claims.UserID,
			Email:              claims.Email,
			VerificationStatus: claims.VerificationStatus,
		}

		ctx := context.WithValue(r.Context(), UserContextKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (am *AuthMiddleware) OptionalAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var tokenString string

		if cookie, err := r.Cookie("auth-token"); err == nil {
			tokenString = cookie.Value
		} else {
			authHeader := r.Header.Get("Authorization")
			if authHeader != "" {
				bearerToken := strings.Split(authHeader, " ")
				if len(bearerToken) == 2 && bearerToken[0] == "Bearer" {
					tokenString = bearerToken[1]
				}
			}
		}

		if tokenString != "" {
			if claims, err := am.authService.ValidateToken(tokenString); err == nil {
				user := &models.User{
					ID:                 claims.UserID,
					Email:              claims.Email,
					VerificationStatus: claims.VerificationStatus,
				}
				ctx := context.WithValue(r.Context(), UserContextKey, user)
				r = r.WithContext(ctx)
			}
		}

		next.ServeHTTP(w, r)
	})
}

func GetUserFromContext(r *http.Request) (*models.User, bool) {
	user, ok := r.Context().Value(UserContextKey).(*models.User)
	return user, ok
}
