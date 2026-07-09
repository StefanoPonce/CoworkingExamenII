import { Controller, Get, UseGuards } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Get()
  findAll() {
    return this.amenitiesService.findAll();
  }
}
