import 'dotenv/config';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('Prisma');
  private pool: Pool;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('❌ DATABASE_URL no está definida en el .env');
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    super({
      adapter: new PrismaPg(pool),
      log: ['query', 'info', 'warn', 'error'], // ✅ logging oficial
    });

    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('✅ Prisma conectado correctamente');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
    this.logger.warn('🔌 Prisma desconectado');
  }
}