import { type Team, type InsertTeam, type Admin, type InsertAdmin, TOURNAMENT_CONFIG, teams, adminUsers } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, count, or, like, inArray, sql } from "drizzle-orm";

export interface IStorage {
  getAllTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  getTeamCount(): Promise<number>;
  getTeamCountByStatus(status?: string): Promise<number>;
  updateTeamStatus(id: string, status: string): Promise<Team>;
  updateTeamNotes(id: string, notes: string): Promise<Team>;
  searchTeams(query: string, status?: string): Promise<Team[]>;
  bulkUpdateStatus(ids: string[], status: string): Promise<Team[]>;
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

  async getTeamCountByStatus(status?: string): Promise<number> {
    if (status) {
      const [result] = await db
        .select({ count: count() })
        .from(teams)
        .where(eq(teams.status, status));
      return result.count;
    }
    return this.getTeamCount();
  }

  async updateTeamStatus(id: string, status: string): Promise<Team> {
    const [team] = await db
      .update(teams)
      .set({ status, updatedAt: sql`NOW()` })
      .where(eq(teams.id, id))
      .returning();
    return team;
  }

  async updateTeamNotes(id: string, notes: string): Promise<Team> {
    const [team] = await db
      .update(teams)
      .set({ adminNotes: notes, updatedAt: sql`NOW()` })
      .where(eq(teams.id, id))
      .returning();
    return team;
  }

  async searchTeams(query: string, status?: string): Promise<Team[]> {
    if (query && status) {
      const searchPattern = `%${query}%`;
      const conditions = or(
        like(teams.teamName, searchPattern),
        like(teams.leaderName, searchPattern),
        like(teams.leaderWhatsapp, searchPattern),
        like(teams.transactionId, searchPattern)
      );

      const results = await db
        .select()
        .from(teams)
        .where(
          sql`${conditions} AND ${eq(teams.status, status)}`
        )
        .orderBy(teams.createdAt);
      return results;
    }

    if (query) {
      const searchPattern = `%${query}%`;
      const conditions = or(
        like(teams.teamName, searchPattern),
        like(teams.leaderName, searchPattern),
        like(teams.leaderWhatsapp, searchPattern),
        like(teams.transactionId, searchPattern)
      );

      return await db
        .select()
        .from(teams)
        .where(conditions)
        .orderBy(teams.createdAt);
    }

    if (status) {
      return await db
        .select()
        .from(teams)
        .where(eq(teams.status, status))
        .orderBy(teams.createdAt);
    }

    return this.getAllTeams();
  }

  async bulkUpdateStatus(ids: string[], status: string): Promise<Team[]> {
    if (ids.length === 0) {
      return [];
    }

    const updatedTeams = await db
      .update(teams)
      .set({ status, updatedAt: sql`NOW()` })
      .where(inArray(teams.id, ids))
      .returning();
    return updatedTeams;
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
