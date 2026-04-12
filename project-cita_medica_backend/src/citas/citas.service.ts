import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { EstadoCita } from '@prisma/client';

@Injectable()
export class CitasService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear cita médica
   */
  async crear(dto: CreateCitaDto, userId: string) {
    const inicio = new Date(dto.inicio);
    const fin = new Date(dto.fin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      throw new BadRequestException('Formato de fecha inválido');
    }

    if (inicio >= fin) {
      throw new BadRequestException('El horario fin debe ser posterior al inicio');
    }

    // 🔒 Validar solapamiento (citas activas)
    const conflicto = await this.prisma.cita.findFirst({
      where: {
        doctor_id: BigInt(dto.doctor_id),
        estado: { in: [EstadoCita.PENDIENTE_PAGO, EstadoCita.ACEPTADA] },
        inicio: { lt: fin },
        fin: { gt: inicio },
      },
    });

    if (conflicto) {
      throw new BadRequestException('El horario ya está ocupado');
    }

    const cita = await this.prisma.cita.create({
      data: {
        paciente_id: BigInt(dto.paciente_id),
        doctor_id: BigInt(dto.doctor_id),
        especialidad_id: BigInt(dto.especialidad_id),
        inicio,
        fin,
        estado: EstadoCita.PENDIENTE_PAGO,
        notas: dto.notas,
        creado_por_user_id: BigInt(userId),
      },
    });

    return {
      id: cita.id.toString(),
      estado: cita.estado,
      inicio: cita.inicio,
      fin: cita.fin,
    };
  }

  /**
   * Cancelar una cita
   */
  async cancelar(id: string, userId: string, motivo?: string) {
    const cita = await this.prisma.cita.findUnique({
      where: { id: BigInt(id) },
    });

    if (!cita) {
      throw new NotFoundException('Cita no encontrada');
    }

    if (cita.estado === EstadoCita.CANCELADA) {
      throw new BadRequestException('La cita ya está cancelada');
    }

    return this.prisma.cita.update({
      where: { id: BigInt(id) },
      data: {
        estado: EstadoCita.CANCELADA,
        cancelado_por_user_id: BigInt(userId),
        cancelado_en: new Date(),
        motivo_cancelacion: motivo,
      },
    });
  }
}