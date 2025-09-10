package config

import (
	"os"
	"strconv"

	"campus-connect/internal/database"
	"campus-connect/internal/services"

	"github.com/joho/godotenv"
)

type Config struct {
	Server     ServerConfig
	Database   database.Config
	JWT        JWTConfig
	Cloudinary services.CloudinaryConfig
	Redis      RedisConfig
	Brevo      BrevoConfig
}

type ServerConfig struct {
	Port string
	Host string
	Env  string
}

type JWTConfig struct {
	Secret string
}

type RedisConfig struct {
	Addr     string
	Password string
	DB       int
}

type BrevoConfig struct {
	APIKey      string
	SenderName  string
	SenderEmail string
}

func Load() (*Config, error) {

	_ = godotenv.Load()

	config := &Config{
		Server: ServerConfig{
			Port: getEnv("PORT", "8080"),
			Host: getEnv("HOST", "0.0.0.0"),
			Env:  getEnv("GO_ENV", "development"),
		},
		Database: database.Config{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", ""),
			DBName:   getEnv("DB_NAME", "campus_connect"),
			SSLMode:  getEnv("DB_SSL_MODE", "disable"),
		},
		JWT: JWTConfig{
			Secret: getEnv("JWT_SECRET", "your-super-secret-jwt-key-change-in-production"),
		},
		Cloudinary: services.CloudinaryConfig{
			CloudName: getEnv("CLOUDINARY_CLOUD_NAME", ""),
			APIKey:    getEnv("CLOUDINARY_API_KEY", ""),
			APISecret: getEnv("CLOUDINARY_API_SECRET", ""),
		},
		Redis: RedisConfig{
			Addr:     getEnv("REDIS_ADDR", "127.0.0.1:6379"),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       getEnvAsInt("REDIS_DB", 0),
		},
		Brevo: BrevoConfig{
			APIKey:      getEnv("BREVO_API_KEY", ""),
			SenderName:  getEnv("BREVO_SENDER_NAME", "CampusConnect"),
			SenderEmail: getEnv("BREVO_SENDER_EMAIL", "no-reply@campusconnect.knust.edu.gh"),
		},
	}

	return config, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if valueStr := os.Getenv(key); valueStr != "" {
		if value, err := strconv.Atoi(valueStr); err == nil {
			return value
		}
	}
	return defaultValue
}
