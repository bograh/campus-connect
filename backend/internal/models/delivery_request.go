package models

import (
	"time"

	"github.com/google/uuid"
)

type DeliveryStatus string
type ItemSize string
type Priority string

const (
	DeliveryPending   DeliveryStatus = "pending"
	DeliveryMatched   DeliveryStatus = "matched"
	DeliveryInTransit DeliveryStatus = "in_transit"
	DeliveryDelivered DeliveryStatus = "delivered"
	DeliveryCancelled DeliveryStatus = "cancelled"
)

const (
	ItemSizeSmall  ItemSize = "small"
	ItemSizeMedium ItemSize = "medium"
	ItemSizeLarge  ItemSize = "large"
)

const (
	PriorityLow    Priority = "low"
	PriorityNormal Priority = "normal"
	PriorityHigh   Priority = "high"
	PriorityUrgent Priority = "urgent"
)

type DeliveryRequest struct {
	ID                   uuid.UUID      `json:"id" db:"id"`
	UserID               uuid.UUID      `json:"userId" db:"user_id"`
	PickupLocation       string         `json:"pickupLocation" db:"pickup_location"`
	DropoffLocation      string         `json:"dropoffLocation" db:"dropoff_location"`
	ItemDescription      string         `json:"itemDescription" db:"item_description"`
	ItemSize             ItemSize       `json:"itemSize" db:"item_size"`
	Priority             Priority       `json:"priority" db:"priority"`
	PaymentAmount        float64        `json:"paymentAmount" db:"payment_amount"`
	PickupDate           time.Time      `json:"pickupDate" db:"pickup_date"`
	PickupTime           string         `json:"pickupTime" db:"pickup_time"`
	ContactInfo          string         `json:"contactInfo" db:"contact_info"`
	SpecialInstructions  *string        `json:"specialInstructions" db:"special_instructions"`
	Status               DeliveryStatus `json:"status" db:"status"`
	MatchedTripID        *uuid.UUID     `json:"matchedTripId" db:"matched_trip_id"`
	CreatedAt            time.Time      `json:"createdAt" db:"created_at"`
	UpdatedAt            time.Time      `json:"updatedAt" db:"updated_at"`
	
	// Populated fields
	User         *User `json:"user,omitempty"`
	RequesterName string `json:"requesterName,omitempty"`
}

type CreateDeliveryRequestRequest struct {
	PickupLocation      string   `json:"pickupLocation" validate:"required"`
	DropoffLocation     string   `json:"dropoffLocation" validate:"required"`
	ItemDescription     string   `json:"itemDescription" validate:"required"`
	ItemSize            ItemSize `json:"itemSize" validate:"required"`
	Priority            Priority `json:"priority"`
	PaymentAmount       float64  `json:"paymentAmount" validate:"required,gt=0"`
	PickupDate          string   `json:"pickupDate" validate:"required"`
	PickupTime          string   `json:"pickupTime" validate:"required"`
	ContactInfo         string   `json:"contactInfo" validate:"required"`
	SpecialInstructions *string  `json:"specialInstructions"`
}

type OfferDeliveryRequest struct {
	DeliveryRequestID uuid.UUID `json:"deliveryRequestId" validate:"required"`
	TripID            uuid.UUID `json:"tripId" validate:"required"`
}

type CancelDeliveryRequest struct {
	DeliveryRequestID uuid.UUID `json:"deliveryRequestId" validate:"required"`
	TripID            uuid.UUID `json:"tripId" validate:"required"`
}
