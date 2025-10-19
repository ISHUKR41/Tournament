import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/tournament/hero";
import { TournamentDetails } from "@/components/tournament/tournament-details";
import { PrizePool } from "@/components/tournament/prize-pool";
import { GameRegistrationForm } from "@/components/tournament/game-registration-form";
import { RegisteredTeams } from "@/components/tournament/registered-teams";
import { TournamentRules } from "@/components/tournament/tournament-rules";
import { Footer } from "@/components/tournament/footer";
import { SlotCounter } from "@/components/tournament/slot-counter";
import { TOURNAMENT_CONFIG } from "@shared/schema";

export default function PubgTournament() {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero onRegisterClick={() => setShowRegistrationForm(true)} gameType="pubg" maxTeams={TOURNAMENT_CONFIG.PUBG.MAX_TEAMS} />
      <TournamentDetails config={TOURNAMENT_CONFIG.PUBG} />
      <PrizePool config={TOURNAMENT_CONFIG.PUBG} />
      <TournamentRules gameType="pubg" />
      <RegisteredTeams gameType="pubg" />
      
      {showRegistrationForm && (
        <GameRegistrationForm
          onClose={() => setShowRegistrationForm(false)}
          gameType="pubg"
          gameName="PUBG Mobile"
          entryFee={TOURNAMENT_CONFIG.PUBG.ENTRY_FEE}
        />
      )}
      
      <Footer />
    </div>
  );
}
