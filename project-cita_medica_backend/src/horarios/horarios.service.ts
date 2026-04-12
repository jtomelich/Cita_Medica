import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorHorarioReglaDto } from './dto/create-horario-regla.dto';
import { UpdateDoctorHorarioReglaDto } from './dto/update-horario-regla.dto';

function timeStringToUTCDate(time: string): Date {
  const [h, m] = time.split(':').map(Number);
  return new Date(Date.UTC(1970, 0, 1, h, m, 0));
}

function utcDateToHHmm(date: Date): string {
  const h = date.getUTCHours().toString().padStart(2, '0');
  const m = date.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

@Injectable()
export class HorariosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDoctorHorarioReglaDto) {
    const horario = await this.prisma.doctorHorarioRegla.create({
      data: {
        doctor_id: BigInt(dto.doctor_id),
        dia_semana: dto.dia_semana,
        hora_inicio: timeStringToUTCDate(dto.hora_inicio),
        hora_fin: timeStringToUTCDate(dto.hora_fin),
        activo: dto.activo ?? true,
      },
    });

    return {
      id: horario.id.toString(),
      doctor_id: horario.doctor_id.toString(),
      dia_semana: horario.dia_semana,
      hora_inicio: utcDateToHHmm(horario.hora_inicio),
      hora_fin: utcDateToHHmm(horario.hora_fin),
      activo: horario.activo,
    };
  }

  async findByDoctor(doctorId: string) {
    const horarios = await this.prisma.doctorHorarioRegla.findMany({
      where: { doctor_id: BigInt(doctorId) },
      orderBy: [{ dia_semana: 'asc' }, { hora_inicio: 'asc' }],
    });

    return horarios.map((h) => ({
      id: h.id.toString(),
      doctor_id: h.doctor_id.toString(),
      dia_semana: h.dia_semana,
      hora_inicio: utcDateToHHmm(h.hora_inicio),
      hora_fin: utcDateToHHmm(h.hora_fin),
      activo: h.activo,
    }));
  }

  async update(id: string, dto: UpdateDoctorHorarioReglaDto) {
    const horario = await this.prisma.doctorHorarioRegla.update({
      where: { id: BigInt(id) },
      data: {
        dia_semana: dto.dia_semana,
        hora_inicio: dto.hora_inicio
          ? timeStringToUTCDate(dto.hora_inicio)
          : undefined,
        hora_fin: dto.hora_fin
          ? timeStringToUTCDate(dto.hora_fin)
          : undefined,
        activo: dto.activo,
      },
    });

    return {
      id: horario.id.toString(),
      doctor_id: horario.doctor_id.toString(),
      dia_semana: horario.dia_semana,
      hora_inicio: utcDateToHHmm(horario.hora_inicio),
      hora_fin: utcDateToHHmm(horario.hora_fin),
      activo: horario.activo,
    };
  }

  async remove(id: string) {
    const exists = await this.prisma.doctorHorarioRegla.findUnique({
      where: { id: BigInt(id) },
    });

    if (!exists) {
      throw new NotFoundException('Horario no encontrado');
    }

    await this.prisma.doctorHorarioRegla.delete({
      where: { id: BigInt(id) },
    });

    return { ok: true };
  }
}