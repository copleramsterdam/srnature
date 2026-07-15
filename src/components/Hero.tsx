import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, ArrowRight, BookOpen, Leaf, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onShopClick: () => void;
  onAboutClick: () => void;
  onWhatsAppClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onAboutClick, onWhatsAppClick }) => {
  const { language, t } = useLanguage();

  const heroContent = {
    badge: {
      en: "AN EXCLUSIVE JAVANESE ROYAL WELLNESS IN THE NETHERLANDS",
      id: "LAYANAN KESEHATAN EKSKLUSIF KERATON JAWA DI BELANDA",
      nl: "EXCLUSIEVE JAVAANSE KONINKLIJKE WELLNESS IN NEDERLAND"
    },
    titlePre: {
      en: "The Sacred Art of",
      id: "Seni Sakral Pemulihan",
      nl: "De Heilige Kunst van"
    },
    titleHighlight: {
      en: "Javanese Royal Healing",
      id: "Tradisional Keraton Jawa",
      nl: "Javaanse Koninklijke Genezing"
    },
    titlePost: {
      en: "& Premium Spa",
      id: "& Spa Premium",
      nl: "& Premium Spa"
    },
    description: {
      en: "Indulge in five-star home-visit therapeutic massages. Experience custom-blended warm aromatherapy oils, restorative touch, and authentic botanical spa collections meticulously designed for deep physical and mental alignment in the comfort of your own space.",
      id: "Manjakan diri dalam layanan pijat terapeutik bintang lima langsung di rumah Anda. Nikmati kehangatan minyak aromaterapi alami, sentuhan pemulihan yang menenangkan, dan rangkaian spa botani autentik Jawa untuk kebugaran lahir batin sejati.",
      nl: "Geniet van vijfsterren massagetherapieën aan huis. Ervaar op maat gemaakte warme aromatherapieoliën, herstellende aanrakingen en authentieke botanische spa-collecties ontworpen voor diepe lichamelijke en geestelijke harmonie."
    }
  };

  const currentBadge = heroContent.badge[language] || heroContent.badge['en'];
  const currentTitlePre = heroContent.titlePre[language] || heroContent.titlePre['en'];
  const currentTitleHighlight = heroContent.titleHighlight[language] || heroContent.titleHighlight['en'];
  const currentTitlePost = heroContent.titlePost[language] || heroContent.titlePost['en'];
  const currentDesc = heroContent.description[language] || heroContent.description['en'];

  return (
    <section 
      id="home" 
      className="relative h-[calc(100vh-5rem)] min-h-[480px] lg:min-h-[500px] flex items-center justify-center overflow-hidden bg-royal-green border-b border-gold/15"
    >
      {/* Background Image of Luxury Massage */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 select-none scale-105 filter brightness-95 transform transition-all duration-1000" 
        style={{ 
          backgroundImage: `url('/src/assets/images/luxury_spa_massage_1783866797180.jpg')`,
        }}
      />

      {/* Cinematic Dark Royal Green/Charcoal Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-royal-green/65 via-royal-green/80 to-royal-green/95 lg:bg-gradient-to-r lg:from-royal-green/95 lg:via-royal-green/85 lg:to-black/70 z-10" />

      {/* Subtle Javanese Batik overlay pattern for touch of heritage */}
      <div className="absolute inset-0 z-10 opacity-[0.03] batik-pattern-dark pointer-events-none" />

      {/* Floating Decorative Elements */}
      <div className="absolute top-12 left-12 text-gold/10 animate-pulse hidden lg:block z-10">
        <Leaf className="w-20 h-20 rotate-45" />
      </div>
      <div className="absolute bottom-12 right-12 text-gold/10 hidden lg:block z-10">
        <Leaf className="w-24 h-24 -rotate-12" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-4 -mt-4 lg:-mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Premium Typography & Actions */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-3 sm:space-y-4 lg:space-y-4">
            
            {/* Elegant Luxury Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1 shadow-lg backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span className="text-[9px] font-mono tracking-widest text-gold-light font-bold uppercase">
                {currentBadge}
              </span>
            </motion.div>

            {/* Majestic Display Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-[2.2rem] font-semibold tracking-wide text-white leading-tight"
            >
              {currentTitlePre} <span className="text-gold block sm:inline">{currentTitleHighlight}</span> {currentTitlePost}
            </motion.h1>

            {/* Luxurious Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xs sm:text-xs md:text-sm text-cream/90 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed font-serif italic tracking-wide"
            >
              "{currentDesc}"
            </motion.p>

            {/* Highlighted Assurance Badges */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3 text-[10px] font-mono text-gold-light/90"
            >
              <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Amsterdam &amp; NL Home-Visits</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Certified Palace Therapists</span>
              </div>
            </motion.div>

            {/* Call to action panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 max-w-md sm:max-w-xl mx-auto lg:mx-0"
              id="hero-cta-buttons"
            >
              {/* Primary Massage Booking CTA */}
              <button
                onClick={onAboutClick}
                className="w-full sm:w-auto bg-gradient-to-r from-gold via-gold-dark to-gold hover:from-gold-dark hover:to-gold text-royal-green font-bold text-xs tracking-widest uppercase px-6 py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer border border-gold/40"
              >
                <span>{t('hero.cta.learn')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-royal-green" />
              </button>

              {/* Secondary Shop Products CTA */}
              <button
                onClick={onShopClick}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs tracking-widest uppercase px-5 py-2.5 rounded-full transition-all duration-300 backdrop-blur-sm flex items-center justify-center space-x-2 cursor-pointer hover:border-gold hover:text-gold"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('hero.cta.shop')}</span>
              </button>
            </motion.div>

          </div>

          {/* Right Column: Replaced with the original premium Brand Logo with pure authenticity */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="w-full max-w-[200px] sm:max-w-[230px] lg:max-w-[260px]"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-2 rounded-[1.5rem] shadow-2xl relative overflow-hidden group">
                {/* Golden glowing background effect */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full filter blur-xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gold/5 rounded-full filter blur-xl pointer-events-none" />
                
                {/* Main Image holding its full authenticity without crop */}
                <div className="relative aspect-square w-full rounded-[1.2rem] overflow-hidden bg-white/95 border border-gold/30 shadow-inner flex items-center justify-center p-0.5">
                  <img 
                    src="/src/assets/images/regenerated_image_1783940847239.png" 
                    alt="SR Natural Wellness Logo" 
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                  {/* Elegant floating badge at bottom of logo card */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-gold/30 px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow-lg">
                    <Sparkles className="w-2.5 h-2.5 text-gold animate-pulse" />
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-gold-light whitespace-nowrap">
                      {language === 'id' ? 'Autentik Keraton' : language === 'nl' ? 'Authentiek Koninklijk' : 'Authentic Royal'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
};

