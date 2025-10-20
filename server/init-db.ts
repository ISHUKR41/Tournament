import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, testConnection } from "./db";
import { testSupabaseConnection } from "@shared/supabase";

export async function initializeDatabase() {
  try {
    console.log("🔧 Initializing database...");

    // Test database connection first
    console.log("📊 Testing database connection...");
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error("Database connection failed");
    }

    // Test Supabase connection
    console.log("📊 Testing Supabase connection...");
    const supabaseConnected = await testSupabaseConnection();
    if (!supabaseConnected) {
      console.warn("⚠️  Supabase connection test failed, but continuing...");
    }

    console.log("📊 Creating admin_users table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    console.log("📊 Creating teams table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS teams (
        id VARCHAR PRIMARY KEY,
        team_name TEXT NOT NULL,
        leader_name TEXT NOT NULL,
        leader_whatsapp TEXT NOT NULL,
        leader_player_id TEXT NOT NULL,
        player2_name TEXT NOT NULL,
        player2_player_id TEXT NOT NULL,
        player3_name TEXT NOT NULL,
        player3_player_id TEXT NOT NULL,
        player4_name TEXT NOT NULL,
        player4_player_id TEXT NOT NULL,
        transaction_id TEXT NOT NULL,
        payment_screenshot TEXT NOT NULL,
        game_type TEXT NOT NULL DEFAULT 'pubg',
        youtube_vote TEXT NOT NULL DEFAULT 'no',
        agreed_to_terms INTEGER NOT NULL DEFAULT 1,
        status TEXT NOT NULL DEFAULT 'pending',
        admin_notes TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    console.log("📊 Running table migrations...");
    try {
      // Add game_type column if not exists
      await db.execute(
        sql`ALTER TABLE teams ADD COLUMN IF NOT EXISTS game_type TEXT NOT NULL DEFAULT 'pubg'`
      );

      // Check and convert youtube_vote column from integer to text
      try {
        const result = await db.execute(
          sql`SELECT youtube_vote FROM teams LIMIT 1`
        );
        console.log("✅ youtube_vote column exists and accessible");
      } catch {
        await db.execute(
          sql`ALTER TABLE teams ADD COLUMN IF NOT EXISTS youtube_vote TEXT NOT NULL DEFAULT 'no'`
        );
        console.log("✅ Added youtube_vote column");
      }

      // Check for old column names and rename if necessary
      try {
        await db.execute(sql`SELECT leader_pubg_id FROM teams LIMIT 1`);
        console.log("📊 Renaming pubg_id columns to player_id...");
        await db.execute(
          sql`ALTER TABLE teams RENAME COLUMN leader_pubg_id TO leader_player_id`
        );
        await db.execute(
          sql`ALTER TABLE teams RENAME COLUMN player2_pubg_id TO player2_player_id`
        );
        await db.execute(
          sql`ALTER TABLE teams RENAME COLUMN player3_pubg_id TO player3_player_id`
        );
        await db.execute(
          sql`ALTER TABLE teams RENAME COLUMN player4_pubg_id TO player4_player_id`
        );
        console.log("✅ Columns renamed successfully!");
      } catch {
        // Columns already have correct names or don't exist
        console.log("ℹ️  Player ID columns already have correct names");
      }
    } catch (error: any) {
      console.log("⚠️  Migration completed with warnings:", error.message);
    }

    // Check if admin exists
    console.log("👤 Checking for existing admin users...");
    try {
      const existingAdmins = await db.execute(
        sql`SELECT COUNT(*) as count FROM admin_users`
      );
      const adminCount = Number((existingAdmins as any)[0]?.count || 0);

      if (adminCount === 0) {
        console.log("👤 Creating default admin user...");
        const hashedPassword = await bcrypt.hash("admin123", 10);

        await db.execute(sql`
          INSERT INTO admin_users (username, password)
          VALUES ('admin', ${hashedPassword})
        `);

        console.log("✅ Default admin created!");
        console.log("📝 Username: admin");
        console.log("📝 Password: admin123");
        console.log("⚠️  IMPORTANT: Change this password after first login!");
      } else {
        console.log("✅ Admin user already exists");
      }
    } catch (error: any) {
      console.log("⚠️  Could not check/create admin user:", error.message);
    }

    console.log("✅ Database initialized successfully!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}
