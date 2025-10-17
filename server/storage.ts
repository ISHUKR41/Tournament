import { type Team, type InsertTeam, type Admin, type InsertAdmin, TOURNAMENT_CONFIG, teams, adminUsers } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, count } from "drizzle-orm";

export interface IStorage {
  getAllTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  getTeamCount(): Promise<number>;
  updateTeamStatus(id: string, status: string): Promise<Team>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

export class DatabaseStorage implements IStorage {
  async getAllTeams(): Promise<Team[]> {
    return await db.select().from(teams).orderBy(teams.createdAt);
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team || undefined;
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const teamCount = await this.getTeamCount();
    
    if (teamCount >= TOURNAMENT_CONFIG.MAX_TEAMS) {
      throw new Error("Tournament is full. All slots have been filled.");
    }

    const id = randomUUID();
    const [team] = await db
      .insert(teams)
      .values({
        ...insertTeam,
        id,
        status: "pending",
      })
      .returning();
    return team;
  }

  async getTeamCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(teams);
    return result.count;
  }

  async updateTeamStatus(id: string, status: string): Promise<Team> {
    const [team] = await db
      .update(teams)
      .set({ status })
      .where(eq(teams.id, id))
      .returning();
    return team;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return admin || undefined;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db
      .insert(adminUsers)
      .values(insertAdmin)
      .returning();
    return admin;
  }
}

export const storage = new DatabaseStorage();
