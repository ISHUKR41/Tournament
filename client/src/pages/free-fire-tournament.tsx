import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { TournamentDetails } from "@/components/tournament/tournament-details";
import { PrizePool } from "@/components/tournament/prize-pool";
import { GameRegistrationForm } from "@/components/tournament/game-registration-form";
import { RegisteredTeams } from "@/components/tournament/registered-teams";
import { TournamentRules } from "@/components/tournament/tournament-rules";
import { Footer } from "@/components/tournament/footer";
import { TOURNAMENT_CONFIG } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, Flame } from "lucide-react";
import { SlotCounter } from "@/components/tournament/slot-counter";
import heroImage from "@assets/generated_images/Free_Fire_Tournament_Hero_12705473.png";
import { motion } from "framer-motion";

export default function FreeFireTournament() {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Free Fire Hero Section */}
      <div className="relative min-h-[700px] lg:min-h-[800px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 hero-gradient"></div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-24 text-center">
          <Badge 
            variant="outline" 
            className="mb-8 text-sm px-5 py-2 border-primary/60 bg-primary/15 backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-top-4 duration-700"
            data-testid="badge-tournament-type"
          >
            <Flame className="w-4 h-4 mr-2 text-orange-400" />
            Battle Royale Championship 2025
          </Badge>

          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold mb-8 leading-tight"
            data-testid="text-hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              textShadow: '0 0 40px rgba(255, 100, 0, 0.5), 0 0 80px rgba(255, 50, 0, 0.3)',
            }}
          >
            Ultimate Free Fire
            <span className="block gradient-text mt-3 text-6xl sm:text-7xl md:text-8xl lg:text-9xl" style={{
              background: 'linear-gradient(135deg, #ff6b00 0%, #ff0000 50%, #ff6b00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 3s ease infinite',
            }}>Tournament</span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-foreground/90 mb-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 font-medium leading-relaxed"
            data-testid="text-hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Show your power, earn the glory, and become the ultimate Free Fire Champion!
            Register your squad now for the ultimate battleground experience.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Button 
              size="lg" 
              className="text-xl px-10 py-7 min-h-14 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              onClick={() => setShowRegistrationForm(true)}
              data-testid="button-register-now"
            >
              <Users className="w-6 h-6 mr-2" />
              Register Your Squad
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="text-xl px-10 py-7 min-h-14 backdrop-blur-md bg-background/30 border-2 border-foreground/20 hover:bg-background/40 shadow-xl hover:shadow-2xl transition-all duration-300"
              onClick={() => document.getElementById('rules')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-view-rules"
            >
              <Calendar className="w-6 h-6 mr-2" />
              View Rules
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <SlotCounter gameType="freefire" maxTeams={TOURNAMENT_CONFIG.FREE_FIRE.MAX_TEAMS} />
          </motion.div>
        </div>
      </div>

      <TournamentDetails config={TOURNAMENT_CONFIG.FREE_FIRE} />
      <PrizePool config={TOURNAMENT_CONFIG.FREE_FIRE} />
      <TournamentRules gameType="freefire" />
      <RegisteredTeams gameType="freefire" />
      
      {showRegistrationForm && (
        <GameRegistrationForm
          onClose={() => setShowRegistrationForm(false)}
          gameType="freefire"
          gameName="Free Fire"
          entryFee={TOURNAMENT_CONFIG.FREE_FIRE.ENTRY_FEE}
        />
      )}
      
      <Footer />
    </div>
  );
}
