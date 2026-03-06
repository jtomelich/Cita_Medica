-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'DOCTOR', 'PACIENTE');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('M', 'F', 'X');

-- CreateEnum
CREATE TYPE "EstadoCita" AS ENUM ('PENDIENTE_PAGO', 'ACEPTADA', 'CANCELADA', 'NO_ASISTIO');

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email_login" TEXT,
    "password_hash" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMPTZ(6),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellido_paterno" TEXT NOT NULL,
    "apellido_materno" TEXT,
    "fecha_nacimiento" DATE NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "dni" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "correo" TEXT,
    "matricula" TEXT NOT NULL,
    "fecha_contratacion" DATE NOT NULL,
    "fecha_registro" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duracion_minutos_default" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellido_paterno" TEXT NOT NULL,
    "apellido_materno" TEXT,
    "fecha_nacimiento" DATE NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "dni" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "correo" TEXT,
    "fecha_registro" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Especialidad" (
    "id" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Especialidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorEspecialidad" (
    "doctor_id" BIGINT NOT NULL,
    "especialidad_id" BIGINT NOT NULL,
    "duracion_minutos" INTEGER,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DoctorEspecialidad_pkey" PRIMARY KEY ("doctor_id","especialidad_id")
);

-- CreateTable
CREATE TABLE "DoctorHorarioRegla" (
    "id" BIGSERIAL NOT NULL,
    "doctor_id" BIGINT NOT NULL,
    "dia_semana" INTEGER NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DoctorHorarioRegla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorBloqueo" (
    "id" BIGSERIAL NOT NULL,
    "doctor_id" BIGINT NOT NULL,
    "inicio" TIMESTAMPTZ(6) NOT NULL,
    "fin" TIMESTAMPTZ(6) NOT NULL,
    "motivo" TEXT,

    CONSTRAINT "DoctorBloqueo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cita" (
    "id" BIGSERIAL NOT NULL,
    "paciente_id" BIGINT NOT NULL,
    "doctor_id" BIGINT NOT NULL,
    "especialidad_id" BIGINT NOT NULL,
    "inicio" TIMESTAMPTZ(6) NOT NULL,
    "fin" TIMESTAMPTZ(6) NOT NULL,
    "estado" "EstadoCita" NOT NULL DEFAULT 'PENDIENTE_PAGO',
    "creado_por_user_id" BIGINT,
    "notas" TEXT,
    "doctor_atendio_id" BIGINT,
    "cancelado_por_user_id" BIGINT,
    "cancelado_en" TIMESTAMPTZ(6),
    "motivo_cancelacion" TEXT,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParametroSistema" (
    "clave" TEXT NOT NULL,
    "valor_text" TEXT,
    "valor_int" INTEGER,
    "valor_bool" BOOLEAN,
    "descripcion" TEXT,

    CONSTRAINT "ParametroSistema_pkey" PRIMARY KEY ("clave")
);

-- CreateTable
CREATE TABLE "Auditoria" (
    "id" BIGSERIAL NOT NULL,
    "tabla" TEXT NOT NULL,
    "registro_id" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "usuario_id" BIGINT,
    "valores_antes" JSONB,
    "valores_despues" JSONB,
    "fecha" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_user_id_key" ON "Doctor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_dni_key" ON "Doctor"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_matricula_key" ON "Doctor"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_user_id_key" ON "Paciente"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_dni_key" ON "Paciente"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Especialidad_nombre_key" ON "Especialidad"("nombre");

-- CreateIndex
CREATE INDEX "idx_horario_doc_dia" ON "DoctorHorarioRegla"("doctor_id", "dia_semana");

-- CreateIndex
CREATE INDEX "idx_bloqueo_doc_rango" ON "DoctorBloqueo"("doctor_id", "inicio", "fin");

-- CreateIndex
CREATE INDEX "idx_citas_doctor_inicio" ON "Cita"("doctor_id", "inicio");

-- CreateIndex
CREATE INDEX "idx_citas_paciente_inicio" ON "Cita"("paciente_id", "inicio");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorEspecialidad" ADD CONSTRAINT "DoctorEspecialidad_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorEspecialidad" ADD CONSTRAINT "DoctorEspecialidad_especialidad_id_fkey" FOREIGN KEY ("especialidad_id") REFERENCES "Especialidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorHorarioRegla" ADD CONSTRAINT "DoctorHorarioRegla_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorBloqueo" ADD CONSTRAINT "DoctorBloqueo_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_especialidad_id_fkey" FOREIGN KEY ("especialidad_id") REFERENCES "Especialidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_creado_por_user_id_fkey" FOREIGN KEY ("creado_por_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_cancelado_por_user_id_fkey" FOREIGN KEY ("cancelado_por_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_doctor_atendio_id_fkey" FOREIGN KEY ("doctor_atendio_id") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
