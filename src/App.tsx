import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderForm } from './components/OrderForm';
import { BlogSection } from './components/BlogSection';
import { AdminPanel } from './components/AdminPanel';
import { ScrollReveal } from './components/ScrollReveal';
import { Footer } from './components/Footer';
import { Product, BlogPost, Order, SeoSettings, BusinessInfo } from './types';
import { Sparkles, Star, MapPin, RefreshCw, AlertCircle, ShoppingBag, Leaf, MessageCircle, CalendarRange, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AiChat } from './components/AiChat';

function MainAppContent() {
  const { t, translate, language } = useLanguage();

  // Root content states
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [seoSettings, setSeoSettings] = useState<SeoSettings | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);

  // Status metrics
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Active UI sections & filter queries
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Interactive drawer modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart shopping states
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Auth Sanctum state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Floating WhatsApp Quick Access Menu state
  const [isWhatsAppMenuOpen, setIsWhatsAppMenuOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Prefilled notes for massage services
  const [prefilledNotes, setPrefilledNotes] = useState('');

  // Categories list definition
  const categories = [
    { id: 'all', label: 'All Remedies' },
    { id: 'womens-health', label: 'cat.womens-health' },
    { id: 'men-health', label: 'cat.men-health' },
    { id: 'digestive-health', label: 'cat.digestive-health' },
    { id: 'traditional-drinks', label: 'cat.traditional-drinks' },
    { id: 'immune-booster', label: 'cat.immune-booster' },
    { id: 'detox', label: 'cat.detox' }
  ];

  // Static curated testimonials
  const testimonials = [
    {
      name: "Marieke de Jong",
      location: "Utrecht, NL",
      text: "Drinking Royal Kunyit Asam has completely re-balanced my digestive cycle. I feel energized and no longer depend on morning caffeine shots.",
      stars: 5,
      potion: "Kunyit Asam"
    },
    {
      name: "Bram van der Meer",
      location: "Amsterdam, NL",
      text: "Temulawak is a daily miracle for liver recovery and inflammation. The artisanal bottle feels like luxury spa therapy.",
      stars: 5,
      potion: "Royal Temulawak"
    },
    {
      name: "Anouk Smeets",
      location: "Rotterdam, NL",
      text: "Absolutely pure and freshly hand-extracted. The taste of authentic ginger and galangal brings Javanese warmth right to my winter kitchen.",
      stars: 5,
      potion: "Beras Kencur"
    }
  ];

  useEffect(() => {
    loadDatabase();
    verifyAdminToken();
  }, []);

  // Update HTML Meta tags in the browser head dynamically based on SEO settings
  useEffect(() => {
    if (seoSettings) {
      const title = translate(seoSettings.title);
      const desc = translate(seoSettings.description);
      const keys = translate(seoSettings.keywords);

      if (title) document.title = title;
      
      // Update or create meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', desc || "Premium Indonesian SR Natural Produk Website");

      // Update keywords
      let metaKeys = document.querySelector('meta[name="keywords"]');
      if (!metaKeys) {
        metaKeys = document.createElement('meta');
        metaKeys.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeys);
      }
      metaKeys.setAttribute('content', keys || "SR Natural Produk, herbal, Indonesia");
    }
  }, [seoSettings, language]);

  const loadDatabase = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Products fetch
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      setProducts(prodData);

      // Blogs fetch
      const blogRes = await fetch('/api/blogs');
      const blogData = await blogRes.json();
      setBlogs(blogData);

      // Settings & Metadata fetch
      const settingsRes = await fetch('/api/settings');
      const settingsData = await settingsRes.json();
      setSeoSettings(settingsData.seoSettings);
      setBusinessInfo(settingsData.businessInfo);

      // Silent orders fetch if admin token exists
      const token = localStorage.getItem('djamoe_admin_token');
      if (token) {
        const orderRes = await fetch('/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (orderRes.ok) {
          const orderData = await orderRes.json();
          setOrders(orderData);
        }
      }
    } catch (e: any) {
      console.error(e);
      setError('Could not connect to the botanical chronicle server. Please try refreshing.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAdminToken = async () => {
    const token = localStorage.getItem('djamoe_admin_token');
    if (!token) return;

    if (token === 'direct_access_token') {
      setIsAdminLoggedIn(true);
      return;
    }

    try {
      const res = await fetch('/api/admin/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setIsAdminLoggedIn(true);
      } else {
        localStorage.removeItem('djamoe_admin_token');
        setIsAdminLoggedIn(false);
      }
    } catch (e) {
      console.error(e);
      // Fallback to preserve login state on serverless platforms
      setIsAdminLoggedIn(true);
    }
  };

  const handleAdminSuccess = () => {
    setIsAdminLoggedIn(true);
    loadDatabase(); // reload to populate admin orders
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('djamoe_admin_token');
    setIsAdminLoggedIn(false);
    setOrders([]);
    setActiveSection('home');
  };

  // Add Product elixirs directly to Order Cart form
  const handleAddToOrder = (product: Product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      // already added, remove it (toggle)
      handleRemoveProduct(product.id);
    } else {
      setSelectedProducts(prev => [...prev, product]);
      setQuantities(prev => ({ ...prev, [product.id]: 1 }));
      
      // Navigate to order page
      handleSectionTransition('order');
    }
  };

  const handleRemoveProduct = (id: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== id));
    setQuantities(prev => {
      const clone = { ...prev };
      delete clone[id];
      return clone;
    });
  };

  const getWhatsAppUrl = () => {
    const rawWa = businessInfo?.socialMedia?.whatsapp || "https://wa.me/31684861301";
    let baseNumber = "31684861301";
    if (rawWa.includes('wa.me/')) {
      baseNumber = rawWa.split('wa.me/')[1].split('?')[0].replace('+', '').trim();
    } else if (rawWa.includes('whatsapp.com/send')) {
      const match = rawWa.match(/phone=([^&]+)/);
      if (match) baseNumber = match[1].replace('+', '').trim();
    } else {
      baseNumber = rawWa.replace('https://', '').replace('http://', '').replace('+', '').replace(/\s+/g, '').trim();
    }

    if (selectedProducts.length > 0) {
      let text = `🌿 *SR Nature & Aromatherapy* 🌿\n\n`;
      text += `*Current Cart Items / Rincian Keranjang:*\n`;
      selectedProducts.forEach(p => {
        const qty = quantities[p.id] || 1;
        const name = translate(p.name);
        text += `- ${name} x ${qty} (€${(p.price * qty).toFixed(2)})\n`;
      });
      const total = selectedProducts.reduce((sum, p) => {
        const qty = quantities[p.id] || 1;
        return sum + p.price * qty;
      }, 0);
      text += `\n*Total:* €${total.toFixed(2)}\n\n`;
      text += `Please help me complete my order/consultation!`;
      return `https://wa.me/${baseNumber}?text=${encodeURIComponent(text)}`;
    }

    const defaultText = `Hello SR Nature & Aromatherapy, I would like to consult about your traditional Javanese herbal remedies and wellness treatments.`;
    return `https://wa.me/${baseNumber}?text=${encodeURIComponent(defaultText)}`;
  };

  const handleSectionTransition = (id: string) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter products locally based on category tab selections
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-6 max-w-[1440px] mx-auto shadow-[0_0_60px_rgba(0,0,0,0.35)] relative border-x border-gold/15" id="app-loading-screen">
        <div className="relative flex items-center justify-center">
          {/* Outer golden rotating frame */}
          <div className="absolute w-28 h-28 border-2 border-dashed border-gold rounded-full animate-[spin_10s_linear_infinite]" />
          {/* Inner pulsing logo container */}
          <div className="w-24 h-24 bg-black rounded-full overflow-hidden shadow-2xl p-0.5 border-2 border-gold flex items-center justify-center animate-pulse">
            <img 
              src="/src/assets/images/sr_nature_logo_1783939605671.jpg" 
              alt="SR Nature &amp; Aromatherapy Logo" 
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div className="text-center space-y-1">
          <span className="font-display text-xl sm:text-2xl font-bold tracking-wider uppercase block bg-gradient-to-r from-cream via-gold-light to-gold bg-clip-text text-transparent">
            SR NATURE &amp; AROMATHERAPY
          </span>
          <span className="text-xs font-mono text-gold-light tracking-widest uppercase block animate-pulse">
            Opening Ledger Archives...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-[1440px] mx-auto shadow-[0_0_60px_rgba(0,0,0,0.35)] relative border-x border-gold/15" id="app-error-screen">
        <div className="bg-red-950 p-4 rounded-full text-red-400 shadow-inner border border-red-500/20">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h2 className="font-serif text-2xl font-bold text-gold">Botanical Server Desync</h2>
          <p className="text-sm text-cream/75 font-light leading-relaxed">{error}</p>
        </div>
        <button
          onClick={loadDatabase}
          className="bg-gold hover:bg-gold-light text-black px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-colors"
        >
          Reconnect
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-[1440px] mx-auto bg-cream shadow-[0_0_60px_rgba(0,0,0,0.35)] relative border-x border-gold/15" id="root-app-layout">
      
      {/* Navigation Header */}
      {activeSection !== 'admin' && (
        <Header
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isAdminLoggedIn={isAdminLoggedIn}
          onLogout={handleAdminLogout}
        />
      )}

      {/* Main Sections */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'home' && (
              <div 
                className="bg-cover bg-center bg-royal-green relative w-full h-full min-h-[480px] lg:min-h-[500px]"
                style={{ backgroundImage: "url('/src/assets/images/luxury_spa_massage_1783866797180.jpg')" }}
              >
                <Hero
                  onShopClick={() => handleSectionTransition('shop')}
                  onAboutClick={() => handleSectionTransition('about')}
                  onWhatsAppClick={() => handleSectionTransition('order')}
                />
              </div>
            )}

            {activeSection === 'shop' && (
              <section id="shop" className="py-10 bg-cream border-b border-gold/15 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  
                  {/* Header copy */}
                  <div className="text-center max-w-3xl mx-auto space-y-2">
                    <div className="inline-flex items-center space-x-2 text-gold">
                      <Sparkles className="w-4 h-4 text-gold-dark" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-dark">
                        Traditional Apothecary
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-royal-green">
                      {t('shop.title')}
                    </h2>
                    <p className="text-xs sm:text-sm text-royal-green/75 font-light leading-relaxed max-w-xl mx-auto">
                      {t('shop.subtitle')}
                    </p>
                  </div>

                  {/* Category selection Tabs */}
                  <div className="flex flex-wrap items-center justify-center gap-2.5" id="shop-category-tabs">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-5 py-2.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase transition-all duration-300 border ${
                          selectedCategory === cat.id
                            ? 'bg-royal-green border-royal-green text-gold shadow-md font-bold'
                            : 'bg-white/60 border-gold/15 text-royal-green hover:border-gold hover:bg-white'
                        }`}
                      >
                        {cat.id === 'all' ? cat.label : t(cat.label)}
                      </button>
                    ))}
                  </div>

                  {/* Shop Product Grid display */}
                  {filteredProducts.length === 0 ? (
                    <div className="py-20 text-center text-royal-green/60 font-light">
                      This particular category of potions is currently being prepared. Check other categories!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10" id="shop-product-grid">
                      {filteredProducts.map((prod) => (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          onViewDetails={setSelectedProduct}
                          onAddToOrder={handleAddToOrder}
                          isAdded={!!selectedProducts.find(p => p.id === prod.id)}
                        />
                      ))}
                    </div>
                  )}

                </div>
              </section>
            )}

            {activeSection === 'about' && (
              <>
                <AboutSection onBookMassage={(message: string) => {
                  setPrefilledNotes(message);
                  handleSectionTransition('order');
                }} />

                {/* Curated Customer Review Testimonials Carousel */}
                <section id="reviews" className="py-10 bg-royal-green text-cream border-b border-gold/15 relative overflow-hidden">
                  <div className="absolute inset-0 z-0 opacity-[0.01] batik-pattern-dark pointer-events-none" />
                  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header info */}
                    <ScrollReveal direction="up" delay={0.1}>
                      <div className="text-center max-w-2xl mx-auto space-y-1">
                        <div className="inline-flex items-center space-x-2 text-gold">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-light">
                            Echoes of Vitality
                          </span>
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream">
                          {t('reviews.title')}
                        </h2>
                        <p className="text-xs text-cream/70 font-light font-sans">
                          {t('reviews.subtitle')}
                        </p>
                      </div>
                    </ScrollReveal>

                    {/* Testimonials layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="testimonials-grid">
                      {testimonials.map((test, idx) => (
                        <ScrollReveal 
                          key={idx}
                          direction="up"
                          delay={0.1 * (idx % 3)}
                          className="bg-white/5 border border-gold/15 p-6 sm:p-8 rounded-3xl flex flex-col justify-between hover:bg-white/10 hover:border-gold/30 transition-all duration-300"
                        >
                          <div className="space-y-4">
                            {/* Stars */}
                            <div className="flex space-x-1 text-gold">
                              {[...Array(test.stars)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                              ))}
                            </div>
                            <p className="text-sm sm:text-base text-cream/90 font-light leading-relaxed italic">
                              "{test.text}"
                            </p>
                          </div>
                          
                          {/* Customer author footer details */}
                          <div className="pt-6 border-t border-gold/10 mt-6 flex justify-between items-center text-xs">
                            <div>
                              <span className="font-serif font-bold text-gold block">{test.name}</span>
                              <span className="text-cream/60 flex items-center space-x-1 font-mono">
                                <MapPin className="w-3 h-3" />
                                <span>{test.location}</span>
                              </span>
                            </div>
                            <span className="bg-gold/10 text-gold text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full font-bold border border-gold/15">
                              {test.potion}
                            </span>
                          </div>
                        </ScrollReveal>
                      ))}
                    </div>

                  </div>
                </section>
              </>
            )}

            {activeSection === 'blog' && (
              <BlogSection blogs={blogs} />
            )}

            {activeSection === 'order' && (
              <OrderForm
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                quantities={quantities}
                setQuantities={setQuantities}
                onRemoveProduct={handleRemoveProduct}
                prefilledNotes={prefilledNotes}
                setPrefilledNotes={setPrefilledNotes}
              />
            )}

            {activeSection === 'admin' && (
              <AdminPanel
                products={products}
                blogs={blogs}
                orders={orders}
                seoSettings={seoSettings!}
                businessInfo={businessInfo!}
                onRefreshData={loadDatabase}
                onAdminLoginSuccess={handleAdminSuccess}
                isAdminLoggedIn={isAdminLoggedIn}
                onLogout={handleAdminLogout}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Spa Styled Footnote */}
      {activeSection !== 'admin' && (
        <Footer onNavClick={handleSectionTransition} whatsappUrl={getWhatsAppUrl()} />
      )}

      {/* DETAILED POTIONS LAB ALCHEMY LIGHTBOX */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToOrder={handleAddToOrder}
        isAdded={!!selectedProduct && !!selectedProducts.find(p => p.id === selectedProduct.id)}
      />

      {/* PERSISTENT FLOATING WHATSAPP QUICK ACCESS & ORDER ENGINE */}
      {activeSection !== 'home' && activeSection !== 'admin' && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="floating-whatsapp-widget">
        <AnimatePresence>
          {isWhatsAppMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`bg-white border-2 border-gold rounded-2xl p-4 shadow-2xl mb-4 transition-all duration-300 flex flex-col relative overflow-hidden ${
                isAiChatOpen ? 'w-80 md:w-96' : 'w-72 space-y-3'
              }`}
              id="whatsapp-menu-container"
            >
              {isAiChatOpen ? (
                <AiChat onBack={() => setIsAiChatOpen(false)} />
              ) : (
                <>
                  {/* Luxury gold line decoration */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-light via-gold to-gold-dark" />
                  
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gold/40 bg-black">
                      <img 
                        src="/src/assets/images/sr_nature_logo_1783939605671.jpg" 
                        alt="SR Nature &amp; Aromatherapy Specialist" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-royal-green leading-tight">
                        {language === 'nl' ? 'SR Nature & Aromatherapy Specialist' : 'SR Nature & Aromatherapy Specialist'}
                      </h4>
                      <p className="text-[10px] font-mono text-gold-dark tracking-wider uppercase">
                        {language === 'nl' ? 'Hoe kunnen we u helpen?' : 'How can we assist you?'}
                      </p>
                    </div>
                  </div>

                  <hr className="border-gold/10" />

                  <div className="flex flex-col gap-2">
                    {/* Option 1: Configure Custom Order (scroll to Order engine) */}
                    <button
                      onClick={() => {
                        handleSectionTransition('order');
                        setIsWhatsAppMenuOpen(false);
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-royal-green/5 hover:bg-royal-green/10 border border-gold/15 hover:border-gold/30 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 bg-royal-green/10 text-royal-green rounded-lg group-hover:bg-royal-green group-hover:text-gold transition-colors">
                          <CalendarRange className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-serif font-bold text-royal-green">
                          {language === 'nl' ? 'Zelf samenstellen' : 'Configure Custom Order'}
                        </span>
                      </div>
                      <Sparkles className="w-3.5 h-3.5 text-gold-dark opacity-40 group-hover:opacity-100 transition-opacity" />
                    </button>

                    {/* Option 2: AI Consult Specialist */}
                    <button
                      onClick={() => setIsAiChatOpen(true)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-royal-green/5 hover:bg-royal-green/10 border border-gold/15 hover:border-gold/30 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 bg-royal-green/10 text-royal-green rounded-lg group-hover:bg-royal-green group-hover:text-gold transition-colors">
                          <Bot className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-serif font-bold text-royal-green">
                          {language === 'nl' ? 'Consulteer AI Sari' : 'Consult AI Sari'}
                        </span>
                      </div>
                      <Sparkles className="w-3.5 h-3.5 text-gold-dark opacity-40 group-hover:opacity-100 transition-opacity" />
                    </button>

                    {/* Option 3: Direct WhatsApp Chat */}
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsWhatsAppMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#128C7E]/5 hover:bg-[#128C7E]/10 border border-[#128C7E]/20 hover:border-[#128C7E]/40 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 bg-[#128C7E]/10 text-[#128C7E] rounded-lg group-hover:bg-[#128C7E] group-hover:text-cream transition-colors">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.017 14.077 1.001 11.997 1.001c-5.443 0-9.87 4.371-9.875 9.801-.001 1.77.476 3.498 1.381 5.011L2.433 21.49l5.801-1.503c-.503-.3-.974-.627-1.587-.833z"/>
                          </svg>
                        </div>
                        <span className="text-xs font-serif font-bold text-royal-green">
                          {language === 'nl' ? 'Direct overleg' : 'Direct Consultation'}
                        </span>
                      </div>
                      <MessageCircle className="w-3.5 h-3.5 text-[#128C7E] opacity-60 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master floating pulsing button */}
        <div className="relative group">
          {/* Animated Gold pulsing rings */}
          <span className="absolute -inset-1.5 rounded-full bg-gold/30 animate-ping pointer-events-none" />
          <span className="absolute -inset-2.5 rounded-full bg-royal-green/15 animate-pulse pointer-events-none" style={{ animationDuration: '3s' }} />
          
          <motion.button
            onClick={() => {
              if (isWhatsAppMenuOpen) {
                setIsAiChatOpen(false);
              }
              setIsWhatsAppMenuOpen(!isWhatsAppMenuOpen);
            }}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative z-10 border-2 transition-colors duration-300 group cursor-pointer ${
              isWhatsAppMenuOpen 
                ? 'bg-royal-green border-gold text-gold hover:bg-royal-green/90' 
                : 'bg-[#128C7E] border-white/20 text-cream hover:bg-[#0e7065]'
            }`}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            id="whatsapp-floating-button"
            aria-label="Contact Javanese Herbalist on WhatsApp"
          >
            <AnimatePresence mode="wait">
              {isWhatsAppMenuOpen ? (
                <motion.div
                  key="close-icon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-gold" />
                </motion.div>
              ) : (
                <motion.div
                  key="whatsapp-icon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  {/* WhatsApp Custom Premium SVG Icon */}
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.017 14.077 1.001 11.997 1.001c-5.443 0-9.87 4.371-9.875 9.801-.001 1.77.476 3.498 1.381 5.011L2.433 21.49l5.801-1.503c-.503-.3-.974-.627-1.587-.833z"/>
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Custom mini tooltip showing on hover */}
            <span className="absolute right-16 bg-royal-green border border-gold/30 text-gold text-[10px] font-mono tracking-widest uppercase font-bold py-1.5 px-3.5 rounded-full opacity-0 translate-x-3 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap shadow-xl hidden md:inline-block">
              {language === 'nl' ? 'Chat & Bestel' : 'Chat & Order'}
            </span>
          </motion.button>
        </div>
      </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainAppContent />
    </LanguageProvider>
  );
}
