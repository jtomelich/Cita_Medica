import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EspecialidadesModule } from './especialidades/especialidades.module';
import { DoctorEspecialidadModule } from './doctor-especialidad/doctor-especialidad.module';
import { DoctoresModule } from './doctores/doctores.module';
import { HorariosModule } from './horarios/horarios.module';
import { BloqueosModule } from './bloqueos/bloqueos.module';
import { DisponibilidadModule } from './disponibilidad/disponibilidad.module';
import { CitasModule } from './citas/citas.module';
import { AuditoriaService } from './auditoria/auditoria.service';
import { AuditoriaController } from './auditoria/auditoria.controller';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { PacientesService } from './pacientes/pacientes.service';
import { PacientesController } from './pacientes/pacientes.controller';
import { PacientesModule } from './pacientes/pacientes.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, EspecialidadesModule, DoctorEspecialidadModule, DoctoresModule, HorariosModule, BloqueosModule, DisponibilidadModule, CitasModule, AuditoriaModule, PacientesModule],
  controllers: [AppController, AuditoriaController, PacientesController],
  providers: [AppService, AuditoriaService, PacientesService],
})
export class AppModule {}
