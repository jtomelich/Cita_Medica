import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import { IsEnum } from 'class-validator';
import { Sexo } from '@prisma/client';

export class CreatePacienteDto {
  @ApiProperty({ description: 'User ID (bigint en texto)' })
  @IsString()
  @Matches(/^\d+$/)
  user_id!: string;

  @ApiProperty() @IsString() nombres!: string;
  @ApiProperty() @IsString() apellido_paterno!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apellido_materno?: string;

  @ApiProperty({ format: 'date' })
  @IsDateString()
  fecha_nacimiento!: string;

  @ApiProperty({ enum: Sexo, enumName: 'Sexo' })
  @IsEnum(Sexo)
  sexo!: Sexo;

  @ApiProperty() @IsString() dni!: string;
  @ApiProperty() @IsString() celular!: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() correo?: string;
}