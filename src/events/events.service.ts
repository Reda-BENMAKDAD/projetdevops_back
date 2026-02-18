import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventDto) {
    const data = { ...dto, date: new Date(dto.date) };
    return this.prisma.event.create({ data });
  }

  async findAll(status?: EventStatus) {
    const where = status ? { status } : undefined;
    return this.prisma.event.findMany({ where, orderBy: { date: 'asc' } });
  }

  async findOne(id: number) {
    const ev = await this.prisma.event.findUnique({ where: { id } });
    if (!ev) throw new NotFoundException('Event not found');
    return ev;
  }

  async update(id: number, dto: UpdateEventDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    return this.prisma.event.update({ where: { id }, data });
  }

  async cancel(id: number) {
    await this.findOne(id);
    return this.prisma.event.update({ where: { id }, data: { status: EventStatus.CANCELED } });
  }

  async subscribe(eventId: number, studentId: number) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.status === EventStatus.CANCELED) {
      throw new BadRequestException('Cannot subscribe to a canceled event');
    }

    const student = await this.prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student not found');

    const existing = await this.prisma.eventSubscription.findUnique({
      where: { studentId_eventId: { studentId, eventId } },
    });
    if (existing) throw new BadRequestException('Already subscribed');

    return this.prisma.eventSubscription.create({ data: { studentId, eventId } });
  }

  async unsubscribe(eventId: number, studentId: number) {
    const existing = await this.prisma.eventSubscription.findUnique({
      where: { studentId_eventId: { studentId, eventId } },
    });
    if (!existing) throw new NotFoundException('Subscription not found');
    return this.prisma.eventSubscription.delete({ where: { id: existing.id } });
  }
}
