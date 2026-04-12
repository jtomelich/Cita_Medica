import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { CancelarCitaDto } from './dto/cancelar-cita.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Citas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('citas')
export class CitasController {
  constructor(private service: CitasService) {}

  @Post()
  crear(@Body() dto: CreateCitaDto, @CurrentUser() user: any) {
    return this.service.crear(dto, user.id);
  }

  @Post(':id/cancelar')
  cancelar(
    @Param('id') id: string,
    @Body() dto: CancelarCitaDto,
    @CurrentUser() user: any,
  ) {
    return this.service.cancelar(id, user.id, dto.motivo_cancelacion);
  }
}