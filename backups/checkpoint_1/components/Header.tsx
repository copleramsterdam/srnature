import React, { useState } from 'react';
import { useLanguage, Language } from '../context/LanguageContext';
import { Menu, X, Leaf, Globe, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  setActiveSection,
  isAdminLoggedIn,
  onLogout
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'nav.home' },
    { id: 'shop', label: 'nav.shop' },
    { id: 'about', label: 'nav.about' },
    { id: 'philosophy', label: 'nav.philosophy' },
    { id: 'blog', label: 'nav.blog' },
    { id: 'order', label: 'nav.contact' }
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsOpen(false);
    
    // Smooth scroll to element if present
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-royal-green/95 backdrop-blur-md border-b border-gold/20 text-cream luxury-shadow transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand Name */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center space-x-3 cursor-pointer group"
            id="brand-logo"
          >
            <motion.div 
              className="bg-gradient-to-br from-gold-light to-gold p-0.5 rounded-full text-royal-green flex items-center justify-center shadow-lg w-12 h-12 overflow-hidden border border-gold/40 relative"
              whileHover={{ 
                scale: 1.12,
                rotate: 5,
                boxShadow: "0px 0px 15px rgba(212, 175, 55, 0.6)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 17 
              }}
            >
              <img 
                src="/src/assets/images/java_herbal_logo_1783606253363.jpg" 
                alt="Java Herbal Logo" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
              {/* Subtle shining light effect overlay */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full"
                whileHover={{ 
                  x: ["-100%", "100%"]
                }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider block bg-gradient-to-r from-cream via-gold-light to-gold bg-clip-text text-transparent">
                JAVA HERBAL
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center" id="desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-medium text-sm tracking-wider uppercase transition-colors duration-300 relative py-2 px-1 ${
                  activeSection === item.id 
                    ? 'text-gold' 
                    : 'text-cream/80 hover:text-gold'
                }`}
              >
                {t(item.label)}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold rounded-full" />
                )}
              </button>
            ))}

            {/* Admin Sanctum tab shortcut */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs tracking-wider uppercase transition-all duration-300 ${
                activeSection === 'admin'
                  ? 'bg-gold text-royal-green border-gold font-bold'
                  : 'border-gold/30 text-gold hover:bg-gold/10'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>{isAdminLoggedIn ? 'Sanctum' : t('nav.admin')}</span>
            </button>
          </nav>

          {/* Right actions: Language switcher */}
          <div className="hidden md:flex items-center space-x-3" id="lang-switcher-desktop">
            <Globe className="w-4 h-4 text-gold" />
            <div className="inline-flex rounded-full border border-gold/30 p-0.5 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full transition-all duration-300 font-semibold uppercase ${
                  language === 'en'
                    ? 'bg-gold text-royal-green font-bold shadow-sm'
                    : 'text-cream/70 hover:text-cream'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('nl')}
                className={`px-2.5 py-1 rounded-full transition-all duration-300 font-semibold uppercase ${
                  language === 'nl'
                    ? 'bg-gold text-royal-green font-bold shadow-sm'
                    : 'text-cream/70 hover:text-cream'
                }`}
              >
                NL
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3" id="lang-switcher-mobile">
            {/* Quick lang swap button on mobile header */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'nl' : 'en')}
              className="flex items-center space-x-1 border border-gold/30 rounded-full px-2.5 py-1 text-xs text-gold uppercase"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'NL' : 'EN'}</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-md text-cream hover:text-gold hover:bg-royal-green/50 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-royal-green border-t border-gold/10 luxury-shadow animate-fade-in" id="mobile-nav">
          <div className="px-2 pt-2 pb-4 space-y-1.5 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium tracking-wider uppercase transition-colors ${
                  activeSection === item.id
                    ? 'bg-leaf-green text-gold font-bold border-l-4 border-gold'
                    : 'text-cream/80 hover:bg-royal-green-light hover:text-gold'
                }`}
              >
                {t(item.label)}
              </button>
            ))}
            
            {/* Admin on mobile */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center space-x-2 w-full text-left px-4 py-3 rounded-md text-base font-medium tracking-wider uppercase transition-colors ${
                activeSection === 'admin'
                  ? 'bg-gold text-royal-green font-bold'
                  : 'text-gold hover:bg-royal-green-light'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isAdminLoggedIn ? 'Admin Sanctum' : t('nav.admin')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
