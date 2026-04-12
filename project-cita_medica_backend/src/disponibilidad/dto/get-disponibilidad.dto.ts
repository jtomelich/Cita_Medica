import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class GetDisponibilidadDto {
  @ApiProperty({ description: 'Doctor ID (bigint en texto)' })
  @IsString()
  @Matches(/^\d+$/)
  doctor_id!: string;

  @ApiProperty({ description: 'Fecha base YYYY-MM-DD' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fecha!: string;

  @ApiPropertyOptional({ description: 'Especialidad ID (bigint en texto)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  especialidad_id?: string;

  @ApiPropertyOptional({ description: 'HH:mm' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'desde debe ser HH:mm',
  })
  desde?: string;

  @ApiPropertyOptional({ description: 'HH:mm' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'hasta debe ser HH:mm',
  })
  hasta?: string;
}