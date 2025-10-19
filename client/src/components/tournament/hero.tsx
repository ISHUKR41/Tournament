import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar } from "lucide-react";
import { CountdownTimer } from "./countdown-timer";
import { SlotCounter } from "./slot-counter";
import heroImage from "@assets/generated_images/PUBG_tournament_hero_image_76e84b21.png";

interface HeroProps {
  onRegisterClick: () => void;
  gameType: "pubg" | "freefire";
  maxTeams: number;
}

export function Hero({ onRegisterClick, gameType, maxTeams }: HeroProps) {
  return (
    <div className="relative min-h-[700px] lg:min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Enhanced Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-chart-2/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-chart-4/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 text-center">
        <Badge 
          variant="outline" 
          className="mb-8 text-sm px-5 py-2 border-primary/60 bg-primary/15 backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-top-4 duration-700"
          data-testid="badge-tournament-type"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Squad Championship 2025
        </Badge>

        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 leading-tight"
          data-testid="text-hero-title"
        >
          Ultimate PUBG Mobile
          <span className="block gradient-text mt-3 text-6xl sm:text-7xl md:text-8xl lg:text-9xl">Tournament</span>
        </h1>

        <p 
          className="text-xl md:text-2xl text-foreground/90 mb-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 font-medium leading-relaxed"
          data-testid="text-hero-subtitle"
        >
          Show off your skills, teamwork, and strategy to win exciting cash prizes!
          Register your squad now for the ultimate battleground experience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <Button 
            size="lg" 
            className="text-xl px-10 py-7 min-h-14 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            onClick={onRegisterClick}
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
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <SlotCounter gameType={gameType} maxTeams={maxTeams} />
          <CountdownTimer />
        </div>
      </div>
    </div>
  );
}
