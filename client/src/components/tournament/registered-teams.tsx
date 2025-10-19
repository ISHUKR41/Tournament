import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Team } from "@shared/schema";
import { motion } from "framer-motion";

interface RegisteredTeamsProps {
  gameType: "pubg" | "freefire";
}

export function RegisteredTeams({ gameType }: RegisteredTeamsProps) {
  const { data: allTeams = [], isLoading } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
    refetchInterval: 5000,
  });

  const teams = allTeams.filter(team => team.gameType === gameType);

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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-secondary/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <Skeleton className="h-10 sm:h-12 md:h-14 w-64 sm:w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="p-6 sm:p-7">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (teams.length === 0) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-secondary/40">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-10 sm:mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            data-aos="fade-up"
          >
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-4 sm:mb-5" 
              style={{ fontSize: 'clamp(1.875rem, 5vw, 3.75rem)' }}
              data-testid="text-section-teams"
            >
              Registered Teams
            </h2>
            <p 
              className="text-foreground/80 text-base sm:text-lg md:text-xl font-medium"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
            >
              Be the first team to register for this epic tournament!
            </p>
          </motion.div>
          <motion.div 
            className="max-w-lg mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            data-aos="zoom-in"
          >
            <Card className="p-12 sm:p-16 md:p-20 text-center hover:shadow-2xl hover:scale-105 transition-all duration-500">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Users className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-muted-foreground mx-auto mb-6 opacity-40" />
              </motion.div>
              <p 
                className="text-foreground/70 text-base sm:text-lg md:text-xl font-medium"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
              >
                No teams registered yet. Register your squad now!
              </p>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-secondary/40">
      <div className="container mx-auto px-4 sm:px-6">
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
            data-testid="text-section-teams"
          >
            Registered Teams
          </h2>
          <p 
            className="text-foreground/80 text-base sm:text-lg md:text-xl font-medium"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
          >
            {teams.length} squad{teams.length !== 1 ? 's' : ''} ready for battle
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              variants={itemVariants}
              data-aos="flip-left"
              data-aos-delay={index * 100}
            >
              <Card 
                className="p-6 sm:p-7 hover-elevate transition-all duration-500 hover:scale-105 relative overflow-hidden group hover:shadow-2xl min-h-[180px] sm:min-h-[200px] hover:border-primary/30"
                data-testid={`card-team-${team.id}`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4 sm:mb-5 flex-wrap gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="p-2.5 sm:p-3 rounded-xl bg-primary/15 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 flex-shrink-0 min-w-[48px] min-h-[48px] sm:min-w-[52px] sm:min-h-[52px] flex items-center justify-center">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="min-w-0">
                        <h3 
                          className="font-display font-bold text-lg sm:text-xl md:text-2xl truncate" 
                          style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}
                          data-testid={`text-team-name-${team.id}`}
                        >
                          {team.teamName}
                        </h3>
                        <p 
                          className="text-xs sm:text-sm text-muted-foreground font-medium"
                          style={{ fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)' }}
                        >
                          Team #{index + 1}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-chart-3/15 border-chart-3/50 hover:bg-chart-3/25 transition-colors duration-300 min-h-[32px] px-3" 
                      data-testid={`badge-team-status-${team.id}`}
                    >
                      <CheckCircle className="w-3 h-3 mr-1.5" />
                      <span style={{ fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)' }}>Registered</span>
                    </Badge>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3">
                    <div 
                      className="flex items-center gap-2.5 sm:gap-3 text-sm sm:text-base min-h-[36px]"
                      style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
                    >
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground flex-shrink-0">Leader:</span>
                      <span className="font-semibold truncate">{team.leaderName}</span>
                    </div>
                    <div 
                      className="flex items-center gap-2.5 sm:gap-3 text-sm sm:text-base min-h-[36px]"
                      style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
                    >
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground flex-shrink-0">Squad:</span>
                      <span className="font-semibold">4 Players</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
