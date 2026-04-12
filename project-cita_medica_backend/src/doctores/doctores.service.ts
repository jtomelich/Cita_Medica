import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctoresService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDoctorDto) {
    const doctor = await this.prisma.doctor.create({
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
        matricula: dto.matricula,
        fecha_contratacion: new Date(dto.fecha_contratacion),
        duracion_minutos_default: dto.duracion_minutos_default ?? 30,
      },
      select: {
        id: true,
        user_id: true,
        nombres: true,
        apellido_paterno: true,
        apellido_materno: true,
        sexo: true,
        dni: true,
        celular: true,
        correo: true,
        matricula: true,
        duracion_minutos_default: true,
      },
    });

    return {
      ...doctor,
      id: doctor.id.toString(),
      user_id: doctor.user_id.toString(),
    };
  }

  async findAll() {
    const doctors = await this.prisma.doctor.findMany({
      include: {
        user: {
          select: { username: true, rol: true, activo: true },
        },
      },
    });

    return doctors.map((d) => ({
      ...d,
      id: d.id.toString(),
      user_id: d.user_id.toString(),
    }));
  }

  async findOne(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: BigInt(id) },
      include: {
        user: {
          select: { username: true, rol: true, activo: true },
        },
        especialidades: {
          include: {
            especialidad: {
              select: { id: true, nombre: true },
            },
          },
        },
      },
    });

    if (!doctor) throw new NotFoundException('Doctor no encontrado');

    return {
      ...doctor,
      id: doctor.id.toString(),
      user_id: doctor.user_id.toString(),
      especialidades: doctor.especialidades.map((e) => ({
        especialidad_id: e.especialidad_id.toString(),
        nombre: e.especialidad.nombre,
        duracion_minutos: e.duracion_minutos,
        es_principal: e.es_principal,
      })),
    };
  }

  async update(id: string, dto: UpdateDoctorDto) {
    const doctor = await this.prisma.doctor.update({
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
        matricula: dto.matricula,
        fecha_contratacion: dto.fecha_contratacion
          ? new Date(dto.fecha_contratacion)
          : undefined,
        duracion_minutos_default: dto.duracion_minutos_default,
      },
    });

    return {
      ...doctor,
      id: doctor.id.toString(),
      user_id: doctor.user_id.toString(),
    };
  }
}