import React from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { X, Leaf, Award, Brain, Info, AlertTriangle, Play, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToOrder: (product: Product) => void;
  isAdded: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToOrder,
  isAdded
}) => {
  const { t, translate, translateArray } = useLanguage();

  if (!product) return null;

  const ingredientsList = translateArray(product.ingredients);
  const benefitsList = translateArray(product.benefits);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-royal-green/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6" id="product-detail-modal-overlay">
      
      <div className="relative bg-cream w-full max-w-4xl rounded-3xl border border-gold/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
        
        {/* Header Ribbon */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="bg-royal-green/90 border border-gold/20 hover:border-gold p-2 rounded-full text-cream hover:text-gold transition-all duration-300 shadow-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-8 sm:space-y-10">
          
          {/* Main banner block (split grid) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Product Picture */}
            <div className="md:col-span-5 relative" id="modal-product-image">
              <div className="absolute -inset-2 border border-gold/20 rounded-2xl rotate-1 pointer-events-none" />
              <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg border border-gold/10">
                <img
                  src={product.imageUrl}
                  alt={translate(product.name)}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* General title & short intro info */}
            <div className="md:col-span-7 space-y-4" id="modal-product-info">
              <span className="text-xs font-mono font-bold tracking-widest text-gold-dark uppercase block">
                {t(`cat.${product.category}`)}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-royal-green tracking-wide">
                {translate(product.name)}
              </h2>
              <div className="text-2xl font-serif font-bold text-gold-dark">
                €{product.price.toFixed(2)}
              </div>
              <p className="text-sm sm:text-base text-royal-green/90 font-light leading-relaxed">
                {translate(product.description)}
              </p>

              {/* Select Herb Action button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onAddToOrder(product);
                  }}
                  disabled={product.stock <= 0}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-lg ${
                    product.stock <= 0
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : isAdded
                      ? 'bg-leaf-green text-gold border border-gold/30'
                      : 'bg-royal-green text-cream hover:bg-leaf-green'
                  }`}
                >
                  {isAdded ? 'Selected in Your Order' : t('product.addToOrder')}
                </button>
              </div>
            </div>

          </div>

          {/* Alchemy Grid: Traditional vs Scientific */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gold/20" id="alchemy-grid">
            
            {/* Traditional wisdom column */}
            <div className="bg-white/40 border border-gold/15 p-6 rounded-2xl space-y-3.5">
              <h3 className="font-serif text-lg font-bold text-royal-green flex items-center space-x-2 border-b border-gold/15 pb-2">
                <Award className="w-5 h-5 text-gold-dark flex-shrink-0" />
                <span>{t('product.traditional')}</span>
              </h3>
              <p className="text-xs sm:text-sm text-royal-green/85 leading-relaxed font-light">
                {translate(product.traditionalExplanation)}
              </p>
            </div>

            {/* Scientific explanation column */}
            <div className="bg-white/40 border border-gold/15 p-6 rounded-2xl space-y-3.5">
              <h3 className="font-serif text-lg font-bold text-royal-green flex items-center space-x-2 border-b border-gold/15 pb-2">
                <Brain className="w-5 h-5 text-gold-dark flex-shrink-0" />
                <span>{t('product.scientific')}</span>
              </h3>
              <p className="text-xs sm:text-sm text-royal-green/85 leading-relaxed font-light">
                {translate(product.scientificExplanation)}
              </p>
            </div>

          </div>

          {/* Split lists: Ingredients and Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start" id="modal-lists-grid">
            
            {/* Ingredients */}
            <div className="md:col-span-5 space-y-4">
              <h4 className="font-serif text-base font-bold text-royal-green flex items-center space-x-2">
                <Leaf className="w-4 h-4 text-gold-dark" />
                <span>{t('product.ingredients')}</span>
              </h4>
              <ul className="space-y-2">
                {ingredientsList.map((item, i) => (
                  <li key={i} className="text-xs sm:text-sm text-royal-green/80 font-light flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key benefits list */}
            <div className="md:col-span-7 space-y-4">
              <h4 className="font-serif text-base font-bold text-royal-green flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-gold-dark" />
                <span>{t('product.benefits')}</span>
              </h4>
              <ul className="space-y-2.5">
                {benefitsList.map((benefit, i) => (
                  <li key={i} className="text-xs sm:text-sm text-royal-green/90 font-light flex items-start space-x-2.5">
                    <span className="text-gold font-bold mt-0.5">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Usage Instruction card (Grid footer details) */}
          <div className="bg-royal-green border border-gold/20 p-6 rounded-2xl text-cream grid grid-cols-1 sm:grid-cols-3 gap-6" id="modal-usage-card">
            
            <div className="space-y-1.5">
              <h5 className="font-serif font-bold text-gold text-sm tracking-wide flex items-center space-x-1.5">
                <Play className="w-3.5 h-3.5 rotate-90" />
                <span>{t('product.howToConsume')}</span>
              </h5>
              <p className="text-xs text-cream/80 font-light leading-relaxed">
                {translate(product.howToConsume)}
              </p>
            </div>

            <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-gold/15 pt-4 sm:pt-0 sm:pl-6">
              <h5 className="font-serif font-bold text-gold text-sm tracking-wide flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>{t('product.recommended')}</span>
              </h5>
              <p className="text-xs text-cream/80 font-light leading-relaxed">
                {translate(product.recommendedConsumption)}
              </p>
            </div>

            <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-gold/15 pt-4 sm:pt-0 sm:pl-6">
              <h5 className="font-serif font-bold text-gold text-sm tracking-wide flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('product.whoShouldUse')}</span>
              </h5>
              <p className="text-xs text-cream/80 font-light leading-relaxed">
                {translate(product.whoShouldUse)}
              </p>
            </div>

          </div>

          {/* Medical Warnings Alert section */}
          {product.warnings && (
            <div className="bg-red-50/50 border border-red-200 p-4 rounded-xl flex items-start space-x-3 text-red-800" id="modal-warnings">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-serif font-bold text-xs tracking-wider uppercase text-red-600">
                  {t('product.warnings')}
                </h5>
                <p className="text-xs font-light leading-relaxed">
                  {translate(product.warnings)}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
