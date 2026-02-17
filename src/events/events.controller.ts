import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EventStatus } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Events')
@ApiBearerAuth('bearer')
@Controller('events')
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Post()
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create event' })
  create(@Body() dto: CreateEventDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(TokenAuthGuard)
  @ApiOperation({ summary: 'List events' })
  @ApiQuery({ name: 'status', required: false, enum: EventStatus })
  findAll(@Query('status') status?: EventStatus) {
    return this.service.findAll(status);
  }

  @Get(':id')
  @UseGuards(TokenAuthGuard)
  @ApiOperation({ summary: 'Get event by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update event' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEventDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/cancel')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Cancel event' })
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.service.cancel(id);
  }

  @Post(':eventId/subscribe/:studentId')
  @UseGuards(TokenAuthGuard)
  @ApiOperation({ summary: 'Subscribe student to event' })
  subscribe(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.service.subscribe(eventId, studentId);
  }

  @Delete(':eventId/unsubscribe/:studentId')
  @UseGuards(TokenAuthGuard)
  @ApiOperation({ summary: 'Unsubscribe student from event' })
  unsubscribe(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.service.unsubscribe(eventId, studentId);
  }
}
