import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DisponibilidadService } from './disponibilidad.service';
import { GetDisponibilidadDto } from './dto/get-disponibilidad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Disponibilidad')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('disponibilidad')
export class DisponibilidadController {
  constructor(private service: DisponibilidadService) {}

  @Get()
  getDisponibilidad(@Query() query: GetDisponibilidadDto) {
    return this.service.getDisponibilidad(query);
  }
}
``