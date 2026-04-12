import { Module } from '@nestjs/common';
import { DoctorEspecialidadService } from './doctor-especialidad.service';
import { DoctorEspecialidadController } from './doctor-especialidad.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DoctorEspecialidadController],
  providers: [DoctorEspecialidadService],
})
export class DoctorEspecialidadModule {}