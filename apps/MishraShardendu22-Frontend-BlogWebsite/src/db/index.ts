import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

if (!import.meta.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

const sql = neon(import.meta.env.DATABASE_URL)
export const db = drizzle(sql)
