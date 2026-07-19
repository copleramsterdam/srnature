import React from 'react';
import { motion } from 'motion/react';
import { Home, ShoppingBag, Compass, Heart, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onNavigateToPrimbon: () => void;
  selectedProductsLength: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSection,
  setActiveSection,
  onNavigateToPrimbon,
  selectedProductsLength,
}) => {
  const { t, language } = useLanguage();

  const handleNavClick = (sectionId: string) => {
    if (sectionId === 'primbon') {
      onNavigateToPrimbon();
    } else {
      setActiveSection(sectionId);
      // Smooth scroll to the section
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  // Determine if Primbon is active. Primbon is active if we are in 'blog' section AND the active menu is 'primbon'.
  // However, simple heuristic: if activeSection is 'blog', we can treat either 'blog' or 'primbon' as active,
  // but let's see. In App.tsx we set blogInitialMenu to 'primbon' when navigating to Primbon.
  // We can pass a flag or just check if activeSection === 'blog'. Let's do a smart check:
  // Let's have item definitions:
  const items = [
    {
      id: 'home',
      label: language === 'id' ? 'Beranda' : language === 'nl' ? 'Home' : 'Home',
      icon: Home,
      isActive: activeSection === 'home',
    },
    {
      id: 'shop',
      label: language === 'id' ? 'Produk Spa' : language === 'nl' ? 'Producten' : 'Products',
      icon: ShoppingBag,
      isActive: activeSection === 'shop',
    },
    {
      id: 'primbon',
      label: language === 'id' ? 'Primbon' : language === 'nl' ? 'Weton' : 'Primbon',
      icon: Compass,
      // If we are in blog and it's initialized as primbon, highlight Primbon
      isActive: activeSection === 'blog',
    },
    {
      id: 'about',
      label: language === 'id' ? 'Pijat' : language === 'nl' ? 'Pijat' : 'Massage',
      icon: Heart,
      isActive: activeSection === 'about',
    },
    {
      id: 'order',
      label: language === 'id' ? 'Pesanan' : language === 'nl' ? 'Bestel' : 'Order',
      icon: ShoppingCart,
      isActive: activeSection === 'order',
      badge: selectedProductsLength > 0 ? selectedProductsLength : undefined,
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] border-t border-gray-100/80 px-4 pt-2 pb-5 pb-safe">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {items.map((item) => {
          const IconComponent = item.icon;
          const isActive = item.isActive;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="relative flex flex-col items-center justify-center py-1 px-3 focus:outline-none transition-all duration-300 group cursor-pointer"
              id={`mobile-nav-${item.id}`}
            >
              {/* Micro-animation container for icon */}
              <motion.div
                className={`relative p-1 rounded-full transition-colors duration-300 ${
                  isActive 
                    ? 'text-royal-green' 
                    : 'text-gray-400 group-hover:text-royal-green/70'
                }`}
                animate={{
                  scale: isActive ? 1.18 : 1.0,
                  y: isActive ? -4 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 17,
                }}
              >
                <IconComponent className="w-5 h-5 stroke-[2.2]" />

                {/* Badge for notifications (e.g. order item count) */}
                {item.badge !== undefined && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white font-sans text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </motion.div>

              {/* Text label with color transition */}
              <span
                className={`text-[10px] font-sans font-medium tracking-wide mt-1 transition-colors duration-300 ${
                  isActive 
                    ? 'text-royal-green font-semibold' 
                    : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>

              {/* Little active indicator dot */}
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute bottom-0 w-1.5 h-1.5 bg-gold rounded-full"
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
