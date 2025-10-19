import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTeamSchema, TOURNAMENT_CONFIG } from "@shared/schema";
import bcrypt from "bcryptjs";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

declare module 'express-session' {
  interface SessionData {
    adminId?: number;
    username?: string;
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.adminId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.adminId = admin.id;
      req.session.username = admin.username;
      
      res.json({ message: "Login successful", username: admin.username });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/admin/me", (req, res) => {
    if (!req.session.adminId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({ username: req.session.username });
  });

  app.get("/api/teams", async (_req, res) => {
    try {
      const teams = await storage.getAllTeams();
      res.json(teams);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/teams/count", async (_req, res) => {
    try {
      const count = await storage.getTeamCount();
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/teams/count/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      if (gameType !== 'pubg' && gameType !== 'freefire') {
        return res.status(400).json({ message: "Invalid game type" });
      }
      const count = await storage.getTeamCountByGameType(gameType);
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const validatedData = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(validatedData);
      res.status(201).json(team);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        res.status(404).json({ message: "Team not found" });
        return;
      }
      res.json(team);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/teams/search", async (req, res) => {
    try {
      const { query, status } = req.query;
      
      if (!query && !status) {
        const teams = await storage.getAllTeams();
        res.json(teams);
        return;
      }
      
      const teams = await storage.searchTeams(
        (query as string) || "",
        status as string | undefined
      );
      res.json(teams);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/stats", requireAuth, async (_req, res) => {
    try {
      const totalTeams = await storage.getTeamCount();
      const pubgTeams = await storage.getTeamCountByGameType("pubg");
      const freeFireTeams = await storage.getTeamCountByGameType("freefire");
      const pendingTeams = await storage.getTeamCountByStatus("pending");
      const approvedTeams = await storage.getTeamCountByStatus("approved");
      const rejectedTeams = await storage.getTeamCountByStatus("rejected");
      
      res.json({
        total: totalTeams,
        pubgTeams,
        freeFireTeams,
        pending: pendingTeams,
        approved: approvedTeams,
        rejected: rejectedTeams,
        pubgAvailable: TOURNAMENT_CONFIG.PUBG.MAX_TEAMS - pubgTeams,
        freeFireAvailable: TOURNAMENT_CONFIG.FREE_FIRE.MAX_TEAMS - freeFireTeams,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/teams/:id/status", requireAuth, async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ["pending", "approved", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      const team = await storage.updateTeamStatus(req.params.id, status);
      res.json(team);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/teams/:id/notes", requireAuth, async (req, res) => {
    try {
      const { notes } = req.body;
      const team = await storage.updateTeamNotes(req.params.id, notes);
      res.json(team);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/teams/bulk-status", requireAuth, async (req, res) => {
    try {
      const { ids, status } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Invalid team IDs" });
      }
      const validStatuses = ["pending", "approved", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      const teams = await storage.bulkUpdateStatus(ids, status);
      res.json(teams);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/teams/export", requireAuth, async (_req, res) => {
    try {
      const teams = await storage.getAllTeams();
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Teams');
      
      worksheet.columns = [
        { header: 'Game Type', key: 'gameType', width: 15 },
        { header: 'Team Name', key: 'teamName', width: 20 },
        { header: 'Leader Name', key: 'leaderName', width: 20 },
        { header: 'Leader WhatsApp', key: 'leaderWhatsapp', width: 15 },
        { header: 'Leader Player ID', key: 'leaderPlayerId', width: 20 },
        { header: 'Player 2 Name', key: 'player2Name', width: 20 },
        { header: 'Player 2 Player ID', key: 'player2PlayerId', width: 20 },
        { header: 'Player 3 Name', key: 'player3Name', width: 20 },
        { header: 'Player 3 Player ID', key: 'player3PlayerId', width: 20 },
        { header: 'Player 4 Name', key: 'player4Name', width: 20 },
        { header: 'Player 4 Player ID', key: 'player4PlayerId', width: 20 },
        { header: 'YouTube Live Vote', key: 'youtubeVote', width: 15 },
        { header: 'Transaction ID', key: 'transactionId', width: 25 },
        { header: 'Payment Screenshot', key: 'paymentScreenshot', width: 50 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Admin Notes', key: 'adminNotes', width: 30 },
        { header: 'Registration Date', key: 'createdAt', width: 20 },
      ];

      teams.forEach(team => {
        worksheet.addRow({
          ...team,
          createdAt: new Date(team.createdAt).toLocaleString(),
          adminNotes: team.adminNotes || '',
        });
      });

      worksheet.getRow(1).font = { bold: true };

      const exportsDir = path.join(process.cwd(), 'exports');
      if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true });
      }

      const filename = `teams-${new Date().toISOString().split('T')[0]}-${Date.now()}.xlsx`;
      const filepath = path.join(exportsDir, filename);

      await workbook.xlsx.writeFile(filepath);

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${filename}`
      );

      const fileBuffer = await workbook.xlsx.writeBuffer();
      res.send(fileBuffer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
