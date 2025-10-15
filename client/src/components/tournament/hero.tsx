import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar } from "lucide-react";
import { CountdownTimer } from "./countdown-timer";
import { SlotCounter } from "./slot-counter";
import heroImage from "@assets/generated_images/PUBG_tournament_hero_image_76e84b21.png";

interface HeroProps {
  onRegisterClick: () => void;
}

export function Hero({ onRegisterClick }: HeroProps) {
  return (
    <div className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <Badge 
          variant="outline" 
          className="mb-6 text-sm px-4 py-1 border-primary/50 bg-primary/10 backdrop-blur-sm"
          data-testid="badge-tournament-type"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Squad Championship 2025
        </Badge>

        <h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
          data-testid="text-hero-title"
        >
          Ultimate PUBG Mobile
          <span className="block gradient-text mt-2">Tournament</span>
        </h1>

        <p 
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100"
          data-testid="text-hero-subtitle"
        >
          Show off your skills, teamwork, and strategy to win exciting cash prizes!
          Register your squad now for the ultimate battleground experience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 min-h-12"
            onClick={onRegisterClick}
            data-testid="button-register-now"
          >
            <Users className="w-5 h-5 mr-2" />
            Register Your Squad
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-6 min-h-12 backdrop-blur-md bg-background/20 border-border/50"
            onClick={() => document.getElementById('rules')?.scrollIntoView({ behavior: 'smooth' })}
            data-testid="button-view-rules"
          >
            <Calendar className="w-5 h-5 mr-2" />
            View Rules
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <SlotCounter />
          <CountdownTimer />
        </div>
      </div>
    </div>
  );
}
