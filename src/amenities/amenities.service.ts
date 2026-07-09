import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AmenitiesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.amenity.findMany({ orderBy: { name: 'asc' } });
  }
}
