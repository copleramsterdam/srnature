import React, { useState, useEffect } from 'react';
import { Product, BlogPost, Order, SeoSettings, BusinessInfo } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Lock, LayoutDashboard, ShoppingCart, BookOpen, Package, Settings, Database,
  Plus, Edit2, Trash2, ShieldCheck, Download, Sparkles, Send, Check, X, RefreshCw
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

type Tab = 'analytics' | 'products' | 'blogs' | 'orders' | 'seo';

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
  const [activeTab, setActiveTab] = useState<Tab>('analytics');

  // Authentication states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Live analytics state
  const [analytics, setAnalytics] = useState<any>(null);
  const [isFetchingAnalytics, setIsFetchingAnalytics] = useState(false);

  // CRUD Forms State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  // Gemini AI Assistants States
  const [aiBlogTopic, setAiBlogTopic] = useState('');
  const [aiBlogLang, setAiBlogLang] = useState<'en' | 'nl'>('en');
  const [isAiBlogGenerating, setIsAiBlogGenerating] = useState(false);

  const [aiSeoProductName, setAiSeoProductName] = useState('');
  const [aiSeoDesc, setAiSeoDesc] = useState('');
  const [aiSeoLang, setAiSeoLang] = useState<'en' | 'nl'>('en');
  const [isAiSeoGenerating, setIsAiSeoGenerating] = useState(false);

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

  // Core Blog Form fields
  const [blogId, setBlogId] = useState('');
  const [blogTitleEn, setBlogTitleEn] = useState('');
  const [blogTitleNl, setBlogTitleNl] = useState('');
  const [blogExcerptEn, setBlogExcerptEn] = useState('');
  const [blogExcerptNl, setBlogExcerptNl] = useState('');
  const [blogContentEn, setBlogContentEn] = useState('');
  const [blogContentNl, setBlogContentNl] = useState('');
  const [blogCatEn, setBlogCatEn] = useState('Javanese Wisdom');
  const [blogCatNl, setBlogCatNl] = useState('Javaanse Wijsheid');
  const [blogAuthor, setBlogAuthor] = useState('Djamoe Heritage Master');
  const [blogKeysEn, setBlogKeysEn] = useState('');
  const [blogKeysNl, setBlogKeysNl] = useState('');
  const [blogImgUrl, setBlogImgUrl] = useState('');

  // Settings Forms states
  const [seoEnTitle, setSeoEnTitle] = useState(seoSettings?.title?.en || '');
  const [seoNlTitle, setSeoNlTitle] = useState(seoSettings?.title?.nl || '');
  const [seoEnDesc, setSeoEnDesc] = useState(seoSettings?.description?.en || '');
  const [seoNlDesc, setSeoNlDesc] = useState(seoSettings?.description?.nl || '');
  const [seoEnKeys, setSeoEnKeys] = useState(seoSettings?.keywords?.en?.join(', ') || '');
  const [seoNlKeys, setSeoNlKeys] = useState(seoSettings?.keywords?.nl?.join(', ') || '');

  const [bizPhone, setBizPhone] = useState(businessInfo?.phone || '');
  const [bizEmail, setBizEmail] = useState(businessInfo?.email || '');
  const [bizAddress, setBizAddress] = useState(businessInfo?.address || '');
  const [bizHoursEn, setBizHoursEn] = useState(businessInfo?.openingHours?.en || '');
  const [bizHoursNl, setBizHoursNl] = useState(businessInfo?.openingHours?.nl || '');

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAnalytics();
    }
  }, [isAdminLoggedIn, products, blogs, orders]);

  const getAuthToken = () => {
    return localStorage.getItem('djamoe_admin_token') || '';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('djamoe_admin_token', data.token);
        onAdminLoginSuccess();
      } else {
        setAuthError(data.error || 'Access denied.');
      }
    } catch (e) {
      setAuthError('Connection failure.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchAnalytics = async () => {
    setIsFetchingAnalytics(true);
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingAnalytics(false);
    }
  };

  // Change Order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Database seed picker for image selector defaults
  const handleDefaultImgPick = (type: 'product' | 'blog', filename: string) => {
    const path = `/src/assets/images/${filename}`;
    if (type === 'product') {
      setProdImgUrl(path);
    } else {
      setBlogImgUrl(path);
    }
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

  // Populate Blog modal fields
  const openBlogModal = (blog: BlogPost | null) => {
    setEditingBlog(blog);
    if (blog) {
      setBlogId(blog.id);
      setBlogTitleEn(blog.title.en);
      setBlogTitleNl(blog.title.nl);
      setBlogExcerptEn(blog.excerpt.en);
      setBlogExcerptNl(blog.excerpt.nl);
      setBlogContentEn(blog.content.en);
      setBlogContentNl(blog.content.nl);
      setBlogCatEn(blog.category.en);
      setBlogCatNl(blog.category.nl);
      setBlogAuthor(blog.author);
      setBlogKeysEn(blog.seoKeywords.en.join(', '));
      setBlogKeysNl(blog.seoKeywords.nl.join(', '));
      setBlogImgUrl(blog.imageUrl);
    } else {
      setBlogId('');
      setBlogTitleEn('');
      setBlogTitleNl('');
      setBlogExcerptEn('');
      setBlogExcerptNl('');
      setBlogContentEn('');
      setBlogContentNl('');
      setBlogCatEn('Javanese Wisdom');
      setBlogCatNl('Javaanse Wijsheid');
      setBlogAuthor('Djamoe Heritage Master');
      setBlogKeysEn('');
      setBlogKeysNl('');
      setBlogImgUrl('/src/assets/images/hero_jamu_preparation_1783604874087.jpg');
    }
    setIsBlogModalOpen(true);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingBlog ? `/api/blogs/${editingBlog.id}` : '/api/blogs';
    const method = editingBlog ? 'PUT' : 'POST';

    const payload = {
      id: blogId || undefined,
      title: { en: blogTitleEn, nl: blogTitleNl },
      excerpt: { en: blogExcerptEn, nl: blogExcerptNl },
      content: { en: blogContentEn, nl: blogContentNl },
      category: { en: blogCatEn, nl: blogCatNl },
      author: blogAuthor,
      imageUrl: blogImgUrl,
      seoKeywords: {
        en: blogKeysEn.split(',').map(s => s.trim()).filter(Boolean),
        nl: blogKeysNl.split(',').map(s => s.trim()).filter(Boolean)
      }
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
        setIsBlogModalOpen(false);
        onRefreshData();
      } else {
        alert('Error saving blog.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBlogDelete = async (id: string) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, {
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

  // Submit global settings
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      seoSettings: {
        title: { en: seoEnTitle, nl: seoNlTitle },
        description: { en: seoEnDesc, nl: seoNlDesc },
        keywords: {
          en: seoEnKeys.split(',').map(s => s.trim()).filter(Boolean),
          nl: seoNlKeys.split(',').map(s => s.trim()).filter(Boolean)
        }
      },
      businessInfo: {
        phone: bizPhone,
        email: bizEmail,
        address: bizAddress,
        openingHours: { en: bizHoursEn, nl: bizHoursNl },
        mapsEmbedUrl: businessInfo.mapsEmbedUrl, // preserve original
        socialMedia: businessInfo.socialMedia
      }
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('SEO & Shop settings updated successfully!');
        onRefreshData();
      } else {
        alert('Failed to update settings.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Backup Database direct download
  const triggerDbBackup = () => {
    window.location.href = `/api/admin/backup?token=${getAuthToken()}`;
  };

  // ==========================================
  // GEMINI AI INTEGRATION SUITE
  // ==========================================

  // Generate complete blog with Gemini
  const handleAiBlogWrite = async () => {
    if (!aiBlogTopic) {
      alert('Please specify an article topic.');
      return;
    }
    setIsAiBlogGenerating(true);

    try {
      const res = await fetch('/api/gemini/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ topic: aiBlogTopic, lang: aiBlogLang })
      });
      const data = await res.json();
      if (res.ok && data.title && data.content) {
        if (aiBlogLang === 'en') {
          setBlogTitleEn(data.title);
          setBlogExcerptEn(data.excerpt || '');
          setBlogContentEn(data.content);
          setBlogKeysEn(data.seoKeywords?.join(', ') || '');
        } else {
          setBlogTitleNl(data.title);
          setBlogExcerptNl(data.excerpt || '');
          setBlogContentNl(data.content);
          setBlogKeysNl(data.seoKeywords?.join(', ') || '');
        }
        alert(`Gemini successfully composed the Javanese ${aiBlogLang === 'en' ? 'English' : 'Dutch'} article! Review and complete details in the form.`);
      } else {
        alert(data.error || 'Gemini could not fulfill the request.');
      }
    } catch (e: any) {
      alert('Error connecting to Gemini writing services: ' + e.message);
    } finally {
      setIsAiBlogGenerating(false);
    }
  };

  // Generate product SEO meta with Gemini
  const handleAiSeoGenerate = async () => {
    if (!aiSeoProductName) {
      alert('Please specify the product name.');
      return;
    }
    setIsAiSeoGenerating(true);

    try {
      const res = await fetch('/api/gemini/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          productName: aiSeoProductName,
          productDescription: aiSeoDesc,
          lang: aiSeoLang
        })
      });
      const data = await res.json();
      if (res.ok && data.seoTitle && data.metaDescription) {
        if (aiSeoLang === 'en') {
          setSeoEnTitle(data.seoTitle);
          setSeoEnDesc(data.metaDescription);
          setSeoEnKeys(data.keywords?.join(', ') || '');
        } else {
          setSeoNlTitle(data.seoTitle);
          setSeoNlDesc(data.metaDescription);
          setSeoNlKeys(data.keywords?.join(', ') || '');
        }
        alert(`Gemini formulated perfect SEO tags for ${aiSeoProductName}! Filled into general SEO tab.`);
      } else {
        alert(data.error || 'Gemini could not optimize.');
      }
    } catch (e: any) {
      alert('Error connecting to Gemini SEO engine: ' + e.message);
    } finally {
      setIsAiSeoGenerating(false);
    }
  };

  if (!isAdminLoggedIn) {
    /* Login Sanctum screen */
    return (
      <section id="admin" className="py-24 bg-cream batik-pattern border-b border-gold/15 flex items-center justify-center min-h-[75vh]">
        <div className="bg-white rounded-3xl border border-gold/15 p-8 max-w-md w-full luxury-shadow text-center space-y-6" id="admin-login-card">
          <div className="bg-royal-green w-14 h-14 rounded-full flex items-center justify-center mx-auto text-gold shadow-lg">
            <Lock className="w-6 h-6" />
          </div>
          
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-royal-green">
              Access Royal Sanctum
            </h2>
            <p className="text-xs text-royal-green/75 font-mono uppercase tracking-widest text-gold-dark font-semibold">
              Secure Ledger Gate
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded-lg text-left">
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-widest uppercase text-royal-green/80 font-bold">
                Admin Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full bg-cream/30 border border-gold/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-widest uppercase text-royal-green/80 font-bold">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="e.g. jamuheritage2026"
                className="w-full bg-cream/30 border border-gold/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-royal-green hover:bg-leaf-green text-cream font-bold text-xs tracking-widest uppercase py-3.5 rounded-full shadow-lg transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>{isLoggingIn ? 'Unlocking Sanctum...' : 'Verify Access'}</span>
              <ShieldCheck className="w-4 h-4 text-gold" />
            </button>
          </form>
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
                Djamoe Heritage CMS &amp; AI Workspace
              </span>
            </div>
          </div>

          {/* Action Header bar */}
          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <button
              onClick={triggerDbBackup}
              className="flex items-center space-x-1 px-4 py-2 bg-white hover:bg-gold/10 border border-gold/30 rounded-full text-xs font-mono font-bold text-royal-green transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-gold-dark" />
              <span>Backup Database</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-royal-green text-cream hover:bg-red-900 border border-transparent rounded-full text-xs font-mono tracking-wider uppercase transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Workspace Main split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation left column tabs */}
          <div className="lg:col-span-3 bg-white border border-gold/15 p-5 rounded-3xl luxury-shadow space-y-2">
            {[
              { id: 'analytics', label: 'Analytics Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'products', label: 'Product Inventory', icon: <Package className="w-4 h-4" /> },
              { id: 'blogs', label: 'Chronicling Blogs', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'orders', label: 'Bespoke Orders', icon: <ShoppingCart className="w-4 h-4" /> },
              { id: 'seo', label: 'Settings & SEO', icon: <Settings className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-royal-green text-gold border border-gold/20 font-bold shadow-md'
                    : 'text-royal-green/80 hover:bg-gold/10'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Right main workspace tabs panels */}
          <div className="lg:col-span-9 bg-white border border-gold/15 p-6 sm:p-8 rounded-3xl luxury-shadow" id="admin-workspace-pane">
            
            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-fade-in" id="panel-analytics">
                <div className="flex items-center justify-between border-b border-gold/15 pb-4">
                  <h3 className="font-serif text-xl font-bold text-royal-green">Ledger Analytics</h3>
                  <button onClick={fetchAnalytics} className="p-1 text-gold-dark hover:text-royal-green">
                    <RefreshCw className={`w-4 h-4 ${isFetchingAnalytics ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {analytics ? (
                  <div className="space-y-6">
                    {/* Live score cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-cream/40 border border-gold/15 p-4 rounded-2xl text-center">
                        <span className="text-[10px] font-mono uppercase text-royal-green/60 block mb-1">Products</span>
                        <span className="text-3xl font-serif font-bold text-royal-green">{analytics.totalProducts}</span>
                      </div>
                      <div className="bg-cream/40 border border-gold/15 p-4 rounded-2xl text-center">
                        <span className="text-[10px] font-mono uppercase text-royal-green/60 block mb-1">Blogs</span>
                        <span className="text-3xl font-serif font-bold text-royal-green">{analytics.totalBlogs}</span>
                      </div>
                      <div className="bg-cream/40 border border-gold/15 p-4 rounded-2xl text-center font-bold">
                        <span className="text-[10px] font-mono uppercase text-gold-dark block mb-1">Pending orders</span>
                        <span className="text-3xl font-serif text-gold-dark">{analytics.pendingOrders}</span>
                      </div>
                      <div className="bg-royal-green p-4 rounded-2xl text-center text-cream">
                        <span className="text-[10px] font-mono uppercase text-gold block mb-1">Revenue</span>
                        <span className="text-xl sm:text-2xl font-serif font-bold text-gold-light">€{analytics.totalRevenue.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Visitors stats */}
                    <div className="bg-cream/20 border border-gold/15 p-5 rounded-2xl flex justify-between items-center text-sm">
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-royal-green">Simulated Core Web Vitals Traffic</h4>
                        <p className="text-xs text-royal-green/70">Conversion rates based on WhatsApp checkout completions.</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-serif font-bold text-royal-green">{analytics.simulatedVisits.total} Visits</div>
                        <div className="text-xs font-mono text-leaf-green font-semibold">Conv: {analytics.simulatedVisits.conversionRate}</div>
                      </div>
                    </div>

                    {/* Top Selling Products List */}
                    <div className="space-y-3">
                      <h4 className="font-serif font-bold text-royal-green text-sm uppercase tracking-wider border-b border-gold/10 pb-2">Product Alchemical Performance</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="border-b border-gold/10 text-royal-green/50">
                              <th className="py-2">Drink Name</th>
                              <th className="py-2 text-center">Stock</th>
                              <th className="py-2 text-center">Bottles Sold</th>
                              <th className="py-2 text-right">Revenue Generated</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analytics.topProducts.map((p: any, i: number) => (
                              <tr key={i} className="border-b border-gold/5 text-royal-green">
                                <td className="py-2.5 font-serif font-bold">{p.name}</td>
                                <td className="py-2.5 text-center">{p.stock}</td>
                                <td className="py-2.5 text-center font-bold">{p.sales}</td>
                                <td className="py-2.5 text-right font-mono">€{p.revenue.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-royal-green/60 font-light">Loading statistics...</div>
                )}
              </div>
            )}

            {/* PRODUCT MANAGEMENT TAB */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-fade-in" id="panel-products">
                <div className="flex items-center justify-between border-b border-gold/15 pb-4">
                  <h3 className="font-serif text-xl font-bold text-royal-green">Jamu Inventory</h3>
                  <button
                    onClick={() => openProductModal(null)}
                    className="flex items-center space-x-1 px-4 py-2 bg-royal-green text-cream hover:bg-leaf-green rounded-full text-xs font-bold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Elixir</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {products.map(p => (
                    <div key={p.id} className="flex items-center justify-between border border-gold/15 p-4 rounded-2xl bg-cream/20 hover:bg-cream/40 transition-colors">
                      <div className="flex items-center space-x-4">
                        <img src={p.imageUrl} alt={p.name.en} className="w-12 h-12 rounded-lg object-cover bg-white" />
                        <div>
                          <h4 className="font-serif font-bold text-royal-green">{p.name.en}</h4>
                          <span className="text-xs text-gold-dark font-mono uppercase">{p.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-sm font-serif font-bold text-royal-green">€{p.price.toFixed(2)}</div>
                          <div className="text-[10px] text-royal-green/60">Stock: {p.stock}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => openProductModal(p)} className="p-1.5 border border-gold/30 hover:border-gold rounded-full text-royal-green hover:bg-gold/15" title="Edit">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleProductDelete(p.id)} className="p-1.5 border border-red-200 hover:border-red-500 rounded-full text-stone-500 hover:text-red-500" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BLOG POSTS MANAGEMENT TAB */}
            {activeTab === 'blogs' && (
              <div className="space-y-6 animate-fade-in" id="panel-blogs">
                <div className="flex items-center justify-between border-b border-gold/15 pb-4">
                  <h3 className="font-serif text-xl font-bold text-royal-green">Wellness Chronicles</h3>
                  <button
                    onClick={() => openBlogModal(null)}
                    className="flex items-center space-x-1 px-4 py-2 bg-royal-green text-cream hover:bg-leaf-green rounded-full text-xs font-bold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Wisdom</span>
                  </button>
                </div>

                {/* Intelligent AI Writer Assistant widget */}
                <div className="bg-royal-green border border-gold/30 p-5 rounded-2xl text-cream space-y-4">
                  <h4 className="font-serif text-base font-bold text-gold flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>Gemini AI Intelligent Chronicle Writer</span>
                  </h4>
                  <p className="text-xs text-cream/80 font-light">
                    Type an organic wellness topic (e.g., "The restorative power of Kaempferol in Javanese galangal") and let the server-side Gemini write a complete localized masterpiece for your ledger!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={aiBlogTopic}
                      onChange={e => setAiBlogTopic(e.target.value)}
                      placeholder="e.g. Digestive benefits of Temulawak root"
                      className="flex-grow bg-white/10 border border-gold/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-cream"
                    />
                    
                    <div className="flex gap-2">
                      <select
                        value={aiBlogLang}
                        onChange={e => setAiBlogLang(e.target.value as 'en' | 'nl')}
                        className="bg-white/10 border border-gold/30 rounded-xl px-3 py-2.5 text-xs text-cream"
                      >
                        <option value="en" className="text-royal-green">English</option>
                        <option value="nl" className="text-royal-green">Dutch (Nederlands)</option>
                      </select>
                      
                      <button
                        type="button"
                        onClick={handleAiBlogWrite}
                        disabled={isAiBlogGenerating}
                        className="bg-gold hover:bg-gold-dark disabled:bg-stone-500 text-royal-green hover:text-cream px-5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                      >
                        {isAiBlogGenerating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Composing...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>AI Write</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-4">
                  {blogs.map(b => (
                    <div key={b.id} className="flex items-center justify-between border border-gold/15 p-4 rounded-2xl bg-cream/20 hover:bg-cream/40 transition-colors">
                      <div className="flex items-center space-x-4">
                        <img src={b.imageUrl} alt={b.title.en} className="w-12 h-12 rounded-lg object-cover bg-white" />
                        <div>
                          <h4 className="font-serif font-bold text-royal-green line-clamp-1">{b.title.en}</h4>
                          <span className="text-xs text-royal-green/60 font-mono">{b.date} • {b.author}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                        <button onClick={() => openBlogModal(b)} className="p-1.5 border border-gold/30 hover:border-gold rounded-full text-royal-green hover:bg-gold/15" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleBlogDelete(b.id)} className="p-1.5 border border-red-200 hover:border-red-500 rounded-full text-stone-500 hover:text-red-500" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CUSTOMER ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fade-in" id="panel-orders">
                <div className="border-b border-gold/15 pb-4">
                  <h3 className="font-serif text-xl font-bold text-royal-green">Submitted WhatsApp Orders</h3>
                  <p className="text-xs text-royal-green/70">A record of orders sent to +31684861301. Manage statuses below for fulfillment tracking.</p>
                </div>

                <div className="space-y-5">
                  {orders.length === 0 ? (
                    <div className="py-12 text-center text-royal-green/60 font-light">No customer orders recorded yet.</div>
                  ) : (
                    orders.map(o => (
                      <div key={o.id} className="border border-gold/15 p-5 rounded-2xl bg-cream/10 space-y-3" id={`admin-order-${o.id}`}>
                        {/* Header details */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/5 pb-2.5">
                          <div className="flex items-center space-x-3">
                            <span className="font-mono font-bold text-royal-green text-sm bg-gold/10 px-2.5 py-0.5 rounded-md">
                              {o.id}
                            </span>
                            <span className="text-xs text-royal-green/60">
                              {new Date(o.createdAt).toLocaleString()}
                            </span>
                          </div>
                          
                          {/* Status changer */}
                          <div className="flex items-center space-x-2">
                            <label className="text-[10px] font-mono tracking-wider uppercase text-royal-green/60">Status:</label>
                            <select
                              value={o.status}
                              onChange={e => updateOrderStatus(o.id, e.target.value)}
                              className={`text-xs font-bold border rounded-full px-3 py-1 focus:outline-none ${
                                o.status === 'completed'
                                  ? 'bg-leaf-green/10 text-leaf-green border-leaf-green/30'
                                  : o.status === 'cancelled'
                                  ? 'bg-red-50 text-red-600 border-red-200'
                                  : 'bg-amber-50 text-amber-600 border-amber-200'
                              }`}
                            >
                              <option value="pending">Pending (Pending)</option>
                              <option value="completed">Completed (Voltooid)</option>
                              <option value="cancelled">Cancelled (Geannuleerd)</option>
                            </select>
                          </div>
                        </div>

                        {/* Customer metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-royal-green">
                          <div>
                            <span className="font-semibold block">Customer Details:</span>
                            <span>• Name: {o.customerName}</span><br />
                            <span>• Phone: {o.phone}</span><br />
                            <span>• Email: {o.email || '-'}</span>
                          </div>
                          <div>
                            <span className="font-semibold block">Shipping:</span>
                            <span>• Country: {o.country}</span><br />
                            <span>• Total Paid: <strong className="font-serif text-gold-dark text-sm">€{o.totalPrice.toFixed(2)}</strong></span>
                          </div>
                        </div>

                        {/* Order items snapshots */}
                        <div className="bg-white/60 p-3 rounded-xl border border-gold/10 space-y-1 text-xs">
                          <span className="font-bold text-royal-green block uppercase text-[9px] tracking-wider mb-1">Potions Selected:</span>
                          {o.productNames.map((name, idx) => (
                            <div key={idx} className="flex justify-between text-royal-green">
                              <span>- {name} x {o.quantities[idx]}</span>
                              <span>€{(o.prices[idx] * o.quantities[idx]).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        {o.notes && (
                          <div className="text-xs bg-amber-50/40 p-3 rounded-lg border border-amber-100 italic text-stone-700">
                            "Notes: {o.notes}"
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* SEO & BUSINESS SETTINGS TAB */}
            {activeTab === 'seo' && (
              <form onSubmit={handleSettingsSubmit} className="space-y-8 animate-fade-in" id="panel-seo">
                
                {/* Section header */}
                <div className="border-b border-gold/15 pb-4">
                  <h3 className="font-serif text-xl font-bold text-royal-green">Search Optimization &amp; Shop Metadata</h3>
                  <p className="text-xs text-royal-green/70">Modify sitemap targets, Google tags, schema mappings, and opening hours directly.</p>
                </div>

                {/* Gemini AI SEO Optimizer helper */}
                <div className="bg-royal-green border border-gold/30 p-5 rounded-2xl text-cream space-y-4">
                  <h4 className="font-serif text-base font-bold text-gold flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>Gemini AI Intelligent SEO Metadata Optimizer</span>
                  </h4>
                  <p className="text-xs text-cream/80 font-light">
                    Generate highly professional and catchy SEO Titles, Meta Descriptions, and tags for any product name. Select English or Dutch targets.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={aiSeoProductName}
                        onChange={e => setAiSeoProductName(e.target.value)}
                        placeholder="Product Name (e.g. Royal Kunyit Asam)"
                        className="bg-white/10 border border-gold/30 rounded-xl px-4 py-2.5 text-xs text-cream focus:outline-none"
                      />
                      <input
                        type="text"
                        value={aiSeoDesc}
                        onChange={e => setAiSeoDesc(e.target.value)}
                        placeholder="Core herbal benefits description"
                        className="bg-white/10 border border-gold/30 rounded-xl px-4 py-2.5 text-xs text-cream focus:outline-none"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <select
                        value={aiSeoLang}
                        onChange={e => setAiSeoLang(e.target.value as 'en' | 'nl')}
                        className="bg-white/10 border border-gold/30 rounded-xl px-3 py-2 text-xs text-cream"
                      >
                        <option value="en" className="text-royal-green">English</option>
                        <option value="nl" className="text-royal-green">Dutch (Nederlands)</option>
                      </select>
                      
                      <button
                        type="button"
                        onClick={handleAiSeoGenerate}
                        disabled={isAiSeoGenerating}
                        className="bg-gold hover:bg-gold-dark disabled:bg-stone-500 text-royal-green hover:text-cream px-5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        {isAiSeoGenerating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Optimizing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Generate SEO Tags</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* English SEO Fields */}
                <div className="space-y-4 pt-4 border-t border-gold/15">
                  <h4 className="font-serif font-bold text-royal-green text-sm uppercase tracking-wide">English SEO Meta Tags</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-widest text-royal-green/80 uppercase font-bold">SEO Title (English)</label>
                      <input
                        type="text"
                        value={seoEnTitle}
                        onChange={e => setSeoEnTitle(e.target.value)}
                        className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-widest text-royal-green/80 uppercase font-bold">Meta Description (English)</label>
                      <textarea
                        rows={2}
                        value={seoEnDesc}
                        onChange={e => setSeoEnDesc(e.target.value)}
                        className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-widest text-royal-green/80 uppercase font-bold">Search Keywords (English, comma-separated)</label>
                      <input
                        type="text"
                        value={seoEnKeys}
                        onChange={e => setSeoEnKeys(e.target.value)}
                        className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                </div>

                {/* Dutch SEO Fields */}
                <div className="space-y-4 pt-4 border-t border-gold/15">
                  <h4 className="font-serif font-bold text-royal-green text-sm uppercase tracking-wide">Dutch SEO Meta Tags</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-widest text-royal-green/80 uppercase font-bold">SEO Title (Dutch)</label>
                      <input
                        type="text"
                        value={seoNlTitle}
                        onChange={e => setSeoNlTitle(e.target.value)}
                        className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-widest text-royal-green/80 uppercase font-bold">Meta Description (Dutch)</label>
                      <textarea
                        rows={2}
                        value={seoNlDesc}
                        onChange={e => setSeoNlDesc(e.target.value)}
                        className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-widest text-royal-green/80 uppercase font-bold">Search Keywords (Dutch, comma-separated)</label>
                      <input
                        type="text"
                        value={seoNlKeys}
                        onChange={e => setSeoNlKeys(e.target.value)}
                        className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                </div>

                {/* Business details */}
                <div className="space-y-4 pt-4 border-t border-gold/15">
                  <h4 className="font-serif font-bold text-royal-green text-sm uppercase tracking-wide">Business Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-widest text-royal-green/80 uppercase font-bold">WhatsApp Hotline</label>
                      <input type="text" value={bizPhone} onChange={e => setBizPhone(e.target.value)} className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-xs text-royal-green" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-widest text-royal-green/80 uppercase font-bold">Email Address</label>
                      <input type="email" value={bizEmail} onChange={e => setBizEmail(e.target.value)} className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-xs text-royal-green" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-widest text-royal-green/80 uppercase font-bold">Physical Address Location</label>
                    <input type="text" value={bizAddress} onChange={e => setBizAddress(e.target.value)} className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-xs text-royal-green" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-widest text-royal-green/80 uppercase font-bold">Opening Hours (English)</label>
                      <input type="text" value={bizHoursEn} onChange={e => setBizHoursEn(e.target.value)} className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-xs text-royal-green" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-widest text-royal-green/80 uppercase font-bold">Opening Hours (Dutch)</label>
                      <input type="text" value={bizHoursNl} onChange={e => setBizHoursNl(e.target.value)} className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-xs text-royal-green" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-royal-green hover:bg-leaf-green text-cream font-bold text-xs tracking-widest uppercase py-3.5 rounded-full shadow-lg transition-transform hover:scale-101 cursor-pointer"
                >
                  Save Settings &amp; Deploy Changes
                </button>

              </form>
            )}

          </div>

        </div>

      </div>

      {/* PRODUCT FORM LIGHTBOX OVERLAY MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-royal-green/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6" id="product-form-modal">
          <div className="relative bg-cream w-full max-w-4xl rounded-3xl border border-gold/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-royal-green text-cream border-b border-gold/20">
              <h3 className="font-serif text-lg font-bold">{editingProduct ? 'Edit Traditional Elixir' : 'Add New Herbal Elixir'}</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-cream hover:text-gold">
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
                    <option value="men-health">Men's Health</option>
                    <option value="digestive-health">Digestive Health</option>
                    <option value="traditional-drinks">Traditional Drinks</option>
                    <option value="immune-booster">Immune Booster</option>
                    <option value="detox">Detox &amp; Purify</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 pt-4">
                  <input type="checkbox" id="chkFeatured" checked={prodFeatured} onChange={e => setProdFeatured(e.target.checked)} className="h-4 w-4 rounded text-royal-green" />
                  <label htmlFor="chkFeatured" className="text-xs font-serif font-bold text-royal-green">Featured Product</label>
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Select Default Seed Image</label>
                  <div className="flex gap-1.5 mt-1.5">
                    {['kunyit_asam_bottle_1783604890128.jpg', 'beras_kencur_bottle_1783604905190.jpg', 'temulawak_bottle_1783604918337.jpg'].map((img, i) => (
                      <button key={i} type="button" onClick={() => handleDefaultImgPick('product', img)} className="border border-gold/30 hover:border-gold rounded overflow-hidden w-8 h-8">
                        <img src={`/src/assets/images/${img}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Image URL Path</label>
                <input type="text" value={prodImgUrl} onChange={e => setProdImgUrl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Short Description (English)</label>
                  <textarea rows={2} value={prodDescEn} onChange={e => setProdDescEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Short Description (Dutch)</label>
                  <textarea rows={2} value={prodDescNl} onChange={e => setProdDescNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
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
                Save Elixir Details
              </button>

            </form>
          </div>
        </div>
      )}

      {/* BLOG FORM LIGHTBOX OVERLAY MODAL */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-royal-green/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6" id="blog-form-modal">
          <div className="relative bg-cream w-full max-w-4xl rounded-3xl border border-gold/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 bg-royal-green text-cream border-b border-gold/20">
              <h3 className="font-serif text-lg font-bold">{editingBlog ? 'Edit Wisdom Post' : 'Compose New Wisdom'}</h3>
              <button onClick={() => setIsBlogModalOpen(false)} className="text-cream hover:text-gold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBlogSubmit} className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Slug ID</label>
                  <input type="text" value={blogId} onChange={e => setBlogId(e.target.value)} disabled={!!editingBlog} placeholder="e.g. science-of-ginger" className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Author Signature</label>
                  <input type="text" value={blogAuthor} onChange={e => setBlogAuthor(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Seeded Banner Images</label>
                  <div className="flex gap-2 mt-1">
                    {['hero_jamu_preparation_1783604874087.jpg', 'kunyit_asam_bottle_1783604890128.jpg'].map((img, i) => (
                      <button key={i} type="button" onClick={() => handleDefaultImgPick('blog', img)} className="border border-gold/30 hover:border-gold rounded overflow-hidden w-8 h-8">
                        <img src={`/src/assets/images/${img}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Banner Image Path</label>
                <input type="text" value={blogImgUrl} onChange={e => setBlogImgUrl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Category Name (English)</label>
                  <input type="text" value={blogCatEn} onChange={e => setBlogCatEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Category Name (Dutch)</label>
                  <input type="text" value={blogCatNl} onChange={e => setBlogCatNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Title (English)</label>
                  <input type="text" value={blogTitleEn} onChange={e => setBlogTitleEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Title (Dutch)</label>
                  <input type="text" value={blogTitleNl} onChange={e => setBlogTitleNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Excerpt Snippet (English)</label>
                  <textarea rows={2} value={blogExcerptEn} onChange={e => setBlogExcerptEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Excerpt Snippet (Dutch)</label>
                  <textarea rows={2} value={blogExcerptNl} onChange={e => setBlogExcerptNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Chronicle Body Content (English - Markdown supported)</label>
                  <textarea rows={6} value={blogContentEn} onChange={e => setBlogContentEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">Chronicle Body Content (Dutch - Markdown supported)</label>
                  <textarea rows={6} value={blogContentNl} onChange={e => setBlogContentNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">SEO Keywords (English, comma-separated)</label>
                  <input type="text" value={blogKeysEn} onChange={e => setBlogKeysEn(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase font-bold text-royal-green/80">SEO Keywords (Dutch, comma-separated)</label>
                  <input type="text" value={blogKeysNl} onChange={e => setBlogKeysNl(e.target.value)} className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full bg-royal-green hover:bg-leaf-green text-cream font-bold text-xs tracking-widest uppercase py-3 rounded-full shadow-lg transition-transform hover:scale-101 cursor-pointer">
                Commit Article to Ledger
              </button>

            </form>
          </div>
        </div>
      )}

    </section>
  );
};
