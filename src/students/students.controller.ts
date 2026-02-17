import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Students')
@ApiBearerAuth('bearer')
@Controller('students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Post()
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a student' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateStudentDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(TokenAuthGuard)
  @ApiOperation({ summary: 'List students' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(TokenAuthGuard)
  @ApiOperation({ summary: 'Get student by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update student' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete student' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
