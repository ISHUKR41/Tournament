import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";
import { TOURNAMENT_CONFIG } from "@shared/schema";
import { motion } from "framer-motion";

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(TOURNAMENT_CONFIG.PUBG.TOURNAMENT_DATE).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
      setIsLoading(false);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <Card className="p-5 sm:p-6 md:p-7 backdrop-blur-md bg-card/80" data-testid="card-countdown">
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="text-center space-y-2">
              <Skeleton className="h-10 sm:h-12 md:h-14 w-full rounded-lg" />
              <Skeleton className="h-4 w-full rounded" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      data-aos="zoom-in"
    >
      <Card 
        className="p-5 sm:p-6 md:p-7 backdrop-blur-md bg-card/80 hover:shadow-2xl hover:scale-105 transition-all duration-500 border-primary/20 hover:border-primary/40" 
        data-testid="card-countdown"
      >
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <motion.div 
            className="p-2 sm:p-3 rounded-lg bg-primary/10"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </motion.div>
          <h3 
            className="font-display font-semibold text-base sm:text-lg md:text-xl"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
          >
            Tournament Starts In
          </h3>
        </div>
        
        <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[
            { label: "Days", value: timeLeft.days, color: "text-chart-1" },
            { label: "Hours", value: timeLeft.hours, color: "text-chart-2" },
            { label: "Mins", value: timeLeft.minutes, color: "text-chart-3" },
            { label: "Secs", value: timeLeft.seconds, color: "text-chart-4" },
          ].map((item, index) => (
            <motion.div 
              key={item.label} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <motion.div 
                className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold ${item.color} mb-1 sm:mb-2 p-2 sm:p-3 rounded-lg bg-gradient-to-br from-muted/50 to-muted/20 hover:from-primary/10 hover:to-primary/5 transition-all duration-300 min-h-[48px] sm:min-h-[56px] md:min-h-[64px] flex items-center justify-center`}
                data-testid={`text-countdown-${item.label.toLowerCase()}`}
                style={{ fontSize: 'clamp(1.25rem, 4vw, 2.25rem)' }}
                animate={{ 
                  scale: item.label === "Secs" ? [1, 1.05, 1] : 1 
                }}
                transition={{ 
                  duration: 1,
                  repeat: item.label === "Secs" ? Infinity : 0 
                }}
              >
                {String(item.value).padStart(2, '0')}
              </motion.div>
              <div 
                className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wide"
                style={{ fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)' }}
              >
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
