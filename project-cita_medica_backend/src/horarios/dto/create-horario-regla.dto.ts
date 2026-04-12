import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Matches, Min, Max } from 'class-validator';

export class CreateDoctorHorarioReglaDto {
  @ApiProperty({ description: 'Doctor ID (bigint en texto)' })
  @IsString()
  @Matches(/^\d+$/)
  doctor_id!: string;

  @ApiProperty({ description: '0=Domingo ... 6=Sábado', minimum: 0, maximum: 6 })
  @IsInt()
  @Min(0)
  @Max(6)
  dia_semana!: number;

  @ApiProperty({ description: 'HH:mm (24h)' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'hora_inicio debe ser HH:mm' })
  hora_inicio!: string;

  @ApiProperty({ description: 'HH:mm (24h)' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'hora_fin debe ser HH:mm' })
  hora_fin!: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}