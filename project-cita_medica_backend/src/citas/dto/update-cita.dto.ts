import { PartialType } from '@nestjs/swagger';
import { CreateCitaDto } from './create-cita.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { EstadoCita } from '@prisma/client';

export class UpdateCitaDto extends PartialType(CreateCitaDto) {
  @ApiPropertyOptional({ enum: EstadoCita, enumName: 'EstadoCita' })
  @IsOptional()
  @IsEnum(EstadoCita)
  estado?: EstadoCita;

  @ApiPropertyOptional({ description: 'Doctor que atendió (opcional, bigint en texto)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  doctor_atendio_id?: string;
}