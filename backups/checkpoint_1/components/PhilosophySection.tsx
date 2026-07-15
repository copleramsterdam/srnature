import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, CheckCircle2, Leaf, Activity } from 'lucide-react';

export const PhilosophySection: React.FC = () => {
  const { t } = useLanguage();

  const traditionalTargets = [
    { name: 'Immune System Defence', desc: 'Increases leukocyte activity and forms an antioxidant shield.' },
    { name: 'Optimized Digestion', desc: 'Soothes acid reflux, stimulates bile release, and feeds gut microbiome.' },
    { name: 'Natural Detoxification', desc: 'Promotes healthy liver hepatocyte regeneration and filters blood.' },
    { name: 'Optimal Blood Circulation', desc: 'Maintains healthy vascular elasticity and lowers chronic fatigue.' },
    { name: 'Women\'s Hormonal Wellness', desc: 'Balances estrogens, regulates cycle cramps, and brightens skin glow.' },
    { name: 'Stress & Sleep Quality', desc: 'Adaptogenic roots balance cortisol production to quieten minds.' }
  ];

  return (
    <section id="philosophy" className="py-24 bg-royal-green text-cream border-b border-gold/15 scroll-mt-20 relative overflow-hidden">
      
      {/* Decorative Javanese Batik Background overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.02] batik-pattern-dark pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 text-gold">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">
              Laras &amp; Rukun Wisdom
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-cream">
            {t('phil.title')}
          </h2>
          <p className="text-base sm:text-lg text-cream/70 font-light font-sans max-w-2xl mx-auto">
            {t('phil.subtitle')}
          </p>
        </div>

        {/* Philosophy Intro text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6 text-cream/85 text-base sm:text-lg font-light leading-relaxed">
            <p>{t('phil.p1')}</p>
            <p>{t('phil.p2')}</p>
          </div>
          
          <div className="bg-leaf-green/50 border border-gold/20 p-8 rounded-3xl relative overflow-hidden flex flex-col justify-center shadow-xl">
            {/* Soft gold leaf background shadow */}
            <Leaf className="absolute -bottom-10 -right-10 w-44 h-44 text-gold/5 pointer-events-none" />
            
            <h3 className="font-serif text-2xl font-bold text-gold mb-4 flex items-center space-x-2">
              <Activity className="w-6 h-6" />
              <span>Prevention Before Illness</span>
            </h3>
            <p className="text-sm text-cream/90 font-light leading-relaxed mb-6">
              In Java, the body is seen as an ecosystem. Just as a royal gardener waters plants daily rather than waiting for leaves to wither, Jamu is drunk as a daily ritual of purification. It strengthens the natural biological barrier before stressors and diseases can accumulate.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-gold-light uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                <span>Cellular Renewal</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono text-gold-light uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                <span>Nervous Alignment</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono text-gold-light uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                <span>Thermal Equilibrium</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono text-gold-light uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                <span>Bile Stimulation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Targets Grid */}
        <div className="border-t border-gold/15 pt-16">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-center text-gold-light mb-12">
            Why Drink Jamu? — Scientific &amp; Traditional Support
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" id="health-targets-grid">
            {traditionalTargets.map((target, idx) => (
              <div 
                key={idx}
                className="bg-royal-green border border-gold/15 p-6 rounded-2xl hover:border-gold/40 hover:bg-leaf-green/30 transition-all duration-300"
              >
                <div className="text-gold mb-3 font-serif font-bold text-lg">
                  0{idx + 1}. {target.name}
                </div>
                <p className="text-xs sm:text-sm text-cream/80 leading-relaxed font-light font-sans">
                  {target.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
