import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorBloqueoDto } from './dto/create-bloqueo.dto';

@Injectable()
export class BloqueosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDoctorBloqueoDto) {
    const bloqueo = await this.prisma.doctorBloqueo.create({
      data: {
        doctor_id: BigInt(dto.doctor_id),
        inicio: new Date(dto.inicio), // ✓ con zona horaria
        fin: new Date(dto.fin),
        motivo: dto.motivo,
      },
    });

    return {
      id: bloqueo.id.toString(),
      doctor_id: bloqueo.doctor_id.toString(),
      inicio: bloqueo.inicio.toISOString(),
      fin: bloqueo.fin.toISOString(),
      motivo: bloqueo.motivo,
    };
  }

  async findByDoctor(doctorId: string) {
    const bloqueos = await this.prisma.doctorBloqueo.findMany({
      where: { doctor_id: BigInt(doctorId) },
      orderBy: { inicio: 'asc' },
    });

    return bloqueos.map(b => ({
      id: b.id.toString(),
      doctor_id: b.doctor_id.toString(),
      inicio: b.inicio.toISOString(),
      fin: b.fin.toISOString(),
      motivo: b.motivo,
    }));
  }

  async remove(id: string) {
    await this.prisma.doctorBloqueo.delete({
      where: { id: BigInt(id) },
    });

    return { ok: true };
  }
}