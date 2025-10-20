import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

let _client: postgres.Sql | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function getSupabaseConnectionString(): string {
  const supabaseUrl =
    process.env.SUPABASE_URL || "https://ielwxcdoejxahmdsfznj.supabase.co";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc4MDk4NCwiZXhwIjoyMDc2MzU2OTg0fQ.nbewHUVOQwIueavCvyi64GRxrcbnTB7EFVOaGy3WJbE";

  // Extract the project reference from the URL
  const projectRef = supabaseUrl
    .replace("https://", "")
    .replace(".supabase.co", "");

  // Create the PostgreSQL connection string for Supabase
  return `postgresql://postgres.${projectRef}:${encodeURIComponent(
    serviceRoleKey
  )}@aws-0-ap-south-1.pooler.supabase.co:6543/postgres`;
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
      connect_timeout: 10,
      prepare: false, // Disable prepared statements for serverless
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
