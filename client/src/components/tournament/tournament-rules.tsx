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
    description: "Team names and PUBG IDs are final after submission. No changes will be permitted.",
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

export function TournamentRules() {
  return (
    <section id="rules" className="py-16 md:py-24 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" data-testid="text-section-rules">
          Rules & Regulations
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Please read all rules carefully before registering. Organizers' decisions are final.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
        {rules.map((rule, index) => (
          <Card 
            key={index}
            className={`p-6 hover-elevate transition-all duration-300 ${
              rule.variant === 'destructive' ? 'border-destructive/50' : ''
            }`}
            data-testid={`card-rule-${index}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg flex-shrink-0 ${
                rule.variant === 'destructive' 
                  ? 'bg-destructive/10' 
                  : 'bg-primary/10'
              }`}>
                <rule.icon className={`w-5 h-5 ${
                  rule.variant === 'destructive' 
                    ? 'text-destructive' 
                    : 'text-primary'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-lg mb-2">
                  {rule.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {rule.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
