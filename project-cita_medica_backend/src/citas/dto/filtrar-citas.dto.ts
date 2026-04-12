import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { EstadoCita } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FiltrarCitasDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Doctor ID' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  doctor_id?: string;

  @ApiPropertyOptional({ description: 'Paciente ID' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  paciente_id?: string;

  @ApiPropertyOptional({ description: 'Especialidad ID' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  especialidad_id?: string;

  @ApiPropertyOptional({ enum: EstadoCita, enumName: 'EstadoCita' })
  @IsOptional()
  @IsEnum(EstadoCita)
  estado?: EstadoCita;

  @ApiPropertyOptional({ description: 'Fecha inicio (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  desde?: string;

  @ApiPropertyOptional({ description: 'Fecha fin (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  hasta?: string;
}