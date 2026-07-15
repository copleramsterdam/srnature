import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, ShoppingBag, Trash2, Plus, Minus, CheckCircle, ArrowRight } from 'lucide-react';

interface OrderFormProps {
  selectedProducts: Product[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onRemoveProduct: (id: string) => void;
  prefilledNotes?: string;
  setPrefilledNotes?: (val: string) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  selectedProducts,
  setSelectedProducts,
  quantities,
  setQuantities,
  onRemoveProduct,
  prefilledNotes = '',
  setPrefilledNotes
}) => {
  const { t, translate } = useLanguage();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Netherlands');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (prefilledNotes) {
      setNotes(prefilledNotes);
    }
  }, [prefilledNotes]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, p) => {
      const qty = quantities[p.id] || 1;
      return sum + p.price * qty;
    }, 0);
  };

  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProducts.length && !notes.trim()) {
      setErrorMsg('Please select at least one herbal drink or specify your massage/service booking details in the notes.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        customerName,
        phone,
        email,
        country,
        productIds: selectedProducts.map(p => p.id),
        quantities: selectedProducts.map(p => quantities[p.id] || 1),
        notes
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.redirectUrl) {
        setIsSuccess(true);
        setRedirectUrl(data.redirectUrl);
        
        // Clear order state on success
        setSelectedProducts([]);
        setQuantities({});
        setNotes('');
        setPrefilledNotes?.('');
        
        // Attempt top level redirection, with a safe visual fallback for iframes
        setTimeout(() => {
          window.location.href = data.redirectUrl;
        }, 1200);
      } else {
        setErrorMsg(data.error || 'Failed to submit order. Please check inputs.');
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Network error. Unable to process order right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order" className="py-10 bg-cream border-b border-gold/15 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center space-x-2 text-gold">
            <ShoppingBag className="w-4 h-4 text-gold-dark" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-dark">
              Botanical Dispensary
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-royal-green tracking-wide">
            {t('order.title')}
          </h2>
          <p className="text-xs sm:text-sm text-royal-green/75 font-light leading-relaxed max-w-xl mx-auto">
            {t('order.subtitle')}
          </p>
        </div>

        {isSuccess ? (
          /* Success Screen with direct Link trigger fallback */
          <div className="max-w-2xl mx-auto bg-white border border-gold/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 luxury-shadow animate-scale-up" id="order-success-panel">
            <div className="bg-leaf-green w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gold shadow-lg">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-royal-green">
                Order Registered Successfully!
              </h3>
              <p className="text-sm text-royal-green/80 font-light max-w-md mx-auto leading-relaxed">
                We have registered your traditional remedies in our ledger. We are now attempting to connect to our dispatch master on WhatsApp.
              </p>
            </div>

            <div className="bg-cream border border-gold/20 p-5 rounded-2xl max-w-md mx-auto space-y-4">
              <p className="text-xs text-royal-green/70 font-mono tracking-wider uppercase font-semibold">
                If you were not redirected automatically, please click below:
              </p>
              <a
                href={redirectUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2.5 bg-[#128C7E] hover:bg-[#0e7065] text-cream font-bold text-sm tracking-widest uppercase px-6 py-3.5 rounded-full shadow-lg transition-transform hover:scale-103 duration-300"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>
            
            <button
              onClick={() => setIsSuccess(false)}
              className="text-xs font-mono font-bold text-gold-dark tracking-wider uppercase underline hover:text-royal-green"
            >
              Order More Elixirs
            </button>
          </div>
        ) : (
          /* Order Form Main Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="order-form-grid">
            
            {/* Left Column: Selection Ledger Cart */}
            <div className="lg:col-span-5 bg-white border border-gold/15 p-6 sm:p-8 rounded-3xl luxury-shadow space-y-6" id="order-cart-ledger">
              <h3 className="font-serif text-xl font-bold text-royal-green border-b border-gold/15 pb-4 flex items-center justify-between">
                <span>Selected Herbs</span>
                <span className="text-xs font-mono font-normal bg-gold/10 text-gold-dark px-2.5 py-1 rounded-full uppercase">
                  {selectedProducts.length} Drinks
                </span>
              </h3>

              {selectedProducts.length === 0 ? (
                <div className="py-12 text-center text-royal-green/60 space-y-3 font-light text-sm">
                  <ShoppingBag className="w-8 h-8 text-gold/50 mx-auto" />
                  <p>{t('order.cart.empty')}</p>
                </div>
              ) : (
                <div className="space-y-4 divide-y divide-gold/10" id="cart-items-list">
                  {selectedProducts.map((p, idx) => {
                    const qty = quantities[p.id] || 1;
                    return (
                      <div key={p.id} className={`flex items-center space-x-4 ${idx > 0 ? 'pt-4' : ''}`}>
                        {/* Little thumbnail */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream border border-gold/10 flex-shrink-0">
                          <img src={p.imageUrl} alt={translate(p.name)} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        {/* Name and pricing */}
                        <div className="flex-grow space-y-0.5">
                          <h4 className="font-serif font-bold text-royal-green text-sm line-clamp-1">
                            {translate(p.name)}
                          </h4>
                          <span className="text-xs text-gold-dark font-medium">
                            €{(p.price * qty).toFixed(2)} (€{p.price.toFixed(2)})
                          </span>
                        </div>
                        {/* Qty increment controls */}
                        <div className="flex items-center space-x-2.5">
                          <button
                            type="button"
                            onClick={() => updateQty(p.id, -1)}
                            className="p-1 rounded-full border border-gold/30 hover:border-gold text-royal-green hover:bg-gold/10 transition-all duration-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold font-mono w-4 text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(p.id, 1)}
                            className="p-1 rounded-full border border-gold/30 hover:border-gold text-royal-green hover:bg-gold/10 transition-all duration-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        {/* Delete selection */}
                        <button
                          type="button"
                          onClick={() => onRemoveProduct(p.id)}
                          className="text-stone-400 hover:text-red-500 p-1 transition-colors"
                          aria-label="Remove drink"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Cart pricing footer */}
              {selectedProducts.length > 0 && (
                <div className="pt-6 border-t border-gold/15 flex items-center justify-between font-serif text-lg text-royal-green">
                  <span>{t('order.cart.total')}</span>
                  <span className="font-bold text-xl text-gold-dark">
                    €{calculateTotal().toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Right Column: Checkout Form Fields */}
            <div className="lg:col-span-7 bg-white border border-gold/15 p-6 sm:p-8 rounded-3xl luxury-shadow" id="order-fields-form-panel">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm p-4 rounded-xl font-light">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold tracking-wider uppercase text-royal-green/80 block">
                      {t('order.form.name')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Marieke Jansen"
                      className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold tracking-wider uppercase text-royal-green/80 block">
                      {t('order.form.phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. +31 6 12345678"
                      className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold tracking-wider uppercase text-royal-green/80 block">
                      {t('order.form.email')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. marieke@gmail.com"
                      className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold tracking-wider uppercase text-royal-green/80 block">
                      {t('order.form.country')} *
                    </label>
                    <select
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    >
                      <option value="Netherlands">Netherlands (Nederland)</option>
                      <option value="Belgium">Belgium (België)</option>
                      <option value="Germany">Germany (Duitsland)</option>
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold tracking-wider uppercase text-royal-green/80 block">
                    {t('order.form.notes')}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Enter any custom preferences, digestive goals, or allergy notifications."
                    className="w-full bg-cream/30 border border-gold/25 rounded-xl p-4 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || (selectedProducts.length === 0 && !notes.trim())}
                  className="w-full bg-royal-green hover:bg-leaf-green text-cream disabled:bg-stone-200 disabled:text-stone-400 font-bold text-sm tracking-widest uppercase py-4 rounded-full shadow-lg transition-transform hover:scale-[1.01] duration-300 flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-5 h-5 text-gold" />
                  <span>{isSubmitting ? 'Transcribing Order...' : t('order.form.submit')}</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </button>

              </form>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
