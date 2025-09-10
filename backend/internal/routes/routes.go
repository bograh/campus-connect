package routes

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"campus-connect/internal/auth"
	"campus-connect/internal/database"
	"campus-connect/internal/handlers"
	"campus-connect/internal/middleware"
	"campus-connect/internal/repositories"
	"campus-connect/internal/services"
)

func SetupRoutes(
	db *database.DB,
	authService *auth.AuthService,
	cloudinaryService *services.CloudinaryService,
) http.Handler {
	r := chi.NewRouter()

	r.Use(chiMiddleware.Logger)
	r.Use(chiMiddleware.Recoverer)
	r.Use(chiMiddleware.RequestID)
	r.Use(chiMiddleware.RealIP)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "Cookie"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	userRepo := repositories.NewUserRepository(db)
	deliveryRepo := repositories.NewDeliveryRepository(db)
	tripRepo := repositories.NewTripRepository(db)

	authHandler := handlers.NewAuthHandler(userRepo, authService).WithCloudinary(cloudinaryService)
	deliveryHandler := handlers.NewDeliveryHandler(deliveryRepo, tripRepo)
	tripHandler := handlers.NewTripHandler(tripRepo)

	authMiddleware := middleware.NewAuthMiddleware(authService)

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"campus-connect-api", "version":"1.0.0", "timestamp":"` + time.Now().Format(time.RFC3339) + `"}`))
	})

	r.Route("/api", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Post("/signup", authHandler.SignUp)
			r.Post("/signin", authHandler.SignIn)
			r.Post("/logout", authHandler.Logout)

			r.Group(func(r chi.Router) {
				r.Use(authMiddleware.RequireAuth)
				r.Get("/me", authHandler.Me)
				r.Put("/update-profile", authHandler.UpdateProfile)
				r.Post("/upload-verification", authHandler.UploadVerificationDocument)
			})
		})

		r.Route("/delivery-requests", func(r chi.Router) {
			r.With(authMiddleware.OptionalAuth).Get("/", deliveryHandler.GetDeliveryRequests)

			r.Group(func(r chi.Router) {
				r.Use(authMiddleware.RequireAuth)
				r.Post("/create", deliveryHandler.CreateDeliveryRequest)
				r.Post("/offer", deliveryHandler.OfferDelivery)
				r.Delete("/cancel", deliveryHandler.CancelDeliveryOffer)
			})
		})

		r.Route("/trips", func(r chi.Router) {
			r.With(authMiddleware.OptionalAuth).Get("/", tripHandler.GetTrips)

			r.Group(func(r chi.Router) {
				r.Use(authMiddleware.RequireAuth)
				r.Post("/create", tripHandler.CreateTrip)
				r.Post("/join", tripHandler.JoinTrip)
				r.Delete("/leave", tripHandler.LeaveTrip)
				r.Get("/my-trips", tripHandler.GetMyTrips)
			})
		})
	})

	return r
}
