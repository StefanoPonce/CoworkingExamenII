import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AmenitiesService } from './amenities.service';
import { AmenitiesController } from './amenities.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AmenitiesController],
  providers: [AmenitiesService],
})
export class AmenitiesModule {}
