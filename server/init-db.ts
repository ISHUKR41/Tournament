import { sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from './db';

export async function initializeDatabase() {
  try {
    console.log("🔧 Initializing database...");

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
        leader_pubg_id TEXT NOT NULL,
        player2_name TEXT NOT NULL,
        player2_pubg_id TEXT NOT NULL,
        player3_name TEXT NOT NULL,
        player3_pubg_id TEXT NOT NULL,
        player4_name TEXT NOT NULL,
        player4_pubg_id TEXT NOT NULL,
        transaction_id TEXT NOT NULL,
        payment_screenshot TEXT NOT NULL,
        agreed_to_terms INTEGER NOT NULL DEFAULT 1,
        status TEXT NOT NULL DEFAULT 'pending',
        admin_notes TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    const existingAdminResult = await db.execute(sql`SELECT COUNT(*) as count FROM admin_users`);
    const adminCount = Number(existingAdminResult.rows[0]?.count || 0);
    
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

    console.log("✅ Database initialized successfully!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}
