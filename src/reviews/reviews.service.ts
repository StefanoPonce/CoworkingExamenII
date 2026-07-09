import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateReviewDto) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: dto.reservationId },
      include: { review: true },
    });

    if (!reservation) throw new NotFoundException('Reserva no encontrada');
    if (reservation.userId !== userId) {
      throw new ForbiddenException('Solo puedes reseñar tus propias reservas');
    }
    if (reservation.status !== 'COMPLETED') {
      throw new BadRequestException('Solo puedes reseñar reservas finalizadas');
    }
    if (reservation.review) {
      throw new BadRequestException('Esta reserva ya tiene una reseña');
    }

    return this.prisma.review.create({
      data: {
        userId,
        spaceId: reservation.spaceId,
        reservationId: dto.reservationId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  findBySpace(spaceId: number) {
    return this.prisma.review.findMany({
      where: { spaceId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
