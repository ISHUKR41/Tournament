import { Card } from "@/components/ui/card";
import { Gamepad2, Map, Smartphone, Users, IndianRupee, Trophy } from "lucide-react";
import { TOURNAMENT_CONFIG } from "@shared/schema";

const details = [
  {
    icon: Gamepad2,
    label: "Game Mode",
    value: TOURNAMENT_CONFIG.GAME_MODE,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    icon: Map,
    label: "Map",
    value: TOURNAMENT_CONFIG.MAP,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    icon: Smartphone,
    label: "Platform",
    value: "Mobile Only",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    icon: Users,
    label: "Total Slots",
    value: `${TOURNAMENT_CONFIG.MAX_TEAMS} Teams`,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
  {
    icon: IndianRupee,
    label: "Entry Fee",
    value: `₹${TOURNAMENT_CONFIG.ENTRY_FEE} per team`,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    icon: Trophy,
    label: "Prize Pool",
    value: `₹${TOURNAMENT_CONFIG.PRIZE_WINNER + TOURNAMENT_CONFIG.PRIZE_RUNNER_UP}`,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
];

export function TournamentDetails() {
  return (
    <section className="py-16 md:py-24 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" data-testid="text-section-tournament-details">
          Tournament Details
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Everything you need to know about the championship
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {details.map((detail, index) => (
          <Card 
            key={index} 
            className="p-6 hover-elevate transition-transform duration-300"
            data-testid={`card-detail-${detail.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${detail.bg} flex-shrink-0`}>
                <detail.icon className={`w-6 h-6 ${detail.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                  {detail.label}
                </h3>
                <p className="font-display font-bold text-lg">
                  {detail.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
