package models

import (
	"time"

	"github.com/google/uuid"
)

type TripStatus string
type TransportMethod string

const (
	TripActive    TripStatus = "active"
	TripCompleted TripStatus = "completed"
	TripCancelled TripStatus = "cancelled"
)

const (
	TransportCar        TransportMethod = "car"
	TransportMotorcycle TransportMethod = "motorcycle"
	TransportBicycle    TransportMethod = "bicycle"
	TransportWalking    TransportMethod = "walking"
	TransportPublic     TransportMethod = "public_transport"
)

type Trip struct {
	ID                uuid.UUID       `json:"id" db:"id"`
	TravelerID        uuid.UUID       `json:"travelerId" db:"traveler_id"`
	FromLocation      string          `json:"fromLocation" db:"from_location"`
	ToLocation        string          `json:"toLocation" db:"to_location"`
	DepartureTime     time.Time       `json:"departureTime" db:"departure_time"`
	TransportMethod   TransportMethod `json:"transportMethod" db:"transport_method"`
	MaxDeliveries     int             `json:"maxDeliveries" db:"max_deliveries"`
	CurrentDeliveries int             `json:"currentDeliveries" db:"current_deliveries"`
	PricePerDelivery  float64         `json:"pricePerDelivery" db:"price_per_delivery"`
	IsRecurring       bool            `json:"isRecurring" db:"is_recurring"`
	Status            TripStatus      `json:"status" db:"status"`
	Description       *string         `json:"description" db:"description"`
	ContactInfo       *string         `json:"contactInfo" db:"contact_info"`
	CreatedAt         time.Time       `json:"createdAt" db:"created_at"`
	UpdatedAt         time.Time       `json:"updatedAt" db:"updated_at"`

	// Populated fields
	Traveler        *User             `json:"traveler,omitempty"`
	TravelerName    string            `json:"travelerName,omitempty"`
	JoinedUsers     []User            `json:"joinedUsers,omitempty"`
	MatchedRequests []DeliveryRequest `json:"matchedRequests,omitempty"`
}

type CreateTripRequest struct {
	FromLocation     string          `json:"fromLocation" validate:"required"`
	ToLocation       string          `json:"toLocation" validate:"required"`
	DepartureDate    string          `json:"departureDate" validate:"required"`
	DepartureTime    string          `json:"departureTime" validate:"required"`
	AvailableSeats   int             `json:"availableSeats" validate:"required,gt=0"`
	PricePerDelivery float64         `json:"pricePerDelivery" validate:"required,gt=0"`
	VehicleType      TransportMethod `json:"vehicleType" validate:"required"`
	Description      *string         `json:"description"`
	ContactInfo      *string         `json:"contactInfo"`
}

type JoinTripRequest struct {
	TripID uuid.UUID `json:"tripId" validate:"required"`
}

type LeaveTripRequest struct {
	TripID uuid.UUID `json:"tripId" validate:"required"`
}

// Junction table for trip participants
type TripParticipant struct {
	TripID uuid.UUID `db:"trip_id"`
	UserID uuid.UUID `db:"user_id"`
}

// Junction table for matched delivery requests
type TripDeliveryRequest struct {
	TripID            uuid.UUID `db:"trip_id"`
	DeliveryRequestID uuid.UUID `db:"delivery_request_id"`
}
