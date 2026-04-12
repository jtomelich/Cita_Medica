import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BloqueosService } from './bloqueos.service';
import { CreateDoctorBloqueoDto } from './dto/create-bloqueo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Bloqueos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bloqueos')
export class BloqueosController {
  constructor(private service: BloqueosService) {}

  // 🔐 ADMIN
  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateDoctorBloqueoDto) {
    return this.service.create(dto);
  }

  // ✅ ADMIN / DOCTOR
  @Get('doctor/:doctorId')
  @Roles('ADMIN', 'DOCTOR')
  findByDoctor(@Param('doctorId') doctorId: string) {
    return this.service.findByDoctor(doctorId);
  }

  // 🔐 ADMIN
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}