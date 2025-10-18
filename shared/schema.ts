import { pgTable, text, varchar, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin Users Schema
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tournament Team Registration Schema
export const teams = pgTable("teams", {
  id: varchar("id").primaryKey(),
  teamName: text("team_name").notNull(),
  leaderName: text("leader_name").notNull(),
  leaderWhatsapp: text("leader_whatsapp").notNull(),
  leaderPubgId: text("leader_pubg_id").notNull(),
  player2Name: text("player2_name").notNull(),
  player2PubgId: text("player2_pubg_id").notNull(),
  player3Name: text("player3_name").notNull(),
  player3PubgId: text("player3_pubg_id").notNull(),
  player4Name: text("player4_name").notNull(),
  player4PubgId: text("player4_pubg_id").notNull(),
  transactionId: text("transaction_id").notNull(),
  paymentScreenshot: text("payment_screenshot").notNull(),
  agreedToTerms: integer("agreed_to_terms").notNull().default(1),
  status: text("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  adminNotes: true,
}).extend({
  teamName: z.string().min(3, "Team name must be at least 3 characters").max(50, "Team name too long"),
  leaderName: z.string().min(2, "Leader name required"),
  leaderWhatsapp: z.string().regex(/^\d{10}$/, "WhatsApp number must be 10 digits"),
  leaderPubgId: z.string().min(3, "Valid PUBG ID required"),
  player2Name: z.string().min(2, "Player 2 name required"),
  player2PubgId: z.string().min(3, "Valid PUBG ID required"),
  player3Name: z.string().min(2, "Player 3 name required"),
  player3PubgId: z.string().min(3, "Valid PUBG ID required"),
  player4Name: z.string().min(2, "Player 4 name required"),
  player4PubgId: z.string().min(3, "Valid PUBG ID required"),
  transactionId: z.string().min(5, "Transaction ID required"),
  paymentScreenshot: z.string().min(1, "Payment screenshot required"),
  agreedToTerms: z.number().refine((val) => val === 1, {
    message: "You must agree to terms and conditions",
  }),
});

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export const insertAdminSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof adminUsers.$inferSelect;

// Tournament Configuration
export const TOURNAMENT_CONFIG = {
  MAX_TEAMS: 25,
  ENTRY_FEE: 80,
  PRIZE_WINNER: 1000,
  PRIZE_RUNNER_UP: 400,
  GAME_MODE: "Squad (4 Players)",
  MAP: "Erangel (Classic)",
  TOURNAMENT_DATE: "2025-10-25T18:00:00", // Example date
} as const;
