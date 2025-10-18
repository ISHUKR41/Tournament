import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { Pool as PgPool } from 'pg';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let _pool: NeonPool | PgPool | null = null;
let _db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePg> | null = null;

function initializeDb() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  if (!_pool) {
    const dbUrl = process.env.DATABASE_URL;
    
    if (dbUrl.includes('neon') || dbUrl.includes('wss://')) {
      console.log("📊 Using Neon serverless database");
      _pool = new NeonPool({ connectionString: dbUrl });
      _db = drizzleNeon({ client: _pool as NeonPool, schema });
    } else {
      console.log("📊 Using PostgreSQL database");
      _pool = new PgPool({ connectionString: dbUrl });
      _db = drizzlePg({ client: _pool as PgPool, schema });
    }
  }
}

export const pool = new Proxy({} as NeonPool | PgPool, {
  get(_target, prop) {
    if (!_pool) initializeDb();
    return (_pool as any)[prop];
  }
});

export const db = new Proxy({} as ReturnType<typeof drizzleNeon> & ReturnType<typeof drizzlePg>, {
  get(_target, prop) {
    if (!_db) initializeDb();
    return (_db as any)[prop];
  }
});
