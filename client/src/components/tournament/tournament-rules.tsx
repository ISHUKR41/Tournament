import { Card } from "@/components/ui/card";
import { 
  Shield, 
  Users, 
  Ban, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Video,
  AlertTriangle,
  Wallet
} from "lucide-react";
import { motion } from "framer-motion";

interface TournamentRulesProps {
  gameType: "pubg" | "freefire";
}

export function TournamentRules({ gameType }: TournamentRulesProps) {
  const playerIdLabel = gameType === "pubg" ? "PUBG IDs" : "Free Fire UIDs";
  
  const rules = [
    {
      icon: Users,
      title: "Team Composition",
      description: "Each team must have exactly 4 members. All player details must be accurate and final.",
      variant: "default" as const,
    },
    {
      icon: Shield,
      title: "Platform Restriction",
      description: "Only mobile players are allowed. Emulator players are strictly prohibited.",
      variant: "default" as const,
    },
    {
      icon: Ban,
      title: "Fair Play Policy",
      description: "No hacks, cheats, glitches, or third-party tools. Violations lead to immediate disqualification.",
      variant: "destructive" as const,
    },
    {
      icon: CheckCircle,
      title: "Registration Finality",
      description: `Team names and ${playerIdLabel} are final after submission. No changes will be permitted.`,
      variant: "default" as const,
    },
    {
      icon: XCircle,
      title: "No Refund Policy",
      description: "Once registered, fees are non-refundable under any circumstances.",
      variant: "destructive" as const,
    },
    {
      icon: Clock,
      title: "Punctuality Required",
      description: "Room ID and password shared 15 minutes before match. Teams must join on time - no late entries.",
      variant: "default" as const,
    },
    {
      icon: MessageSquare,
      title: "Code of Conduct",
      description: "Good behavior and fair play are mandatory. Toxic behavior results in disqualification.",
      variant: "default" as const,
    },
    {
      icon: Video,
      title: "Streaming Allowed",
      description: "Recording or streaming is permitted, but please mention the official tournament name.",
      variant: "default" as const,
    },
    {
      icon: AlertTriangle,
      title: "Disconnect Policy",
      description: "If a player disconnects during match, no rematch or refund will be given.",
      variant: "destructive" as const,
    },
    {
      icon: Wallet,
      title: "Prize Distribution",
      description: "Top 2 teams receive prize money directly via UPI/Paytm/PhonePe after verification.",
      variant: "default" as const,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="rules" className="py-12 sm:py-16 md:py-20 lg:py-28 container mx-auto px-4 sm:px-6">
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
          data-testid="text-section-rules"
        >
          Rules & Regulations
        </h2>
        <p 
          className="text-foreground/80 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-medium"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
        >
          Please read all rules carefully before registering. Organizers' decisions are final.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {rules.map((rule, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            data-aos="fade-right"
            data-aos-delay={index * 50}
          >
            <Card 
              className={`p-5 sm:p-6 md:p-7 hover-elevate transition-all duration-500 hover:scale-[1.02] group min-h-[140px] sm:min-h-[160px] ${
                rule.variant === 'destructive' ? 'border-destructive/40 hover:border-destructive/60 hover:shadow-destructive/20' : 'hover:border-primary/30 hover:shadow-primary/10'
              } hover:shadow-xl`}
              data-testid={`card-rule-${index}`}
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div className={`p-3 sm:p-4 rounded-xl flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 min-w-[52px] min-h-[52px] sm:min-w-[56px] sm:min-h-[56px] flex items-center justify-center ${
                  rule.variant === 'destructive' 
                    ? 'bg-destructive/15' 
                    : 'bg-primary/15'
                }`}>
                  <rule.icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-500 group-hover:scale-110 ${
                    rule.variant === 'destructive' 
                      ? 'text-destructive' 
                      : 'text-primary'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 
                    className="font-display font-bold text-base sm:text-lg md:text-xl mb-2"
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
                  >
                    {rule.title}
                  </h3>
                  <p 
                    className="text-sm sm:text-base text-foreground/70 leading-relaxed"
                    style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
                  >
                    {rule.description}
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
