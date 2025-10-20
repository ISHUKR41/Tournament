import { useEffect } from "react";
import { supabase } from "@shared/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

let realtimeSubscription: RealtimeChannel | null = null;

export function useRealtimeSync() {
  useEffect(() => {
    if (!realtimeSubscription) {
      // Subscribe to all tables that need realtime sync
      realtimeSubscription = supabase
        .channel("tournament_changes")
        .on(
          "postgres_changes",
          {
            event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
            schema: "public",
          },
          (payload) => {
            // Force a re-fetch of data when changes occur
            window.dispatchEvent(
              new CustomEvent("database_updated", { detail: payload })
            );
          }
        )
        .subscribe();
    }

    // Cleanup subscription when component unmounts
    return () => {
      if (realtimeSubscription) {
        supabase.removeChannel(realtimeSubscription);
        realtimeSubscription = null;
      }
    };
  }, []);
}
