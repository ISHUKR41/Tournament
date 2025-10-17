import { Card } from "@/components/ui/card";
import { MessageCircle, Mail, Trophy, Shield } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-primary" />
              <h3 className="font-display font-bold text-lg">PUBG Tournament</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Ultimate PUBG Mobile Squad Championship. Register your team and compete for amazing prizes!
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a 
                href="https://wa.me/your-number" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-whatsapp"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Support
              </a>
              <a 
                href="mailto:support@tournament.com" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-email"
              >
                <Mail className="w-4 h-4" />
                Email Us
              </a>
            </div>
          </div>

          {/* Important Info */}
          <div>
            <h3 className="font-display font-semibold mb-4">Important</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Room details shared 15 mins before match</li>
              <li>• All payments are non-refundable</li>
              <li>• Organizers' decisions are final</li>
              <li>• Fair play is mandatory</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© 2025 PUBG Mobile Tournament. All rights reserved.</p>
          <p className="mt-1">Good luck, warriors! May the best squad win.</p>
          <Link href="/admin/login">
            <button className="mt-4 text-xs opacity-30 hover:opacity-100 transition-opacity flex items-center gap-1 mx-auto" data-testid="link-admin">
              <Shield className="w-3 h-3" />
              Admin
            </button>
          </Link>
        </div>
      </div>
    </footer>
  );
}
