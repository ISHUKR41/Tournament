import { Card } from "@/components/ui/card";
import { Trophy, Medal, Crown } from "lucide-react";
import { TOURNAMENT_CONFIG } from "@shared/schema";

export function PrizePool() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" data-testid="text-section-prize-pool">
            Prize Pool
          </h2>
          <p className="text-muted-foreground text-lg">
            Compete for amazing cash prizes!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Winner */}
          <Card className="p-8 text-center relative overflow-hidden group hover-elevate transition-all duration-300" data-testid="card-prize-winner">
            <div className="absolute top-0 right-0 w-32 h-32 bg-chart-4/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="inline-flex p-4 rounded-full bg-chart-4/10 mb-4">
                <Crown className="w-12 h-12 text-chart-4" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">Winner</h3>
              <p className="text-5xl font-display font-bold gradient-text mb-2">
                ₹{TOURNAMENT_CONFIG.PRIZE_WINNER}
              </p>
              <p className="text-muted-foreground">1st Place Prize</p>
            </div>
          </Card>

          {/* Runner Up */}
          <Card className="p-8 text-center relative overflow-hidden group hover-elevate transition-all duration-300" data-testid="card-prize-runner-up">
            <div className="absolute top-0 right-0 w-32 h-32 bg-chart-2/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="inline-flex p-4 rounded-full bg-chart-2/10 mb-4">
                <Medal className="w-12 h-12 text-chart-2" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">Runner-up</h3>
              <p className="text-5xl font-display font-bold gradient-text mb-2">
                ₹{TOURNAMENT_CONFIG.PRIZE_RUNNER_UP}
              </p>
              <p className="text-muted-foreground">2nd Place Prize</p>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <Trophy className="w-4 h-4 inline mr-1" />
            Prize money will be transferred via UPI/Paytm/PhonePe after verification
          </p>
        </div>
      </div>
    </section>
  );
}
