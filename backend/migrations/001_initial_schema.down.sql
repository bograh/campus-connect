-- Drop triggers
DROP TRIGGER IF EXISTS update_delivery_requests_updated_at ON delivery_requests;
DROP TRIGGER IF EXISTS update_trips_updated_at ON trips;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_delivery_requests_pickup_date;
DROP INDEX IF EXISTS idx_delivery_requests_status;
DROP INDEX IF EXISTS idx_delivery_requests_user_id;
DROP INDEX IF EXISTS idx_trips_status;
DROP INDEX IF EXISTS idx_trips_departure_time;
DROP INDEX IF EXISTS idx_trips_traveler_id;
DROP INDEX IF EXISTS idx_users_verification_status;
DROP INDEX IF EXISTS idx_users_student_id;
DROP INDEX IF EXISTS idx_users_email;

-- Drop tables
DROP TABLE IF EXISTS trip_delivery_requests;
DROP TABLE IF EXISTS trip_participants;
DROP TABLE IF EXISTS delivery_requests;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS users;

-- Drop ENUM types
DROP TYPE IF EXISTS transport_method;
DROP TYPE IF EXISTS trip_status;
DROP TYPE IF EXISTS priority;
DROP TYPE IF EXISTS item_size;
DROP TYPE IF EXISTS delivery_status;
DROP TYPE IF EXISTS verification_status;
