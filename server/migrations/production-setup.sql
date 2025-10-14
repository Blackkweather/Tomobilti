-- Production Database Setup for Tomobilti
-- This script sets up the production PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table with enhanced security features
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image TEXT,
    user_type VARCHAR(20) NOT NULL DEFAULT 'renter' CHECK (user_type IN ('owner', 'renter', 'both')),
    
    -- Security & Verification Fields
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_id_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_license_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_background_checked BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Verification Documents
    id_document_url TEXT,
    license_document_url TEXT,
    insurance_document_url TEXT,
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    
    -- Security Status
    security_score INTEGER DEFAULT 0 CHECK (security_score >= 0 AND security_score <= 100),
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    block_reason TEXT,
    
    -- Email verification
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP,
    
    -- Password reset
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cars table with comprehensive vehicle information
CREATE TABLE IF NOT EXISTS cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('essence', 'diesel', 'electric', 'hybrid')),
    transmission VARCHAR(20) NOT NULL CHECK (transmission IN ('manual', 'automatic')),
    seats INTEGER NOT NULL CHECK (seats >= 1 AND seats <= 20),
    price_per_day DECIMAL(10,2) NOT NULL CHECK (price_per_day > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'MAD',
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    images JSONB DEFAULT '[]'::jsonb,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Vehicle Security & Safety
    vin VARCHAR(17),
    registration_number VARCHAR(20),
    mot_expiry TIMESTAMP,
    insurance_expiry TIMESTAMP,
    is_insured BOOLEAN NOT NULL DEFAULT FALSE,
    insurance_provider VARCHAR(100),
    insurance_policy_number VARCHAR(100),
    
    -- Safety Features
    has_airbags BOOLEAN DEFAULT TRUE,
    has_abs BOOLEAN DEFAULT TRUE,
    has_esp BOOLEAN DEFAULT FALSE,
    has_bluetooth BOOLEAN DEFAULT FALSE,
    has_gps BOOLEAN DEFAULT FALSE,
    has_parking_sensors BOOLEAN DEFAULT FALSE,
    
    -- Security Features
    has_alarm BOOLEAN DEFAULT FALSE,
    has_immobilizer BOOLEAN DEFAULT FALSE,
    has_tracking_device BOOLEAN DEFAULT FALSE,
    
    -- Vehicle Condition
    mileage INTEGER CHECK (mileage >= 0),
    last_service_date TIMESTAMP,
    next_service_due TIMESTAMP,
    
    -- Ratings and Reviews
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    renter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount > 0),
    service_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    insurance DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
    message TEXT,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_intent_id VARCHAR(255),
    payment_method_id VARCHAR(255),
    
    -- Cancellation
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    refund_amount DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure end date is after start date
    CONSTRAINT valid_booking_dates CHECK (end_date > start_date)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    renter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one review per booking
    UNIQUE(booking_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token);

CREATE INDEX IF NOT EXISTS idx_cars_owner_id ON cars(owner_id);
CREATE INDEX IF NOT EXISTS idx_cars_city ON cars(city);
CREATE INDEX IF NOT EXISTS idx_cars_available ON cars(is_available);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price_per_day);
CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars(fuel_type);
CREATE INDEX IF NOT EXISTS idx_cars_location ON cars USING GIST (ll_to_earth(latitude, longitude));

CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);

CREATE INDEX IF NOT EXISTS idx_reviews_car_id ON reviews(car_id);
CREATE INDEX IF NOT EXISTS idx_reviews_renter_id ON reviews(renter_id);
CREATE INDEX IF NOT EXISTS idx_reviews_owner_id ON reviews(owner_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to check booking conflicts
CREATE OR REPLACE FUNCTION check_booking_conflicts()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM bookings 
        WHERE car_id = NEW.car_id 
        AND status IN ('confirmed', 'active')
        AND (
            (NEW.start_date <= start_date AND NEW.end_date > start_date) OR
            (NEW.start_date < end_date AND NEW.end_date >= end_date) OR
            (NEW.start_date >= start_date AND NEW.end_date <= end_date)
        )
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) THEN
        RAISE EXCEPTION 'Booking conflicts with existing booking';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for booking conflicts
CREATE TRIGGER check_booking_conflicts_trigger 
    BEFORE INSERT OR UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION check_booking_conflicts();

-- Create function to update car rating
CREATE OR REPLACE FUNCTION update_car_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE cars SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM reviews 
            WHERE car_id = NEW.car_id AND is_public = TRUE
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE car_id = NEW.car_id AND is_public = TRUE
        )
    WHERE id = NEW.car_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for car rating updates
CREATE TRIGGER update_car_rating_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_car_rating();

-- Insert sample data for testing
INSERT INTO users (id, email, password, first_name, last_name, phone, user_type, is_email_verified) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@tomobilti.com', '$2b$10$example', 'Admin', 'User', '+212600000000', 'both', TRUE),
('550e8400-e29b-41d4-a716-446655440001', 'owner@tomobilti.com', '$2b$10$example', 'Car', 'Owner', '+212600000001', 'owner', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'renter@tomobilti.com', '$2b$10$example', 'Car', 'Renter', '+212600000002', 'renter', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Insert sample cars
-- Removed example cars: BMW 3 Series, Mercedes A-Class, Tesla Model 3

COMMIT;

