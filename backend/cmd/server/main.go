package main

import (
	"log"
	"net/http"

	"campus-connect/internal/auth"
	"campus-connect/internal/config"
	"campus-connect/internal/database"
	"campus-connect/internal/routes"
	"campus-connect/internal/services"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load configuration:", err)
	}

	db, err := database.NewConnection(cfg.Database)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	if err := db.RunMigrations("./migrations"); err != nil {
		log.Fatal("Failed to run database migrations:", err)
	}

	authService := auth.NewAuthService(cfg.JWT.Secret)

	var cloudinaryService *services.CloudinaryService
	if cfg.Cloudinary.CloudName != "" && cfg.Cloudinary.APIKey != "" && cfg.Cloudinary.APISecret != "" {
		cloudinaryService, err = services.NewCloudinaryService(cfg.Cloudinary)
		if err != nil {
			log.Printf("Warning: Failed to initialize Cloudinary service: %v", err)
		} else {
			log.Println("Cloudinary service initialized successfully")
		}
	} else {
		log.Println("Warning: Cloudinary credentials not provided, image uploads will not work")
	}

	handler := routes.SetupRoutes(db, authService, cloudinaryService, cfg)

	serverAddr := cfg.Server.Host + ":" + cfg.Server.Port
	log.Printf("Starting server on %s", serverAddr)
	log.Printf("Environment: %s", cfg.Server.Env)
	log.Printf("Database: %s:%s/%s", cfg.Database.Host, cfg.Database.Port, cfg.Database.DBName)

	if err := http.ListenAndServe(serverAddr, handler); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
