import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, Matches, Validate } from 'class-validator';
import { EstadoCita } from '@prisma/client';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'fechaRangoValido', async: false })
class FechaRangoValido implements ValidatorConstraintInterface {
  validate(fin: string, args: any) {
    const inicio = new Date((args.object as any).inicio);
    const finDate = new Date(fin);
    return isFinite(inicio.getTime()) && isFinite(finDate.getTime()) && finDate > inicio;
  }
  defaultMessage() {
    return 'fin debe ser posterior a inicio';
  }
}

export class CreateCitaDto {
  @ApiProperty({ description: 'Paciente ID (bigint en texto)' })
  @IsString()
  @Matches(/^\d+$/)
  paciente_id!: string;

  @ApiProperty({ description: 'Doctor ID (bigint en texto)' })
  @IsString()
  @Matches(/^\d+$/)
  doctor_id!: string;

  @ApiProperty({ description: 'Especialidad ID (bigint en texto)' })
  @IsString()
  @Matches(/^\d+$/)
  especialidad_id!: string;

  @ApiProperty({ description: 'Inicio ISO 8601 con zona (timestamptz)' })
  @IsDateString()
  inicio!: string;

  @ApiProperty({ description: 'Fin ISO 8601 con zona (timestamptz)' })
  @IsDateString()
  @Validate(FechaRangoValido)
  fin!: string;

  @ApiPropertyOptional({ enum: EstadoCita, enumName: 'EstadoCita', default: EstadoCita.PENDIENTE_PAGO })
  @IsOptional()
  @IsEnum(EstadoCita)
  estado?: EstadoCita = EstadoCita.PENDIENTE_PAGO;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiPropertyOptional({ description: 'Usuario que crea (opcional, bigint en texto)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  creado_por_user_id?: string;
}