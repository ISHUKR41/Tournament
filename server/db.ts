import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

let _client: postgres.Sql | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function getSupabaseConnectionString(): string {
  const supabaseUrl = process.env.SUPABASE_URL;
  const dbPassword = process.env.SUPABASE_DB_PASSWORD || "ISHUkr21@";

  if (!supabaseUrl) {
    throw new Error("Supabase URL not configured");
  }

  // Extract project ref
  const projectRef = supabaseUrl
    .replace("https://", "")
    .replace(".supabase.co", "");

  // Use Session Pooler (IPv4 compatible, works on Vercel)
  // Port 5432 for Session mode pooler
  return `postgresql://postgres.${projectRef}:${encodeURIComponent(
    dbPassword
  )}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`;
}

function initializeDb() {
  if (!_client) {
    let dbUrl = process.env.DATABASE_URL;

    // If no DATABASE_URL, construct it from Supabase credentials
    if (!dbUrl || dbUrl.trim() === "") {
      console.log("📊 Constructing database URL from Supabase credentials...");
      dbUrl = getSupabaseConnectionString();
    }

    console.log("📊 Connecting to Supabase PostgreSQL database...");

    // Connection options optimized for Vercel serverless
    _client = postgres(dbUrl, {
      max: 1, // Single connection for serverless
      idle_timeout: 20,
      connect_timeout: 30,
      prepare: false, // Disable prepared statements for serverless
      ssl: false, // Disable SSL for pooler
      types: {
        bigint: postgres.BigInt,
      },
    });

    _db = drizzle(_client, { schema });
    console.log("✅ Database connection established");
  }

  return _db!;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    if (!_db) _db = initializeDb();
    return (_db as any)[prop];
  },
});

// Health check function
export async function testConnection() {
  try {
    const result = await db.select().from(schema.teams).limit(1);
    console.log("✅ Database connection test successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection test failed:", error);
    return false;
  }
}

// Export client for cleanup if needed
export function closeConnection() {
  if (_client) {
    _client.end();
    _client = null;
    _db = null;
    console.log("🔌 Database connection closed");
  }
}
