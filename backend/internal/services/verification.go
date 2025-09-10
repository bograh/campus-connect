package services

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/redis/go-redis/v9"
)

type VerificationService struct {
	redisClient *redis.Client
	brevoAPIKey string
	senderName  string
	senderEmail string
}

func NewVerificationService(redisAddr, redisPassword string, redisDB int, brevoAPIKey, senderName, senderEmail string) *VerificationService {
	rdb := redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: redisPassword,
		DB:       redisDB,
	})
	return &VerificationService{redisClient: rdb, brevoAPIKey: brevoAPIKey, senderName: senderName, senderEmail: senderEmail}
}

func (vs *VerificationService) StoreCode(ctx context.Context, email, code string, ttl time.Duration) error {
	key := fmt.Sprintf("verify:%s", email)
	return vs.redisClient.Set(ctx, key, code, ttl).Err()
}

func (vs *VerificationService) ValidateCode(ctx context.Context, email, code string) (bool, error) {
	key := fmt.Sprintf("verify:%s", email)
	val, err := vs.redisClient.Get(ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			return false, nil
		}
		return false, err
	}
	if val != code {
		return false, nil
	}
	_ = vs.redisClient.Del(ctx, key).Err()
	return true, nil
}

type brevoEmail struct {
	Sender struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	} `json:"sender"`
	To []struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	} `json:"to"`
	Subject     string `json:"subject"`
	HTMLContent string `json:"htmlContent"`
}

func (vs *VerificationService) SendVerificationEmail(email, name, code string) error {
	payload := brevoEmail{}
	payload.Sender.Name = vs.senderName
	payload.Sender.Email = vs.senderEmail
	payload.To = append(payload.To, struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	}{Email: email, Name: name})
	payload.Subject = "Verify your CampusConnect email"
	payload.HTMLContent = fmt.Sprintf("<html><body><p>Hello %s,</p><p>Your verification code is <strong>%s</strong>. It expires in 10 minutes.</p></body></html>", name, code)

	body, _ := json.Marshal(payload)
	req, err := http.NewRequest("POST", "https://api.brevo.com/v3/smtp/email", bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	req.Header.Set("accept", "application/json")
	req.Header.Set("content-type", "application/json")
	req.Header.Set("api-key", vs.brevoAPIKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("brevo send failed: status %d", resp.StatusCode)
	}
	return nil
}
