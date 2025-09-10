package handlers

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"campus-connect/internal/middleware"
	"campus-connect/internal/models"
	"campus-connect/internal/repositories"
	"campus-connect/internal/utils"

	"github.com/google/uuid"
)

type TripHandler struct {
	tripRepo repositories.TripRepository
}

func NewTripHandler(tripRepo repositories.TripRepository) *TripHandler {
	return &TripHandler{
		tripRepo: tripRepo,
	}
}

func (h *TripHandler) CreateTrip(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetUserFromContext(r)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	var req models.CreateTripRequest
	if err := utils.DecodeAndValidate(r, &req); err != nil {
		if strings.Contains(err.Error(), "validation failed") {
			utils.WriteErrorResponse(w, http.StatusBadRequest, utils.FormatValidationError(err))
		} else {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		}
		return
	}

	// Parse departure date and time
	// Handle both HH:mm and HH:mm:ss formats
	var departureDateTime time.Time
	var err error

	// First try with seconds (HH:mm:ss format)
	departureDateTime, err = time.Parse("2006-01-02T15:04:05", req.DepartureDate+"T"+req.DepartureTime+":00")
	if err != nil {
		// If that fails, try without seconds (HH:mm format)
		departureDateTime, err = time.Parse("2006-01-02T15:04", req.DepartureDate+"T"+req.DepartureTime)
		if err != nil {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid departure date or time format. Expected YYYY-MM-DD and HH:mm")
			return
		}
	}

	trip := &models.Trip{
		ID:                uuid.New(),
		TravelerID:        user.ID,
		FromLocation:      req.FromLocation,
		ToLocation:        req.ToLocation,
		DepartureTime:     departureDateTime,
		TransportMethod:   req.VehicleType,
		MaxDeliveries:     req.AvailableSeats,
		CurrentDeliveries: 0,
		PricePerDelivery:  req.PricePerDelivery,
		IsRecurring:       false,
		Status:            models.TripActive,
		Description:       req.Description,
		ContactInfo:       req.ContactInfo,
	}

	if err := h.tripRepo.Create(trip); err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to create trip")
		return
	}

	createdTrip, err := h.tripRepo.GetByID(trip.ID)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to retrieve created trip")
		return
	}

	response := map[string]interface{}{
		"message": "Trip created successfully",
		"trip":    createdTrip,
	}

	utils.WriteCreatedResponse(w, "Trip created successfully", response)
}

func (h *TripHandler) GetTrips(w http.ResponseWriter, r *http.Request) {
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")

	page := 1
	limit := 10

	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 100 {
			limit = l
		}
	}

	offset := (page - 1) * limit

	trips, totalCount, err := h.tripRepo.GetActiveTrips(limit, offset)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to get trips")
		return
	}

	totalPages := (totalCount + limit - 1) / limit

	response := map[string]interface{}{
		"trips":       trips,
		"totalTrips":  totalCount,
		"currentPage": page,
		"totalPages":  totalPages,
	}

	utils.WriteSuccessResponse(w, "Trips retrieved successfully", response)
}

func (h *TripHandler) GetTripDetails(w http.ResponseWriter, r *http.Request) {
	tripIDStr := r.URL.Path[len("/api/trips/"):]
	if tripIDStr == "" {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "Trip ID is required")
		return
	}

	tripID, err := uuid.Parse(tripIDStr)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid trip ID format")
		return
	}

	trip, err := h.tripRepo.GetByID(tripID)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusNotFound, "Trip not found")
		return
	}

	participants, err := h.tripRepo.GetParticipants(tripID)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to get trip participants")
		return
	}

	matchedRequests, err := h.tripRepo.GetMatchedRequests(tripID)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to get matched requests")
		return
	}

	trip.JoinedUsers = make([]models.User, len(participants))
	for i, p := range participants {
		trip.JoinedUsers[i] = *p
	}

	trip.MatchedRequests = make([]models.DeliveryRequest, len(matchedRequests))
	for i, r := range matchedRequests {
		trip.MatchedRequests[i] = *r
	}

	utils.WriteSuccessResponse(w, "Trip details retrieved successfully", trip)
}

func (h *TripHandler) JoinTrip(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetUserFromContext(r)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	var req models.JoinTripRequest
	if err := utils.DecodeAndValidate(r, &req); err != nil {
		if strings.Contains(err.Error(), "validation failed") {
			utils.WriteErrorResponse(w, http.StatusBadRequest, utils.FormatValidationError(err))
		} else {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		}
		return
	}

	trip, err := h.tripRepo.GetByID(req.TripID)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusNotFound, "Trip not found")
		return
	}

	if trip.CurrentDeliveries >= trip.MaxDeliveries {
		utils.WriteErrorResponse(w, http.StatusConflict, "Trip is full")
		return
	}

	participants, err := h.tripRepo.GetParticipants(req.TripID)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to check trip participants")
		return
	}

	for _, participant := range participants {
		if participant.ID == user.ID {
			utils.WriteErrorResponse(w, http.StatusConflict, "You are already part of this trip")
			return
		}
	}

	if err := h.tripRepo.AddParticipant(req.TripID, user.ID); err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to join trip")
		return
	}

	utils.WriteSuccessResponse(w, "Successfully joined trip", nil)
}

func (h *TripHandler) LeaveTrip(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetUserFromContext(r)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	var req models.LeaveTripRequest
	if err := utils.DecodeAndValidate(r, &req); err != nil {
		if strings.Contains(err.Error(), "validation failed") {
			utils.WriteErrorResponse(w, http.StatusBadRequest, utils.FormatValidationError(err))
		} else {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		}
		return
	}

	_, err := h.tripRepo.GetByID(req.TripID)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusNotFound, "Trip not found")
		return
	}

	participants, err := h.tripRepo.GetParticipants(req.TripID)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to check trip participants")
		return
	}

	isParticipant := false
	for _, participant := range participants {
		if participant.ID == user.ID {
			isParticipant = true
			break
		}
	}

	if !isParticipant {
		utils.WriteErrorResponse(w, http.StatusConflict, "You are not part of this trip")
		return
	}

	if err := h.tripRepo.RemoveParticipant(req.TripID, user.ID); err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to leave trip")
		return
	}

	utils.WriteSuccessResponse(w, "Successfully left trip", nil)
}

func (h *TripHandler) GetMyTrips(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetUserFromContext(r)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	trips, err := h.tripRepo.GetByTravelerID(user.ID)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to get user trips")
		return
	}

	utils.WriteSuccessResponse(w, "User trips retrieved successfully", trips)
}
