import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { TOURNAMENT_CONFIG } from "@shared/schema";

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(TOURNAMENT_CONFIG.TOURNAMENT_DATE).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="p-6 backdrop-blur-md bg-card/80" data-testid="card-countdown">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-display font-semibold text-lg">Tournament Starts In</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Mins", value: timeLeft.minutes },
          { label: "Secs", value: timeLeft.seconds },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div 
              className="text-2xl md:text-3xl font-display font-bold text-primary mb-1"
              data-testid={`text-countdown-${item.label.toLowerCase()}`}
            >
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-xs text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
