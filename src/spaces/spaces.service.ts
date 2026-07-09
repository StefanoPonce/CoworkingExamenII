import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { FilterSpacesDto } from './dto/filter-spaces.dto';

const ACTIVE_STATUSES = ['PENDING', 'CONFIRMED'];
const WORK_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];

const spaceInclude = {
  amenities: { include: { amenity: true } },
  reviews: { select: { rating: true } },
};

@Injectable()
export class SpacesService {
  constructor(private readonly prisma: PrismaService) {}

  private enrichSpace(space: any, favoriteIds: number[] = []) {
    const ratings = space.reviews?.map((r: { rating: number }) => r.rating) ?? [];
    const avgRating =
      ratings.length > 0
        ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) / 10
        : null;

    return {
      id: space.id,
      name: space.name,
      description: space.description,
      location: space.location,
      capacity: space.capacity,
      type: space.type,
      imageUrl: space.imageUrl,
      pricePerHour: space.pricePerHour,
      status: space.status,
      amenities: space.amenities?.map((sa: any) => sa.amenity) ?? [],
      avgRating,
      reviewCount: ratings.length,
      isFavorite: favoriteIds.includes(space.id),
      createdAt: space.createdAt,
      updatedAt: space.updatedAt,
    };
  }

  async create(dto: CreateSpaceDto) {
    const { amenityNames, ...data } = dto;
    const space = await this.prisma.space.create({ data });

    if (amenityNames?.length) {
      await this.linkAmenities(space.id, amenityNames);
    }

    return this.findOne(space.id);
  }

  async findAll(filters: FilterSpacesDto, userId?: number) {
    const where: any = { status: true };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.amenities) {
      const names = filters.amenities.split(',').map((a) => a.trim());
      where.AND = names.map((name) => ({
        amenities: { some: { amenity: { name: { equals: name, mode: 'insensitive' } } } },
      }));
    }

    const spaces = await this.prisma.space.findMany({
      where,
      include: spaceInclude,
      orderBy: { name: 'asc' },
    });

    const favoriteIds = userId ? await this.getFavoriteIds(userId) : [];
    return spaces.map((s) => this.enrichSpace(s, favoriteIds));
  }

  async findOne(id: number, userId?: number) {
    const space = await this.prisma.space.findUnique({
      where: { id },
      include: {
        ...spaceInclude,
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!space) throw new NotFoundException('Espacio no encontrado');

    const favoriteIds = userId ? await this.getFavoriteIds(userId) : [];
    const enriched = this.enrichSpace(space, favoriteIds);

    return {
      ...enriched,
      reviews: space.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        user: r.user,
      })),
    };
  }

  async getAvailability(id: number, date: string) {
    await this.findOne(id);

    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);

    const reservations = await this.prisma.reservation.findMany({
      where: {
        spaceId: id,
        status: { in: ACTIVE_STATUSES },
        startTime: { lt: dayEnd },
        endTime: { gt: dayStart },
      },
    });

    const slots = WORK_HOURS.map((hour) => {
      const start = new Date(`${date}T${String(hour).padStart(2, '0')}:00:00`);
      const end = new Date(`${date}T${String(hour + 1).padStart(2, '0')}:00:00`);
      const occupied = reservations.some((r) => r.startTime < end && r.endTime > start);
      return { hour, label: `${hour}:00`, available: !occupied };
    });

    return { date, slots };
  }

  async update(id: number, dto: UpdateSpaceDto) {
    await this.findOne(id);
    const { amenityNames, ...data } = dto as CreateSpaceDto;

    const space = await this.prisma.space.update({ where: { id }, data });

    if (amenityNames !== undefined) {
      await this.prisma.spaceAmenity.deleteMany({ where: { spaceId: id } });
      if (amenityNames.length) {
        await this.linkAmenities(id, amenityNames);
      }
    }

    return this.findOne(space.id);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.space.update({ where: { id }, data: { status: false } });
  }

  private async linkAmenities(spaceId: number, names: string[]) {
    for (const name of names) {
      const amenity = await this.prisma.amenity.upsert({
        where: { name },
        create: { name },
        update: {},
      });
      await this.prisma.spaceAmenity.upsert({
        where: { spaceId_amenityId: { spaceId, amenityId: amenity.id } },
        create: { spaceId, amenityId: amenity.id },
        update: {},
      });
    }
  }

  private async getFavoriteIds(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      select: { spaceId: true },
    });
    return favorites.map((f) => f.spaceId);
  }
}
