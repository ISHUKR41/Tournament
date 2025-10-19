import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Gamepad2, Map, Smartphone, Users, IndianRupee, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface TournamentDetailsProps {
  config: {
    MAX_TEAMS: number;
    ENTRY_FEE: number;
    PRIZE_WINNER: number;
    PRIZE_RUNNER_UP: number;
    GAME_MODE: string;
    MAP: string;
  };
  isLoading?: boolean;
}

export function TournamentDetails({ config, isLoading = false }: TournamentDetailsProps) {
  const details = [
    {
      icon: Gamepad2,
      label: "Game Mode",
      value: config.GAME_MODE,
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
    {
      icon: Map,
      label: "Map",
      value: config.MAP,
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
      value: `${config.MAX_TEAMS} Teams`,
      color: "text-chart-4",
      bg: "bg-chart-4/10",
    },
    {
      icon: IndianRupee,
      label: "Entry Fee",
      value: `₹${config.ENTRY_FEE} per team`,
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
    {
      icon: Trophy,
      label: "Prize Pool",
      value: `₹${config.PRIZE_WINNER + config.PRIZE_RUNNER_UP}`,
      color: "text-chart-4",
      bg: "bg-chart-4/10",
    },
  ];

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

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <Skeleton className="h-10 sm:h-12 md:h-14 w-64 sm:w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-6 sm:p-7">
              <div className="flex items-start gap-4 sm:gap-5">
                <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 container mx-auto px-4 sm:px-6">
      <motion.div 
        className="text-center mb-10 sm:mb-12 md:mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        data-aos="fade-up"
      >
        <h2 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-4 sm:mb-5" 
          style={{ fontSize: 'clamp(1.875rem, 5vw, 3.75rem)' }}
          data-testid="text-section-tournament-details"
        >
          Tournament Details
        </h2>
        <p 
          className="text-foreground/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
        >
          Everything you need to know about the championship
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {details.map((detail, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <Card 
              className="p-6 sm:p-7 hover-elevate transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-primary/20 group min-h-[140px] sm:min-h-[160px]"
              data-testid={`card-detail-${detail.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div className={`p-3 sm:p-4 rounded-xl ${detail.bg} flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 min-w-[56px] min-h-[56px] sm:min-w-[64px] sm:min-h-[64px] flex items-center justify-center`}>
                  <detail.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${detail.color} transition-transform duration-500 group-hover:scale-110`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 
                    className="font-semibold text-xs sm:text-sm text-muted-foreground mb-2 uppercase tracking-wide"
                    style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}
                  >
                    {detail.label}
                  </h3>
                  <p 
                    className="font-display font-bold text-lg sm:text-xl md:text-2xl break-words"
                    style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}
                  >
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
