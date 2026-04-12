import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DoctorEspecialidadService } from './doctor-especialidad.service';
import { UpsertDoctorEspecialidadDto } from './dto/upsert-doctor-especialidad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('DoctorEspecialidad')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('doctor-especialidades')
export class DoctorEspecialidadController {
  constructor(private service: DoctorEspecialidadService) {}

  // 🔐 ADMIN
  @Post()
  @Roles('ADMIN')
  upsert(@Body() dto: UpsertDoctorEspecialidadDto) {
    return this.service.upsert(dto);
  }

  @Get('doctor/:doctorId')
  findByDoctor(@Param('doctorId') doctorId: string) {
    return this.service.findByDoctor(doctorId);
  }

  // 🔐 ADMIN
  @Delete()
  @Roles('ADMIN')
  remove(@Body() dto: UpsertDoctorEspecialidadDto) {
    return this.service.remove(dto);
  }
}