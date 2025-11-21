import { PrismaClient } from '@/lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
  pool: Pool
}

// Configurar pool de conexiones con timeouts y límites
const pool = globalForPrisma.pool || new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Máximo de conexiones
  idleTimeoutMillis: 30000, // 30 segundos
  connectionTimeoutMillis: 10000, // 10 segundos timeout
})

const adapter = new PrismaPg(pool)

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.pool = pool
}

export default prisma