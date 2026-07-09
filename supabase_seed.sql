-- CREAR TABLAS (ejecutar primero)
DROP TABLE IF EXISTS "Notification" CASCADE;
DROP TABLE IF EXISTS "Favorite" CASCADE;
DROP TABLE IF EXISTS "Review" CASCADE;
DROP TABLE IF EXISTS "Reservation" CASCADE;
DROP TABLE IF EXISTS "SpaceAmenity" CASCADE;
DROP TABLE IF EXISTS "Space" CASCADE;
DROP TABLE IF EXISTS "Amenity" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

CREATE TABLE "User" ("id" SERIAL,"name" TEXT NOT NULL,"email" TEXT NOT NULL,"password" TEXT NOT NULL,"role" TEXT DEFAULT 'USER',"status" BOOLEAN DEFAULT true,"createdAt" TIMESTAMP DEFAULT now(),"updatedAt" TIMESTAMP NOT NULL,PRIMARY KEY ("id"));
CREATE UNIQUE INDEX ON "User"("email");

CREATE TABLE "Space" ("id" SERIAL,"name" TEXT NOT NULL,"description" TEXT,"location" TEXT NOT NULL,"capacity" INTEGER NOT NULL,"type" TEXT NOT NULL,"imageUrl" TEXT,"pricePerHour" NUMERIC DEFAULT 120,"status" BOOLEAN DEFAULT true,"createdAt" TIMESTAMP DEFAULT now(),"updatedAt" TIMESTAMP NOT NULL,PRIMARY KEY ("id"));

CREATE TABLE "Amenity" ("id" SERIAL,"name" TEXT NOT NULL UNIQUE,"icon" TEXT,PRIMARY KEY ("id"));

CREATE TABLE "SpaceAmenity" ("spaceId" INTEGER NOT NULL REFERENCES "Space"(id) ON DELETE CASCADE,"amenityId" INTEGER NOT NULL REFERENCES "Amenity"(id) ON DELETE CASCADE,PRIMARY KEY ("spaceId","amenityId"));

CREATE TABLE "Reservation" ("id" SERIAL,"userId" INTEGER NOT NULL REFERENCES "User"(id),"spaceId" INTEGER NOT NULL REFERENCES "Space"(id),"startTime" TIMESTAMP NOT NULL,"endTime" TIMESTAMP NOT NULL,"status" TEXT DEFAULT 'PENDING',"reason" TEXT,"createdAt" TIMESTAMP DEFAULT now(),"updatedAt" TIMESTAMP NOT NULL,PRIMARY KEY ("id"));

CREATE TABLE "Review" ("id" SERIAL,"userId" INTEGER NOT NULL REFERENCES "User"(id),"spaceId" INTEGER NOT NULL REFERENCES "Space"(id),"reservationId" INTEGER NOT NULL UNIQUE REFERENCES "Reservation"(id),"rating" INTEGER NOT NULL,"comment" TEXT NOT NULL,"createdAt" TIMESTAMP DEFAULT now(),PRIMARY KEY ("id"));

CREATE TABLE "Favorite" ("userId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,"spaceId" INTEGER NOT NULL REFERENCES "Space"(id) ON DELETE CASCADE,"createdAt" TIMESTAMP DEFAULT now(),PRIMARY KEY ("userId","spaceId"));

CREATE TABLE "Notification" ("id" SERIAL,"userId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,"title" TEXT NOT NULL,"message" TEXT,"type" TEXT DEFAULT 'INFO',"readAt" TIMESTAMP,"createdAt" TIMESTAMP DEFAULT now(),PRIMARY KEY ("id"));
CREATE INDEX ON "Notification"("userId","readAt");

-- INSERTAR DATOS (ejecutar después)
INSERT INTO "User" VALUES (1,'Administrador','admin@coworking.com','$2b$10$8KzQMGNeBOVJ1GJQJ5VUZOQmKrQZJ1GKQVJ3KJ5VUZOQmKrQZJ1GKQ','ADMIN',true,now(),now()),(2,'Maria Gonzalez','usuario@coworking.com','$2b$10$8KzQMGNeBOVJ1GJQJ5VUZOQmKrQZJ1GKQVJ3KJ5VUZOQmKrQZJ1GKQ','USER',true,now(),now());

INSERT INTO "Amenity" VALUES (1,'Wifi',NULL),(2,'Proyector',NULL),(3,'Cafe',NULL),(4,'Pizarra',NULL),(5,'Videollamada',NULL),(6,'Aire acondicionado',NULL);

INSERT INTO "Space" VALUES (1,'Sala Ada Lovelace','Sala cerrada con ventanal ideal para reuniones de equipo.','Piso 2 Ala Norte',6,'SALA',NULL,120,true,now(),now());
INSERT INTO "Space" VALUES (2,'Sala Alan Turing','Sala mediana con excelente iluminacion natural.','Piso 2 Ala Sur',4,'SALA',NULL,100,true,now(),now());
INSERT INTO "Space" VALUES (3,'Sala Premium Todo Incluido','Sala con WiFi proyector 4K y cafetera premium. Ideal para presentaciones.','Piso 4 Ala Ejecutiva',8,'SALA',NULL,250,true,now(),now());
INSERT INTO "Space" VALUES (4,'Sala Solo WiFi','Sala basica con internet de alta velocidad.','Piso 1 Ala Oeste',4,'SALA',NULL,80,true,now(),now());
INSERT INTO "Space" VALUES (5,'Sala Solo Proyector','Sala equipada con proyector para presentaciones.','Piso 2 Ala Este',6,'SALA',NULL,90,true,now(),now());
INSERT INTO "Space" VALUES (6,'Sala Solo Cafe','Sala confortable con cafetera. Perfecta para reuniones informales.','Piso 3 Ala Norte',5,'SALA',NULL,70,true,now(),now());
INSERT INTO "Space" VALUES (7,'Escritorio Grace Hopper','Escritorio individual en terraza con vista al campus.','Piso 3 Terraza',1,'ESCRITORIO',NULL,60,true,now(),now());
INSERT INTO "Space" VALUES (8,'Escritorio Katherine Johnson','Escritorio compartido en zona silenciosa.','Piso 1 Ala Este',2,'ESCRITORIO',NULL,50,true,now(),now());
INSERT INTO "Space" VALUES (9,'Escritorio Solo WiFi','Escritorio individual con internet.','Piso 1 Ala Central',1,'ESCRITORIO',NULL,40,true,now(),now());
INSERT INTO "Space" VALUES (10,'Escritorio Solo Cafe','Escritorio con acceso a cafetera.','Piso 2 Sala de Descanso',1,'ESCRITORIO',NULL,35,true,now(),now());
INSERT INTO "Space" VALUES (11,'Auditorio Margaret Hamilton','Auditorio amplio con sonido y proyector HD.','Piso 1 Ala Sur',40,'AUDITORIO',NULL,300,true,now(),now());
INSERT INTO "Space" VALUES (12,'Auditorio Nikola Tesla','Auditorio mediano para conferencias.','Piso 3 Ala Central',25,'AUDITORIO',NULL,200,true,now(),now());
INSERT INTO "Space" VALUES (13,'Auditorio Premium Todo Incluido','Auditorio de lujo con WiFi proyector 4K cafe y aire.','Piso 4 Torre Principal',50,'AUDITORIO',NULL,500,true,now(),now());
INSERT INTO "Space" VALUES (14,'Auditorio Solo WiFi','Auditorio basico con internet.','Piso 2 Ala Oeste',30,'AUDITORIO',NULL,150,true,now(),now());
INSERT INTO "Space" VALUES (15,'Auditorio Solo Proyector','Auditorio con proyector de alta calidad.','Piso 3 Ala Sur',35,'AUDITORIO',NULL,180,true,now(),now());
INSERT INTO "Space" VALUES (16,'Escritorio Premium Todo Incluido','Escritorio con WiFi proyector y cafetera personal.','Piso 4 Ala Ejecutiva',1,'ESCRITORIO',NULL,85,true,now(),now());
INSERT INTO "Space" VALUES (17,'Escritorio Solo Proyector','Escritorio con monitor y proyector personal.','Piso 2 Ala Central',1,'ESCRITORIO',NULL,55,true,now(),now());
INSERT INTO "Space" VALUES (18,'Auditorio Solo Cafe','Auditorio con servicio de cafeteria incluido.','Piso 1 Ala Central',20,'AUDITORIO',NULL,160,true,now(),now());
INSERT INTO "Space" VALUES (19,'Sala Ejecutiva WiFi Proyector','Sala con WiFi y proyector HD. Ideal para presentaciones.','Piso 3 Ala Ejecutiva',6,'SALA',NULL,150,true,now(),now());
INSERT INTO "Space" VALUES (20,'Sala Integral Todo Incluido','Sala completa con WiFi proyector 4K y cafetera premium.','Piso 4 Ala Central',10,'SALA',NULL,300,true,now(),now());

INSERT INTO "SpaceAmenity" VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(2,1),(2,4),(2,3),(3,1),(3,2),(3,3),(4,1),(5,2),(6,3),(7,1),(7,3),(8,1),(8,3),(9,1),(10,3),(11,1),(11,2),(11,6),(11,5),(12,1),(12,2),(12,6),(13,1),(13,2),(13,3),(13,6),(14,1),(15,2),(16,1),(16,2),(16,3),(17,2),(18,3),(19,1),(19,2),(20,1),(20,2),(20,3);

INSERT INTO "Reservation" VALUES (1,2,1,now()+interval'5 days'+interval'11 hours',now()+interval'5 days'+interval'12 hours','PENDING',NULL,now(),now()),(2,2,5,now()+interval'2 days'+interval'15 hours',now()+interval'2 days'+interval'16 hours','CONFIRMED',NULL,now(),now()),(3,2,3,now()-interval'10 days'+interval'9 hours',now()-interval'10 days'+interval'13 hours','COMPLETED',NULL,now(),now()),(4,2,2,now()-interval'5 days'+interval'10 hours',now()-interval'5 days'+interval'11 hours','CANCELLED',NULL,now(),now());

INSERT INTO "Review" VALUES (1,2,1,3,5,'Excelente para trabajo en equipo la pizarra y el proyector funcionan perfecto.');

INSERT INTO "Favorite" VALUES (2,1,now()),(2,3,now()),(2,5,now());

-- Resetear secuencias auto-increment
SELECT setval('"User_id_seq"', COALESCE((SELECT MAX(id) FROM "User"), 1));
SELECT setval('"Space_id_seq"', COALESCE((SELECT MAX(id) FROM "Space"), 1));
SELECT setval('"Amenity_id_seq"', COALESCE((SELECT MAX(id) FROM "Amenity"), 1));
SELECT setval('"Reservation_id_seq"', COALESCE((SELECT MAX(id) FROM "Reservation"), 1));
SELECT setval('"Review_id_seq"', COALESCE((SELECT MAX(id) FROM "Review"), 1));
SELECT setval('"Notification_id_seq"', COALESCE((SELECT MAX(id) FROM "Notification"), 1));
