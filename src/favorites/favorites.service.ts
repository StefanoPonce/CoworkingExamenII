import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SpacesService } from '../spaces/spaces.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly spacesService: SpacesService,
  ) {}

  async findMine(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: { space: { include: { amenities: { include: { amenity: true } }, reviews: { select: { rating: true } } } } },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((f) => {
      const ratings = f.space.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
          : null;

      return {
        spaceId: f.spaceId,
        createdAt: f.createdAt,
        space: {
          id: f.space.id,
          name: f.space.name,
          description: f.space.description,
          location: f.space.location,
          capacity: f.space.capacity,
          type: f.space.type,
          imageUrl: f.space.imageUrl,
          pricePerHour: f.space.pricePerHour,
          amenities: f.space.amenities.map((sa) => sa.amenity),
          avgRating,
          reviewCount: ratings.length,
          isFavorite: true,
        },
      };
    });
  }

  async add(userId: number, spaceId: number) {
    await this.spacesService.findOne(spaceId);
    return this.prisma.favorite.upsert({
      where: { userId_spaceId: { userId, spaceId } },
      create: { userId, spaceId },
      update: {},
    });
  }

  async remove(userId: number, spaceId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_spaceId: { userId, spaceId } },
    });
    if (!favorite) throw new NotFoundException('Favorito no encontrado');
    return this.prisma.favorite.delete({ where: { userId_spaceId: { userId, spaceId } } });
  }
}
