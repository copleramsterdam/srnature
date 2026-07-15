import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Calendar, User, Search, BookOpen, X, Hash } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { PrimbonCalculator } from './PrimbonCalculator';

interface BlogSectionProps {
  blogs: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogs }) => {
  const { t, translate, translateArray, language } = useLanguage();
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<'articles' | 'primbon'>('articles');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get('weton_tab') || 
      params.get('weton_name') || 
      params.get('weton_date') || 
      params.get('c1_name') || 
      params.get('c1_date') || 
      params.get('c2_name') || 
      params.get('c2_date')
    ) {
      setActiveMenu('primbon');
    }
  }, []);

  useEffect(() => {
    if (blogs && blogs.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const blogIdParam = params.get('blog_id');
      if (blogIdParam) {
        const found = blogs.find(b => b.id === blogIdParam || b.slug === blogIdParam);
        if (found) {
          setSelectedBlog(found);
          setTimeout(() => {
            const el = document.getElementById('blog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 800);
        }
      }
    }
  }, [blogs]);

  const filteredBlogs = blogs.filter(b => {
    const titleText = translate(b.title).toLowerCase();
    const excerptText = translate(b.excerpt).toLowerCase();
    const query = searchQuery.toLowerCase();
    return titleText.includes(query) || excerptText.includes(query);
  });

  return (
    <section id="blog" className="py-10 bg-cream batik-pattern border-b border-gold/15 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 text-gold">
                <BookOpen className="w-4 h-4 text-gold-dark" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-dark">
                  The Royal Chronicles
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-royal-green tracking-wide">
                {t('blog.title')}
              </h2>
              <p className="text-xs sm:text-sm text-royal-green/75 font-light leading-relaxed">
                {t('blog.subtitle')}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Navigation Menu Tabs */}
        <ScrollReveal direction="up" delay={0.15}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gold/15 pb-2 mb-8 gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveMenu('articles')}
                className={`pb-3 px-4 sm:px-6 font-serif text-xs sm:text-sm font-bold tracking-wide relative transition-colors duration-300 cursor-pointer ${
                  activeMenu === 'articles' ? 'text-royal-green' : 'text-royal-green/50 hover:text-royal-green'
                }`}
              >
                <span>{language === 'id' ? 'Artikel Kesehatan & Jamu' : language === 'nl' ? 'Gezondheidsartikelen' : 'Health & Jamu Articles'}</span>
                {activeMenu === 'articles' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-royal-green" />
                )}
              </button>
              <button
                onClick={() => setActiveMenu('primbon')}
                className={`pb-3 px-4 sm:px-6 font-serif text-xs sm:text-sm font-bold tracking-wide relative transition-colors duration-300 flex items-center space-x-1.5 cursor-pointer ${
                  activeMenu === 'primbon' ? 'text-royal-green' : 'text-royal-green/50 hover:text-royal-green'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                <span>{language === 'id' ? 'Primbon Jawa (Hiburan)' : language === 'nl' ? 'Javaanse Primbon' : 'Javanese Primbon (Fun)'}</span>
                {activeMenu === 'primbon' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-royal-green" />
                )}
              </button>
            </div>

            {/* Search bar (Only shown when Articles menu is active) */}
            {activeMenu === 'articles' && (
              <div className="relative w-full md:w-80">
                <Search className="w-3.5 h-3.5 text-royal-green/40 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={language === 'id' ? "Cari ramuan herbal..." : language === 'nl' ? "Zoek kruidenwijsheid..." : "Search botanical wisdom..."}
                  className="w-full bg-white border border-gold/20 rounded-full pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-gold shadow-sm"
                />
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Conditional Rendering of Tabs */}
        {activeMenu === 'primbon' ? (
          <ScrollReveal direction="up" delay={0.2}>
            <PrimbonCalculator />
          </ScrollReveal>
        ) : (
          <>
            {/* Blogs Grid */}
            {filteredBlogs.length === 0 ? (
              <div className="py-12 text-center text-royal-green/60 font-light text-xs">
                No articles match your query. Explore other herbal secrets!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" id="blog-grid">
                {filteredBlogs.map((post, idx) => (
                  <ScrollReveal 
                    key={post.id}
                    direction="up"
                    delay={0.1 * (idx % 2)}
                    className="h-full"
                  >
                    <div 
                      className="bg-white rounded-2xl border border-gold/15 overflow-hidden luxury-shadow hover:shadow-2xl transition-all duration-500 group flex flex-col h-full cursor-pointer"
                      onClick={() => setSelectedBlog(post)}
                    >
                      {/* Banner image */}
                      <div className="relative aspect-16/9 overflow-hidden bg-royal-green">
                        <img
                          src={post.imageUrl}
                          alt={translate(post.title)}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-royal-green/40 to-transparent" />
                        
                        {/* Category overlay */}
                        <div className="absolute bottom-3 left-3 bg-royal-green/95 backdrop-blur-sm border border-gold/30 text-gold px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider">
                          {translate(post.category)}
                        </div>
                      </div>

                      {/* Body details */}
                      <div className="p-4 sm:p-6 flex flex-col flex-grow space-y-2">
                        {/* Date and Author */}
                        <div className="flex items-center space-x-3 text-[10px] font-mono text-royal-green/60">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{post.date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{post.author}</span>
                          </span>
                        </div>

                        {/* Title and Excerpt */}
                        <div className="space-y-1">
                          <h3 className="font-serif text-lg sm:text-xl font-bold text-royal-green group-hover:text-gold-dark transition-colors duration-300 line-clamp-2 leading-tight">
                            {translate(post.title)}
                          </h3>
                          <p className="text-xs text-royal-green/75 font-light leading-relaxed line-clamp-2">
                            {translate(post.excerpt)}
                          </p>
                        </div>

                        {/* Read action CTA */}
                        <div className="pt-3 border-t border-gold/10 mt-auto flex items-center justify-between text-[10px] font-mono font-bold text-gold-dark group-hover:text-royal-green uppercase tracking-widest">
                          <span>{t('blog.readMore')}</span>
                          <span className="transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </>
        )}

        {/* Read Article Lightbox Overlay Modal */}
        {selectedBlog && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-royal-green/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6" id="blog-reading-lightbox">
            
            <div className="relative bg-cream w-full max-w-3xl rounded-3xl border border-gold/30 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-scale-up">
              
              {/* Close button top-right */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="bg-royal-green/90 border border-gold/20 hover:border-gold p-2 rounded-full text-cream hover:text-gold transition-all duration-300 shadow-md"
                  aria-label="Close article"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body content */}
              <div className="overflow-y-auto">
                {/* Banner Backdrop picture */}
                <div className="relative h-64 sm:h-80 bg-royal-green overflow-hidden">
                  <img
                    src={selectedBlog.imageUrl}
                    alt={translate(selectedBlog.title)}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/10 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 bg-royal-green/90 border border-gold/30 p-3 rounded-xl inline-block max-w-max">
                    <span className="text-xs font-mono text-gold font-bold uppercase tracking-widest block">
                      {translate(selectedBlog.category)}
                    </span>
                  </div>
                </div>

                {/* Article detail spacing */}
                <div className="p-6 sm:p-8 md:p-10 space-y-6">
                  {/* Meta headers */}
                  <div className="flex items-center space-x-6 text-xs font-mono text-royal-green/60 border-b border-gold/15 pb-4">
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-gold-dark" />
                      <span>{selectedBlog.date}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <User className="w-4 h-4 text-gold-dark" />
                      <span>{selectedBlog.author}</span>
                    </span>
                  </div>

                  {/* Editorial Title */}
                  <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-royal-green tracking-wide leading-tight">
                    {translate(selectedBlog.title)}
                  </h3>

                  {/* Excerpt panel */}
                  <div className="bg-white/50 border-l-4 border-gold border-y border-r border-gold/10 p-4 rounded-r-xl italic text-sm sm:text-base text-royal-green/80 font-light font-sans">
                    "{translate(selectedBlog.excerpt)}"
                  </div>

                  {/* Rich markdown style body */}
                  <div className="font-sans text-royal-green/90 text-sm sm:text-base leading-relaxed font-light space-y-4 whitespace-pre-wrap" id="article-markdown-body">
                    {translate(selectedBlog.content)}
                  </div>

                  {/* SEO tags list footer */}
                  <div className="pt-6 border-t border-gold/15 space-y-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-royal-green/50 font-bold block flex items-center space-x-1">
                      <Hash className="w-3 h-3" />
                      <span>Wisdom Tags</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {translateArray(selectedBlog.seoKeywords).map((tag, i) => (
                        <span key={i} className="text-xs font-mono bg-gold/10 text-gold-dark px-3 py-1 rounded-full border border-gold/15">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
