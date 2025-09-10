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

type DeliveryHandler struct {
	deliveryRepo repositories.DeliveryRepository
	tripRepo     repositories.TripRepository
}

func NewDeliveryHandler(deliveryRepo repositories.DeliveryRepository, tripRepo repositories.TripRepository) *DeliveryHandler {
	return &DeliveryHandler{
		deliveryRepo: deliveryRepo,
		tripRepo:     tripRepo,
	}
}

func (h *DeliveryHandler) CreateDeliveryRequest(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetUserFromContext(r)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	var req models.CreateDeliveryRequestRequest
	if err := utils.DecodeAndValidate(r, &req); err != nil {
		if strings.Contains(err.Error(), "validation failed") {
			utils.WriteErrorResponse(w, http.StatusBadRequest, utils.FormatValidationError(err))
		} else {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		}
		return
	}

	var pickupDateTime time.Time
	var err error

	pickupDateTime, err = time.Parse("2006-01-02T15:04:05", req.PickupDate+"T"+req.PickupTime+":00")
	if err != nil {
		pickupDateTime, err = time.Parse("2006-01-02T15:04", req.PickupDate+"T"+req.PickupTime)
		if err != nil {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid pickup date or time format. Expected YYYY-MM-DD and HH:mm")
			return
		}
	}

	deliveryRequest := &models.DeliveryRequest{
		ID:                  uuid.New(),
		UserID:              user.ID,
		PickupLocation:      req.PickupLocation,
		DropoffLocation:     req.DropoffLocation,
		ItemDescription:     req.ItemDescription,
		ItemSize:            req.ItemSize,
		Priority:            req.Priority,
		PaymentAmount:       req.PaymentAmount,
		PickupDate:          pickupDateTime,
		PickupTime:          req.PickupTime,
		ContactInfo:         req.ContactInfo,
		SpecialInstructions: req.SpecialInstructions,
		Status:              models.DeliveryPending,
	}

	// Set default priority if not provided
	if deliveryRequest.Priority == "" {
		deliveryRequest.Priority = models.PriorityNormal
	}

	if err := h.deliveryRepo.Create(deliveryRequest); err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to create delivery request")
		return
	}

	response := map[string]interface{}{
		"message":         "Delivery request created successfully",
		"deliveryRequest": deliveryRequest,
	}

	utils.WriteCreatedResponse(w, "Delivery request created successfully", response)
}

func (h *DeliveryHandler) GetDeliveryRequests(w http.ResponseWriter, r *http.Request) {
	// Parse pagination parameters
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

	// Get pending delivery requests
	requests, totalCount, err := h.deliveryRepo.GetPendingRequests(limit, offset)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to get delivery requests")
		return
	}

	totalPages := (totalCount + limit - 1) / limit

	response := map[string]interface{}{
		"deliveryRequests": requests,
		"totalRequests":    totalCount,
		"currentPage":      page,
		"totalPages":       totalPages,
	}

	utils.WriteSuccessResponse(w, "Delivery requests retrieved successfully", response)
}

func (h *DeliveryHandler) OfferDelivery(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetUserFromContext(r)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	var req models.OfferDeliveryRequest
	if err := utils.DecodeAndValidate(r, &req); err != nil {
		if strings.Contains(err.Error(), "validation failed") {
			utils.WriteErrorResponse(w, http.StatusBadRequest, utils.FormatValidationError(err))
		} else {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		}
		return
	}

	// Get the delivery request
	deliveryRequest, err := h.deliveryRepo.GetByID(req.DeliveryRequestID)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusNotFound, "Delivery request not found")
		return
	}

	// Get the trip
	trip, err := h.tripRepo.GetByID(req.TripID)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusNotFound, "Trip not found")
		return
	}

	// Check if user is the traveler
	if trip.TravelerID != user.ID {
		utils.WriteErrorResponse(w, http.StatusForbidden, "Only the trip traveler can offer delivery service")
		return
	}

	// Check if trip has available space
	if trip.CurrentDeliveries >= trip.MaxDeliveries {
		utils.WriteErrorResponse(w, http.StatusConflict, "Trip is full")
		return
	}

	// Check if request is already matched
	if deliveryRequest.Status != models.DeliveryPending {
		utils.WriteErrorResponse(w, http.StatusConflict, "Delivery request is already matched")
		return
	}

	// Update delivery request status and match with trip
	if err := h.deliveryRepo.UpdateStatus(req.DeliveryRequestID, models.DeliveryMatched, &req.TripID); err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to update delivery request")
		return
	}

	// Add delivery request to trip
	if err := h.tripRepo.AddDeliveryRequest(req.TripID, req.DeliveryRequestID); err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to add delivery request to trip")
		return
	}

	utils.WriteSuccessResponse(w, "Delivery offer made successfully", nil)
}

func (h *DeliveryHandler) CancelDeliveryOffer(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetUserFromContext(r)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	var req models.CancelDeliveryRequest
	if err := utils.DecodeAndValidate(r, &req); err != nil {
		if strings.Contains(err.Error(), "validation failed") {
			utils.WriteErrorResponse(w, http.StatusBadRequest, utils.FormatValidationError(err))
		} else {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		}
		return
	}

	// Get the delivery request
	deliveryRequest, err := h.deliveryRepo.GetByID(req.DeliveryRequestID)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusNotFound, "Delivery request not found")
		return
	}

	// Get the trip
	trip, err := h.tripRepo.GetByID(req.TripID)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusNotFound, "Trip not found")
		return
	}

	// Check if user is the traveler
	if trip.TravelerID != user.ID {
		utils.WriteErrorResponse(w, http.StatusForbidden, "Only the trip traveler can cancel delivery offer")
		return
	}

	// Check if request is matched with this trip
	if deliveryRequest.MatchedTripID == nil || *deliveryRequest.MatchedTripID != req.TripID {
		utils.WriteErrorResponse(w, http.StatusConflict, "Delivery request is not matched with this trip")
		return
	}

	// Update delivery request status back to pending
	if err := h.deliveryRepo.UpdateStatus(req.DeliveryRequestID, models.DeliveryPending, nil); err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to update delivery request")
		return
	}

	// Remove delivery request from trip
	if err := h.tripRepo.RemoveDeliveryRequest(req.TripID, req.DeliveryRequestID); err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to remove delivery request from trip")
		return
	}

	utils.WriteSuccessResponse(w, "Delivery offer cancelled successfully", nil)
}
