import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, ArrowRight, BookOpen, Leaf, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onShopClick: () => void;
  onAboutClick: () => void;
  onWhatsAppClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onAboutClick, onWhatsAppClick }) => {
  const { t } = useLanguage();

  return (
    <section 
      id="home" 
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-cream border-b border-gold/15"
    >
      {/* Background Subtle Batik Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] batik-pattern pointer-events-none" />

      {/* Radial soft glow to highlight the content */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(244,232,193,0.15)_0%,transparent_100%)]" />

      {/* Floating Botanical Leaf Accents */}
      <div className="absolute top-12 left-12 text-royal-green/5 animate-pulse hidden lg:block">
        <Leaf className="w-24 h-24 rotate-45" />
      </div>
      <div className="absolute bottom-16 right-16 text-royal-green/5 hidden lg:block">
        <Leaf className="w-32 h-32 -rotate-12" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8 order-2 lg:order-1">
            
            {/* Animated Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center space-x-2 bg-royal-green/5 border border-royal-green/15 rounded-full px-4 py-1.5 shadow-sm backdrop-blur-sm"
            >
              <Leaf className="w-3.5 h-3.5 text-royal-green" />
              <span className="text-xs sm:text-sm font-mono tracking-widest text-royal-green font-semibold uppercase">
                {t('hero.subtitle')}
              </span>
            </motion.div>

            {/* Elegant Display Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-royal-green leading-[1.15]"
            >
              {t('hero.title')}
            </motion.h1>

            {/* Descriptive intro */}
            <motion.p 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-royal-green/80 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              {t('hero.description')}
            </motion.p>

            {/* Call to action panel */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 max-w-md sm:max-w-xl mx-auto lg:mx-0"
              id="hero-cta-buttons"
            >
              {/* Shop now CTA */}
              <button
                onClick={onShopClick}
                className="w-full sm:w-auto bg-gradient-to-r from-royal-green via-leaf-green to-royal-green hover:from-leaf-green hover:to-royal-green text-cream font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-full shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer border border-royal-green/20"
              >
                <span>{t('hero.cta.shop')}</span>
                <ArrowRight className="w-4 h-4 text-gold-light" />
              </button>

              {/* Learn More CTA */}
              <button
                onClick={onAboutClick}
                className="w-full sm:w-auto bg-transparent hover:bg-royal-green/5 border border-royal-green/30 text-royal-green font-semibold text-sm tracking-widest uppercase px-7 py-4 rounded-full transition-all duration-300 hover:border-gold hover:text-gold-dark flex items-center justify-center space-x-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('hero.cta.learn')}</span>
              </button>

              {/* WhatsApp CTA */}
              <button
                onClick={onWhatsAppClick}
                className="w-full sm:w-auto bg-[#128C7E] hover:bg-[#0e7065] border border-transparent text-cream font-semibold text-sm tracking-widest uppercase px-7 py-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WA Order</span>
              </button>
            </motion.div>

          </div>

          {/* Right Column: Beautiful Circular Artwork Show */}
          <div className="lg:col-span-5 flex justify-center items-center order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px]"
            >
              {/* Luxury outer gold pulsing ring */}
              <div className="absolute inset-0 rounded-full border-2 border-gold/40 animate-pulse pointer-events-none scale-105" style={{ animationDuration: '4s' }} />
              <div className="absolute inset-0 rounded-full border border-royal-green/10 pointer-events-none scale-110" />
              
              {/* Curved text style or luxury badges can go here */}
              <div className="absolute -top-4 -right-4 bg-white border border-gold/40 text-royal-green px-3.5 py-1.5 rounded-full shadow-lg z-30 flex items-center space-x-1.5 animate-bounce" style={{ animationDuration: '3s' }}>
                <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold">100% Organic</span>
              </div>

              {/* Main Circular Artwork wrapper */}
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-gold bg-cream shadow-2xl relative">
                <img
                  src="/src/assets/images/java_herbal_logo_1783606253363.jpg"
                  alt="Java Herbal Traditional Wellness"
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
                
                {/* Subtle rotating gold shine lines on top */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
              </div>

              {/* Soft reflection shadow under the circle */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-4 bg-black/10 rounded-full filter blur-md opacity-70 pointer-events-none" />
            </motion.div>
          </div>

        </div>

        {/* Javanese Philosophy scroll quote indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, delay: 1 }}
          className="hidden lg:flex flex-col items-center space-y-1 text-gold-dark/60 font-mono text-[10px] tracking-widest uppercase mt-12"
        >
          <span>Harmonizing Body &amp; Mind</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-gold/70 to-transparent animate-bounce mt-2" />
        </motion.div>

      </div>
    </section>
  );
};
