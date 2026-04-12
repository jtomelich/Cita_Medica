import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpsertParametroDto {
  @ApiProperty({ description: 'Clave (ID lógico)' })
  @IsString()
  clave!: string;

  @ApiPropertyOptional() @IsOptional() @IsString() valor_text?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() valor_int?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() valor_bool?: boolean;

  @ApiPropertyOptional() @IsOptional() @IsString() descripcion?: string;
}