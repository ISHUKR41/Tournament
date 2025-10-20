import type { Express } from "express";
import { storage } from "./storage";
import { insertTeamSchema, TOURNAMENT_CONFIG } from "@shared/schema";
import { requireAuth, signToken, setTokenCookie, clearTokenCookie, getTokenFromRequest, verifyToken } from "./auth";
import bcrypt from "bcryptjs";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<void> {
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

      const token = signToken({ id: admin.id, username: admin.username });
      setTokenCookie(res, token);
      
      res.json({ message: "Login successful", username: admin.username });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/logout", (_req, res) => {
    clearTokenCookie(res);
    res.json({ message: "Logout successful" });
  });

  app.get("/api/admin/me", (req, res) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.json({ username: payload.username });
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
      
      const { notifyTeamRegistration } = await import("./services/pusher");
      await notifyTeamRegistration(team.gameType);
      
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
      
      const { notifyPaymentUpdate } = await import("./services/pusher");
      await notifyPaymentUpdate(team.id);
      
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

  app.get("/api/admin/teams/export", requireAuth, async (req, res) => {
    try {
      const { gameType } = req.query;
      const teams = await storage.getAllTeams();
      
      const filteredTeams = gameType && (gameType === 'pubg' || gameType === 'freefire')
        ? teams.filter(team => team.gameType === gameType)
        : teams;
      
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

      filteredTeams.forEach(team => {
        worksheet.addRow({
          ...team,
          createdAt: new Date(team.createdAt).toLocaleString(),
          adminNotes: team.adminNotes || '',
        });
      });

      worksheet.getRow(1).font = { bold: true };

      const baseExportsDir = path.join(process.cwd(), 'exports');
      const gameFolder = gameType === 'pubg' ? 'pubg' : gameType === 'freefire' ? 'freefire' : 'all';
      const exportsDir = path.join(baseExportsDir, gameFolder);
      
      if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true });
      }

      const gameName = gameType === 'pubg' ? 'PUBG' : gameType === 'freefire' ? 'FreeFire' : 'All';
      const filename = `${gameName}-teams-${new Date().toISOString().split('T')[0]}-${Date.now()}.xlsx`;
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
}
