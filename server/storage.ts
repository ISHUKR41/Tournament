import { type Team, type InsertTeam, TOURNAMENT_CONFIG } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  getTeamCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private teams: Map<string, Team>;

  constructor() {
    this.teams = new Map();
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
    const teamCount = this.teams.size;
    
    if (teamCount >= TOURNAMENT_CONFIG.MAX_TEAMS) {
      throw new Error("Tournament is full. All slots have been filled.");
    }

    const id = randomUUID();
    const team: Team = { 
      ...insertTeam, 
      id,
      createdAt: new Date(),
    };
    this.teams.set(id, team);
    return team;
  }

  async getTeamCount(): Promise<number> {
    return this.teams.size;
  }
}

export const storage = new MemStorage();
