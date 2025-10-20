import { execSync, exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

const POSTGRES_DIR = path.join(
  process.env.HOME || "/home/runner",
  ".postgresql",
  "data"
);
const SOCKET_DIR = "/tmp";
const PORT = "5433";
const LOG_FILE = path.join(POSTGRES_DIR, "logfile");

async function isPostgresRunning(): Promise<boolean> {
  try {
    await execAsync(`pg_isready -h ${SOCKET_DIR} -p ${PORT}`, {
      timeout: 5000,
    });
    return true;
  } catch {
    return false;
  }
}

export async function ensureDatabase() {
  // Check if we have Supabase credentials
  const supabaseUrl =
    process.env.SUPABASE_URL || "https://ielwxcdoejxahmdsfznj.supabase.co";
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc4MDk4NCwiZXhwIjoyMDc2MzU2OTg0fQ.nbewHUVOQwIueavCvyi64GRxrcbnTB7EFVOaGy3WJbE";

  if (supabaseUrl && supabaseServiceKey) {
    console.log("✅ Using Supabase PostgreSQL database");
    console.log(
      "📊 This ensures data persistence and real-time sync across all users"
    );

    // Construct DATABASE_URL if not already set
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
      const projectRef = supabaseUrl
        .replace("https://", "")
        .replace(".supabase.co", "");
      process.env.DATABASE_URL = `postgresql://postgres.${projectRef}:${encodeURIComponent(
        supabaseServiceKey
      )}@aws-0-ap-south-1.pooler.supabase.co:6543/postgres`;
      console.log("📊 DATABASE_URL constructed from Supabase credentials");
    }
    return;
  }

  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "") {
    console.log("✅ DATABASE_URL is set, using configured database");
    console.log(
      "📊 This ensures data persistence and real-time sync across all users"
    );
    return;
  }

  console.log(
    "⚠️  DATABASE_URL not set. Setting up local PostgreSQL for development..."
  );
  console.log(
    "📝 NOTE: For production deployment, you MUST set DATABASE_URL to a cloud database"
  );
  console.log(
    "📝 This local database is only for development and data will NOT sync across users"
  );

  try {
    const needsInit = !fs.existsSync(path.join(POSTGRES_DIR, "PG_VERSION"));

    if (needsInit) {
      console.log("📊 Initializing PostgreSQL data directory...");

      if (fs.existsSync(POSTGRES_DIR)) {
        console.log("🗑️  Cleaning up corrupted PostgreSQL directory...");
        fs.rmSync(POSTGRES_DIR, { recursive: true, force: true });
      }

      fs.mkdirSync(POSTGRES_DIR, { recursive: true });

      try {
        const cleanEnv = { ...process.env };
        delete cleanEnv.PGPORT;
        delete cleanEnv.PGHOST;
        delete cleanEnv.PGUSER;
        delete cleanEnv.PGPASSWORD;
        delete cleanEnv.PGDATABASE;

        execSync(
          `initdb -D ${POSTGRES_DIR} --auth=trust --no-locale --encoding=UTF8`,
          {
            stdio: "pipe",
            env: cleanEnv,
          }
        );
        console.log("✅ PostgreSQL initialized");
      } catch (error: any) {
        console.error("❌ Failed to initialize PostgreSQL:", error.message);
        throw error;
      }
    } else {
      console.log("ℹ️  PostgreSQL data directory already exists");
    }

    const isRunning = await isPostgresRunning();

    if (!isRunning) {
      console.log("🚀 Starting PostgreSQL server...");

      try {
        const cleanEnv = { ...process.env };
        delete cleanEnv.PGPORT;
        delete cleanEnv.PGHOST;
        delete cleanEnv.PGUSER;
        delete cleanEnv.PGPASSWORD;
        delete cleanEnv.PGDATABASE;

        execSync(
          `pg_ctl -D ${POSTGRES_DIR} -o "-p ${PORT} -k ${SOCKET_DIR}" -l ${LOG_FILE} start`,
          { stdio: "pipe", timeout: 15000, env: cleanEnv }
        );

        console.log("⏳ Waiting for PostgreSQL to be ready...");
        for (let i = 0; i < 10; i++) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (await isPostgresRunning()) {
            console.log("✅ PostgreSQL is ready");
            break;
          }
        }

        const finalCheck = await isPostgresRunning();
        if (!finalCheck) {
          if (fs.existsSync(LOG_FILE)) {
            const logs = fs.readFileSync(LOG_FILE, "utf-8");
            console.error("PostgreSQL logs:", logs.slice(-500));
          }
          throw new Error("PostgreSQL started but is not responding");
        }
      } catch (error: any) {
        console.error("❌ Failed to start PostgreSQL:", error.message);
        throw error;
      }
    } else {
      console.log("✅ PostgreSQL is already running");
    }

    try {
      execSync(`createdb -h ${SOCKET_DIR} -p ${PORT} replit_db 2>&1`, {
        stdio: "pipe",
      });
      console.log("✅ Database 'replit_db' created");
    } catch (error: any) {
      if (!error.message.includes("already exists")) {
        console.log("ℹ️  Database 'replit_db' might already exist");
      }
    }

    const localDatabaseUrl = `postgresql://runner@localhost:${PORT}/replit_db?host=${SOCKET_DIR}`;
    process.env.DATABASE_URL = localDatabaseUrl;

    console.log("✅ DATABASE_URL set to local PostgreSQL (development only)");
  } catch (error: any) {
    console.error("❌ Failed to setup local database:", error.message);
    throw new Error(`Database setup failed: ${error.message}`);
  }
}
