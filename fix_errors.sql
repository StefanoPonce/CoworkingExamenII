-- Agregar columnas faltantes a la tabla User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" VARCHAR(50) DEFAULT 'USER';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "status" BOOLEAN DEFAULT true;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Agregar columnas faltantes a la tabla Space
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "imageUrl" VARCHAR(255);
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "pricePerHour" NUMERIC(10, 2) DEFAULT 120;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "status" BOOLEAN DEFAULT true;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Recrear tabla Notification con estructura correcta
DROP TABLE IF EXISTS "Notification" CASCADE;

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

-- Crear índice para notifications
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"(userId, readAt);

-- Crear función y triggers para updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_updated_at ON "User";
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_space_updated_at ON "Space";
CREATE TRIGGER update_space_updated_at BEFORE UPDATE ON "Space"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
