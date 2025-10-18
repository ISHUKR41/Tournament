import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TOURNAMENT_CONFIG } from "@shared/schema";
import { Progress } from "@/components/ui/progress";

export function SlotCounter() {
  const { data: countData, isLoading } = useQuery<{ count: number }>({
    queryKey: ['/api/teams/count'],
    refetchInterval: 5000,
  });

  const teamsCount = countData?.count || 0;
  const slotsRemaining = TOURNAMENT_CONFIG.MAX_TEAMS - teamsCount;
  const percentFilled = (teamsCount / TOURNAMENT_CONFIG.MAX_TEAMS) * 100;
  const isAlmostFull = slotsRemaining <= 5;

  return (
    <Card className={`p-6 backdrop-blur-md bg-card/80 ${isAlmostFull ? 'animate-pulse-scale' : ''}`} data-testid="card-slot-counter">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-chart-2/10">
          <Users className="w-5 h-5 text-chart-2" />
        </div>
        <h3 className="font-display font-semibold text-lg">Team Slots</h3>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-10 bg-secondary/50 rounded animate-pulse"></div>
          <div className="h-2 bg-secondary/50 rounded animate-pulse"></div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl md:text-4xl font-display font-bold text-chart-2" data-testid="text-teams-registered">
                {teamsCount}
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
          
          <Progress value={percentFilled} className="h-2" data-testid="progress-slots" />
        </div>
      )}
    </Card>
  );
}
