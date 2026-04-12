import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FiltrarAuditoriaDto extends PaginationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() tabla?: string;

  @ApiPropertyOptional({ description: 'Registro ID (texto)' })
  @IsOptional()
  @IsString()
  registro_id?: string;

  @ApiPropertyOptional({ description: 'Usuario ID (bigint en texto)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  usuario_id?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() accion?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString() desde?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() hasta?: string;
}