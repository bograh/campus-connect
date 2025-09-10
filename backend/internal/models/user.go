package models

import (
	"time"

	"github.com/google/uuid"
)

type VerificationStatus string

const (
	VerificationPending  VerificationStatus = "pending"
	VerificationApproved VerificationStatus = "approved"
	VerificationRejected VerificationStatus = "rejected"
)

type User struct {
	ID                 uuid.UUID          `json:"id" db:"id"`
	FirstName          string             `json:"firstName" db:"first_name"`
	LastName           string             `json:"lastName" db:"last_name"`
	Email              string             `json:"email" db:"email"`
	Password           string             `json:"-" db:"password"`
	StudentID          string             `json:"studentId" db:"student_id"`
	PhoneNumber        string             `json:"phoneNumber" db:"phone_number"`
	PhoneVerified      bool               `json:"phoneVerified" db:"phone_verified"`
	Gender             *string            `json:"gender" db:"gender"`
	IndexNumber        *string            `json:"indexNumber" db:"index_number"`
	ProgrammeOfStudy   *string            `json:"programmeOfStudy" db:"programme_of_study"`
	CurrentYear        *int               `json:"currentYear" db:"current_year"`
	VerificationStatus VerificationStatus `json:"verificationStatus" db:"verification_status"`
	Rating             float64            `json:"rating" db:"rating"`
	TotalDeliveries    int                `json:"totalDeliveries" db:"total_deliveries"`
	ProfileImage       *string            `json:"profileImage" db:"profile_image"`
	CreatedAt          time.Time          `json:"createdAt" db:"created_at"`
	UpdatedAt          time.Time          `json:"updatedAt" db:"updated_at"`
}

type VerificationDocument struct {
	ID        uuid.UUID `json:"id" db:"id"`
	UserID    uuid.UUID `json:"userId" db:"user_id"`
	DocType   string    `json:"docType" db:"doc_type"`
	URL       string    `json:"url" db:"url"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
}

type UploadVerificationDocRequest struct {
	DocType string `json:"docType" validate:"required,oneof=student_id selfie other"`
}

type CreateUserRequest struct {
	FirstName        string  `json:"firstName" validate:"required"`
	LastName         string  `json:"lastName" validate:"required"`
	Email            string  `json:"email" validate:"required,email"`
	Password         string  `json:"password" validate:"required,min=6"`
	StudentID        string  `json:"studentId" validate:"required"`
	PhoneNumber      string  `json:"phoneNumber" validate:"required"`
	Gender           *string `json:"gender"`
	IndexNumber      *string `json:"indexNumber"`
	ProgrammeOfStudy *string `json:"programmeOfStudy"`
	CurrentYear      *int    `json:"currentYear"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type UpdateProfileRequest struct {
	FirstName        *string `json:"firstName"`
	LastName         *string `json:"lastName"`
	Gender           *string `json:"gender"`
	IndexNumber      *string `json:"indexNumber"`
	ProgrammeOfStudy *string `json:"programmeOfStudy"`
	CurrentYear      *int    `json:"currentYear"`
}

type UserResponse struct {
	ID                 uuid.UUID          `json:"id"`
	FirstName          string             `json:"firstName"`
	LastName           string             `json:"lastName"`
	Email              string             `json:"email"`
	StudentID          string             `json:"studentId"`
	PhoneNumber        string             `json:"phoneNumber"`
	PhoneVerified      bool               `json:"phoneVerified"`
	Gender             *string            `json:"gender"`
	IndexNumber        *string            `json:"indexNumber"`
	ProgrammeOfStudy   *string            `json:"programmeOfStudy"`
	CurrentYear        *int               `json:"currentYear"`
	VerificationStatus VerificationStatus `json:"verificationStatus"`
	Rating             float64            `json:"rating"`
	TotalDeliveries    int                `json:"totalDeliveries"`
	ProfileImage       *string            `json:"profileImage"`
}

func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		ID:                 u.ID,
		FirstName:          u.FirstName,
		LastName:           u.LastName,
		Email:              u.Email,
		StudentID:          u.StudentID,
		PhoneNumber:        u.PhoneNumber,
		PhoneVerified:      u.PhoneVerified,
		Gender:             u.Gender,
		IndexNumber:        u.IndexNumber,
		ProgrammeOfStudy:   u.ProgrammeOfStudy,
		CurrentYear:        u.CurrentYear,
		VerificationStatus: u.VerificationStatus,
		Rating:             u.Rating,
		TotalDeliveries:    u.TotalDeliveries,
		ProfileImage:       u.ProfileImage,
	}
}
