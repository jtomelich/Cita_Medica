import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetDisponibilidadDto } from './dto/get-disponibilidad.dto';
import { EstadoCita } from '@prisma/client';

function timeStringToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToHHmm(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

@Injectable()
export class DisponibilidadService {
  constructor(private prisma: PrismaService) {}

  async getDisponibilidad(dto: GetDisponibilidadDto) {
    const doctorId = BigInt(dto.doctor_id);

    // ✅ Día local correcto
    const fecha = new Date(`${dto.fecha}T00:00:00`);
    const diaSemana = fecha.getDay(); // 0=Domingo ... 6=Sábado

    // 1️⃣ Duración de la cita
    let duracion = 30;

    if (dto.especialidad_id) {
      const esp = await this.prisma.doctorEspecialidad.findUnique({
        where: {
          doctor_id_especialidad_id: {
            doctor_id: doctorId,
            especialidad_id: BigInt(dto.especialidad_id),
          },
        },
      });
      if (esp?.duracion_minutos) duracion = esp.duracion_minutos;
    } else {
      const doctor = await this.prisma.doctor.findUnique({
        where: { id: doctorId },
      });
      if (doctor?.duracion_minutos_default)
        duracion = doctor.duracion_minutos_default;
    }

    // 2️⃣ Horarios del día
    const horarios = await this.prisma.doctorHorarioRegla.findMany({
      where: {
        doctor_id: doctorId,
        dia_semana: diaSemana,
        activo: true,
      },
      orderBy: { hora_inicio: 'asc' },
    });

    if (horarios.length === 0) return [];

    // 3️⃣ Rango del día
    const inicioDia = new Date(`${dto.fecha}T00:00:00-04:00`);
    const finDia = new Date(`${dto.fecha}T23:59:59-04:00`);

    // 4️⃣ Bloqueos
    const bloqueos = await this.prisma.doctorBloqueo.findMany({
      where: {
        doctor_id: doctorId,
        inicio: { lte: finDia },
        fin: { gte: inicioDia },
      },
    });

    // 5️⃣ Citas existentes (CLAVE)
    const citas = await this.prisma.cita.findMany({
      where: {
        doctor_id: doctorId,
        estado: { in: [EstadoCita.PENDIENTE_PAGO, EstadoCita.ACEPTADA] },
        inicio: { lt: finDia },
        fin: { gt: inicioDia },
      },
    });

    // 6️⃣ Generar slots
    let slots: { inicio: string; fin: string }[] = [];

    for (const h of horarios) {
      const desde = timeStringToMinutes(
        `${h.hora_inicio.getUTCHours().toString().padStart(2, '0')}:${h.hora_inicio
          .getUTCMinutes()
          .toString()
          .padStart(2, '0')}`,
      );

      const hasta = timeStringToMinutes(
        `${h.hora_fin.getUTCHours().toString().padStart(2, '0')}:${h.hora_fin
          .getUTCMinutes()
          .toString()
          .padStart(2, '0')}`,
      );

      for (let t = desde; t + duracion <= hasta; t += duracion) {
        const inicioSlot = new Date(`${dto.fecha}T${minutesToHHmm(t)}:00-04:00`);
        const finSlot = new Date(
          `${dto.fecha}T${minutesToHHmm(t + duracion)}:00-04:00`,
        );

        const bloqueado = bloqueos.some(
          (b) => inicioSlot < b.fin && finSlot > b.inicio,
        );

        const ocupadoPorCita = citas.some(
          (c) => inicioSlot < c.fin && finSlot > c.inicio,
        );

        if (!bloqueado && !ocupadoPorCita) {
          slots.push({
            inicio: minutesToHHmm(t),
            fin: minutesToHHmm(t + duracion),
          });
        }
      }
    }

    // 7️⃣ Filtros opcionales
    if (dto.desde) {
      const desdeMin = timeStringToMinutes(dto.desde);
      slots = slots.filter(
        (s) => timeStringToMinutes(s.inicio) >= desdeMin,
      );
    }

    if (dto.hasta) {
      const hastaMin = timeStringToMinutes(dto.hasta);
      slots = slots.filter(
        (s) => timeStringToMinutes(s.fin) <= hastaMin,
      );
    }

    return slots;
  }
}