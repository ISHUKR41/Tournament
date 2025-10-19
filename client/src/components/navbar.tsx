import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Trophy, Gamepad2 } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            <span className="text-xl font-display font-bold">Tournament Arena</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/pubg">
              <Button
                variant={location === "/pubg" || location === "/" ? "default" : "ghost"}
                className="gap-2"
                data-testid="link-pubg-tournament"
              >
                <Gamepad2 className="w-4 h-4" />
                PUBG Mobile
              </Button>
            </Link>
            
            <Link href="/free-fire">
              <Button
                variant={location === "/free-fire" ? "default" : "ghost"}
                className="gap-2"
                data-testid="link-freefire-tournament"
              >
                <Gamepad2 className="w-4 h-4" />
                Free Fire
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
