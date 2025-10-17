import { db } from "./db";
import { adminUsers } from "@shared/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function setupAdmin() {
  const username = process.argv[2] || "admin";
  const password = process.argv[3] || "admin123";

  try {
    const existingAdmin = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log(`Admin user '${username}' already exists.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(adminUsers).values({
      username,
      password: hashedPassword,
    });

    console.log(`Admin user '${username}' created successfully!`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log("\nPlease change the password after first login.");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

setupAdmin();
