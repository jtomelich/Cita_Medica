import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';

export class CancelarCitaDto {
  @ApiProperty({ description: 'Usuario que cancela (bigint en texto)' })
  @IsString()
  @Matches(/^\d+$/)
  cancelado_por_user_id!: string;

  @ApiProperty({ description: 'Fecha/hora de cancelación (ISO 8601 con zona)' })
  @IsDateString()
  cancelado_en!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  motivo_cancelacion?: string;
}