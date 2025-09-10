package repositories

import (
	"database/sql"
	"fmt"

	"campus-connect/internal/database"
	"campus-connect/internal/models"

	"github.com/google/uuid"
)

type UserRepository interface {
	Create(user *models.User) error
	GetByID(id uuid.UUID) (*models.User, error)
	GetByEmail(email string) (*models.User, error)
	GetByStudentID(studentID string) (*models.User, error)
	Update(user *models.User) error
	UpdateProfile(userID uuid.UUID, updates *models.UpdateProfileRequest) (*models.User, error)
}

type userRepository struct {
	db *database.DB
}

func NewUserRepository(db *database.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(user *models.User) error {
	query := `
		INSERT INTO users (
			id, first_name, last_name, email, password, student_id, 
			phone_number, gender, index_number, programme_of_study, current_year
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING created_at, updated_at, verification_status, rating, total_deliveries, phone_verified`

	err := r.db.QueryRow(
		query,
		user.ID, user.FirstName, user.LastName, user.Email, user.Password,
		user.StudentID, user.PhoneNumber, user.Gender, user.IndexNumber,
		user.ProgrammeOfStudy, user.CurrentYear,
	).Scan(
		&user.CreatedAt, &user.UpdatedAt, &user.VerificationStatus,
		&user.Rating, &user.TotalDeliveries, &user.PhoneVerified,
	)

	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}

func (r *userRepository) GetByID(id uuid.UUID) (*models.User, error) {
	user := &models.User{}
	query := `
		SELECT id, first_name, last_name, email, password, student_id, 
			   phone_number, phone_verified, gender, index_number, programme_of_study, 
			   current_year, verification_status, rating, total_deliveries, 
			   profile_image, created_at, updated_at
		FROM users 
		WHERE id = $1`

	err := r.db.QueryRow(query, id).Scan(
		&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.Password,
		&user.StudentID, &user.PhoneNumber, &user.PhoneVerified, &user.Gender,
		&user.IndexNumber, &user.ProgrammeOfStudy, &user.CurrentYear,
		&user.VerificationStatus, &user.Rating, &user.TotalDeliveries,
		&user.ProfileImage, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	return user, nil
}

func (r *userRepository) GetByEmail(email string) (*models.User, error) {
	user := &models.User{}
	query := `
		SELECT id, first_name, last_name, email, password, student_id, 
			   phone_number, phone_verified, gender, index_number, programme_of_study, 
			   current_year, verification_status, rating, total_deliveries, 
			   profile_image, created_at, updated_at
		FROM users 
		WHERE email = $1`

	err := r.db.QueryRow(query, email).Scan(
		&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.Password,
		&user.StudentID, &user.PhoneNumber, &user.PhoneVerified, &user.Gender,
		&user.IndexNumber, &user.ProgrammeOfStudy, &user.CurrentYear,
		&user.VerificationStatus, &user.Rating, &user.TotalDeliveries,
		&user.ProfileImage, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	return user, nil
}

func (r *userRepository) GetByStudentID(studentID string) (*models.User, error) {
	user := &models.User{}
	query := `
		SELECT id, first_name, last_name, email, password, student_id, 
			   phone_number, phone_verified, gender, index_number, programme_of_study, 
			   current_year, verification_status, rating, total_deliveries, 
			   profile_image, created_at, updated_at
		FROM users 
		WHERE student_id = $1`

	err := r.db.QueryRow(query, studentID).Scan(
		&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.Password,
		&user.StudentID, &user.PhoneNumber, &user.PhoneVerified, &user.Gender,
		&user.IndexNumber, &user.ProgrammeOfStudy, &user.CurrentYear,
		&user.VerificationStatus, &user.Rating, &user.TotalDeliveries,
		&user.ProfileImage, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	return user, nil
}

func (r *userRepository) Update(user *models.User) error {
	query := `
		UPDATE users 
		SET first_name = $2, last_name = $3, gender = $4, index_number = $5, 
			programme_of_study = $6, current_year = $7, profile_image = $8
		WHERE id = $1`

	_, err := r.db.Exec(
		query,
		user.ID, user.FirstName, user.LastName, user.Gender,
		user.IndexNumber, user.ProgrammeOfStudy, user.CurrentYear, user.ProfileImage,
	)

	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}

	return nil
}

func (r *userRepository) UpdateProfile(userID uuid.UUID, updates *models.UpdateProfileRequest) (*models.User, error) {
	// Build dynamic query based on non-nil fields
	setParts := []string{}
	args := []interface{}{userID}
	argIndex := 2

	if updates.FirstName != nil {
		setParts = append(setParts, fmt.Sprintf("first_name = $%d", argIndex))
		args = append(args, *updates.FirstName)
		argIndex++
	}
	if updates.LastName != nil {
		setParts = append(setParts, fmt.Sprintf("last_name = $%d", argIndex))
		args = append(args, *updates.LastName)
		argIndex++
	}
	if updates.Gender != nil {
		setParts = append(setParts, fmt.Sprintf("gender = $%d", argIndex))
		args = append(args, *updates.Gender)
		argIndex++
	}
	if updates.IndexNumber != nil {
		setParts = append(setParts, fmt.Sprintf("index_number = $%d", argIndex))
		args = append(args, *updates.IndexNumber)
		argIndex++
	}
	if updates.ProgrammeOfStudy != nil {
		setParts = append(setParts, fmt.Sprintf("programme_of_study = $%d", argIndex))
		args = append(args, *updates.ProgrammeOfStudy)
		argIndex++
	}
	if updates.CurrentYear != nil {
		setParts = append(setParts, fmt.Sprintf("current_year = $%d", argIndex))
		args = append(args, *updates.CurrentYear)
		argIndex++
	}

	if len(setParts) == 0 {
		// No updates to make, just return current user
		return r.GetByID(userID)
	}

	query := fmt.Sprintf(`
		UPDATE users 
		SET %s
		WHERE id = $1
		RETURNING id, first_name, last_name, email, student_id, 
				  phone_number, phone_verified, gender, index_number, programme_of_study, 
				  current_year, verification_status, rating, total_deliveries, 
				  profile_image, created_at, updated_at`,
		fmt.Sprintf("%s", setParts[0:]))

	// Join the setParts properly
	if len(setParts) > 1 {
		setClause := setParts[0]
		for i := 1; i < len(setParts); i++ {
			setClause += ", " + setParts[i]
		}
		query = fmt.Sprintf(`
			UPDATE users 
			SET %s
			WHERE id = $1
			RETURNING id, first_name, last_name, email, student_id, 
					  phone_number, phone_verified, gender, index_number, programme_of_study, 
					  current_year, verification_status, rating, total_deliveries, 
					  profile_image, created_at, updated_at`,
			setClause)
	}

	user := &models.User{}
	err := r.db.QueryRow(query, args...).Scan(
		&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.StudentID,
		&user.PhoneNumber, &user.PhoneVerified, &user.Gender, &user.IndexNumber,
		&user.ProgrammeOfStudy, &user.CurrentYear, &user.VerificationStatus,
		&user.Rating, &user.TotalDeliveries, &user.ProfileImage,
		&user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to update user profile: %w", err)
	}

	return user, nil
}
