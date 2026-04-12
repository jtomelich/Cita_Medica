import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Auditoría')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('auditoria')
export class AuditoriaController {
  constructor(private prisma: PrismaService) {}

  /**
   * Listar auditoría general
   */
  @Get()
  @ApiQuery({ name: 'tabla', required: false })
  @ApiQuery({ name: 'registro_id', required: false })
  @ApiQuery({ name: 'accion', required: false })
  @ApiQuery({ name: 'usuario_id', required: false })
  async findAll(
    @Query('tabla') tabla?: string,
    @Query('registro_id') registroId?: string,
    @Query('accion') accion?: string,
    @Query('usuario_id') usuarioId?: string,
  ) {
    const auditorias = await this.prisma.auditoria.findMany({
      where: {
        tabla: tabla || undefined,
        registro_id: registroId || undefined,
        accion: accion || undefined,
        usuario_id: usuarioId ? BigInt(usuarioId) : undefined,
      },
      orderBy: { fecha: 'desc' },
      include: {
        usuario: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return auditorias.map((a) => ({
      id: a.id.toString(),
      tabla: a.tabla,
      registro_id: a.registro_id,
      accion: a.accion,
      fecha: a.fecha,
      valores_antes: a.valores_antes,
      valores_despues: a.valores_despues,
      usuario: a.usuario
        ? {
            id: a.usuario.id.toString(),
            username: a.usuario.username,
          }
        : null,
    }));
  }
}