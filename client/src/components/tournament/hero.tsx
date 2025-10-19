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
    <div className="relative min-h-[600px] sm:min-h-[700px] lg:min-h-[800px] xl:min-h-[900px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Enhanced Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Animated Gradient Orbs - Responsive sizes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"
          data-aos="fade-in"
          data-aos-duration="1000"
        ></div>
        <div 
          className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-chart-2/20 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '1s' }}
          data-aos="fade-in"
          data-aos-duration="1000"
          data-aos-delay="200"
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-80 sm:h-80 bg-chart-4/15 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '2s' }}
          data-aos="fade-in"
          data-aos-duration="1000"
          data-aos-delay="400"
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-28 text-center">
        <Badge 
          variant="outline" 
          className="mb-6 sm:mb-8 text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 border-primary/60 bg-primary/15 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105"
          data-testid="badge-tournament-type"
          data-aos="fade-down"
          data-aos-duration="600"
        >
          <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          <span className="font-medium">Squad Championship 2025</span>
        </Badge>

        <h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-display font-bold mb-6 sm:mb-8 leading-tight px-2"
          data-testid="text-hero-title"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <span className="block mb-2 sm:mb-3">Ultimate PUBG Mobile</span>
          <span className="block gradient-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extrabold mt-2 sm:mt-3">
            Tournament
          </span>
        </h1>

        <p 
          className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/80 mb-8 sm:mb-10 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto font-normal leading-relaxed px-4"
          data-testid="text-hero-subtitle"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="100"
        >
          Show off your skills, teamwork, and strategy to win exciting cash prizes!
          Register your squad now for the ultimate battleground experience.
        </p>

        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-5 mb-12 sm:mb-14 lg:mb-16 px-4"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="200"
        >
          <Button 
            size="lg" 
            className="w-full sm:w-auto text-base sm:text-lg shadow-lg transition-all duration-300 btn-hover-lift btn-hover-scale px-6 sm:px-8 py-5 sm:py-6"
            onClick={onRegisterClick}
            data-testid="button-register-now"
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Register Your Squad
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto text-base sm:text-lg backdrop-blur-md bg-background/30 transition-all duration-300 btn-hover-lift px-6 sm:px-8 py-5 sm:py-6"
            onClick={() => document.getElementById('rules')?.scrollIntoView({ behavior: 'smooth' })}
            data-testid="button-view-rules"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            View Rules
          </Button>
        </div>

        {/* Info Cards - Fully Responsive */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto px-4"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="300"
        >
          <SlotCounter gameType={gameType} maxTeams={maxTeams} />
          <CountdownTimer />
        </div>
      </div>
    </div>
  );
}
