import { Module } from '@nestjs/common';
import { DoctoresService } from './doctores.service';
import { DoctoresController } from './doctores.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DoctoresController],
  providers: [DoctoresService],
})
export class DoctoresModule {}