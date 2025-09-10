-- Create ENUM types
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE delivery_status AS ENUM ('pending', 'matched', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE item_size AS ENUM ('small', 'medium', 'large');
CREATE TYPE priority AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE trip_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE transport_method AS ENUM ('car', 'motorcycle', 'bicycle', 'walking', 'public_transport');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    phone_verified BOOLEAN DEFAULT FALSE,
    gender VARCHAR(20),
    index_number VARCHAR(50),
    programme_of_study VARCHAR(200),
    current_year INTEGER,
    verification_status verification_status DEFAULT 'pending',
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_deliveries INTEGER DEFAULT 0,
    profile_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trips table
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    traveler_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    from_location VARCHAR(255) NOT NULL,
    to_location VARCHAR(255) NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    transport_method transport_method NOT NULL,
    max_deliveries INTEGER NOT NULL,
    current_deliveries INTEGER DEFAULT 0,
    price_per_delivery DECIMAL(10,2) NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    status trip_status DEFAULT 'active',
    description TEXT,
    contact_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create delivery_requests table
CREATE TABLE delivery_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pickup_location VARCHAR(255) NOT NULL,
    dropoff_location VARCHAR(255) NOT NULL,
    item_description TEXT NOT NULL,
    item_size item_size NOT NULL,
    priority priority DEFAULT 'normal',
    payment_amount DECIMAL(10,2) NOT NULL,
    pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
    pickup_time VARCHAR(10) NOT NULL,
    contact_info TEXT NOT NULL,
    special_instructions TEXT,
    status delivery_status DEFAULT 'pending',
    matched_trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trip_participants junction table
CREATE TABLE trip_participants (
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (trip_id, user_id)
);

-- Create trip_delivery_requests junction table
CREATE TABLE trip_delivery_requests (
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    delivery_request_id UUID NOT NULL REFERENCES delivery_requests(id) ON DELETE CASCADE,
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (trip_id, delivery_request_id)
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_users_verification_status ON users(verification_status);
CREATE INDEX idx_trips_traveler_id ON trips(traveler_id);
CREATE INDEX idx_trips_departure_time ON trips(departure_time);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_delivery_requests_user_id ON delivery_requests(user_id);
CREATE INDEX idx_delivery_requests_status ON delivery_requests(status);
CREATE INDEX idx_delivery_requests_pickup_date ON delivery_requests(pickup_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_requests_updated_at BEFORE UPDATE ON delivery_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
