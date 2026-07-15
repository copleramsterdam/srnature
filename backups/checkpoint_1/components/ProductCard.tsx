import React from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Eye, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToOrder: (product: Product) => void;
  isAdded: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToOrder,
  isAdded
}) => {
  const { language, t, translate } = useLanguage();

  return (
    <div 
      className="bg-white rounded-3xl border border-gold/15 overflow-hidden luxury-shadow transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col h-full group"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Panel */}
      <div className="relative aspect-square bg-cream overflow-hidden">
        {/* Hover Zoom image effect */}
        <img
          src={product.imageUrl}
          alt={translate(product.name)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Featured Badge */}
        {product.isFeatured && (
          <div className="absolute top-4 left-4 bg-royal-green text-gold border border-gold/45 px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-md">
            <Sparkles className="w-3 h-3 text-gold" />
            <span>{t('product.featured')}</span>
          </div>
        )}

        {/* Category Badge overlay bottom-left */}
        <div className="absolute bottom-4 left-4 bg-cream/90 backdrop-blur-sm border border-gold/20 text-royal-green px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide shadow-sm">
          {t(`cat.${product.category}`)}
        </div>
      </div>

      {/* Content description */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div className="space-y-1.5">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-royal-green tracking-wide line-clamp-1 group-hover:text-gold-dark transition-colors duration-300">
            {translate(product.name)}
          </h3>
          <p className="text-xs sm:text-sm text-royal-green/75 font-light leading-relaxed line-clamp-2">
            {translate(product.description)}
          </p>
        </div>

        {/* Pricing and Stock footer */}
        <div className="pt-2 border-t border-gold/10 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-royal-green/60 uppercase block">
              {t('product.price')}
            </span>
            <span className="text-xl font-serif font-bold text-royal-green">
              €{product.price.toFixed(2)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono tracking-widest text-royal-green/60 uppercase block">
              Status
            </span>
            {product.stock > 0 ? (
              <span className="text-xs font-semibold text-leaf-green">
                {product.stock} {t('product.stock')}
              </span>
            ) : (
              <span className="text-xs font-bold text-red-600">
                {t('product.outOfStock')}
              </span>
            )}
          </div>
        </div>

        {/* Interactive Action buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          
          <button
            onClick={() => onViewDetails(product)}
            className="bg-transparent hover:bg-gold/10 border border-gold/40 text-royal-green hover:text-gold-dark text-[11px] font-semibold tracking-wider uppercase py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('product.viewDetails')}</span>
          </button>

          <button
            onClick={() => product.stock > 0 && onAddToOrder(product)}
            disabled={product.stock <= 0}
            className={`text-[11px] font-bold tracking-wider uppercase py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-1 ${
              product.stock <= 0
                ? 'bg-stone-200 text-stone-400 border border-transparent cursor-not-allowed'
                : isAdded
                ? 'bg-leaf-green text-gold border border-gold/30'
                : 'bg-royal-green hover:bg-leaf-green text-cream border border-transparent shadow-md'
            }`}
          >
            {isAdded ? <Check className="w-3.5 h-3.5 text-gold" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isAdded ? 'Selected' : t('product.addToOrder')}</span>
          </button>

        </div>
      </div>
    </div>
  );
};
