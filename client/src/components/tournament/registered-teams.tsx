import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Team } from "@shared/schema";
import { motion } from "framer-motion";

export function RegisteredTeams() {
  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
    refetchInterval: 5000,
  });

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
      <section className="py-20 md:py-28 bg-secondary/40">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-5">
              Registered Teams
            </h2>
            <div className="flex items-center justify-center gap-3 text-foreground/70">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-lg">Loading teams...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (teams.length === 0) {
    return (
      <section className="py-20 md:py-28 bg-secondary/40">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-5" data-testid="text-section-teams">
              Registered Teams
            </h2>
            <p className="text-foreground/80 text-xl font-medium">
              Be the first team to register for this epic tournament!
            </p>
          </motion.div>
          <motion.div 
            className="max-w-lg mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-16 text-center">
              <Users className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-40" />
              <p className="text-foreground/70 text-lg font-medium">
                No teams registered yet. Register your squad now!
              </p>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-secondary/40">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-5" data-testid="text-section-teams">
            Registered Teams
          </h2>
          <p className="text-foreground/80 text-xl font-medium">
            {teams.length} squad{teams.length !== 1 ? 's' : ''} ready for battle
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              variants={itemVariants}
            >
              <Card 
                className="p-7 hover-elevate transition-all duration-300 hover:scale-105 relative overflow-hidden group hover:shadow-xl"
                data-testid={`card-team-${team.id}`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/15 transition-transform duration-300 group-hover:scale-110">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-xl" data-testid={`text-team-name-${team.id}`}>
                          {team.teamName}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">
                          Team #{index + 1}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-chart-3/15 border-chart-3/50" data-testid={`badge-team-status-${team.id}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Registered
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-base">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <span className="text-muted-foreground">Leader:</span>
                      <span className="font-semibold">{team.leaderName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-base">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <span className="text-muted-foreground">Squad:</span>
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
