import { useState } from "react";
import { Hero } from "@/components/tournament/hero";
import { TournamentDetails } from "@/components/tournament/tournament-details";
import { PrizePool } from "@/components/tournament/prize-pool";
import { RegistrationForm } from "@/components/tournament/registration-form";
import { RegisteredTeams } from "@/components/tournament/registered-teams";
import { TournamentRules } from "@/components/tournament/tournament-rules";
import { Footer } from "@/components/tournament/footer";

export default function Home() {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Hero onRegisterClick={() => setShowRegistrationForm(true)} />
      <TournamentDetails />
      <PrizePool />
      <TournamentRules />
      <RegisteredTeams />
      
      {showRegistrationForm && (
        <RegistrationForm onClose={() => setShowRegistrationForm(false)} />
      )}
      
      <Footer />
    </div>
  );
}
