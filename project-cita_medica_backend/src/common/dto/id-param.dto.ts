import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class IdParamDto {
  @ApiProperty({ description: 'ID bigint en texto (solo dígitos)' })
  @IsString()
  @Matches(/^\d+$/, { message: 'id debe ser numérico en texto' })
  id!: string;
}