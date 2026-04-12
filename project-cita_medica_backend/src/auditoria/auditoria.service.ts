import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditoriaService {
  constructor(private prisma: PrismaService) {}

  async registrar(data: {
    tabla: string;
    registro_id: string;
    accion: string;
    usuario_id?: string;
    valores_antes?: any;
    valores_despues?: any;
  }) {
    return this.prisma.auditoria.create({
      data: {
        tabla: data.tabla,
        registro_id: data.registro_id,
        accion: data.accion,
        usuario_id: data.usuario_id
          ? BigInt(data.usuario_id)
          : undefined,
        valores_antes: data.valores_antes,
        valores_despues: data.valores_despues,
      },
    });
  }
}