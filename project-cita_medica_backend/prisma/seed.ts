// prisma/seed.ts
import 'dotenv/config';                               // Carga .env
import { PrismaClient, RolUsuario, Sexo, EstadoCita } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

// Crea el Pool del driver 'pg' (Neon requiere TLS)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});

// Crea el adapter para Prisma 7 (cliente clásico sin Accelerate)
const adapter = new PrismaPg(pool);

// Pasa el adapter al constructor del cliente
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1) Admin
  const adminPass = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password_hash: adminPass,
      rol: RolUsuario.ADMIN,
      activo: true,
    },
  });

  // 2) Especialidad
  const especialidad = await prisma.especialidad.upsert({
    where: { nombre: 'Medicina General' },
    update: {},
    create: { nombre: 'Medicina General', descripcion: 'Atención primaria' },
  });

  // 3) Doctor + relación con especialidad
  const doctorUserPass = await bcrypt.hash('Doc123!', 10);
  const uDoc = await prisma.user.upsert({
    where: { username: 'doc1' },
    update: {},
    create: {
      username: 'doc1',
      password_hash: doctorUserPass,
      rol: RolUsuario.DOCTOR,
      activo: true,
    },
  });

  const doctor = await prisma.doctor.upsert({
    where: { user_id: uDoc.id },
    update: {},
    create: {
      user_id: uDoc.id,
      nombres: 'Juan',
      apellido_paterno: 'Pérez',
      apellido_materno: 'Lopez',
      fecha_nacimiento: new Date('1980-01-01'),
      sexo: Sexo.M,
      dni: 'DOC-123',
      celular: '70000000',
      correo: 'juan.perez@example.com',
      matricula: 'MAT-999',
      fecha_contratacion: new Date('2024-01-01'),
      duracion_minutos_default: 15,
    },
  });

  await prisma.doctorEspecialidad.upsert({
    where: { doctor_id_especialidad_id: { doctor_id: doctor.id, especialidad_id: especialidad.id } },
    update: { duracion_minutos: 15, es_principal: true },
    create: {
      doctor_id: doctor.id,
      especialidad_id: especialidad.id,
      duracion_minutos: 15,
      es_principal: true,
    },
  });

  // 4) Paciente
  const pacUserPass = await bcrypt.hash('Pac123!', 10);
  const uPac = await prisma.user.upsert({
    where: { username: 'pac1' },
    update: {},
    create: {
      username: 'pac1',
      password_hash: pacUserPass,
      rol: RolUsuario.PACIENTE,
      activo: true,
    },
  });

  const paciente = await prisma.paciente.upsert({
    where: { user_id: uPac.id },
    update: {},
    create: {
      user_id: uPac.id,
      nombres: 'María',
      apellido_paterno: 'Gómez',
      apellido_materno: 'Rojas',
      fecha_nacimiento: new Date('1995-05-05'),
      sexo: Sexo.F,
      dni: 'PAC-321',
      celular: '71000000',
      correo: 'maria.gomez@example.com',
    },
  });

  // 5) Cita de ejemplo (hoy +1h, 30 min)
  const start = new Date(Date.now() + 60 * 60 * 1000);
  const end   = new Date(start.getTime() + 30 * 60 * 1000);

  const cita = await prisma.cita.create({
    data: {
      paciente_id: paciente.id,
      doctor_id: doctor.id,
      especialidad_id: especialidad.id,
      inicio: start,
      fin: end,
      estado: EstadoCita.PENDIENTE_PAGO,
      notas: 'Cita de prueba inicial',
    },
  });

  console.log({ admin, especialidad, doctor, paciente, cita });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });