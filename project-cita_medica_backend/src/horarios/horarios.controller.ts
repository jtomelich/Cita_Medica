import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { CreateDoctorHorarioReglaDto } from './dto/create-horario-regla.dto';
import { UpdateDoctorHorarioReglaDto } from './dto/update-horario-regla.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Horarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('horarios')
export class HorariosController {
  constructor(private service: HorariosService) {}

  // 🔐 ADMIN
  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateDoctorHorarioReglaDto) {
    return this.service.create(dto);
  }

  // ✅ ADMIN / DOCTOR
  @Get('doctor/:doctorId')
  @Roles('ADMIN', 'DOCTOR')
  findByDoctor(@Param('doctorId') doctorId: string) {
    return this.service.findByDoctor(doctorId);
  }

  // 🔐 ADMIN
  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateDoctorHorarioReglaDto) {
    return this.service.update(id, dto);
  }

  // 🔐 ADMIN
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}