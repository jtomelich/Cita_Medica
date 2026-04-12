import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePacienteDto) {
    const paciente = await this.prisma.paciente.create({
      data: {
        user_id: BigInt(dto.user_id),
        nombres: dto.nombres,
        apellido_paterno: dto.apellido_paterno,
        apellido_materno: dto.apellido_materno,
        fecha_nacimiento: new Date(dto.fecha_nacimiento),
        sexo: dto.sexo,
        dni: dto.dni,
        celular: dto.celular,
        correo: dto.correo,
      },
    });

    return {
      ...paciente,
      id: paciente.id.toString(),
      user_id: paciente.user_id.toString(),
    };
  }

  async findAll() {
    const pacientes = await this.prisma.paciente.findMany({
      include: {
        user: {
          select: {
            username: true,
            activo: true,
          },
        },
      },
    });

    return pacientes.map(p => ({
      ...p,
      id: p.id.toString(),
      user_id: p.user_id.toString(),
    }));
  }

  async findOne(id: string) {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id: BigInt(id) },
      include: {
        user: {
          select: {
            username: true,
            activo: true,
          },
        },
      },
    });

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return {
      ...paciente,
      id: paciente.id.toString(),
      user_id: paciente.user_id.toString(),
    };
  }

  async update(id: string, dto: UpdatePacienteDto) {
    const paciente = await this.prisma.paciente.update({
      where: { id: BigInt(id) },
      data: {
        nombres: dto.nombres,
        apellido_paterno: dto.apellido_paterno,
        apellido_materno: dto.apellido_materno,
        fecha_nacimiento: dto.fecha_nacimiento
          ? new Date(dto.fecha_nacimiento)
          : undefined,
        sexo: dto.sexo,
        dni: dto.dni,
        celular: dto.celular,
        correo: dto.correo,
      },
    });

    return {
      ...paciente,
      id: paciente.id.toString(),
      user_id: paciente.user_id.toString(),
    };
  }
}