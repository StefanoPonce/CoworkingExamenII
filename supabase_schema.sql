-- Complete schema for coworking space management system
-- This will drop all existing tables and recreate them with the correct structure

-- Drop all tables in correct order (respecting foreign key dependencies)
DROP TABLE IF EXISTS "Notification" CASCADE;
DROP TABLE IF EXISTS "Favorite" CASCADE;
DROP TABLE IF EXISTS "Review" CASCADE;
DROP TABLE IF EXISTS "Reservation" CASCADE;
DROP TABLE IF EXISTS "SpaceAmenity" CASCADE;
DROP TABLE IF EXISTS "Space" CASCADE;
DROP TABLE IF EXISTS "Amenity" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Drop the update function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create User table
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    status BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Space table
CREATE TABLE "Space" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    imageUrl VARCHAR(255),
    pricePerHour NUMERIC(10, 2) DEFAULT 120,
    status BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Amenity table
CREATE TABLE "Amenity" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    icon VARCHAR(255)
);

-- SpaceAmenity junction table
CREATE TABLE "SpaceAmenity" (
    spaceId INTEGER NOT NULL,
    amenityId INTEGER NOT NULL,
    PRIMARY KEY (spaceId, amenityId),
    FOREIGN KEY (spaceId) REFERENCES "Space"(id) ON DELETE CASCADE,
    FOREIGN KEY (amenityId) REFERENCES "Amenity"(id) ON DELETE CASCADE
);

-- Reservation table
CREATE TABLE "Reservation" (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    spaceId INTEGER NOT NULL,
    startTime TIMESTAMP NOT NULL,
    endTime TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    reason TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES "User"(id),
    FOREIGN KEY (spaceId) REFERENCES "Space"(id)
);

-- Review table
CREATE TABLE "Review" (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    spaceId INTEGER NOT NULL,
    reservationId INTEGER UNIQUE NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES "User"(id),
    FOREIGN KEY (spaceId) REFERENCES "Space"(id),
    FOREIGN KEY (reservationId) REFERENCES "Reservation"(id)
);

-- Favorite junction table
CREATE TABLE "Favorite" (
    userId INTEGER NOT NULL,
    spaceId INTEGER NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, spaceId),
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (spaceId) REFERENCES "Space"(id) ON DELETE CASCADE
);

-- Notification table
CREATE TABLE "Notification" (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'INFO',
    readAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create index for notifications
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"(userId, readAt);

-- Function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updatedAt
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_space_updated_at BEFORE UPDATE ON "Space"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservation_updated_at BEFORE UPDATE ON "Reservation"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
