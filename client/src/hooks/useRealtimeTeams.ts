import { useState, useEffect, useCallback } from "react";
import { realtimeManager } from "@shared/supabase";

interface Team {
  id: string;
  gameType: string;
  teamName: string;
  leaderName: string;
  leaderWhatsapp: string;
  leaderPlayerId: string;
  player2Name: string;
  player2PlayerId: string;
  player3Name: string;
  player3PlayerId: string;
  player4Name: string;
  player4PlayerId: string;
  youtubeVote: string;
  transactionId: string;
  paymentScreenshot: string;
  agreedToTerms: number;
  status: string;
  adminNotes?: string;
  updatedAt: string;
  createdAt: string;
}

interface TeamStats {
  total: number;
  pubgTeams: number;
  freeFireTeams: number;
  pending: number;
  approved: number;
  rejected: number;
  pubgAvailable: number;
  freeFireAvailable: number;
}

export const useRealtimeTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [stats, setStats] = useState<TeamStats>({
    total: 0,
    pubgTeams: 0,
    freeFireTeams: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    pubgAvailable: 25, // PUBG max teams
    freeFireAvailable: 12, // Free Fire max teams
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch teams data from API
  const fetchTeams = useCallback(async () => {
    try {
      const response = await fetch("/api/teams");
      if (!response.ok) throw new Error("Failed to fetch teams");

      const teamsData = await response.json();
      setTeams(teamsData);

      // Calculate stats
      const newStats: TeamStats = {
        total: teamsData.length,
        pubgTeams: teamsData.filter((t: Team) => t.gameType === "pubg").length,
        freeFireTeams: teamsData.filter((t: Team) => t.gameType === "freefire")
          .length,
        pending: teamsData.filter((t: Team) => t.status === "pending").length,
        approved: teamsData.filter((t: Team) => t.status === "approved").length,
        rejected: teamsData.filter((t: Team) => t.status === "rejected").length,
        pubgAvailable:
          25 - teamsData.filter((t: Team) => t.gameType === "pubg").length,
        freeFireAvailable:
          12 - teamsData.filter((t: Team) => t.gameType === "freefire").length,
      };
      setStats(newStats);
      setLastUpdate(new Date());
      setError(null);
    } catch (err: any) {
      console.error("Error fetching teams:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback(
    (payload: any) => {
      console.log("Real-time update received:", payload);

      // Refresh data when any database change occurs
      fetchTeams();

      // Show notification based on event type
      const eventType = payload.eventType;
      const record = payload.new || payload.old;

      switch (eventType) {
        case "INSERT":
          console.log(
            `🆕 New team registered: ${record?.team_name} (${record?.game_type})`
          );
          break;
        case "UPDATE":
          console.log(
            `🔄 Team updated: ${record?.team_name} - Status: ${record?.status}`
          );
          break;
        case "DELETE":
          console.log(`🗑️ Team deleted: ${record?.team_name}`);
          break;
        default:
          console.log("📊 Database updated");
      }
    },
    [fetchTeams]
  );

  // Initialize data and subscriptions
  useEffect(() => {
    // Initial data fetch
    fetchTeams();

    // Set up real-time subscription
    const unsubscribe =
      realtimeManager.subscribeToTeamUpdates(handleRealtimeUpdate);

    // Set up periodic refresh as fallback (every 30 seconds)
    const interval = setInterval(() => {
      fetchTeams();
    }, 30000);

    // Cleanup
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [fetchTeams, handleRealtimeUpdate]);

  // Manual refresh function
  const refreshTeams = useCallback(() => {
    setLoading(true);
    fetchTeams();
  }, [fetchTeams]);

  // Get teams by game type
  const getTeamsByGameType = useCallback(
    (gameType: "pubg" | "freefire") => {
      return teams.filter((team) => team.gameType === gameType);
    },
    [teams]
  );

  // Get teams by status
  const getTeamsByStatus = useCallback(
    (status: "pending" | "approved" | "rejected") => {
      return teams.filter((team) => team.status === status);
    },
    [teams]
  );

  // Check if tournament is full
  const isTournamentFull = useCallback(
    (gameType: "pubg" | "freefire") => {
      const maxTeams = gameType === "pubg" ? 25 : 12;
      const currentTeams = teams.filter(
        (team) => team.gameType === gameType
      ).length;
      return currentTeams >= maxTeams;
    },
    [teams]
  );

  return {
    teams,
    stats,
    loading,
    error,
    lastUpdate,
    refreshTeams,
    getTeamsByGameType,
    getTeamsByStatus,
    isTournamentFull,
  };
};

export default useRealtimeTeams;
