import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';

export class CreateDoctorBloqueoDto {
  @ApiProperty({ description: 'Doctor ID (bigint en texto)' })
  @IsString()
  @Matches(/^\d+$/)
  doctor_id!: string;

  @ApiProperty({ description: 'ISO 8601 con zona (timestamptz)' })
  @IsDateString()
  inicio!: string;

  @ApiProperty({ description: 'ISO 8601 con zona (timestamptz)' })
  @IsDateString()
  fin!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  motivo?: string;
}