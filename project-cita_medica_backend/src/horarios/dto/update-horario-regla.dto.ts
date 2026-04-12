import { PartialType } from '@nestjs/swagger';
import { CreateDoctorHorarioReglaDto } from './create-horario-regla.dto';

export class UpdateDoctorHorarioReglaDto extends PartialType(CreateDoctorHorarioReglaDto) {}