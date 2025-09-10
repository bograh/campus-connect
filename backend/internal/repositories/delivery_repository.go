package repositories

import (
	"database/sql"
	"fmt"

	"campus-connect/internal/database"
	"campus-connect/internal/models"

	"github.com/google/uuid"
)

type DeliveryRepository interface {
	Create(request *models.DeliveryRequest) error
	GetByID(id uuid.UUID) (*models.DeliveryRequest, error)
	GetPendingRequests(limit, offset int) ([]*models.DeliveryRequest, int, error)
	GetByUserID(userID uuid.UUID) ([]*models.DeliveryRequest, error)
	Update(request *models.DeliveryRequest) error
	UpdateStatus(id uuid.UUID, status models.DeliveryStatus, tripID *uuid.UUID) error
}

type deliveryRepository struct {
	db *database.DB
}

func NewDeliveryRepository(db *database.DB) DeliveryRepository {
	return &deliveryRepository{db: db}
}

func (r *deliveryRepository) Create(request *models.DeliveryRequest) error {
	query := `
		INSERT INTO delivery_requests (
			id, user_id, pickup_location, dropoff_location, item_description,
			item_size, priority, payment_amount, pickup_date, pickup_time,
			contact_info, special_instructions, status
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		RETURNING created_at, updated_at`

	err := r.db.QueryRow(
		query,
		request.ID, request.UserID, request.PickupLocation, request.DropoffLocation,
		request.ItemDescription, request.ItemSize, request.Priority,
		request.PaymentAmount, request.PickupDate, request.PickupTime,
		request.ContactInfo, request.SpecialInstructions, request.Status,
	).Scan(&request.CreatedAt, &request.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create delivery request: %w", err)
	}

	return nil
}

func (r *deliveryRepository) GetByID(id uuid.UUID) (*models.DeliveryRequest, error) {
	request := &models.DeliveryRequest{}
	query := `
		SELECT dr.id, dr.user_id, dr.pickup_location, dr.dropoff_location, 
			   dr.item_description, dr.item_size, dr.priority, dr.payment_amount,
			   dr.pickup_date, dr.pickup_time, dr.contact_info, dr.special_instructions,
			   dr.status, dr.matched_trip_id, dr.created_at, dr.updated_at,
			   u.first_name, u.last_name, u.email, u.student_id
		FROM delivery_requests dr
		JOIN users u ON dr.user_id = u.id
		WHERE dr.id = $1`

	user := &models.User{}
	err := r.db.QueryRow(query, id).Scan(
		&request.ID, &request.UserID, &request.PickupLocation, &request.DropoffLocation,
		&request.ItemDescription, &request.ItemSize, &request.Priority,
		&request.PaymentAmount, &request.PickupDate, &request.PickupTime,
		&request.ContactInfo, &request.SpecialInstructions, &request.Status,
		&request.MatchedTripID, &request.CreatedAt, &request.UpdatedAt,
		&user.FirstName, &user.LastName, &user.Email, &user.StudentID,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("delivery request not found")
		}
		return nil, fmt.Errorf("failed to get delivery request: %w", err)
	}

	user.ID = request.UserID
	request.User = user
	request.RequesterName = fmt.Sprintf("%s %s", user.FirstName, user.LastName)

	return request, nil
}

func (r *deliveryRepository) GetPendingRequests(limit, offset int) ([]*models.DeliveryRequest, int, error) {
	query := `
		SELECT dr.id, dr.user_id, dr.pickup_location, dr.dropoff_location, 
			   dr.item_description, dr.item_size, dr.priority, dr.payment_amount,
			   dr.pickup_date, dr.pickup_time, dr.contact_info, dr.special_instructions,
			   dr.status, dr.matched_trip_id, dr.created_at, dr.updated_at,
			   u.first_name, u.last_name, u.email, u.student_id
		FROM delivery_requests dr
		JOIN users u ON dr.user_id = u.id
		WHERE dr.status = 'pending'
		ORDER BY dr.created_at DESC
		LIMIT $1 OFFSET $2`

	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get pending requests: %w", err)
	}
	defer rows.Close()

	var requests []*models.DeliveryRequest
	for rows.Next() {
		request := &models.DeliveryRequest{}
		user := &models.User{}

		err := rows.Scan(
			&request.ID, &request.UserID, &request.PickupLocation, &request.DropoffLocation,
			&request.ItemDescription, &request.ItemSize, &request.Priority,
			&request.PaymentAmount, &request.PickupDate, &request.PickupTime,
			&request.ContactInfo, &request.SpecialInstructions, &request.Status,
			&request.MatchedTripID, &request.CreatedAt, &request.UpdatedAt,
			&user.FirstName, &user.LastName, &user.Email, &user.StudentID,
		)

		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan delivery request: %w", err)
		}

		user.ID = request.UserID
		request.User = user
		request.RequesterName = fmt.Sprintf("%s %s", user.FirstName, user.LastName)
		requests = append(requests, request)
	}

	// Get total count
	var totalCount int
	countQuery := `SELECT COUNT(*) FROM delivery_requests WHERE status = 'pending'`
	err = r.db.QueryRow(countQuery).Scan(&totalCount)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get total count: %w", err)
	}

	return requests, totalCount, nil
}

func (r *deliveryRepository) GetByUserID(userID uuid.UUID) ([]*models.DeliveryRequest, error) {
	query := `
		SELECT dr.id, dr.user_id, dr.pickup_location, dr.dropoff_location, 
			   dr.item_description, dr.item_size, dr.priority, dr.payment_amount,
			   dr.pickup_date, dr.pickup_time, dr.contact_info, dr.special_instructions,
			   dr.status, dr.matched_trip_id, dr.created_at, dr.updated_at
		FROM delivery_requests dr
		WHERE dr.user_id = $1
		ORDER BY dr.created_at DESC`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user delivery requests: %w", err)
	}
	defer rows.Close()

	var requests []*models.DeliveryRequest
	for rows.Next() {
		request := &models.DeliveryRequest{}

		err := rows.Scan(
			&request.ID, &request.UserID, &request.PickupLocation, &request.DropoffLocation,
			&request.ItemDescription, &request.ItemSize, &request.Priority,
			&request.PaymentAmount, &request.PickupDate, &request.PickupTime,
			&request.ContactInfo, &request.SpecialInstructions, &request.Status,
			&request.MatchedTripID, &request.CreatedAt, &request.UpdatedAt,
		)

		if err != nil {
			return nil, fmt.Errorf("failed to scan delivery request: %w", err)
		}

		requests = append(requests, request)
	}

	return requests, nil
}

func (r *deliveryRepository) Update(request *models.DeliveryRequest) error {
	query := `
		UPDATE delivery_requests 
		SET pickup_location = $2, dropoff_location = $3, item_description = $4,
			item_size = $5, priority = $6, payment_amount = $7, pickup_date = $8,
			pickup_time = $9, contact_info = $10, special_instructions = $11,
			status = $12, matched_trip_id = $13
		WHERE id = $1`

	_, err := r.db.Exec(
		query,
		request.ID, request.PickupLocation, request.DropoffLocation,
		request.ItemDescription, request.ItemSize, request.Priority,
		request.PaymentAmount, request.PickupDate, request.PickupTime,
		request.ContactInfo, request.SpecialInstructions, request.Status,
		request.MatchedTripID,
	)

	if err != nil {
		return fmt.Errorf("failed to update delivery request: %w", err)
	}

	return nil
}

func (r *deliveryRepository) UpdateStatus(id uuid.UUID, status models.DeliveryStatus, tripID *uuid.UUID) error {
	query := `
		UPDATE delivery_requests 
		SET status = $2, matched_trip_id = $3
		WHERE id = $1`

	_, err := r.db.Exec(query, id, status, tripID)
	if err != nil {
		return fmt.Errorf("failed to update delivery request status: %w", err)
	}

	return nil
}
