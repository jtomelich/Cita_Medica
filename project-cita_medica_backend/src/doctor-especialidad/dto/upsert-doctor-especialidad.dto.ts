import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export class UpsertDoctorEspecialidadDto {
  @ApiProperty({ description: 'Doctor ID (bigint en texto)' })
  @IsString()
  @Matches(/^\d+$/)
  doctor_id!: string;

  @ApiProperty({ description: 'Especialidad ID (bigint en texto)' })
  @IsString()
  @Matches(/^\d+$/)
  especialidad_id!: string;

  @ApiPropertyOptional({ description: 'Minutos por cita en esta especialidad' })
  @IsOptional()
  @IsInt()
  @Min(5)
  duracion_minutos?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  es_principal?: boolean = false;
}