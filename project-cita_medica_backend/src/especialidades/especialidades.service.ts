import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';

@Injectable()
export class EspecialidadesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEspecialidadDto) {
    const especialidad = await this.prisma.especialidad.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
      },
    });

    return {
      ...especialidad,
      id: especialidad.id.toString(), // ✅ BigInt → string
    };
  }

  async findAll() {
    const especialidades = await this.prisma.especialidad.findMany({
      select: {
        id: true,
        nombre: true,
        descripcion: true,
      },
      orderBy: { nombre: 'asc' },
    });

    return especialidades.map((e) => ({
      ...e,
      id: e.id.toString(), // ✅ BigInt → string
    }));
  }

  async findOne(id: string) {
    const especialidad = await this.prisma.especialidad.findUnique({
      where: { id: BigInt(id) },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
      },
    });

    if (!especialidad) {
      throw new NotFoundException('Especialidad no encontrada');
    }

    return {
      ...especialidad,
      id: especialidad.id.toString(),
    };
  }

  async update(id: string, dto: UpdateEspecialidadDto) {
    const especialidad = await this.prisma.especialidad.update({
      where: { id: BigInt(id) },
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
      },
    });

    return {
      ...especialidad,
      id: especialidad.id.toString(),
    };
  }
}