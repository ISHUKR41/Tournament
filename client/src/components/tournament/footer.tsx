import { MessageCircle, Mail, Trophy, Shield } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t py-10 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            data-aos="fade-up"
            data-aos-delay="0"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="p-2 rounded-lg bg-primary/10 transition-transform duration-300 hover:scale-110">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h3 
                className="font-display font-bold text-base sm:text-lg md:text-xl"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
              >
                PUBG Tournament
              </h3>
            </div>
            <p 
              className="text-sm sm:text-base text-muted-foreground leading-relaxed"
              style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
            >
              Ultimate PUBG Mobile Squad Championship. Register your team and compete for amazing prizes!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h3 
              className="font-display font-semibold mb-4 sm:mb-5 text-base sm:text-lg"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}
            >
              Contact Us
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <a 
                href="https://wa.me/your-number" 
                className="flex items-center gap-3 text-sm sm:text-base text-muted-foreground hover:text-primary transition-all duration-300 group min-h-[44px]"
                data-testid="link-whatsapp"
                style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
              >
                <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors duration-300">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span>WhatsApp Support</span>
              </a>
              <a 
                href="mailto:support@tournament.com" 
                className="flex items-center gap-3 text-sm sm:text-base text-muted-foreground hover:text-primary transition-all duration-300 group min-h-[44px]"
                data-testid="link-email"
                style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
              >
                <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors duration-300">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span>Email Us</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h3 
              className="font-display font-semibold mb-4 sm:mb-5 text-base sm:text-lg"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}
            >
              Important
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}>
              <li className="flex items-start gap-2 transition-colors duration-300 hover:text-foreground">
                <span className="text-primary mt-1">•</span>
                <span>Room details shared 15 mins before match</span>
              </li>
              <li className="flex items-start gap-2 transition-colors duration-300 hover:text-foreground">
                <span className="text-primary mt-1">•</span>
                <span>All payments are non-refundable</span>
              </li>
              <li className="flex items-start gap-2 transition-colors duration-300 hover:text-foreground">
                <span className="text-primary mt-1">•</span>
                <span>Organizers' decisions are final</span>
              </li>
              <li className="flex items-start gap-2 transition-colors duration-300 hover:text-foreground">
                <span className="text-primary mt-1">•</span>
                <span>Fair play is mandatory</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          className="border-t pt-6 sm:pt-8 text-center text-sm sm:text-base text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          data-aos="fade-up"
          data-aos-delay="300"
          style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
        >
          <p className="mb-2">© 2025 PUBG Mobile Tournament. All rights reserved.</p>
          <p className="mb-4">Good luck, warriors! May the best squad win.</p>
          <Link href="/admin/login">
            <button 
              className="mt-2 text-xs sm:text-sm opacity-30 hover:opacity-100 transition-all duration-300 flex items-center gap-2 mx-auto min-h-[44px] px-4 hover:scale-105" 
              data-testid="link-admin"
              style={{ fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)' }}
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              Admin
            </button>
          </Link>
        </motion.div>
      </div>
    </footer>
  );
}
