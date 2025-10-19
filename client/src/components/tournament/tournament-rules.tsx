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
    <section id="rules" className="py-20 md:py-28 container mx-auto px-4">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-5" data-testid="text-section-rules">
          Rules & Regulations
        </h2>
        <p className="text-foreground/80 text-xl max-w-3xl mx-auto font-medium">
          Please read all rules carefully before registering. Organizers' decisions are final.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {rules.map((rule, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
          >
            <Card 
              className={`p-7 hover-elevate transition-all duration-300 hover:scale-[1.02] ${
                rule.variant === 'destructive' ? 'border-destructive/40 hover:border-destructive/60' : 'hover:border-primary/30'
              }`}
              data-testid={`card-rule-${index}`}
            >
              <div className="flex items-start gap-5">
                <div className={`p-3 rounded-xl flex-shrink-0 transition-transform duration-300 hover:scale-110 ${
                  rule.variant === 'destructive' 
                    ? 'bg-destructive/15' 
                    : 'bg-primary/15'
                }`}>
                  <rule.icon className={`w-6 h-6 ${
                    rule.variant === 'destructive' 
                      ? 'text-destructive' 
                      : 'text-primary'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl mb-2">
                    {rule.title}
                  </h3>
                  <p className="text-base text-foreground/70 leading-relaxed">
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
