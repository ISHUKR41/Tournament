import { type Team, type InsertTeam, type Admin, type InsertAdmin, TOURNAMENT_CONFIG } from "@shared/schema";
import { randomUUID } from "crypto";
import { type IStorage } from "./storage";
import bcrypt from "bcryptjs";

// In-memory storage for local development
export class MockStorage implements IStorage {
  private teams: Map<string, Team> = new Map();
  private admins: Map<string, Admin> = new Map();

  constructor() {
    // Create default admin user
    this.initializeDefaultAdmin();
  }

  private async initializeDefaultAdmin() {
    try {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin: Admin = {
        id: 1,
        username: "admin",
        password: hashedPassword,
        createdAt: new Date(),
      };
      this.admins.set(admin.username, admin);
      console.log("👤 Mock admin created - Username: admin, Password: admin123");
    } catch (error) {
      console.error("Failed to create default admin:", error);
    }
  }

  async getAllTeams(): Promise<Team[]> {
    return Array.from(this.teams.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async getTeam(id: string): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const gameType = insertTeam.gameType;
    const teamCount = await this.getTeamCountByGameType(gameType);
    
    const maxTeams = gameType === 'pubg' ? TOURNAMENT_CONFIG.PUBG.MAX_TEAMS : TOURNAMENT_CONFIG.FREE_FIRE.MAX_TEAMS;
    
    if (teamCount >= maxTeams) {
      throw new Error(`Tournament is full. All ${maxTeams} slots for ${gameType.toUpperCase()} have been filled.`);
    }

    const id = randomUUID();
    const now = new Date();
    const team: Team = {
      ...insertTeam,
      id,
      status: "pending",
      adminNotes: null,
      createdAt: now,
      updatedAt: now,
    };
    this.teams.set(id, team);
    return team;
  }

  async getTeamCount(): Promise<number> {
    return this.teams.size;
  }

  async getTeamCountByGameType(gameType: string): Promise<number> {
    return Array.from(this.teams.values()).filter(
      (t) => t.gameType === gameType
    ).length;
  }

  async getTeamCountByStatus(status?: string): Promise<number> {
    if (status) {
      return Array.from(this.teams.values()).filter((t) => t.status === status)
        .length;
    }
    return this.getTeamCount();
  }

  async updateTeamStatus(id: string, status: string): Promise<Team> {
    const team = this.teams.get(id);
    if (!team) {
      throw new Error("Team not found");
    }
    team.status = status;
    team.updatedAt = new Date();
    this.teams.set(id, team);
    return team;
  }

  async updateTeamNotes(id: string, notes: string): Promise<Team> {
    const team = this.teams.get(id);
    if (!team) {
      throw new Error("Team not found");
    }
    team.adminNotes = notes;
    team.updatedAt = new Date();
    this.teams.set(id, team);
    return team;
  }

  async searchTeams(query: string, status?: string): Promise<Team[]> {
    let results = Array.from(this.teams.values());

    if (status) {
      results = results.filter((t) => t.status === status);
    }

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (t) =>
          t.teamName.toLowerCase().includes(q) ||
          t.leaderName.toLowerCase().includes(q) ||
          t.leaderWhatsapp.includes(q) ||
          t.transactionId.toLowerCase().includes(q)
      );
    }

    return results.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async bulkUpdateStatus(ids: string[], status: string): Promise<Team[]> {
    const updated: Team[] = [];
    for (const id of ids) {
      const team = this.teams.get(id);
      if (team) {
        team.status = status;
        team.updatedAt = new Date();
        this.teams.set(id, team);
        updated.push(team);
      }
    }
    return updated;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return this.admins.get(username);
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const admin: Admin = {
      id: this.admins.size + 1,
      ...insertAdmin,
      createdAt: new Date(),
    };
    this.admins.set(admin.username, admin);
    return admin;
  }
}
