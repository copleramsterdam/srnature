import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Calendar, HeartHandshake } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 bg-cream batik-pattern border-b border-gold/15 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Artwork Frame */}
          <div className="lg:col-span-5 relative" id="about-visuals">
            {/* Elegant outer gold border frame */}
            <div className="absolute -inset-4 border border-gold/30 rounded-3xl -rotate-2 pointer-events-none" />
            <div className="absolute -inset-1 border border-gold/40 rounded-3xl rotate-1 pointer-events-none" />
            
            {/* Floating Logo Badge overlay */}
            <div className="absolute -top-6 -right-6 bg-white border-2 border-gold p-1 rounded-full shadow-2xl w-20 h-20 z-10 hidden sm:block animate-bounce" style={{ animationDuration: '6s' }}>
              <img 
                src="/src/assets/images/java_herbal_logo_1783606253363.jpg" 
                alt="Java Herbal Stamp" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-square lg:aspect-3/4 shadow-2xl bg-royal-green">
              <img
                src="/src/assets/images/hero_jamu_preparation_1783604874087.jpg"
                alt="Jamu Preparation Heritage"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-green/60 to-transparent" />
              
              {/* Badge Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-royal-green/90 backdrop-blur-md border border-gold/30 p-4 rounded-xl">
                <span className="font-serif text-cream font-bold block text-sm tracking-wider uppercase text-center text-gold">
                  Mille-Annum Heritage of Java
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Text content */}
          <div className="lg:col-span-7 space-y-8" id="about-editorial-content">
            
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 text-gold">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-dark">
                  Traditional Javanese Herbalism
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-royal-green leading-tight">
                {t('about.home.heading')}
              </h2>
            </div>

            <div className="space-y-6 font-sans text-royal-green/90 text-base sm:text-lg leading-relaxed font-light">
              <p>{t('about.home.p1')}</p>
              <p>{t('about.home.p2')}</p>
            </div>

            {/* Quick Javanese Traditional Wisdom checklist points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gold/20" id="wisdom-checkpoints">
              
              <div className="flex space-x-3.5">
                <div className="flex-shrink-0 bg-gold/10 p-2 rounded-full text-gold-dark flex items-center justify-center h-10 w-10">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-royal-green text-sm tracking-wide">
                    Thousand-Year Tradition
                  </h4>
                  <p className="text-xs text-royal-green/75 leading-relaxed font-light">
                    Sourced from age-old palm leaf logs (*Lontar*) preserved in central Java royal palaces.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3.5">
                <div className="flex-shrink-0 bg-gold/10 p-2 rounded-full text-gold-dark flex items-center justify-center h-10 w-10">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-royal-green text-sm tracking-wide">
                    Absolute Natural Purism
                  </h4>
                  <p className="text-xs text-royal-green/75 leading-relaxed font-light">
                    Strictly zero coloring agents, artificial elements, thickeners, or chemicals.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
