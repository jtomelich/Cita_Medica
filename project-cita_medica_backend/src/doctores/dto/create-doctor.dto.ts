import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';
import { IsEnum } from 'class-validator';
import { Sexo } from '@prisma/client';

export class CreateDoctorDto {
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

  @ApiProperty({ description: 'Documento (único)' })
  @IsString()
  dni!: string;

  @ApiProperty() @IsString() celular!: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() correo?: string;

  @ApiProperty({ description: 'Matrícula profesional (única)' })
  @IsString()
  matricula!: string;

  @ApiProperty({ format: 'date' })
  @IsDateString()
  fecha_contratacion!: string;

  @ApiPropertyOptional({ default: 30, minimum: 5 })
  @IsOptional()
  @IsInt()
  @Min(5)
  duracion_minutos_default?: number = 30;
}