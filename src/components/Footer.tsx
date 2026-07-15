import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Leaf, Phone, Mail, MapPin, Clock, MessageSquare, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  onNavClick: (section: string) => void;
  whatsappUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, whatsappUrl }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-royal-green text-cream border-t border-gold/20 pt-20 pb-10 relative overflow-hidden">
      {/* Subtle background Batik print */}
      <div className="absolute inset-0 z-0 opacity-[0.02] batik-pattern-dark pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Core footer elements grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12" id="footer-layout-grid">
          
          {/* Logo & Philosophy column */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavClick('home')}>
              <div className="bg-black p-0.5 rounded-full text-royal-green w-12 h-12 overflow-hidden border border-gold/40">
                <img 
                  src="/src/assets/images/sr_nature_logo_1783939605671.jpg" 
                  alt="SR Nature &amp; Aromatherapy Logo" 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider block bg-gradient-to-r from-cream to-gold bg-clip-text text-transparent">
                  SR NATURE &amp; AROMATHERAPY
                </span>
                <span className="text-[10px] font-mono tracking-widest text-gold block uppercase -mt-1">
                  Traditional Javanese SR Nature &amp; Aromatherapy
                </span>
              </div>
            </div>
            <p className="text-sm text-cream/70 font-light leading-relaxed max-w-sm">
              We bring organic, hand-crafted Javanese wellness elixirs to the heart of the Netherlands. Concocted with premium roots and botanical flowers using thousand-year-old royal palace recipes.
            </p>
            {/* Social connections */}
            <div className="flex items-center space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-cream/10 hover:bg-gold hover:text-royal-green p-2.5 rounded-full transition-all duration-300 shadow-inner"
                aria-label="Instagram Link"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-cream/10 hover:bg-gold hover:text-royal-green p-2.5 rounded-full transition-all duration-300 shadow-inner"
                aria-label="Facebook Link"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={whatsappUrl || "https://wa.me/31684861301"} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-cream/10 hover:bg-gold hover:text-royal-green p-2.5 rounded-full transition-all duration-300 shadow-inner text-[#25D366] hover:text-royal-green"
                aria-label="WhatsApp Hotline"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links navigation */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif font-bold text-gold text-sm tracking-widest uppercase border-b border-gold/15 pb-2">
              Royal Ledger Pages
            </h4>
            <ul className="space-y-2.5 text-sm font-sans font-light text-cream/85">
              {[
                { id: 'home', label: 'nav.home' },
                { id: 'shop', label: 'nav.shop' },
                { id: 'about', label: 'nav.about' },
                { id: 'blog', label: 'nav.blog' },
                { id: 'order', label: 'nav.contact' }
              ].map((link) => (
                <li key={link.id}>
                  <button 
                    onClick={() => onNavClick(link.id)}
                    className="hover:text-gold transition-colors block text-left"
                  >
                    {t(link.label)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Spa Location and contact parameters */}
          <div className="md:col-span-4 space-y-5 text-sm font-sans font-light text-cream/90" id="footer-contact-details">
            <h4 className="font-serif font-bold text-gold text-sm tracking-widest uppercase border-b border-gold/15 pb-2">
              The Spa Dispensary
            </h4>
            
            <div className="space-y-3.5">
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Djamoe Heritage Netherlands<br />
                  Keizersgracht 421, 1016 EK Amsterdam,<br />
                  Netherlands
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="tel:+31684861301" className="hover:text-gold transition-colors">
                  +31 6 8486 1301
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:info@djamoeheritage.nl" className="hover:text-gold transition-colors">
                  info@djamoeheritage.nl
                </a>
              </div>

              <div className="flex items-start space-x-3 border-t border-gold/10 pt-3">
                <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold block text-gold-light uppercase">Operating Hours:</span>
                  <span>Mon - Fri: 09:00 - 18:00</span><br />
                  <span>Sat: 10:00 - 16:00 (Sundays Closed)</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Outer footer maps and signature */}
        <div className="border-t border-gold/15 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/50 gap-4" id="footer-signature">
          <p>© 2026 SR Nature &amp; Aromatherapy. Crafted in the Netherlands. Preserve Your Vitality.</p>
          <div className="flex space-x-6">
            <a href="#privacy" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-gold transition-colors">Terms of Alchemy</a>
            <button onClick={() => onNavClick('admin')} className="hover:text-gold font-bold transition-colors">Admin Portal</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
