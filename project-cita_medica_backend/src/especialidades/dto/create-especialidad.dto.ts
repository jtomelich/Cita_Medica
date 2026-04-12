import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateEspecialidadDto {
  @ApiProperty() @IsString() nombre!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() descripcion?: string;
}