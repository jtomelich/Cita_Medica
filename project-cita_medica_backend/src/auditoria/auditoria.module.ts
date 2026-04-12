import { Module } from '@nestjs/common';
import { AuditoriaController } from './auditoria.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuditoriaController],
})
export class AuditoriaModule {}