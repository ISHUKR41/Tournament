import {
  createClient,
  RealtimeChannel,
  SupabaseClient,
} from "@supabase/supabase-js";

// Environment variables with fallbacks for development
const supabaseUrl =
  process.env.SUPABASE_URL || "https://ielwxcdoejxahmdsfznj.supabase.co";
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODA5ODQsImV4cCI6MjA3NjM1Njk4NH0.KAjZJ4Em7zBwWz8XxvyIeTayn6ILrasb7n2uUg0rt2o";

// Client for public operations (browser-safe)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10, // Rate limiting for real-time updates
    },
  },
  auth: {
    persistSession: false, // Disable persistence for this app
  },
});

// For admin/server operations that need full access
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc4MDk4NCwiZXhwIjoyMDc2MzU2OTg0fQ.nbewHUVOQwIueavCvyi64GRxrcbnTB7EFVOaGy3WJbE";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});

// Real-time subscription management
export class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();

  subscribeToTeamUpdates(callback: (payload: any) => void): () => void {
    const channelName = "team-updates";

    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe();
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "teams",
        },
        callback
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Subscribed to team updates");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Failed to subscribe to team updates");
        }
      });

    this.channels.set(channelName, channel);

    // Return cleanup function
    return () => {
      channel.unsubscribe();
      this.channels.delete(channelName);
      console.log("🔌 Unsubscribed from team updates");
    };
  }

  // Broadcast custom events
  async broadcastTeamUpdate(teamId: string, gameType: string) {
    const channel = supabase.channel("team-updates");
    await channel.send({
      type: "broadcast",
      event: "team-registration",
      payload: { teamId, gameType, timestamp: Date.now() },
    });
  }

  // Clean up all channels
  cleanup() {
    this.channels.forEach((channel, name) => {
      channel.unsubscribe();
      console.log(`🔌 Unsubscribed from ${name}`);
    });
    this.channels.clear();
  }
}

// Export singleton instance
export const realtimeManager = new RealtimeManager();

// Health check function for Supabase
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("teams").select("id").limit(1);
    if (error) throw error;
    console.log("✅ Supabase connection test successful");
    return true;
  } catch (error) {
    console.error("❌ Supabase connection test failed:", error);
    return false;
  }
}
