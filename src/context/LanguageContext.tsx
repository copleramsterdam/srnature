import React, { createContext, useContext, useState, useEffect } from 'react';
import { MultilingualString, MultilingualArray } from '../types';

export type Language = 'en' | 'nl' | 'id';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translate: (val: MultilingualString | undefined) => string;
  translateArray: (val: MultilingualArray | undefined) => string[];
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const UI_TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': { en: 'Home', nl: 'Home', id: 'Beranda' },
  'nav.shop': { en: 'Spa Products', nl: 'Spa Producten', id: 'Produk Spa' },
  'nav.about': { en: 'Massage Services', nl: 'Pijatservice', id: 'Layanan Pijat' },
  'nav.philosophy': { en: 'Philosophy', nl: 'Filosofie', id: 'Filosofi' },
  'nav.blog': { en: 'Wellness Blog', nl: 'Gezondheidsblog', id: 'Blog Kesehatan' },
  'nav.contact': { en: 'Contact Us', nl: 'Contact', id: 'Hubungi Kami' },
  'nav.admin': { en: 'Admin Portal', nl: 'Admin Portaal', id: 'Portal Admin' },

  // Hero Section
  'hero.subtitle': { en: "Nature's Touch for Complete Wellness.", nl: "Natuurlijke Aanraking voor Compleet Welzijn", id: "Sentuhan Alam untuk Kesehatan Menyeluruh" },
  'hero.title': { en: 'Premium Traditional Javanese Massage & Spa Wellness', nl: 'Premium Traditionele Javaanse Massage & Spa Wellness', id: 'Layanan Pijat & Produk Spa Tradisional Premium Jawa' },
  'hero.description': { en: 'Indulge in a relaxing body and face massage with warm aromatherapy oils, or pamper yourself with our traditional botanical spa range. Home service wellness crafted for ultimate relaxation.', nl: 'Geniet van een ontspannende lichaams- en gezichtsmassage met warme aromatherapieoliën, of verwen uzelf met ons traditionele botanische spa-assortiment. Wellness aan huis gemaakt voor ultieme ontspanning.', id: 'Nikmati layanan pijat tubuh dan wajah yang menenangkan dengan minyak aromaterapi hangat, atau manjakan diri Anda dengan rangkaian produk spa botani tradisional kami. Layanan home service untuk relaksasi maksimal.' },
  'hero.cta.shop': { en: 'Shop Spa Products', nl: 'Spa Producten Kopen', id: 'Belanja Produk Spa' },
  'hero.cta.learn': { en: 'Explore Massage Services', nl: 'Ontdek Pijatservice', id: 'Layanan Pijat Kunjungan' },
  'hero.cta.whatsapp': { en: 'Order via WhatsApp', nl: 'Bestellen via WhatsApp', id: 'Pesan via WhatsApp' },

  // Brand Pillars
  'pillar.natural.title': { en: '100% Organic', nl: '100% Biologisch', id: '100% Organik' },
  'pillar.natural.desc': { en: 'Zero chemical additives, mineral oils, or synthetic fragrances.', nl: 'Zonder chemische toevoegingen, minerale oliën of synthetische geurstoffen.', id: 'Tanpa bahan kimia tambahan, minyak mineral, atau pewangi buatan.' },
  'pillar.recipe.title': { en: 'Royal Spa Legacy', nl: 'Koninklijke Spa Traditie', id: 'Warisan Spa Keraton' },
  'pillar.recipe.desc': { en: 'Formulated following precise Javanese royal palace botanical secrets.', nl: 'Samengesteld volgens exacte geheime botanische verhoudingen van de Javaanse paleizen.', id: 'Diracik mengikuti rahasia herbal botani keraton Jawa yang presisi.' },
  'pillar.fresh.title': { en: 'Freshly Prepared', nl: 'Vers Bereid', id: 'Disajikan Segar' },
  'pillar.fresh.desc': { en: 'Artisanally small-batched and hand-poured in Amsterdam.', nl: 'Ambachtelijk in kleine hoeveelheden gemaakt en met de hand gegoten in Amsterdam.', id: 'Dibuat dalam jumlah terbatas secara tradisional dan dikemas dengan tangan di Amsterdam.' },

  // Product Sections
  'shop.title': { en: 'Our Premium Spa Products', nl: 'Onze Premium Spa Producten', id: 'Produk Spa Premium Kami' },
  'shop.subtitle': { en: 'Premium natural aromatherapy and traditional body products for your home sanctuary', nl: 'Premium natuurlijke aromatherapie en traditionele lichaamsproducten voor uw wellness thuis', id: 'Aromaterapi alami premium dan produk perawatan tubuh tradisional untuk ketenangan Anda di rumah' },
  'product.category': { en: 'Category', nl: 'Categorie', id: 'Kategori' },
  'product.price': { en: 'Price', nl: 'Prijs', id: 'Harga' },
  'product.stock': { en: 'In Stock', nl: 'Op Voorraad', id: 'Tersedia' },
  'product.outOfStock': { en: 'Sold Out', nl: 'Uitverkocht', id: 'Habis Terjual' },
  'product.viewDetails': { en: 'View Details', nl: 'Bekijk Details', id: 'Detail Produk' },
  'product.addToOrder': { en: 'Add to Order', nl: 'Voeg toe', id: 'Tambah ke Pesanan' },
  'product.ingredients': { en: 'Ingredients', nl: 'Ingrediënten', id: 'Bahan-bahan' },
  'product.benefits': { en: 'Key Wellness Benefits', nl: 'Belangrijkste Wellness Voordelen', id: 'Manfaat Utama Relaksasi' },
  'product.traditional': { en: 'Traditional Javanese Origin', nl: 'Traditionele Javaanse Oorsprong', id: 'Asal-Usul Tradisional Jawa' },
  'product.scientific': { en: 'Modern Scientific Proof', nl: 'Bukti Ilmiah Modern', id: 'Bukti Ilmiah Modern' },
  'product.howToConsume': { en: 'How to Use', nl: 'Hoe te Gebruiken', id: 'Cara Pemakaian' },
  'product.recommended': { en: 'Recommended Use', nl: 'Aanbevolen Gebruik', id: 'Saran Pemakaian' },
  'product.whoShouldUse': { en: 'Who is this for?', nl: 'Voor wie is dit?', id: 'Untuk Siapa Produk Ini?' },
  'product.warnings': { en: 'Warnings & Precautions', nl: 'Waarschuwingen', id: 'Peringatan & Efek Samping' },
  'product.featured': { en: 'Signature Product', nl: 'Ons Handtekening Product', id: 'Produk Unggulan' },

  // Categories
  'cat.womens-health': { en: 'Massage Oils', nl: 'Massage Oliën', id: 'Minyak Pijat' },
  'cat.men-health': { en: 'Face & Body Care', nl: 'Gezichts- & Lichaamsverzorging', id: 'Perawatan Wajah & Tubuh' },
  'cat.digestive-health': { en: 'Traditional Scrubs', nl: 'Traditionele Scrubs', id: 'Lulur Tradisional' },
  'cat.traditional-drinks': { en: 'Herbal Therapies', nl: 'Kruidentherapieën', id: 'Terapi Herbal' },
  'cat.immune-booster': { en: 'Stress Relief', nl: 'Stressverlichting', id: 'Pereda Stres' },
  'cat.detox': { en: 'Aromatherapy', nl: 'Aromatherapie', id: 'Aromaterapi' },

  // About Section (Home Page) -> Replaced with Massage Section
  'about.home.title': { en: 'Our Services', nl: 'Onze Diensten', id: 'Layanan Kami' },
  'about.home.heading': { en: 'Beauty & Health Home-Visit Massage', nl: 'Schoonheids- & Gezondheidsmassage aan Huis', id: 'Pijat Kecantikan & Kesehatan Kunjungan ke Rumah' },
  'about.home.p1': { en: 'Indulge in our professional home-visit massage therapies, meticulously designed to restore natural balance, alleviate stress, and promote physical and mental well-being in the comfort of your own space. Combining traditional touch with contemporary wellness care.', nl: 'Geniet van onze professionele massagetherapieën aan huis, zorgvuldig ontworpen om de natuurlijke balans te herstellen, stress te verlichten en fysiek en mentaal welzijn te bevorderen in het comfort van uw eigen ruimte.', id: 'Nikmati terapi pijat kunjungan rumah profesional kami, yang dirancang secara teliti untuk mengembalikan keseimbangan alami, meredakan stres, serta mendukung kesehatan fisik dan mental di kenyamanan tempat Anda sendiri.' },
  'about.home.p2': { en: 'We carry organic oils and custom therapeutic blends directly to your doorstep. Each treatment is tailored to your body\'s unique rhythm and tension points, ensuring a deeply restorative spa-level experience.', nl: 'Wij brengen biologische oliën en op maat gemaakte therapeutische blends rechtstreeks naar uw deur. Elke behandeling is afgestemd op het unieke ritme en de knopen van uw lichaam.', id: 'Kami membawa minyak organik dan racikan terapeutik khusus langsung ke pintu rumah Anda. Setiap perawatan disesuaikan dengan ritme unik dan titik ketegangan tubuh Anda, memastikan pengalaman tingkat spa yang memulihkan secara mendalam.' },

  // New specific massage keys
  'massage.travel_policy': { 
    en: 'Note: For home locations more than 10 km away, a travel fee of €10 - €20 is applicable.', 
    nl: 'Let op: Voor adressen verder dan 10 km wordt een reiskostentoeslag van €10 - €20 in rekening gebracht.', 
    id: 'Catatan: Untuk jarak rumah yang lebih dari 10 km dikenakan biaya perjalanan sebesar €10 - €20.' 
  },
  'massage.book_now': { en: 'Book Now', nl: 'Nu Boeken', id: 'Pesan Sekarang' },
  'massage.duration_mins': { en: 'minutes', nl: 'minuten', id: 'menit' },
  'massage.duration_hour': { en: '1 hour', nl: '1 uur', id: '1 jam' },
  'massage.balance.name': { en: 'Body Massage', nl: 'Lichaamsmassage', id: 'Body Massage' },
  'massage.balance.desc': { 
    en: 'Enjoy a comprehensive body massage that helps relieve muscle tension, provides a sense of comfort, and makes your body feel lighter after a long day of activities.',
    nl: 'Geniet van een uitgebreide lichaamsmassage die helpt bij het verlichten van spierspanning, zorgt voor comfort en uw lichaam lichter laat voelen na een actieve dag.',
    id: 'Nikmati pijatan menyeluruh yang membantu meredakan ketegangan otot, memberikan rasa nyaman, dan membuat tubuh terasa lebih ringan setelah beraktivitas.'
  },
  'massage.relax.name': { en: 'Face Massage', nl: 'Gezichtsmassage', id: 'Face Massage' },
  'massage.relax.desc': { 
    en: 'A facial treatment with gentle massage techniques that provide a relaxing sensation, help reduce facial tension, and leave your face feeling refreshed.',
    nl: 'Een gezichtsbehandeling met zachte massagetechnieken die een ontspannen gevoel geven, de spanning in het gezicht helpen verminderen en uw gezicht frisser laten aanvoelen.',
    id: 'Perawatan wajah dengan teknik pijat lembut yang memberikan sensasi rileks, membantu mengurangi ketegangan pada wajah, dan membuat wajah terasa lebih segar.'
  },
  'massage.fullbody.name': { en: 'Full Body Massage', nl: 'Full Body Massage', id: 'Pijat Full Body' },
  'massage.fullbody.desc': { 
    en: 'Let your body rest and recharge. Enjoy a full body relaxation massage with a professional touch and natural aromatherapy that helps ease tension, reduce soreness, and bring peace to body and mind.\n\n🌿 Gentle and professional touch\n💆‍♀️ Relaxation from head to toe\n🏡 Home Service – Comfortable in your own home\n\nA relaxed body is the beginning of a better day. Book now and experience a soothing relaxation experience with SR Natural Wellness.',
    nl: 'Laat uw lichaam rusten en weer opladen. Geniet van een ontspannende volledige lichaamsmassage met een professionele aanraking en natuurlijke aromatherapie die helpt spanning te verlichten, spierpijn te verminderen en rust te brengen in lichaam en geest.\n\n🌿 Zachte en professionele aanraking\n💆‍♀️ Ontspanning van top tot teen\n🏡 Home Service – Comfortabel bij u thuis\n\nEen ontspannen lichaam is het begin van een betere dag. Boek nu en ervaar een rustgevende ontspanningservaring met SR Natural Wellness.',
    id: 'Biarkan tubuh Anda beristirahat dan kembali bertenaga. Nikmati pijat relaksasi seluruh tubuh dengan sentuhan profesional dan aromaterapi alami yang membantu meredakan ketegangan, mengurangi rasa pegal, dan menghadirkan ketenangan untuk tubuh serta pikiran.\n\n🌿 Sentuhan lembut dan profesional\n💆‍♀️ Relaksasi dari kepala hingga kaki\n🏡 Home Service – Nyaman di rumah Anda\n\nTubuh yang rileks adalah awal dari hari yang lebih baik. Reservasi sekarang dan rasakan pengalaman relaksasi yang menenangkan bersama SR Natural Wellness.'
  },

  // Philosophy Section (Home page/dedicated)
  'phil.title': { en: 'Philosophy of Botanical Harmony', nl: 'Filosofie van Plantaardige Harmonie', id: 'Filosofi Harmoni Botani' },
  'phil.subtitle': { en: 'The Javanese Art of Inner and Outer Balance', nl: 'De Javaanse Kunst van Innerlijke en Uiterlijke Balans', id: 'Seni Jawa Menyeimbangkan Lahir dan Batin' },
  'phil.p1': { en: 'Traditional Javanese wellness is rooted in the philosophy of *Rukun* (Harmony) and *Laras* (Balance). Illness and fatigue are viewed not as an invasion, but as a temporary disharmony between hot and cold vital forces within the body, and between the body and the surrounding environment.', nl: 'Traditionele Javaanse wellness is geworteld in de filosofie van *Rukun* (Harmonie) en *Laras* (Balans). Vermoeidheid en ongemak worden niet gezien als een invasie, maar als een tijdelijke disharmonie tussen warme en koude levenskrachten in het lichaam.', id: 'Pijat tradisional Jawa berakar pada filosofi *Rukun* (Keselarasan) dan *Laras* (Keseimbangan). Rasa lelah dan ketegangan dipandang bukan sebagai penyakit, melainkan ketidakselarasan sementara antara energi vital panas dan dingin di dalam tubuh.' },
  'phil.p2': { en: 'By blending the healing power of dedicated therapeutic touch, hot herbal compresses, and calming aromatherapy oils, SR Natural gently nudges the body back into its natural homeostasis. It is regular relaxation for your well-being, caring for the garden of your body daily so that stress and physical fatigue never take root.', nl: 'Door de genezende kracht van therapeutische massage, warme kruidencompressen en kalmerende aromatherapie te combineren, brengt SR Natural het lichaam zachtjes terug in homeostase. Het is een regelmatige ontspanning voor uw welzijn.', id: 'Dengan memadukan kekuatan penyembuhan dari pijat terapeutik, kompres herbal hangat, dan minyak aromaterapi yang menenangkan, SR Natural mengembalikan keseimbangan alami tubuh Anda. Ini adalah langkah relaksasi berkala untuk merawat kebugaran tubuh Anda agar stres dan kelelahan fisik tidak menumpuk.' },

  // Ordering Form
  'order.title': { en: 'Order Spa & Wellness Products', nl: 'Bestel Spa & Wellness Producten', id: 'Pesan Produk Spa & Wellness' },
  'order.subtitle': { en: 'Select your wellness products. We will instantly compose a personalized order details file and redirect you to WhatsApp to complete your delivery.', nl: 'Selecteer uw wellnessproducten. We stellen direct een gepersonaliseerde bestelling samen en sturen u door naar WhatsApp om uw levering af te ronden.', id: 'Pilih produk wellness Anda. Kami akan segera menyusun rincian pesanan Anda dan mengalihkan Anda ke WhatsApp untuk menyelesaikan pengiriman.' },
  'order.form.name': { en: 'Full Name', nl: 'Volledige Naam', id: 'Nama Lengkap' },
  'order.form.phone': { en: 'WhatsApp Phone Number', nl: 'WhatsApp Telefoonnummer', id: 'Nomor WhatsApp' },
  'order.form.email': { en: 'Email Address', nl: 'Alamat Email', id: 'Alamat Email' },
  'order.form.country': { en: 'Country (Deliveries inside NL/BE)', nl: 'Land (Leveringen binnen NL/BE)', id: 'Negara (Pengiriman di dalam NL/BE)' },
  'order.form.products': { en: 'Selected Products', nl: 'Geselecteerde Producten', id: 'Produk Terpilih' },
  'order.form.qty': { en: 'Quantity', nl: 'Aantal', id: 'Jumlah' },
  'order.form.notes': { en: 'Special Requests / Health Notes', nl: 'Speciale Wensen / Opmerkingen', id: 'Catatan Khusus / Permintaan Pengiriman' },
  'order.form.submit': { en: 'Confirm and Order via WhatsApp', nl: 'Bevestig en Bestel via WhatsApp', id: 'Konfirmasi dan Pesan via WhatsApp' },
  'order.form.success': { en: 'Connecting to WhatsApp... Thank you!', nl: 'Verbinding maken met WhatsApp... Bedankt!', id: 'Menghubungkan ke WhatsApp... Terima kasih!' },
  'order.cart.empty': { en: 'Your selection is empty. Choose a product below!', nl: 'Uw selectie is leeg. Kies hieronder een product!', id: 'Keranjang belanja Anda kosong. Pilih produk di bawah!' },
  'order.cart.total': { en: 'Estimated Total', nl: 'Geschat Totaal', id: 'Estimasi Total' },

  // Blog Section
  'blog.title': { en: 'Sacred Botanical Knowledge', nl: 'Heilige Botanische Kennis', id: 'Pengetahuan Botani Suci' },
  'blog.subtitle': { en: 'Weekly articles blending traditional Javanese wisdom and modern wellness science', nl: 'Wekelijkse artikelen die traditionele Javaanse wijsheid en moderne wellness-wetenschap combineren', id: 'Artikel mingguan yang memadukan kebijaksanaan tradisional Jawa dan sains kebugaran modern' },
  'blog.readMore': { en: 'Read Wisdom', nl: 'Lees Artikel', id: 'Baca Artikel' },
  'blog.author': { en: 'By', nl: 'Door', id: 'Oleh' },

  // Footer
  'footer.desc': { en: 'Premium Javanese massage services and natural spa wellness products in the Netherlands. Preserving a thousand-year Javanese royal legacy of relaxation and beauty.', nl: 'Premium Javaanse massagediensten en natuurlijke spa-wellnessproducten in Nederland. Behoud van een duizend jaar oud Javaans koninklijk erfgoed van ontspanning en schoonheid.', id: 'Layanan pijat Jawa premium dan produk spa wellness alami di Belanda. Melestarikan warisan kesehatan dan kecantikan keraton Jawa selama seribu tahun.' },
  'footer.hours': { en: 'Opening Hours', nl: 'Openingstijden', id: 'Jam Operasional' },
  'footer.links': { en: 'Useful Paths', nl: 'Handige Links', id: 'Tautan Penting' },
  'footer.rights': { en: 'All Rights Reserved. Traditional Javanese Wisdom.', nl: 'Alle rechten voorbehouden. Traditionele Javaanse Wijsheid.', id: 'Hak Cipta Dilindungi Undang-Undang. Kearifan Tradisional Jawa.' },

  // Admin Section
  'admin.login.title': { en: 'Secure Admin Access', nl: 'Beveiligde Admin Toegang', id: 'Akses Admin Aman' },
  'admin.username': { en: 'Username', nl: 'Gebruikersnaam', id: 'Nama Pengguna' },
  'admin.password': { en: 'Password', nl: 'Wachtwoord', id: 'Kata Sandi' },
  'admin.login.btn': { en: 'Access Sanctum', nl: 'Inloggen', id: 'Masuk Sanctum' },
  'admin.dashboard': { en: 'Admin Sanctum', nl: 'Admin Portaal', id: 'Sanctum Admin' },
  'admin.products': { en: 'Products', nl: 'Producten', id: 'Produk' },
  'admin.blogs': { en: 'Articles', nl: 'Artikelen', id: 'Artikel' },
  'admin.orders': { en: 'WhatsApp Orders', nl: 'WhatsApp Bestellingen', id: 'Pesanan WhatsApp' },
  'admin.seo': { en: 'SEO & Meta Config', nl: 'SEO & Meta Instellingen', id: 'Konfigurasi SEO' },
  'admin.backup': { en: 'Backup Database', nl: 'Database Back-up', id: 'Cadangkan Database' },
  'admin.backup.desc': { en: 'Download the entire live database file (JSON format) directly to your device for instant offline storage and safety.', nl: 'Download het volledige databasebestand (JSON-indeling) direct naar uw apparaat voor offline opslag en veiligheid.', id: 'Unduh seluruh file database langsung (format JSON) langsung ke perangkat Anda untuk penyimpanan offline instan dan aman.' },
  'admin.logout': { en: 'Exit Sanctum', nl: 'Uitloggen', id: 'Keluar' },

  // Reviews
  'reviews.title': { en: 'Words of Healing', nl: 'Woorden van Genezing', id: 'Kata Mereka' },
  'reviews.subtitle': { en: 'Listen to those who found pure tranquility and relaxation with our wellness care', nl: 'Luister naar degenen die pure rust en ontspanning vonden met onze wellnessverzorging', id: 'Dengarkan kisah mereka yang menemukan ketenangan dan kesegaran sejati bersama kami' },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('djamoe_language');
    return (saved === 'en' || saved === 'nl' || saved === 'id' ? saved : 'en') as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('djamoe_language', lang);
  };

  const t = (key: string): string => {
    const item = UI_TRANSLATIONS[key];
    if (!item) return key;
    return item[language] || item['en'] || key;
  };

  const translate = (val: MultilingualString | undefined): string => {
    if (!val) return '';
    return val[language] || val['en'] || '';
  };

  const translateArray = (val: MultilingualArray | undefined): string[] => {
    if (!val) return [];
    return val[language] || val['en'] || [];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translate, translateArray }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
