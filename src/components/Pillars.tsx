import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Leaf, Award, ShieldCheck } from 'lucide-react';

export const Pillars: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Leaf className="w-6 h-6 text-gold" />,
      title: 'pillar.natural.title',
      desc: 'pillar.natural.desc'
    },
    {
      icon: <Award className="w-6 h-6 text-gold" />,
      title: 'pillar.recipe.title',
      desc: 'pillar.recipe.desc'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-gold" />,
      title: 'pillar.fresh.title',
      desc: 'pillar.fresh.desc'
    }
  ];

  return (
    <section className="relative z-25 bg-cream py-16 border-b border-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12" id="brand-pillars-grid">
          
          {features.map((item, idx) => (
            <div 
              key={idx}
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-5 p-6 rounded-2xl bg-white/50 border border-gold/10 hover:border-gold/30 hover:bg-white transition-all duration-500 luxury-shadow"
            >
              <div className="flex-shrink-0 bg-royal-green p-3.5 rounded-full shadow-inner flex items-center justify-center">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-royal-green tracking-wide">
                  {t(item.title)}
                </h3>
                <p className="text-sm text-royal-green/80 font-light leading-relaxed">
                  {t(item.desc)}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};
