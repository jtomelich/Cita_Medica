import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Pacientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pacientes')
export class PacientesController {
  constructor(private service: PacientesService) {}

  // 🔐 ADMIN
  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreatePacienteDto) {
    return this.service.create(dto);
  }

  // 🔐 ADMIN
  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.service.findAll();
  }

  // 🔐 ADMIN / PACIENTE
  @Get(':id')
  @Roles('ADMIN', 'PACIENTE')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // 🔐 ADMIN / PACIENTE
  @Patch(':id')
  @Roles('ADMIN', 'PACIENTE')
  update(@Param('id') id: string, @Body() dto: UpdatePacienteDto) {
    return this.service.update(id, dto);
  }
}