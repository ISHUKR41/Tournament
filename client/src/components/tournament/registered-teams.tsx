import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Team } from "@shared/schema";

export function RegisteredTeams() {
  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
  });

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Registered Teams
            </h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span>Loading teams...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (teams.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" data-testid="text-section-teams">
              Registered Teams
            </h2>
            <p className="text-muted-foreground text-lg">
              Be the first team to register for this epic tournament!
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                No teams registered yet. Register your squad now!
              </p>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" data-testid="text-section-teams">
            Registered Teams
          </h2>
          <p className="text-muted-foreground text-lg">
            {teams.length} squad{teams.length !== 1 ? 's' : ''} ready for battle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {teams.map((team, index) => (
            <Card 
              key={team.id} 
              className="p-6 hover-elevate transition-all duration-300 relative overflow-hidden group"
              data-testid={`card-team-${team.id}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg" data-testid={`text-team-name-${team.id}`}>
                        {team.teamName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Team #{index + 1}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-chart-3/10 border-chart-3/50" data-testid={`badge-team-status-${team.id}`}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Registered
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Leader:</span>
                    <span className="font-medium">{team.leaderName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Squad:</span>
                    <span className="font-medium">4 Players</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
