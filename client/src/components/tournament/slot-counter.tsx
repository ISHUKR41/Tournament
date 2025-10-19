import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

interface SlotCounterProps {
  gameType: "pubg" | "freefire";
  maxTeams: number;
}

export function SlotCounter({ gameType, maxTeams }: SlotCounterProps) {
  const { data: countData, isLoading } = useQuery<{ count: number }>({
    queryKey: [`/api/teams/count/${gameType}`],
    refetchInterval: 5000,
  });

  const teamsCount = countData?.count || 0;
  const slotsRemaining = maxTeams - teamsCount;
  const percentFilled = (teamsCount / maxTeams) * 100;
  const isAlmostFull = slotsRemaining <= 5;

  return (
    <Card 
      className={`p-4 sm:p-6 backdrop-blur-md bg-card/80 card-hover-float ${isAlmostFull ? 'animate-pulse-scale border-chart-4/50' : ''}`} 
      data-testid="card-slot-counter"
      data-aos="zoom-in"
      data-aos-duration="600"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="p-1.5 sm:p-2 rounded-lg bg-chart-2/10">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-chart-2" />
        </div>
        <h3 className="font-display font-semibold text-base sm:text-lg">Team Slots</h3>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-8 sm:h-10 skeleton rounded"></div>
          <div className="h-2 skeleton rounded"></div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-chart-2" data-testid="text-teams-registered">
                {teamsCount}
              </span>
              <span className="text-muted-foreground mx-1 sm:mx-2 text-sm sm:text-base">/</span>
              <span className="text-xl sm:text-2xl font-display font-semibold text-muted-foreground">
                {maxTeams}
              </span>
            </div>
            <span 
              className={`text-xs sm:text-sm font-semibold ${isAlmostFull ? 'text-chart-4 animate-pulse' : 'text-chart-3'}`}
              data-testid="text-slots-remaining"
            >
              {slotsRemaining} left
            </span>
          </div>
          
          <Progress value={percentFilled} className="h-2" data-testid="progress-slots" />
          
          {isAlmostFull && (
            <p className="text-xs text-chart-4 font-semibold animate-pulse">
              ⚠️ Hurry! Only {slotsRemaining} slots remaining
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
