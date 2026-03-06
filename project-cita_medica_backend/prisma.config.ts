// prisma.config.ts
import 'dotenv/config'; 
import { defineConfig } from '@prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL!;

// Pool de Postgres (driver 'pg')
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, // Neon requiere TLS
});

// Adapter para Prisma Client clásico 
const adapter = new PrismaPg(pool);


export default defineConfig({
  datasource: {
    provider: 'postgresql',
    url: connectionString,           // <-- ya existe porque dotenv cargó .env
  },


  // Habilita el cliente clásico con adapter
  adapter,

  
});