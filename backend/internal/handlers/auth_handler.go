package handlers

import (
	"net/http"
	"strings"
	"time"

	"campus-connect/internal/auth"
	"campus-connect/internal/middleware"
	"campus-connect/internal/models"
	"campus-connect/internal/repositories"
	"campus-connect/internal/services"
	"campus-connect/internal/utils"

	"github.com/google/uuid"
)

type AuthHandler struct {
	userRepo    repositories.UserRepository
	authService *auth.AuthService
	cloudinary  *services.CloudinaryService
	verifier    *services.VerificationService
}

func NewAuthHandler(userRepo repositories.UserRepository, authService *auth.AuthService) *AuthHandler {
	return &AuthHandler{
		userRepo:    userRepo,
		authService: authService,
	}
}

func (h *AuthHandler) WithCloudinary(cld *services.CloudinaryService) *AuthHandler {
	h.cloudinary = cld
	return h
}

func (h *AuthHandler) WithVerifier(v *services.VerificationService) *AuthHandler {
	h.verifier = v
	return h
}

func (h *AuthHandler) SignUp(w http.ResponseWriter, r *http.Request) {
	var req models.CreateUserRequest
	if err := utils.DecodeAndValidate(r, &req); err != nil {
		if strings.Contains(err.Error(), "validation failed") {
			utils.WriteErrorResponse(w, http.StatusBadRequest, utils.FormatValidationError(err))
		} else {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		}
		return
	}

	if !strings.HasSuffix(strings.ToLower(req.Email), "@st.knust.edu.gh") {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "Only KNUST student emails (@st.knust.edu.gh) are allowed")
		return
	}

	if existingUser, _ := h.userRepo.GetByEmail(req.Email); existingUser != nil {
		utils.WriteErrorResponse(w, http.StatusConflict, "User with this email already exists")
		return
	}

	if existingUser, _ := h.userRepo.GetByStudentID(req.StudentID); existingUser != nil {
		utils.WriteErrorResponse(w, http.StatusConflict, "User with this student ID already exists")
		return
	}

	hashedPassword, err := h.authService.HashPassword(req.Password)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to process password")
		return
	}

	user := &models.User{
		ID:               uuid.New(),
		FirstName:        req.FirstName,
		LastName:         req.LastName,
		Email:            req.Email,
		Password:         hashedPassword,
		StudentID:        req.StudentID,
		PhoneNumber:      req.PhoneNumber,
		Gender:           req.Gender,
		IndexNumber:      req.IndexNumber,
		ProgrammeOfStudy: req.ProgrammeOfStudy,
		CurrentYear:      req.CurrentYear,
	}

	if err := h.userRepo.Create(user); err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

	if h.verifier != nil {
		code := generateNumericCode(6)
		_ = h.verifier.StoreCode(r.Context(), strings.ToLower(user.Email), code, 10*time.Minute)
		_ = h.verifier.SendVerificationEmail(user.Email, user.FirstName+" "+user.LastName, code)
	}

	signupToken, _ := h.authService.GenerateToken(user)

	response := map[string]interface{}{
		"message": "User created successfully. Please verify your email.",
		"token":   signupToken,
		"user": map[string]interface{}{
			"id":                 user.ID,
			"firstName":          user.FirstName,
			"lastName":           user.LastName,
			"email":              user.Email,
			"studentId":          user.StudentID,
			"verificationStatus": user.VerificationStatus,
		},
	}

	utils.WriteCreatedResponse(w, "User created successfully", response)
}

func (h *AuthHandler) SignIn(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest
	if err := utils.DecodeAndValidate(r, &req); err != nil {
		if strings.Contains(err.Error(), "validation failed") {
			utils.WriteErrorResponse(w, http.StatusBadRequest, utils.FormatValidationError(err))
		} else {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		}
		return
	}

	user, err := h.userRepo.GetByEmail(req.Email)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	if err := h.authService.ComparePassword(req.Password, user.Password); err != nil {
		utils.WriteErrorResponse(w, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	// Require verified email
	if user.VerificationStatus != models.VerificationApproved {
		utils.WriteErrorResponse(w, http.StatusForbidden, "Please verify your email")
		return
	}

	token, err := h.authService.GenerateToken(user)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	response := map[string]interface{}{
		"message": "Login successful",
		"token":   token,
		"user": map[string]interface{}{
			"id":                 user.ID,
			"firstName":          user.FirstName,
			"lastName":           user.LastName,
			"email":              user.Email,
			"verificationStatus": user.VerificationStatus,
		},
	}

	utils.WriteSuccessResponse(w, "Login successful", response)
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	utils.WriteSuccessResponse(w, "Logout successful", nil)
}

type verifyEmailRequest struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

func (h *AuthHandler) VerifyEmail(w http.ResponseWriter, r *http.Request) {
	if h.verifier == nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Verification service not configured")
		return
	}

	var req verifyEmailRequest
	if err := utils.DecodeAndValidate(r, &req); err != nil {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	ok, err := h.verifier.ValidateCode(r.Context(), strings.ToLower(req.Email), req.Code)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Verification failed")
		return
	}
	if !ok {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid or expired verification code")
		return
	}

	// Mark user as verified
	user, err := h.userRepo.GetByEmail(req.Email)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusNotFound, "User not found")
		return
	}
	if err := h.userRepo.SetVerificationStatus(user.ID, models.VerificationApproved); err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to update user")
		return
	}

	utils.WriteSuccessResponse(w, "Email verified successfully", map[string]interface{}{
		"userId": user.ID,
		"email":  user.Email,
	})
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetUserFromContext(r)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	fullUser, err := h.userRepo.GetByID(user.ID)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusNotFound, "User not found")
		return
	}

	response := map[string]interface{}{
		"user": map[string]interface{}{
			"id":                 fullUser.ID,
			"firstName":          fullUser.FirstName,
			"lastName":           fullUser.LastName,
			"email":              fullUser.Email,
			"studentId":          fullUser.StudentID,
			"verificationStatus": fullUser.VerificationStatus,
			"rating":             fullUser.Rating,
			"totalDeliveries":    fullUser.TotalDeliveries,
			"profileImage":       fullUser.ProfileImage,
			"gender":             fullUser.Gender,
			"indexNumber":        fullUser.IndexNumber,
			"programmeOfStudy":   fullUser.ProgrammeOfStudy,
			"currentYear":        fullUser.CurrentYear,
			"phoneNumber":        fullUser.PhoneNumber,
			"phoneVerified":      fullUser.PhoneVerified,
		},
	}

	utils.WriteSuccessResponse(w, "User data retrieved successfully", response)
}

func (h *AuthHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetUserFromContext(r)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	var req models.UpdateProfileRequest
	if err := utils.DecodeAndValidate(r, &req); err != nil {
		if strings.Contains(err.Error(), "validation failed") {
			utils.WriteErrorResponse(w, http.StatusBadRequest, utils.FormatValidationError(err))
		} else {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		}
		return
	}

	updatedUser, err := h.userRepo.UpdateProfile(user.ID, &req)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to update profile")
		return
	}

	response := map[string]interface{}{
		"message": "Profile updated successfully",
		"user": map[string]interface{}{
			"id":                 updatedUser.ID,
			"firstName":          updatedUser.FirstName,
			"lastName":           updatedUser.LastName,
			"email":              updatedUser.Email,
			"studentId":          updatedUser.StudentID,
			"verificationStatus": updatedUser.VerificationStatus,
			"gender":             updatedUser.Gender,
			"indexNumber":        updatedUser.IndexNumber,
			"programmeOfStudy":   updatedUser.ProgrammeOfStudy,
			"currentYear":        updatedUser.CurrentYear,
		},
	}

	utils.WriteSuccessResponse(w, "Profile updated successfully", response)
}

func (h *AuthHandler) UploadVerificationDocument(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetUserFromContext(r)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	if h.cloudinary == nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Cloudinary service not configured")
		return
	}

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid multipart form data")
		return
	}

	docType := r.FormValue("docType")
	if docType == "" {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "docType is required")
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "file is required")
		return
	}
	file.Close()

	url, err := h.cloudinary.UploadFromMultipartFile(header, user.ID.String())
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to upload document")
		return
	}

	if err := h.userRepo.AddVerificationDocument(user.ID, docType, url); err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to save document record")
		return
	}

	utils.WriteSuccessResponse(w, "Verification document uploaded", map[string]interface{}{
		"url":     url,
		"docType": docType,
	})
}

// simple numeric code generator
func generateNumericCode(length int) string {
	digits := "0123456789"
	b := make([]byte, length)
	now := time.Now().UnixNano()
	for i := 0; i < length; i++ {
		idx := int((now >> uint(i*3)) % 10)
		b[i] = digits[idx]
	}
	return string(b)
}
