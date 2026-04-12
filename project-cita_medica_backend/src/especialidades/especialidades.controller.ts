import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { EspecialidadesService } from './especialidades.service';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Especialidades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('especialidades')
export class EspecialidadesController {
  constructor(private service: EspecialidadesService) {}

  // 🔐 Solo ADMIN
  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateEspecialidadDto) {
    return this.service.create(dto);
  }

  // ✅ Autenticado
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ✅ Autenticado
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // 🔐 Solo ADMIN
  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateEspecialidadDto) {
    return this.service.update(id, dto);
  }
}