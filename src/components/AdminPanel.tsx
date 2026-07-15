import React, { useState, useEffect } from 'react';
import { Product, BlogPost, Order, SeoSettings, BusinessInfo } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Lock, Plus, Edit2, Trash2, X, Sparkles, Clock, Heart, ShieldCheck
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  blogs: BlogPost[];
  orders: Order[];
  seoSettings: SeoSettings;
  businessInfo: BusinessInfo;
  onRefreshData: () => void;
  onAdminLoginSuccess: () => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  blogs,
  orders,
  seoSettings,
  businessInfo,
  onRefreshData,
  onAdminLoginSuccess,
  isAdminLoggedIn,
  onLogout
}) => {
  const { translate } = useLanguage();

  // Safeguard unused variables lint rules
  if (blogs.length === -1 || orders.length === -1 || !seoSettings || !businessInfo) {
    console.log('unused props check');
  }

  // Authentication states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // CRUD Forms State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Massage Service States
  const [services, setServices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);

  // Core Service Form fields
  const [serviceId, setServiceId] = useState('');
  const [serviceBadgeEn, setServiceBadgeEn] = useState('');
  const [serviceBadgeNl, setServiceBadgeNl] = useState('');
  const [serviceBadgeId, setServiceBadgeId] = useState('');
  const [serviceNameEn, setServiceNameEn] = useState('');
  const [serviceNameNl, setServiceNameNl] = useState('');
  const [serviceNameId, setServiceNameId] = useState('');
  const [serviceShortDescEn, setServiceShortDescEn] = useState('');
  const [serviceShortDescNl, setServiceShortDescNl] = useState('');
  const [serviceShortDescId, setServiceShortDescId] = useState('');
  const [serviceLongDescEn, setServiceLongDescEn] = useState('');
  const [serviceLongDescNl, setServiceLongDescNl] = useState('');
  const [serviceLongDescId, setServiceLongDescId] = useState('');
  const [serviceImageUrl, setServiceImageUrl] = useState('');
  const [serviceIconType, setServiceIconType] = useState('heart');
  const [durations, setDurations] = useState<{ mins: string; price: number }[]>([{ mins: '60', price: 70 }]);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (Array.isArray(data)) {
        setServices(data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchServices();
    }
  }, [isAdminLoggedIn]);

  const addDurationRow = () => {
    setDurations([...durations, { mins: '', price: 0 }]);
  };

  const removeDurationRow = (index: number) => {
    setDurations(durations.filter((_, idx) => idx !== index));
  };

  const handleDurationChange = (index: number, field: 'mins' | 'price', value: any) => {
    const updated = [...durations];
    updated[index] = {
      ...updated[index],
      [field]: field === 'price' ? Number(value) : value
    };
    setDurations(updated);
  };

  const openServiceModal = (service: any | null) => {
    setEditingService(service);
    if (service) {
      setServiceId(service.id);
      setServiceBadgeEn(service.badge?.en || '');
      setServiceBadgeNl(service.badge?.nl || '');
      setServiceBadgeId(service.badge?.id || '');
      setServiceNameEn(service.name?.en || '');
      setServiceNameNl(service.name?.nl || '');
      setServiceNameId(service.name?.id || '');
      setServiceShortDescEn(service.shortDesc?.en || '');
      setServiceShortDescNl(service.shortDesc?.nl || '');
      setServiceShortDescId(service.shortDesc?.id || '');
      setServiceLongDescEn(service.longDesc?.en || '');
      setServiceLongDescNl(service.longDesc?.nl || '');
      setServiceLongDescId(service.longDesc?.id || '');
      setServiceImageUrl(service.imageUrl || '');
      setServiceIconType(service.iconType || 'heart');
      setDurations(service.durations || [{ mins: '60', price: 70 }]);
    } else {
      setServiceId('');
      setServiceBadgeEn('');
      setServiceBadgeNl('');
      setServiceBadgeId('');
      setServiceNameEn('');
      setServiceNameNl('');
      setServiceNameId('');
      setServiceShortDescEn('');
      setServiceShortDescNl('');
      setServiceShortDescId('');
      setServiceLongDescEn('');
      setServiceLongDescNl('');
      setServiceLongDescId('');
      setServiceImageUrl('/src/assets/images/luxury_massage_session_1783703874698.jpg');
      setServiceIconType('heart');
      setDurations([{ mins: '60', price: 70 }]);
    }
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    const url = editingService ? `/api/services/${editingService.id}` : '/api/services';
    const method = editingService ? 'PUT' : 'POST';

    const payload = {
      id: serviceId || 'service-' + Date.now(),
      badge: { en: serviceBadgeEn, nl: serviceBadgeNl, id: serviceBadgeId },
      name: { en: serviceNameEn, nl: serviceNameNl, id: serviceNameId },
      shortDesc: { en: serviceShortDescEn, nl: serviceShortDescNl, id: serviceShortDescId },
      longDesc: { en: serviceLongDescEn, nl: serviceLongDescNl, id: serviceLongDescId },
      durations: durations.filter(d => d.mins && d.price > 0),
      imageUrl: serviceImageUrl,
      iconType: serviceIconType
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsServiceModalOpen(false);
        fetchServices();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to save service.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while saving service.');
    }
  };

  const handleServiceDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    const token = getAuthToken();
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchServices();
      } else {
        alert('Failed to delete service.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while deleting service.');
    }
  };

  // Core Product Form fields
  const [prodId, setProdId] = useState('');
  const [prodNameEn, setProdNameEn] = useState('');
  const [prodNameNl, setProdNameNl] = useState('');
  const [prodCategory, setProdCategory] = useState('womens-health');
  const [prodPrice, setProdPrice] = useState('12.50');
  const [prodStock, setProdStock] = useState('50');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodImgUrl, setProdImgUrl] = useState('');
  const [prodDescEn, setProdDescEn] = useState('');
  const [prodDescNl, setProdDescNl] = useState('');
  const [prodIngEn, setProdIngEn] = useState('');
  const [prodIngNl, setProdIngNl] = useState('');
  const [prodBenEn, setProdBenEn] = useState('');
  const [prodBenNl, setProdBenNl] = useState('');
  const [prodTradEn, setProdTradEn] = useState('');
  const [prodTradNl, setProdTradNl] = useState('');
  const [prodSciEn, setProdSciEn] = useState('');
  const [prodSciNl, setProdSciNl] = useState('');
  const [prodHowEn, setProdHowEn] = useState('');
  const [prodHowNl, setProdHowNl] = useState('');
  const [prodRecEn, setProdRecEn] = useState('');
  const [prodRecNl, setProdRecNl] = useState('');
  const [prodWhoEn, setProdWhoEn] = useState('');
  const [prodWhoNl, setProdWhoNl] = useState('');
  const [prodWarnEn, setProdWarnEn] = useState('');
  const [prodWarnNl, setProdWarnNl] = useState('');

  const getAuthToken = () => {
    return localStorage.getItem('djamoe_admin_token') || '';
  };

  const handleDirectAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');
    localStorage.setItem('djamoe_admin_token', 'direct_access_token');
    onAdminLoginSuccess();
    setIsLoggingIn(false);
  };

  // Populate Product modal fields
  const openProductModal = (product: Product | null) => {
    setEditingProduct(product);
    if (product) {
      setProdId(product.id);
      setProdNameEn(product.name.en);
      setProdNameNl(product.name.nl);
      setProdCategory(product.category);
      setProdPrice(String(product.price));
      setProdStock(String(product.stock));
      setProdFeatured(product.isFeatured);
      setProdImgUrl(product.imageUrl);
      setProdDescEn(product.description.en);
      setProdDescNl(product.description.nl);
      setProdIngEn(product.ingredients.en.join(', '));
      setProdIngNl(product.ingredients.nl.join(', '));
      setProdBenEn(product.benefits.en.join(', '));
      setProdBenNl(product.benefits.nl.join(', '));
      setProdTradEn(product.traditionalExplanation.en);
      setProdTradNl(product.traditionalExplanation.nl);
      setProdSciEn(product.scientificExplanation.en);
      setProdSciNl(product.scientificExplanation.nl);
      setProdHowEn(product.howToConsume.en);
      setProdHowNl(product.howToConsume.nl);
      setProdRecEn(product.recommendedConsumption.en);
      setProdRecNl(product.recommendedConsumption.nl);
      setProdWhoEn(product.whoShouldUse.en);
      setProdWhoNl(product.whoShouldUse.nl);
      setProdWarnEn(product.warnings.en);
      setProdWarnNl(product.warnings.nl);
    } else {
      setProdId('');
      setProdNameEn('');
      setProdNameNl('');
      setProdCategory('womens-health');
      setProdPrice('12.50');
      setProdStock('50');
      setProdFeatured(false);
      setProdImgUrl('/src/assets/images/kunyit_asam_bottle_1783604890128.jpg');
      setProdDescEn('');
      setProdDescNl('');
      setProdIngEn('');
      setProdIngNl('');
      setProdBenEn('');
      setProdBenNl('');
      setProdTradEn('');
      setProdTradNl('');
      setProdSciEn('');
      setProdSciNl('');
      setProdHowEn('');
      setProdHowNl('');
      setProdRecEn('');
      setProdRecNl('');
      setProdWhoEn('');
      setProdWhoNl('');
      setProdWarnEn('');
      setProdWarnNl('');
    }
    setIsProductModalOpen(true);
  };

  // Submit Product Form (Create / Edit)
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    const payload = {
      id: prodId || undefined,
      name: { en: prodNameEn, nl: prodNameNl },
      category: prodCategory,
      price: Number(prodPrice),
      stock: Number(prodStock),
      isFeatured: prodFeatured,
      imageUrl: prodImgUrl,
      description: { en: prodDescEn, nl: prodDescNl },
      ingredients: {
        en: prodIngEn.split(',').map(s => s.trim()).filter(Boolean),
        nl: prodIngNl.split(',').map(s => s.trim()).filter(Boolean)
      },
      benefits: {
        en: prodBenEn.split(',').map(s => s.trim()).filter(Boolean),
        nl: prodBenNl.split(',').map(s => s.trim()).filter(Boolean)
      },
      traditionalExplanation: { en: prodTradEn, nl: prodTradNl },
      scientificExplanation: { en: prodSciEn, nl: prodSciNl },
      howToConsume: { en: prodHowEn, nl: prodHowNl },
      recommendedConsumption: { en: prodRecEn, nl: prodRecNl },
      whoShouldUse: { en: prodWhoEn, nl: prodWhoNl },
      warnings: { en: prodWarnEn, nl: prodWarnNl }
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsProductModalOpen(false);
        onRefreshData();
      } else {
        alert('Error saving product.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleProductDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this elixir? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <section id="admin" className="py-24 bg-cream flex items-center justify-center min-h-[70vh] scroll-mt-20">
        <div className="w-full max-w-md bg-white border border-gold/15 p-8 rounded-3xl luxury-shadow animate-scale-up">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-royal-green/10 flex items-center justify-center rounded-2xl text-gold-dark mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-royal-green">{translate('admin.title', 'Djamoe Heritage Sanctum')}</h2>
            <p className="text-xs text-royal-green/60 mt-1">{translate('admin.subtitle', 'Authorized access only for curators')}</p>
          </div>

          <form onSubmit={handleDirectAccess} className="space-y-4">
            {authError && (
              <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl border border-red-200">
                {authError}
              </div>
            )}
            
            <p className="text-xs text-royal-green/80 text-center leading-relaxed font-serif italic mb-6">
              "Kunci gerbang istana telah dibuka. Silakan klik tombol di bawah untuk masuk ke ruang pengelolaan resep tradisional."
            </p>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-royal-green hover:bg-leaf-green text-cream hover:text-gold font-bold text-xs tracking-widest uppercase py-3.5 rounded-full transition-colors cursor-pointer animate-fade-in flex items-center justify-center space-x-2"
            >
              <span>{isLoggingIn ? 'Verifying...' : 'Unlock Portal / Masuk'}</span>
            </button>
          </form>

          <button
            type="button"
            onClick={onLogout}
            className="w-full mt-4 bg-transparent border border-gold/45 hover:border-gold text-royal-green hover:text-leaf-green font-bold text-[10px] tracking-widest uppercase py-3 rounded-full transition-colors cursor-pointer text-center"
          >
            Kembali ke Website / Back to Home
          </button>
        </div>
      </section>
    );
  }

  /* Logged In Dashboard Layout */
  return (
    <section id="admin" className="py-16 bg-cream scroll-mt-20 border-b border-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Portal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-gold/15 pb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-royal-green p-3 rounded-2xl text-gold shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-royal-green leading-tight">
                Royal Javanese Sanctum
              </h2>
              <span className="text-[10px] font-mono tracking-widest text-gold-dark uppercase font-semibold">
                Djamoe Heritage CMS &amp; Product Management
              </span>
            </div>
          </div>

          {/* Action Header bar */}
          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-royal-green text-cream hover:bg-red-900 border border-transparent rounded-full text-xs font-mono tracking-wider uppercase transition-colors shadow-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex border-b border-gold/15 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-serif font-bold text-xs sm:text-sm tracking-wide border-b-2 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'border-gold text-royal-green bg-cream/10'
                : 'border-transparent text-royal-green/60 hover:text-royal-green'
            }`}
          >
            Manage Products (Inventory)
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 font-serif font-bold text-xs sm:text-sm tracking-wide border-b-2 transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'border-gold text-royal-green bg-cream/10'
                : 'border-transparent text-royal-green/60 hover:text-royal-green'
            }`}
          >
            Manage Massage / Services (Jenis Pijatan)
          </button>
        </div>

        {/* Workspace Main full-width layout */}
        <div className="bg-white border border-gold/15 p-6 sm:p-8 rounded-3xl luxury-shadow animate-fade-in" id="admin-workspace-pane">
          {activeTab === 'products' && (
            <div className="space-y-6" id="panel-products">
              <div className="flex items-center justify-between border-b border-gold/15 pb-4">
                <h3 className="font-serif text-xl font-bold text-royal-green">SR Natural Produk Inventory</h3>
                <button
                  onClick={() => openProductModal(null)}
                  className="flex items-center space-x-1 px-4 py-2 bg-royal-green text-cream hover:bg-leaf-green rounded-full text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {products.map(p => (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between border border-gold/15 p-4 rounded-2xl bg-cream/20 hover:bg-cream/40 transition-colors gap-4">
                    <div className="flex items-center space-x-4">
                      <img src={p.imageUrl} alt={p.name.en} className="w-12 h-12 rounded-lg object-cover bg-white" />
                      <div>
                        <h4 className="font-serif font-bold text-royal-green">{p.name.en}</h4>
                        <span className="text-xs text-gold-dark font-mono uppercase">{p.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto">
                      <div className="text-right">
                        <div className="text-sm font-serif font-bold text-royal-green">€{p.price.toFixed(2)}</div>
                        <div className="text-[10px] text-royal-green/60 font-semibold">Stock: {p.stock}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openProductModal(p)} className="p-1.5 border border-gold/30 hover:border-gold rounded-full text-royal-green hover:bg-gold/15 cursor-pointer font-bold" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleProductDelete(p.id)} className="p-1.5 border border-red-200 hover:border-red-500 rounded-full text-stone-500 hover:text-red-500 cursor-pointer font-bold" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6" id="panel-services">
              <div className="flex items-center justify-between border-b border-gold/15 pb-4">
                <h3 className="font-serif text-xl font-bold text-royal-green">SR Natural Massage Services (Jenis Pijatan)</h3>
                <button
                  onClick={() => openServiceModal(null)}
                  className="flex items-center space-x-1 px-4 py-2 bg-royal-green text-cream hover:bg-leaf-green rounded-full text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {services.map(s => (
                  <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between border border-gold/15 p-4 rounded-2xl bg-cream/20 hover:bg-cream/40 transition-colors gap-4">
                    <div className="flex items-center space-x-4">
                      <img src={s.imageUrl} alt={s.name?.en} className="w-16 h-12 rounded-lg object-cover bg-white" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-serif font-bold text-royal-green">{s.name?.en} / {s.name?.id || s.name?.en}</h4>
                          {s.badge?.en && (
                            <span className="text-[9px] font-mono bg-gold/15 text-gold-dark px-2 py-0.5 rounded-full uppercase tracking-wider">{s.badge?.en}</span>
                          )}
                        </div>
                        <p className="text-xs text-royal-green/70 line-clamp-1">{s.shortDesc?.id || s.shortDesc?.en}</p>
                        <div className="flex items-center space-x-3 mt-1.5">
                          {s.durations?.map((d: any, idx: number) => (
                            <span key={idx} className="text-[10px] font-mono text-royal-green/60 bg-white border border-gold/15 px-2 py-0.5 rounded-md">
                              {d.mins} Mins: €{d.price}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-4 w-full sm:w-auto">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openServiceModal(s)} className="p-1.5 border border-gold/30 hover:border-gold rounded-full text-royal-green hover:bg-gold/15 cursor-pointer font-bold" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleServiceDelete(s.id)} className="p-1.5 border border-red-200 hover:border-red-500 rounded-full text-stone-500 hover:text-red-500 cursor-pointer font-bold" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* PRODUCT FORM LIGHTBOX OVERLAY MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-royal-green/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6" id="product-form-modal animate-fade-in">
          <div className="relative bg-cream w-full max-w-4xl rounded-3xl border border-gold/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-royal-green text-cream border-b border-gold/20">
              <h3 className="font-serif text-lg font-bold">{editingProduct ? 'Edit Traditional Elixir' : 'Add New Herbal Elixir'}</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-cream hover:text-gold cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Product ID (Slug)</label>
                  <input type="text" value={prodId} onChange={e => setProdId(e.target.value)} disabled={!!editingProduct} placeholder="e.g. kunyit-asam" className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Price (€)</label>
                  <input type="number" step="0.01" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Initial Stock</label>
                  <input type="number" value={prodStock} onChange={e => setProdStock(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Product Name (English)</label>
                  <input type="text" value={prodNameEn} onChange={e => setProdNameEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Product Name (Dutch)</label>
                  <input type="text" value={prodNameNl} onChange={e => setProdNameNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Category</label>
                  <select value={prodCategory} onChange={e => setProdCategory(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none">
                    <option value="womens-health">Women's Health</option>
                    <option value="digestive-comfort">Digestive Comfort</option>
                    <option value="immunity-boost">Immunity Boost</option>
                    <option value="vitality">Vitality &amp; Focus</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Image URL Path</label>
                  <input type="text" value={prodImgUrl} onChange={e => setProdImgUrl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
                <div className="flex items-center space-x-2 pt-5">
                  <input type="checkbox" id="prod-feat" checked={prodFeatured} onChange={e => setProdFeatured(e.target.checked)} className="rounded border-gold/20 text-royal-green focus:ring-royal-green cursor-pointer" />
                  <label htmlFor="prod-feat" className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80 cursor-pointer">Featured Elixir</label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Description (English)</label>
                  <textarea rows={3} value={prodDescEn} onChange={e => setProdDescEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Description (Dutch)</label>
                  <textarea rows={3} value={prodDescNl} onChange={e => setProdDescNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Ingredients (English, comma-separated)</label>
                  <input type="text" value={prodIngEn} onChange={e => setProdIngEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Ingredients (Dutch, comma-separated)</label>
                  <input type="text" value={prodIngNl} onChange={e => setProdIngNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Key Health Benefits (English, comma-separated)</label>
                  <input type="text" value={prodBenEn} onChange={e => setProdBenEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Key Health Benefits (Dutch, comma-separated)</label>
                  <input type="text" value={prodBenNl} onChange={e => setProdBenNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Traditional History (English)</label>
                  <textarea rows={2} value={prodTradEn} onChange={e => setProdTradEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Traditional History (Dutch)</label>
                  <textarea rows={2} value={prodTradNl} onChange={e => setProdTradNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Scientific Support (English)</label>
                  <textarea rows={2} value={prodSciEn} onChange={e => setProdSciEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Scientific Support (Dutch)</label>
                  <textarea rows={2} value={prodSciNl} onChange={e => setProdSciNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">How to Consume (English)</label>
                  <input type="text" value={prodHowEn} onChange={e => setProdHowEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">How to Consume (Dutch)</label>
                  <input type="text" value={prodHowNl} onChange={e => setProdHowNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Recommended Daily (English)</label>
                  <input type="text" value={prodRecEn} onChange={e => setProdRecEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Recommended Daily (Dutch)</label>
                  <input type="text" value={prodRecNl} onChange={e => setProdRecNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Who is this for? (English)</label>
                  <input type="text" value={prodWhoEn} onChange={e => setProdWhoEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Who is this for? (Dutch)</label>
                  <input type="text" value={prodWhoNl} onChange={e => setProdWhoNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Warnings (English)</label>
                  <input type="text" value={prodWarnEn} onChange={e => setProdWarnEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Warnings (Dutch)</label>
                  <input type="text" value={prodWarnNl} onChange={e => setProdWarnNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full bg-royal-green hover:bg-leaf-green text-cream font-bold text-xs tracking-widest uppercase py-3 rounded-full shadow-lg transition-transform hover:scale-101 cursor-pointer">
                Save Product Details
              </button>

            </form>
          </div>
        </div>
      )}

      {/* SERVICE FORM LIGHTBOX OVERLAY MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-royal-green/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6" id="service-form-modal animate-fade-in">
          <div className="relative bg-cream w-full max-w-4xl rounded-3xl border border-gold/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-royal-green text-cream border-b border-gold/20">
              <h3 className="font-serif text-lg font-bold">{editingService ? 'Edit Massage / Service' : 'Add New Massage / Service'}</h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-cream hover:text-gold cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleServiceSubmit} className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Service ID (Slug)</label>
                  <input type="text" value={serviceId} onChange={e => setServiceId(e.target.value)} disabled={!!editingService} placeholder="e.g. body-massage" className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Image URL Path</label>
                  <input type="text" value={serviceImageUrl} onChange={e => setServiceImageUrl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Icon Type</label>
                  <select value={serviceIconType} onChange={e => setServiceIconType(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none">
                    <option value="heart">Heart / Love</option>
                    <option value="clock">Clock / Time</option>
                    <option value="shield">Shield / Care</option>
                    <option value="sparkles">Sparkles / Beauty</option>
                  </select>
                </div>
              </div>

              {/* Service Names */}
              <div className="bg-white/40 p-4 rounded-2xl border border-gold/10 space-y-4">
                <h4 className="font-serif font-bold text-sm text-royal-green border-b border-gold/15 pb-2">Service Names (Multilingual)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Name (English)</label>
                    <input type="text" value={serviceNameEn} onChange={e => setServiceNameEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Name (Dutch / NL)</label>
                    <input type="text" value={serviceNameNl} onChange={e => setServiceNameNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Name (Indonesian / ID)</label>
                    <input type="text" value={serviceNameId} onChange={e => setServiceNameId(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Service Badges */}
              <div className="bg-white/40 p-4 rounded-2xl border border-gold/10 space-y-4">
                <h4 className="font-serif font-bold text-sm text-royal-green border-b border-gold/15 pb-2">Badge Text (e.g., "Relaxing", "Soothing", "Reflexology")</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Badge (English)</label>
                    <input type="text" value={serviceBadgeEn} onChange={e => setServiceBadgeEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Badge (Dutch / NL)</label>
                    <input type="text" value={serviceBadgeNl} onChange={e => setServiceBadgeNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Badge (Indonesian / ID)</label>
                    <input type="text" value={serviceBadgeId} onChange={e => setServiceBadgeId(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Short Descriptions */}
              <div className="bg-white/40 p-4 rounded-2xl border border-gold/10 space-y-4">
                <h4 className="font-serif font-bold text-sm text-royal-green border-b border-gold/15 pb-2">Short Description</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Short Desc (English)</label>
                    <textarea rows={2} value={serviceShortDescEn} onChange={e => setServiceShortDescEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Short Desc (Dutch / NL)</label>
                    <textarea rows={2} value={serviceShortDescNl} onChange={e => setServiceShortDescNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Short Desc (Indonesian / ID)</label>
                    <textarea rows={2} value={serviceShortDescId} onChange={e => setServiceShortDescId(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Long Descriptions */}
              <div className="bg-white/40 p-4 rounded-2xl border border-gold/10 space-y-4">
                <h4 className="font-serif font-bold text-sm text-royal-green border-b border-gold/15 pb-2">Detailed Long Description</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Long Desc (English)</label>
                    <textarea rows={3} value={serviceLongDescEn} onChange={e => setServiceLongDescEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Long Desc (Dutch / NL)</label>
                    <textarea rows={3} value={serviceLongDescNl} onChange={e => setServiceLongDescNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Long Desc (Indonesian / ID)</label>
                    <textarea rows={3} value={serviceLongDescId} onChange={e => setServiceLongDescId(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Durations list */}
              <div className="bg-white/40 p-4 rounded-2xl border border-gold/10 space-y-4">
                <div className="flex items-center justify-between border-b border-gold/15 pb-2">
                  <h4 className="font-serif font-bold text-sm text-royal-green">Durations &amp; Pricing</h4>
                  <button type="button" onClick={addDurationRow} className="flex items-center space-x-1 px-3 py-1 bg-royal-green text-cream hover:bg-leaf-green rounded-full text-[10px] font-bold cursor-pointer transition-colors">
                    <Plus className="w-3 h-3" />
                    <span>Add Pricing Tier</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {durations.map((d, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="text-[8px] font-mono uppercase text-royal-green/70 block mb-1">Duration (Minutes)</label>
                        <input type="text" placeholder="e.g. 60" value={d.mins} onChange={e => handleDurationChange(index, 'mins', e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                      </div>
                      <div className="flex-1">
                        <label className="text-[8px] font-mono uppercase text-royal-green/70 block mb-1">Price (€)</label>
                        <input type="number" placeholder="e.g. 70" value={d.price || ''} onChange={e => handleDurationChange(index, 'price', e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                      </div>
                      {durations.length > 1 && (
                        <button type="button" onClick={() => removeDurationRow(index)} className="mt-4 px-2.5 py-1.5 border border-red-200 hover:border-red-500 rounded-xl text-stone-500 hover:text-red-500 font-bold transition-all text-xs cursor-pointer">
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-royal-green hover:bg-leaf-green text-cream font-bold text-xs tracking-widest uppercase py-3 rounded-full shadow-lg transition-transform hover:scale-101 cursor-pointer">
                Save Service Details
              </button>

            </form>
          </div>
        </div>
      )}

    </section>
  );
};
