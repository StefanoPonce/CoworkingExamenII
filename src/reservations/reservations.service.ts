import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SpacesService } from '../spaces/spaces.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';

const ACTIVE_STATUSES = ['PENDING', 'CONFIRMED'];

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly spacesService: SpacesService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(userId: number, dto: CreateReservationDto) {
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    if (endTime <= startTime) {
      throw new BadRequestException('endTime debe ser posterior a startTime');
    }

    await this.spacesService.findOne(dto.spaceId);

    const overlapping = await this.prisma.reservation.findFirst({
      where: {
        spaceId: dto.spaceId,
        status: { in: ACTIVE_STATUSES },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (overlapping) {
      throw new BadRequestException('El espacio ya está reservado en ese horario');
    }

    return this.prisma.reservation.create({
      data: { ...dto, startTime, endTime, userId },
      include: { space: true },
    });
  }

  findAll() {
    return this.prisma.reservation.findMany({
      include: {
        space: true,
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  async findMine(userId: number) {
    await this.completePastReservations(userId);

    const reservations = await this.prisma.reservation.findMany({
      where: { userId },
      include: { space: true },
      orderBy: { startTime: 'desc' },
    });

    return reservations;
  }

  async findOne(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { space: true },
    });
    if (!reservation) throw new NotFoundException('Reserva no encontrada');
    return reservation;
  }

  async updateStatus(id: number, userId: number, role: string, dto: UpdateReservationStatusDto) {
    const reservation = await this.findOne(id);

    const isOwner = reservation.userId === userId;
    if (!isOwner && role !== 'ADMIN') {
      throw new ForbiddenException('No puedes modificar esta reserva');
    }

    if (dto.status === 'CANCELLED' && !['PENDING', 'CONFIRMED'].includes(reservation.status)) {
      throw new BadRequestException('No se puede cancelar esta reserva');
    }

    const updated = await this.prisma.reservation.update({
      where: { id },
      data: { status: dto.status },
      include: { space: true },
    });

    const space = await this.spacesService.findOne(updated.spaceId);
    const statusMessages: Record<string, string> = {
      CONFIRMED: `Tu reserva para ${space.name} ha sido confirmada.`,
      CANCELLED: `Tu reserva para ${space.name} ha sido cancelada.`,
      COMPLETED: `Tu reserva para ${space.name} ha sido completada.`,
    };

    if (statusMessages[dto.status]) {
      await this.notificationsService.create(
        reservation.userId,
        `Reserva ${dto.status === 'CONFIRMED' ? 'confirmada' : dto.status === 'CANCELLED' ? 'cancelada' : 'completada'}`,
        statusMessages[dto.status],
        dto.status === 'CONFIRMED' ? 'SUCCESS' : dto.status === 'CANCELLED' ? 'WARNING' : 'INFO',
      );
    }

    return updated;
  }

  async remove(id: number, userId: number, role: string) {
    const reservation = await this.findOne(id);
    if (reservation.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('No puedes eliminar esta reserva');
    }
    return this.prisma.reservation.delete({ where: { id } });
  }

  private async completePastReservations(userId: number) {
    const now = new Date();
    await this.prisma.reservation.updateMany({
      where: {
        userId,
        status: 'CONFIRMED',
        endTime: { lt: now },
      },
      data: { status: 'COMPLETED' },
    });
  }
}
