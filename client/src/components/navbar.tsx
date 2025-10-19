import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Trophy, Gamepad2, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg' 
          : 'bg-background/60 backdrop-blur-md border-b border-border/30'
      }`}
      data-aos="fade-down"
      data-aos-duration="600"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <span className="text-lg sm:text-xl md:text-2xl font-display font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Tournament Arena
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link href="/pubg">
              <Button
                variant={location === "/pubg" || location === "/" ? "default" : "ghost"}
                className="gap-2 transition-all duration-300 btn-hover-lift"
                data-testid="link-pubg-tournament"
              >
                <Gamepad2 className="w-4 h-4" />
                <span className="hidden lg:inline">PUBG Mobile</span>
                <span className="lg:hidden">PUBG</span>
              </Button>
            </Link>
            
            <Link href="/free-fire">
              <Button
                variant={location === "/free-fire" ? "default" : "ghost"}
                className="gap-2 transition-all duration-300 btn-hover-lift"
                data-testid="link-freefire-tournament"
              >
                <Gamepad2 className="w-4 h-4" />
                <span className="hidden lg:inline">Free Fire</span>
                <span className="lg:hidden">FF</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden py-4 space-y-2 animate-in slide-in-from-top-2 duration-300"
            data-aos="fade-down"
          >
            <Link href="/pubg">
              <Button
                variant={location === "/pubg" || location === "/" ? "default" : "ghost"}
                className="w-full justify-start gap-3 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Gamepad2 className="w-5 h-5" />
                PUBG Mobile Tournament
              </Button>
            </Link>
            
            <Link href="/free-fire">
              <Button
                variant={location === "/free-fire" ? "default" : "ghost"}
                className="w-full justify-start gap-3 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Gamepad2 className="w-5 h-5" />
                Free Fire Tournament
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
