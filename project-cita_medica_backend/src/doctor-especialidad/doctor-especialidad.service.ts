import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertDoctorEspecialidadDto } from './dto/upsert-doctor-especialidad.dto';

@Injectable()
export class DoctorEspecialidadService {
  constructor(private prisma: PrismaService) {}

  async upsert(dto: UpsertDoctorEspecialidadDto) {
    const record = await this.prisma.doctorEspecialidad.upsert({
      where: {
        doctor_id_especialidad_id: {
          doctor_id: BigInt(dto.doctor_id),
          especialidad_id: BigInt(dto.especialidad_id),
        },
      },
      create: {
        doctor_id: BigInt(dto.doctor_id),
        especialidad_id: BigInt(dto.especialidad_id),
        duracion_minutos: dto.duracion_minutos,
        es_principal: dto.es_principal ?? false,
      },
      update: {
        duracion_minutos: dto.duracion_minutos,
        es_principal: dto.es_principal,
      },
      select: {
        doctor_id: true,
        especialidad_id: true,
        duracion_minutos: true,
        es_principal: true,
      },
    });

    return {
      ...record,
      doctor_id: record.doctor_id.toString(),
      especialidad_id: record.especialidad_id.toString(),
    };
  }

  async findByDoctor(doctorId: string) {
    const rows = await this.prisma.doctorEspecialidad.findMany({
      where: { doctor_id: BigInt(doctorId) },
      include: {
        especialidad: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
          },
        },
      },
    });

    return rows.map(r => ({
      doctor_id: r.doctor_id.toString(),
      especialidad_id: r.especialidad_id.toString(),
      duracion_minutos: r.duracion_minutos,
      es_principal: r.es_principal,
      especialidad: {
        ...r.especialidad,
        id: r.especialidad.id.toString(),
      },
    }));
  }

  async remove(dto: UpsertDoctorEspecialidadDto) {
    await this.prisma.doctorEspecialidad.delete({
      where: {
        doctor_id_especialidad_id: {
          doctor_id: BigInt(dto.doctor_id),
          especialidad_id: BigInt(dto.especialidad_id),
        },
      },
    });

    return { ok: true };
  }
}