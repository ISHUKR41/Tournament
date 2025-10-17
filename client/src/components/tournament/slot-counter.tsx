import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TOURNAMENT_CONFIG } from "@shared/schema";

export function SlotCounter() {
  const { data: teams = [] } = useQuery<any[]>({
    queryKey: ['/api/teams'],
    refetchInterval: 5000,
  });

  const slotsRemaining = TOURNAMENT_CONFIG.MAX_TEAMS - teams.length;
  const percentFilled = (teams.length / TOURNAMENT_CONFIG.MAX_TEAMS) * 100;
  const isAlmostFull = slotsRemaining <= 5;

  return (
    <Card className={`p-6 backdrop-blur-md bg-card/80 ${isAlmostFull ? 'animate-pulse-scale' : ''}`} data-testid="card-slot-counter">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-chart-2/10">
          <Users className="w-5 h-5 text-chart-2" />
        </div>
        <h3 className="font-display font-semibold text-lg">Team Slots</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl md:text-4xl font-display font-bold text-chart-2" data-testid="text-teams-registered">
              {teams.length}
            </span>
            <span className="text-muted-foreground mx-2">/</span>
            <span className="text-2xl font-display font-semibold text-muted-foreground">
              {TOURNAMENT_CONFIG.MAX_TEAMS}
            </span>
          </div>
          <span 
            className={`text-sm font-semibold ${isAlmostFull ? 'text-chart-4' : 'text-chart-3'}`}
            data-testid="text-slots-remaining"
          >
            {slotsRemaining} slots left
          </span>
        </div>
        
        <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-chart-2 to-chart-1 rounded-full transition-all duration-500"
            style={{ width: `${percentFilled}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
