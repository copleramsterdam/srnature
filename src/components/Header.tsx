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
    { id: 'blog', label: 'nav.blog' }
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsOpen(false);
    
    // Smooth scroll to element if present
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gold/20 text-cream luxury-shadow transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand Name */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center space-x-3 cursor-pointer group"
            id="brand-logo"
          >
            <motion.div 
              className="flex items-center justify-center overflow-hidden relative rounded-full"
              style={{ width: '70px', height: '70px' }}
              whileHover={{ 
                scale: 1.12,
                rotate: 5,
                filter: "drop-shadow(0px 0px 8px rgba(212, 175, 55, 0.5))"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 17 
              }}
            >
              <img 
                src="/src/assets/images/sr_nature_logo_1783939605671.jpg" 
                alt="SR Nature &amp; Aromatherapy Logo" 
                className="object-cover rounded-full animate-fade-in"
                style={{ width: '70px', height: '70px' }}
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
              <span className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-wider block bg-gradient-to-r from-cream via-gold-light to-gold bg-clip-text text-transparent">
                SR NATURE &amp; AROMATHERAPY
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3 lg:space-x-4" id="desktop-nav">
            {navItems.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <span className="h-3 w-[1px] bg-gold/30 self-center" aria-hidden="true" />
                )}
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`font-medium text-xs lg:text-sm tracking-widest uppercase transition-colors duration-300 relative py-2 px-1 ${
                    activeSection === item.id 
                      ? 'text-gold font-semibold' 
                      : 'text-cream/80 hover:text-gold'
                  }`}
                >
                  {t(item.label)}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold rounded-full" />
                  )}
                </button>
              </React.Fragment>
            ))}

            <span className="h-[2px] w-[2px] bg-transparent self-center" aria-hidden="true" />
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
              <button
                onClick={() => setLanguage('id')}
                className={`px-2.5 py-1 rounded-full transition-all duration-300 font-semibold uppercase ${
                  language === 'id'
                    ? 'bg-gold text-royal-green font-bold shadow-sm'
                    : 'text-cream/70 hover:text-cream'
                }`}
              >
                ID
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3" id="lang-switcher-mobile">
            {/* Quick lang swap button on mobile header */}
            <button
              onClick={() => {
                const nextLang: Record<Language, Language> = { en: 'nl', nl: 'id', id: 'en' };
                setLanguage(nextLang[language]);
              }}
              className="flex items-center space-x-1 border border-gold/30 rounded-full px-2.5 py-1 text-xs text-gold uppercase"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language.toUpperCase()}</span>
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
        <div className="md:hidden bg-black border-t border-gold/10 luxury-shadow animate-fade-in" id="mobile-nav">
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
            
            {/* No admin on mobile menu */}

            {/* Language Selection list in Mobile Menu */}
            <div className="pt-4 mt-2 border-t border-gold/10 px-4 flex items-center justify-between">
              <span className="text-xs text-cream/60 flex items-center gap-1.5 uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-gold" />
                Language
              </span>
              <div className="inline-flex rounded-full border border-gold/30 p-0.5 text-xs bg-royal-green/40">
                {(['en', 'nl', 'id'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 rounded-full transition-all duration-300 font-semibold uppercase ${
                      language === lang
                        ? 'bg-gold text-royal-green font-bold shadow-sm'
                        : 'text-cream/70 hover:text-cream'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
