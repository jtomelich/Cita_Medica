import { Module } from '@nestjs/common';
import { BloqueosService } from './bloqueos.service';
import { BloqueosController } from './bloqueos.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BloqueosController],
  providers: [BloqueosService],
})
export class BloqueosModule {}