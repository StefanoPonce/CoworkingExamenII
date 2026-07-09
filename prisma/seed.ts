import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@coworking.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@coworking.com',
      password,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'usuario@coworking.com' },
    update: {},
    create: {
      name: 'María González',
      email: 'usuario@coworking.com',
      password,
      role: 'USER',
    },
  });

  const amenityNames = ['Wifi', 'Proyector', 'Café', 'Pizarra', 'Videollamada', 'Aire acondicionado'];
  const amenities: Record<string, { id: number }> = {};

  for (const name of amenityNames) {
    const amenity = await prisma.amenity.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    amenities[name] = amenity;
  }

  const spacesData = [
    {
      name: 'Sala Ada Lovelace',
      description:
        'Sala cerrada con ventanal, ideal para reuniones de equipo o sesiones de trabajo enfocado. Incluye pizarra blanca y conexión para videollamadas.',
      location: 'Piso 2 · Ala Norte',
      capacity: 6,
      type: 'SALA',
      pricePerHour: 120,
      amenityList: ['Wifi', 'Proyector', 'Café', 'Pizarra', 'Videollamada'],
    },
    {
      name: 'Sala Alan Turing',
      description: 'Sala mediana con excelente iluminación natural, perfecta para sesiones de brainstorming.',
      location: 'Piso 2 · Ala Sur',
      capacity: 4,
      type: 'SALA',
      pricePerHour: 100,
      amenityList: ['Wifi', 'Pizarra', 'Café'],
    },
    {
      name: 'Sala Premium - Todo Incluido',
      description: 'Sala exclusiva con Wi-Fi de alta velocidad, proyector 4K y cafetera premium. Ideal para presentaciones importantes y reuniones ejecutivas.',
      location: 'Piso 4 · Ala Ejecutiva',
      capacity: 8,
      type: 'SALA',
      pricePerHour: 250,
      amenityList: ['Wifi', 'Proyector', 'Café'],
    },
    {
      name: 'Sala Solo Wi-Fi',
      description: 'Sala básica con conexión a internet de alta velocidad. Perfecta para trabajo remoto y videollamadas.',
      location: 'Piso 1 · Ala Oeste',
      capacity: 4,
      type: 'SALA',
      pricePerHour: 80,
      amenityList: ['Wifi'],
    },
    {
      name: 'Sala Solo Proyector',
      description: 'Sala equipada con proyector para presentaciones. Ideal para sesiones de proyección sin necesidad de internet.',
      location: 'Piso 2 · Ala Este',
      capacity: 6,
      type: 'SALA',
      pricePerHour: 90,
      amenityList: ['Proyector'],
    },
    {
      name: 'Sala Solo Café',
      description: 'Sala confortable con cafetera y área de descanso. Perfecta para reuniones informales y networking.',
      location: 'Piso 3 · Ala Norte',
      capacity: 5,
      type: 'SALA',
      pricePerHour: 70,
      amenityList: ['Café'],
    },
    {
      name: 'Escritorio Grace Hopper',
      description: 'Escritorio individual en terraza con vista al campus. Ideal para trabajo concentrado.',
      location: 'Piso 3 · Terraza',
      capacity: 1,
      type: 'ESCRITORIO',
      pricePerHour: 60,
      amenityList: ['Wifi', 'Café'],
    },
    {
      name: 'Escritorio Katherine Johnson',
      description: 'Escritorio compartido en zona silenciosa con enchufes y buena conectividad.',
      location: 'Piso 1 · Ala Este',
      capacity: 2,
      type: 'ESCRITORIO',
      pricePerHour: 50,
      amenityList: ['Wifi', 'Café'],
    },
    {
      name: 'Escritorio Solo Wi-Fi',
      description: 'Escritorio individual con conexión a internet. Opción económica para trabajo remoto.',
      location: 'Piso 1 · Ala Central',
      capacity: 1,
      type: 'ESCRITORIO',
      pricePerHour: 40,
      amenityList: ['Wifi'],
    },
    {
      name: 'Escritorio Solo Café',
      description: 'Escritorio con acceso a cafetera. Ideal para quienes prefieren trabajar en ambiente relajado.',
      location: 'Piso 2 · Sala de Descanso',
      capacity: 1,
      type: 'ESCRITORIO',
      pricePerHour: 35,
      amenityList: ['Café'],
    },
    {
      name: 'Auditorio Margaret Hamilton',
      description: 'Auditorio amplio con sistema de sonido y proyector HD para presentaciones y eventos.',
      location: 'Piso 1 · Ala Sur',
      capacity: 40,
      type: 'AUDITORIO',
      pricePerHour: 300,
      amenityList: ['Wifi', 'Proyector', 'Aire acondicionado', 'Videollamada'],
    },
    {
      name: 'Auditorio Nikola Tesla',
      description: 'Auditorio mediano equipado para conferencias y talleres con capacidad para 25 personas.',
      location: 'Piso 3 · Ala Central',
      capacity: 25,
      type: 'AUDITORIO',
      pricePerHour: 200,
      amenityList: ['Wifi', 'Proyector', 'Aire acondicionado'],
    },
    {
      name: 'Auditorio Premium - Todo Incluido',
      description: 'Auditorio de lujo con Wi-Fi ultra rápido, proyector 4K, sistema de café premium y aire acondicionado. Perfecto para eventos corporativos.',
      location: 'Piso 4 · Torre Principal',
      capacity: 50,
      type: 'AUDITORIO',
      pricePerHour: 500,
      amenityList: ['Wifi', 'Proyector', 'Café', 'Aire acondicionado'],
    },
    {
      name: 'Auditorio Solo Wi-Fi',
      description: 'Auditorio básico con conexión a internet. Ideal para webinars y conferencias en línea.',
      location: 'Piso 2 · Ala Oeste',
      capacity: 30,
      type: 'AUDITORIO',
      pricePerHour: 150,
      amenityList: ['Wifi'],
    },
    {
      name: 'Auditorio Solo Proyector',
      description: 'Auditorio equipado con proyector de alta calidad. Perfecto para proyecciones de video y presentaciones.',
      location: 'Piso 3 · Ala Sur',
      capacity: 35,
      type: 'AUDITORIO',
      pricePerHour: 180,
      amenityList: ['Proyector'],
    },
    {
      name: 'Escritorio Premium - Todo Incluido',
      description: 'Escritorio ejecutivo con Wi-Fi ultrarrápido, proyector portátil y cafetera personal. Lo último en productividad.',
      location: 'Piso 4 · Ala Ejecutiva',
      capacity: 1,
      type: 'ESCRITORIO',
      pricePerHour: 85,
      amenityList: ['Wifi', 'Proyector', 'Café'],
    },
    {
      name: 'Escritorio Solo Proyector',
      description: 'Escritorio con monitor y proyector personal. Ideal para diseñadores y presentaciones individuales.',
      location: 'Piso 2 · Ala Central',
      capacity: 1,
      type: 'ESCRITORIO',
      pricePerHour: 55,
      amenityList: ['Proyector'],
    },
    {
      name: 'Auditorio Solo Café',
      description: 'Auditorio con servicio de cafetería incluido. Perfecto para eventos informales y conferencias matutinas.',
      location: 'Piso 1 · Ala Central',
      capacity: 20,
      type: 'AUDITORIO',
      pricePerHour: 160,
      amenityList: ['Café'],
    },
    {
      name: 'Sala Ejecutiva Wifi + Proyector',
      description: 'Sala mediana equipada con Wi-Fi de alta velocidad y proyector HD. Ideal para presentaciones de equipo.',
      location: 'Piso 3 · Ala Ejecutiva',
      capacity: 6,
      type: 'SALA',
      pricePerHour: 150,
      amenityList: ['Wifi', 'Proyector'],
    },
    {
      name: 'Sala Integral Todo Incluido',
      description: 'Sala completa con Wi-Fi, proyector 4K y cafetera premium. La mejor opción para reuniones importantes con todo lo necesario.',
      location: 'Piso 4 · Ala Central',
      capacity: 10,
      type: 'SALA',
      pricePerHour: 300,
      amenityList: ['Wifi', 'Proyector', 'Café'],
    },
  ];

  const spaces: any[] = [];
  for (const data of spacesData) {
    const { amenityList, ...spaceData } = data;
    const space = await prisma.space.upsert({
      where: { id: spaces.length + 1 },
      update: spaceData,
      create: spaceData,
    });
    spaces.push(space);

    for (const amenityName of amenityList) {
      await prisma.spaceAmenity.upsert({
        where: { spaceId_amenityId: { spaceId: space.id, amenityId: amenities[amenityName].id } },
        create: { spaceId: space.id, amenityId: amenities[amenityName].id },
        update: {},
      });
    }
  }

  const now = new Date();
  const reservations = [
    {
      userId: user.id,
      spaceId: spaces[0].id,
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 11, 0),
      endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 12, 0),
      status: 'PENDING',
    },
    {
      userId: user.id,
      spaceId: spaces[4].id,
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 15, 0),
      endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 16, 0),
      status: 'CONFIRMED',
    },
    {
      userId: user.id,
      spaceId: spaces[2].id,
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10, 9, 0),
      endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10, 13, 0),
      status: 'COMPLETED',
    },
    {
      userId: user.id,
      spaceId: spaces[1].id,
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5, 10, 0),
      endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5, 11, 0),
      status: 'CANCELLED',
    },
  ];

  for (const res of reservations) {
    await prisma.reservation.create({ data: res });
  }

  await prisma.review.create({
    data: {
      userId: user.id,
      spaceId: spaces[0].id,
      reservationId: 1,
      rating: 5,
      comment: 'Excelente para trabajo en equipo, la pizarra y el proyector funcionan perfecto.',
    },
  }).catch(() => {});

  for (const fav of [
    { userId: user.id, spaceId: spaces[0].id },
    { userId: user.id, spaceId: spaces[2].id },
    { userId: user.id, spaceId: spaces[4].id },
  ]) {
    await prisma.favorite.upsert({
      where: { userId_spaceId: { userId: fav.userId, spaceId: fav.spaceId } },
      update: {},
      create: fav,
    });
  }

  console.log('Seed completado:', { admin: admin.email, user: user.email, spaces: spaces.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
