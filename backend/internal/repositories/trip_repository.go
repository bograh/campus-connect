package repositories

import (
	"database/sql"
	"fmt"

	"campus-connect/internal/database"
	"campus-connect/internal/models"

	"github.com/google/uuid"
)

type TripRepository interface {
	Create(trip *models.Trip) error
	GetByID(id uuid.UUID) (*models.Trip, error)
	GetActiveTrips(limit, offset int) ([]*models.Trip, int, error)
	GetByTravelerID(travelerID uuid.UUID) ([]*models.Trip, error)
	Update(trip *models.Trip) error
	AddParticipant(tripID, userID uuid.UUID) error
	RemoveParticipant(tripID, userID uuid.UUID) error
	AddDeliveryRequest(tripID, requestID uuid.UUID) error
	RemoveDeliveryRequest(tripID, requestID uuid.UUID) error
	GetParticipants(tripID uuid.UUID) ([]*models.User, error)
	GetMatchedRequests(tripID uuid.UUID) ([]*models.DeliveryRequest, error)
}

type tripRepository struct {
	db *database.DB
}

func NewTripRepository(db *database.DB) TripRepository {
	return &tripRepository{db: db}
}

func (r *tripRepository) Create(trip *models.Trip) error {
	query := `
		INSERT INTO trips (
			id, traveler_id, from_location, to_location, departure_time,
			transport_method, max_deliveries, current_deliveries, price_per_delivery,
			is_recurring, status, description, contact_info
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		RETURNING created_at, updated_at`

	err := r.db.QueryRow(
		query,
		trip.ID, trip.TravelerID, trip.FromLocation, trip.ToLocation,
		trip.DepartureTime, trip.TransportMethod, trip.MaxDeliveries,
		trip.CurrentDeliveries, trip.PricePerDelivery, trip.IsRecurring,
		trip.Status, trip.Description, trip.ContactInfo,
	).Scan(&trip.CreatedAt, &trip.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create trip: %w", err)
	}

	return nil
}

func (r *tripRepository) GetByID(id uuid.UUID) (*models.Trip, error) {
	trip := &models.Trip{}
	query := `
		SELECT t.id, t.traveler_id, t.from_location, t.to_location, t.departure_time,
			   t.transport_method, t.max_deliveries, t.current_deliveries, 
			   t.price_per_delivery, t.is_recurring, t.status, t.description,
			   t.contact_info, t.created_at, t.updated_at,
			   u.first_name, u.last_name, u.email, u.student_id
		FROM trips t
		JOIN users u ON t.traveler_id = u.id
		WHERE t.id = $1`

	traveler := &models.User{}
	err := r.db.QueryRow(query, id).Scan(
		&trip.ID, &trip.TravelerID, &trip.FromLocation, &trip.ToLocation,
		&trip.DepartureTime, &trip.TransportMethod, &trip.MaxDeliveries,
		&trip.CurrentDeliveries, &trip.PricePerDelivery, &trip.IsRecurring,
		&trip.Status, &trip.Description, &trip.ContactInfo,
		&trip.CreatedAt, &trip.UpdatedAt,
		&traveler.FirstName, &traveler.LastName, &traveler.Email, &traveler.StudentID,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("trip not found")
		}
		return nil, fmt.Errorf("failed to get trip: %w", err)
	}

	traveler.ID = trip.TravelerID
	trip.Traveler = traveler
	trip.TravelerName = fmt.Sprintf("%s %s", traveler.FirstName, traveler.LastName)

	return trip, nil
}

func (r *tripRepository) GetActiveTrips(limit, offset int) ([]*models.Trip, int, error) {
	query := `
		SELECT t.id, t.traveler_id, t.from_location, t.to_location, t.departure_time,
			   t.transport_method, t.max_deliveries, t.current_deliveries, 
			   t.price_per_delivery, t.is_recurring, t.status, t.description,
			   t.contact_info, t.created_at, t.updated_at,
			   u.first_name, u.last_name, u.email, u.student_id
		FROM trips t
		JOIN users u ON t.traveler_id = u.id
		WHERE t.status = 'active'
		ORDER BY t.created_at DESC
		LIMIT $1 OFFSET $2`

	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get active trips: %w", err)
	}
	defer rows.Close()

	var trips []*models.Trip
	for rows.Next() {
		trip := &models.Trip{}
		traveler := &models.User{}

		err := rows.Scan(
			&trip.ID, &trip.TravelerID, &trip.FromLocation, &trip.ToLocation,
			&trip.DepartureTime, &trip.TransportMethod, &trip.MaxDeliveries,
			&trip.CurrentDeliveries, &trip.PricePerDelivery, &trip.IsRecurring,
			&trip.Status, &trip.Description, &trip.ContactInfo,
			&trip.CreatedAt, &trip.UpdatedAt,
			&traveler.FirstName, &traveler.LastName, &traveler.Email, &traveler.StudentID,
		)

		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan trip: %w", err)
		}

		traveler.ID = trip.TravelerID
		trip.Traveler = traveler
		trip.TravelerName = fmt.Sprintf("%s %s", traveler.FirstName, traveler.LastName)
		trips = append(trips, trip)
	}

	// Get total count
	var totalCount int
	countQuery := `SELECT COUNT(*) FROM trips WHERE status = 'active'`
	err = r.db.QueryRow(countQuery).Scan(&totalCount)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get total count: %w", err)
	}

	return trips, totalCount, nil
}

func (r *tripRepository) GetByTravelerID(travelerID uuid.UUID) ([]*models.Trip, error) {
	query := `
		SELECT t.id, t.traveler_id, t.from_location, t.to_location, t.departure_time,
			   t.transport_method, t.max_deliveries, t.current_deliveries, 
			   t.price_per_delivery, t.is_recurring, t.status, t.description,
			   t.contact_info, t.created_at, t.updated_at
		FROM trips t
		WHERE t.traveler_id = $1
		ORDER BY t.created_at DESC`

	rows, err := r.db.Query(query, travelerID)
	if err != nil {
		return nil, fmt.Errorf("failed to get traveler trips: %w", err)
	}
	defer rows.Close()

	var trips []*models.Trip
	for rows.Next() {
		trip := &models.Trip{}

		err := rows.Scan(
			&trip.ID, &trip.TravelerID, &trip.FromLocation, &trip.ToLocation,
			&trip.DepartureTime, &trip.TransportMethod, &trip.MaxDeliveries,
			&trip.CurrentDeliveries, &trip.PricePerDelivery, &trip.IsRecurring,
			&trip.Status, &trip.Description, &trip.ContactInfo,
			&trip.CreatedAt, &trip.UpdatedAt,
		)

		if err != nil {
			return nil, fmt.Errorf("failed to scan trip: %w", err)
		}

		trips = append(trips, trip)
	}

	return trips, nil
}

func (r *tripRepository) Update(trip *models.Trip) error {
	query := `
		UPDATE trips 
		SET from_location = $2, to_location = $3, departure_time = $4,
			transport_method = $5, max_deliveries = $6, current_deliveries = $7,
			price_per_delivery = $8, is_recurring = $9, status = $10,
			description = $11, contact_info = $12
		WHERE id = $1`

	_, err := r.db.Exec(
		query,
		trip.ID, trip.FromLocation, trip.ToLocation, trip.DepartureTime,
		trip.TransportMethod, trip.MaxDeliveries, trip.CurrentDeliveries,
		trip.PricePerDelivery, trip.IsRecurring, trip.Status,
		trip.Description, trip.ContactInfo,
	)

	if err != nil {
		return fmt.Errorf("failed to update trip: %w", err)
	}

	return nil
}

func (r *tripRepository) AddParticipant(tripID, userID uuid.UUID) error {
	// First update the current_deliveries count
	updateQuery := `UPDATE trips SET current_deliveries = current_deliveries + 1 WHERE id = $1`
	_, err := r.db.Exec(updateQuery, tripID)
	if err != nil {
		return fmt.Errorf("failed to update trip deliveries count: %w", err)
	}

	// Then add the participant
	insertQuery := `INSERT INTO trip_participants (trip_id, user_id) VALUES ($1, $2)`
	_, err = r.db.Exec(insertQuery, tripID, userID)
	if err != nil {
		return fmt.Errorf("failed to add trip participant: %w", err)
	}

	return nil
}

func (r *tripRepository) RemoveParticipant(tripID, userID uuid.UUID) error {
	// First remove the participant
	deleteQuery := `DELETE FROM trip_participants WHERE trip_id = $1 AND user_id = $2`
	_, err := r.db.Exec(deleteQuery, tripID, userID)
	if err != nil {
		return fmt.Errorf("failed to remove trip participant: %w", err)
	}

	// Then update the current_deliveries count
	updateQuery := `UPDATE trips SET current_deliveries = GREATEST(current_deliveries - 1, 0) WHERE id = $1`
	_, err = r.db.Exec(updateQuery, tripID)
	if err != nil {
		return fmt.Errorf("failed to update trip deliveries count: %w", err)
	}

	return nil
}

func (r *tripRepository) AddDeliveryRequest(tripID, requestID uuid.UUID) error {
	// First update the current_deliveries count
	updateQuery := `UPDATE trips SET current_deliveries = current_deliveries + 1 WHERE id = $1`
	_, err := r.db.Exec(updateQuery, tripID)
	if err != nil {
		return fmt.Errorf("failed to update trip deliveries count: %w", err)
	}

	// Then add the delivery request
	insertQuery := `INSERT INTO trip_delivery_requests (trip_id, delivery_request_id) VALUES ($1, $2)`
	_, err = r.db.Exec(insertQuery, tripID, requestID)
	if err != nil {
		return fmt.Errorf("failed to add trip delivery request: %w", err)
	}

	return nil
}

func (r *tripRepository) RemoveDeliveryRequest(tripID, requestID uuid.UUID) error {
	// First remove the delivery request
	deleteQuery := `DELETE FROM trip_delivery_requests WHERE trip_id = $1 AND delivery_request_id = $2`
	_, err := r.db.Exec(deleteQuery, tripID, requestID)
	if err != nil {
		return fmt.Errorf("failed to remove trip delivery request: %w", err)
	}

	// Then update the current_deliveries count
	updateQuery := `UPDATE trips SET current_deliveries = GREATEST(current_deliveries - 1, 0) WHERE id = $1`
	_, err = r.db.Exec(updateQuery, tripID)
	if err != nil {
		return fmt.Errorf("failed to update trip deliveries count: %w", err)
	}

	return nil
}

func (r *tripRepository) GetParticipants(tripID uuid.UUID) ([]*models.User, error) {
	query := `
		SELECT u.id, u.first_name, u.last_name, u.email, u.student_id
		FROM users u
		JOIN trip_participants tp ON u.id = tp.user_id
		WHERE tp.trip_id = $1`

	rows, err := r.db.Query(query, tripID)
	if err != nil {
		return nil, fmt.Errorf("failed to get trip participants: %w", err)
	}
	defer rows.Close()

	var participants []*models.User
	for rows.Next() {
		user := &models.User{}
		err := rows.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.StudentID)
		if err != nil {
			return nil, fmt.Errorf("failed to scan participant: %w", err)
		}
		participants = append(participants, user)
	}

	return participants, nil
}

func (r *tripRepository) GetMatchedRequests(tripID uuid.UUID) ([]*models.DeliveryRequest, error) {
	query := `
		SELECT dr.id, dr.user_id, dr.pickup_location, dr.dropoff_location, 
			   dr.item_description, dr.item_size, dr.priority, dr.payment_amount,
			   dr.pickup_date, dr.pickup_time, dr.contact_info, dr.special_instructions,
			   dr.status, dr.matched_trip_id, dr.created_at, dr.updated_at
		FROM delivery_requests dr
		JOIN trip_delivery_requests tdr ON dr.id = tdr.delivery_request_id
		WHERE tdr.trip_id = $1`

	rows, err := r.db.Query(query, tripID)
	if err != nil {
		return nil, fmt.Errorf("failed to get matched requests: %w", err)
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
