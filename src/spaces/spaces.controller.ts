import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { FilterSpacesDto } from './dto/filter-spaces.dto';
import { AvailabilityQueryDto } from './dto/availability-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Get()
  findAll(@Query() filters: FilterSpacesDto, @Req() req: any) {
    return this.spacesService.findAll(filters, req.user.userId);
  }

  @Get(':id/availability')
  getAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: AvailabilityQueryDto,
  ) {
    return this.spacesService.getAvailability(id, query.date);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.spacesService.findOne(id, req.user.userId);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateSpaceDto) {
    return this.spacesService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSpaceDto) {
    return this.spacesService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.spacesService.remove(id);
  }
}
