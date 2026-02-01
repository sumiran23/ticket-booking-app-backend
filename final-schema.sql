-- TICKET BOOKING SYSTEM - FINAL SCHEMA
-- ======================================

-- users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- events Table 
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(500),
    venue VARCHAR(255) NOT NULL,
    eventdatetime TIMESTAMP NOT NULL
);

-- seats Table 
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    type VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    
    UNIQUE(event_id, seat_number)
);

-- ticketstatus Table 
CREATE TABLE ticketstatus (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    seat_id INT NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,  -- Nullable for 'available' status
    status VARCHAR(50) NOT NULL CHECK (status IN ('available', 'reserved', 'booked')),
    held_until TIMESTAMP,  -- Only used when status = 'reserved'
    
    UNIQUE(event_id, seat_id)
);

-- booking_confirmations Table
CREATE TABLE booking_confirmations (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_price DECIMAL(10, 2) NOT NULL
);

-- booking_confirmation_seats Table
CREATE TABLE booking_confirmation_seats (
    id SERIAL PRIMARY KEY,
    booking_confirmation_id INT NOT NULL REFERENCES booking_confirmations(id) ON DELETE CASCADE,
    seat_id INT NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
    
    UNIQUE(booking_confirmation_id, seat_id)
);

