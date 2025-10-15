import { Card } from "@/components/ui/card";
import { Gamepad2, Map, Smartphone, Users, IndianRupee, Trophy } from "lucide-react";
import { TOURNAMENT_CONFIG } from "@shared/schema";
import { motion } from "framer-motion";

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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 md:py-28 container mx-auto px-4">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-5" data-testid="text-section-tournament-details">
          Tournament Details
        </h2>
        <p className="text-foreground/80 text-xl max-w-2xl mx-auto font-medium">
          Everything you need to know about the championship
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {details.map((detail, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
          >
            <Card 
              className="p-7 hover-elevate transition-all duration-300 hover:scale-105 hover:shadow-xl"
              data-testid={`card-detail-${detail.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-start gap-5">
                <div className={`p-4 rounded-xl ${detail.bg} flex-shrink-0 transition-transform duration-300 hover:scale-110`}>
                  <detail.icon className={`w-7 h-7 ${detail.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                    {detail.label}
                  </h3>
                  <p className="font-display font-bold text-xl">
                    {detail.value}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
