import { PartialType } from '@nestjs/swagger';
import { CreateDoctorBloqueoDto } from './create-bloqueo.dto';

export class UpdateDoctorBloqueoDto extends PartialType(CreateDoctorBloqueoDto) {}