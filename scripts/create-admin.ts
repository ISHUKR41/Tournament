import { db } from "../server/db";
import { adminUsers } from "@shared/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function createAdmin() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  try {
    const [existingAdmin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username));

    if (existingAdmin) {
      console.log(`Admin user '${username}' already exists.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [admin] = await db
      .insert(adminUsers)
      .values({
        username,
        password: hashedPassword,
      })
      .returning();

    console.log(`Admin user created successfully!`);
    console.log(`Username: ${admin.username}`);
    console.log(`Password: ${password}`);
    console.log(`\nPlease change your password after first login.`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
