import { Card } from "@/components/ui/card";
import { Trophy, Medal, Crown, Sparkles } from "lucide-react";
import { TOURNAMENT_CONFIG } from "@shared/schema";
import { motion } from "framer-motion";

export function PrizePool() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-chart-4/5 to-chart-2/5"></div>
      <div className="absolute inset-0 bg-secondary/40 backdrop-blur-3xl"></div>
      
      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-20 w-64 h-64 bg-chart-4/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-chart-4 animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-display font-extrabold" data-testid="text-section-prize-pool">
              Prize Pool
            </h2>
            <Sparkles className="w-6 h-6 text-chart-4 animate-pulse" />
          </div>
          <p className="text-foreground/80 text-xl font-medium">
            Compete for amazing cash prizes!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Winner */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <Card className="p-10 text-center relative overflow-hidden group hover-elevate transition-all duration-500 hover:scale-105 hover:shadow-2xl" data-testid="card-prize-winner">
              <div className="absolute top-0 right-0 w-40 h-40 bg-chart-4/30 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative">
                <div className="inline-flex p-6 rounded-full bg-chart-4/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Crown className="w-16 h-16 text-chart-4" />
                </div>
                <h3 className="text-3xl font-display font-bold mb-3">Winner</h3>
                <p className="text-6xl md:text-7xl font-display font-extrabold gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                  ₹{TOURNAMENT_CONFIG.PRIZE_WINNER}
                </p>
                <p className="text-foreground/70 text-lg font-semibold">1st Place Prize</p>
              </div>
            </Card>
          </motion.div>

          {/* Runner Up */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <Card className="p-10 text-center relative overflow-hidden group hover-elevate transition-all duration-500 hover:scale-105 hover:shadow-2xl" data-testid="card-prize-runner-up">
              <div className="absolute top-0 right-0 w-40 h-40 bg-chart-2/30 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-chart-1/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative">
                <div className="inline-flex p-6 rounded-full bg-chart-2/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Medal className="w-16 h-16 text-chart-2" />
                </div>
                <h3 className="text-3xl font-display font-bold mb-3">Runner-up</h3>
                <p className="text-6xl md:text-7xl font-display font-extrabold gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                  ₹{TOURNAMENT_CONFIG.PRIZE_RUNNER_UP}
                </p>
                <p className="text-foreground/70 text-lg font-semibold">2nd Place Prize</p>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-base text-foreground/70 font-medium flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-chart-4" />
            Prize money will be transferred via UPI/Paytm/PhonePe after verification
          </p>
        </motion.div>
      </div>
    </section>
  );
}
