import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles, Heart, Activity, Coffee, Flame, Calendar, RefreshCw, User, HelpCircle, ArrowRight, ShieldCheck, Check
} from 'lucide-react';

interface WetonResult {
  dayName: string;
  pasaranName: string;
  dayNeptu: number;
  pasaranNeptu: number;
  totalNeptu: number;
  character: string;
  healthRisk: string;
  recommendedJamu: string;
  jamuBenefits: string;
  recommendedSpa: string;
}

export const PrimbonCalculator: React.FC = () => {
  const { t, language } = useLanguage();
  
  // Tabs: Single Calculator vs. Couple Compatibility vs. Auspicious Days Map
  const [activeTab, setActiveTab] = useState<'single' | 'couple' | 'haribaik'>('single');

  // Single Input State
  const [singleName, setSingleName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [singleResult, setSingleResult] = useState<WetonResult | null>(null);

  // Couple Input State
  const [partner1Name, setPartner1Name] = useState('');
  const [partner1Date, setPartner1Date] = useState('');
  const [partner2Name, setPartner2Name] = useState('');
  const [partner2Date, setPartner2Date] = useState('');
  
  interface CoupleResult {
    p1Weton: string;
    p1Neptu: number;
    p2Weton: string;
    p2Neptu: number;
    combinedNeptu: number;
    compatibilityName: string;
    compatibilityMeaning: string;
    compatibilityClass: string;
    remedyRecommendation: string;
  }
  const [coupleResult, setCoupleResult] = useState<CoupleResult | null>(null);

  const [copiedSingle, setCopiedSingle] = useState(false);
  const [copiedCouple, setCopiedCouple] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('weton_tab');
    const wName = params.get('weton_name');
    const wDate = params.get('weton_date');
    const c1Name = params.get('c1_name');
    const c1Date = params.get('c1_date');
    const c2Name = params.get('c2_name');
    const c2Date = params.get('c2_date');

    if (tabParam === 'haribaik') {
      setActiveTab('haribaik');
    } else if (c1Date && c2Date) {
      setActiveTab('couple');
      if (c1Name) setPartner1Name(c1Name);
      setPartner1Date(c1Date);
      if (c2Name) setPartner2Name(c2Name);
      setPartner2Date(c2Date);
      generateCoupleReport(c1Name || 'Partner 1', c1Date, c2Name || 'Partner 2', c2Date);
    } else if (wDate) {
      setActiveTab('single');
      if (wName) setSingleName(wName);
      setBirthDate(wDate);
      generateSingleReport(wName || 'Sobat SR Natural', wDate);
    }
  }, [language]);

  // Constants
  const daysID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const daysEN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysNL = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];

  const daysNeptu = [5, 4, 3, 7, 8, 6, 9]; // Sun=5, Mon=4, Tue=3, Wed=7, Thu=8, Fri=6, Sat=9

  // Pasaran: 0=Wage, 1=Kliwon, 2=Legi, 3=Pahing, 4=Pon (Epoch 1970-01-01 was Kamis Wage)
  const pasaranID = ['Wage', 'Kliwon', 'Legi', 'Pahing', 'Pon'];
  const pasaranNeptu = [4, 8, 5, 9, 7];

  const getDayLabel = (dayIndex: number) => {
    if (language === 'nl') return daysNL[dayIndex];
    if (language === 'en') return daysEN[dayIndex];
    return daysID[dayIndex];
  };

  const getPasaranLabel = (pasaranIndex: number) => {
    return pasaranID[pasaranIndex];
  };

  const calculateWeton = (dateString: string): { dayIndex: number; pasaranIndex: number; dayNeptuVal: number; pasaranNeptuVal: number; totalNeptuVal: number } | null => {
    if (!dateString) return null;
    
    // Create UTC-based timezone independent date computation
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) return null;
    
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);

    const targetTime = Date.UTC(year, month, day);
    const utcDate = new Date(targetTime);
    const dayIndex = utcDate.getUTCDay();

    // Unix epoch reference date: Jan 1, 1970 (Kamis Wage)
    const epochTime = Date.UTC(1970, 0, 1);
    const timeDiff = targetTime - epochTime;
    const daysDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));

    // Modulo arithmetic for negative values (dates before 1970)
    const mod = (n: number, m: number) => ((n % m) + m) % m;
    const pasaranIndex = mod(daysDiff, 5);

    const dayNeptuVal = daysNeptu[dayIndex];
    const pasaranNeptuVal = pasaranNeptu[pasaranIndex];
    const totalNeptuVal = dayNeptuVal + pasaranNeptuVal;

    return {
      dayIndex,
      pasaranIndex,
      dayNeptuVal,
      pasaranNeptuVal,
      totalNeptuVal
    };
  };

  const generateSingleReport = (name: string, dateStr: string) => {
    const calc = calculateWeton(dateStr);
    if (!calc) return;

    const { dayIndex, pasaranIndex, dayNeptuVal, pasaranNeptuVal, totalNeptuVal } = calc;

    const dayName = getDayLabel(dayIndex);
    const pasaranName = getPasaranLabel(pasaranIndex);

    // Multilingual Content Generators
    let character = '';
    let healthRisk = '';
    let recommendedJamu = '';
    let jamuBenefits = '';
    let recommendedSpa = '';

    // Weton details mapping
    if (language === 'id') {
      // Bahasa Indonesia Descriptions
      const dayElements: Record<number, string> = {
        0: 'Langit/Angin (Penuh optimisme, visioner, suka kebebasan)',
        1: 'Bunga/Rembulan (Anggun, artistik, empati tinggi, suka kedamaian)',
        2: 'Api (Penuh semangat, kritis, berani mengambil risiko, dinamis)',
        3: 'Bumi/Daun (Sabar, tenang, pengayom yang baik, stabil)',
        4: 'Awan/Petir (Karisma kuat, mandiri, berwawasan luas, teguh)',
        5: 'Air/Bintang (Spiritual, mencintai harmoni, estetis, penenang jiwa)',
        6: 'Gunung/Tanah (Kokoh, penyabar, pelindung, sangat setia)'
      };

      const pasaranElements: Record<number, string> = {
        0: 'Unsur Logam (Fokus pada detail, kerja keras, analisis mendalam)', // Wage
        1: 'Unsur Air (Spiritualitas tinggi, penyembuh alami, visioner)', // Kliwon
        2: 'Unsur Udara (Intelek, ahli komunikasi, menyukai harmoni sosial)', // Legi
        3: 'Unsur Api (Keberanian luar biasa, ambisius, aktif bergerak)', // Pahing
        4: 'Unsur Bumi (Kepemimpinan kokoh, berwibawa, penyabar)' // Pon
      };

      character = `Dilahirkan pada hari ${dayName} ${pasaranName} dengan Neptu ${totalNeptuVal}. Anda dipengaruhi oleh elemen ${dayElements[dayIndex]} dan ${pasaranElements[pasaranIndex]}. Kombinasi ini melahirkan pribadi yang memiliki kepekaan emosi mendalam, integritas spiritual kuat, serta kehangatan yang memikat orang sekitar. Anda cenderung mandiri dan sangat setia pada komitmen hidup Anda.`;

      if (totalNeptuVal <= 10) {
        healthRisk = 'Cenderung memiliki sirkulasi energi tubuh yang dingin. Rentan terhadap masalah pencernaan lambung, masuk angin, serta ketegangan leher.';
        recommendedJamu = 'Jamu Beras Kencur Khas Kraton';
        jamuBenefits = 'Menghangatkan lambung, meringankan perut kembung, meningkatkan nafsu makan sehat, serta meredakan pegal linu pada persendian.';
        recommendedSpa = 'Java Javanese Warm Herbal Compress Therapy';
      } else if (totalNeptuVal <= 14) {
        healthRisk = 'Memiliki unsur energi yang seimbang namun rentan stres pikiran akibat beban tanggung jawab sosial. Rentan migrain atau ketegangan bahu.';
        recommendedJamu = 'Jamu Kunyit Asam Segar';
        jamuBenefits = 'Membersihkan racun darah (detoks alami), menyegarkan raga, mendinginkan suhu internal tubuh, dan memancarkan aura kecantikan alami (glowing).';
        recommendedSpa = 'Traditional Javanese Royal Lulur & Massage';
      } else {
        healthRisk = 'Energi vitalitas sangat tinggi dan cenderung panas. Rentan mengalami tekanan darah tinggi, insomnia, atau ketegangan otot panggul.';
        recommendedJamu = 'Jamu Temulawak / Jamu Pahit Tradisional';
        jamuBenefits = 'Menjaga kesehatan organ hati (liver), melancarkan metabolisme makro, meredakan inflamasi sendi, serta menyaring racun berat.';
        recommendedSpa = 'Royal Boreh Javanese Healing Scrub & Body Soak';
      }
    } else if (language === 'nl') {
      // Nederlands Descriptions
      const dayElements: Record<number, string> = {
        0: 'Lucht/Wind (Vol optimisme, visionair, houdt van vrijheid)',
        1: 'Bloem/Maan (Elegant, artistiek, hoog empathisch, vreedzaam)',
        2: 'Vuur (Gepassioneerd, kritisch, durft risico te nemen, dynamisch)',
        3: 'Aarde/Blad (Geduldig, kalm, een goede mentor, stabiel)',
        4: 'Wolk/Donder (Sterk charisma, onafhankelijk, breeddenkend, standvastig)',
        5: 'Water/Ster (Spiritueel, houdt van harmonie, esthetisch, rustgevend)',
        6: 'Berg/Grond (Robuust, geduldig, beschermend, zeer loyaal)'
      };

      const pasaranElements: Record<number, string> = {
        0: 'Metaal-element (Focus op detail, harde werker, diepe analyse)', // Wage
        1: 'Water-element (Hoge spiritualiteit, natuurlijke heler, visionair)', // Kliwon
        2: 'Lucht-element (Intellectueel, sterke communicator, sociale harmonie)', // Legi
        3: 'Vuur-element (Buitengewone moed, ambitieus, actieve energie)', // Pahing
        4: 'Aarde-element (Sterk leiderschap, gezag, geduldig)' // Pon
      };

      character = `Geboren op ${dayName} ${pasaranName} met een Neptu-score van ${totalNeptuVal}. Je wordt beïnvloed door het element ${dayElements[dayIndex]} en ${pasaranElements[pasaranIndex]}. Deze combinatie creëert een persoonlijkheid met diepe emotionele gevoeligheid, sterke spirituele integriteit en een natuurlijke warmte die anderen aantrekt. Je bent onafhankelijk en zeer loyaal aan je levenskeuzes.`;

      if (totalNeptuVal <= 10) {
        healthRisk = 'Heeft de neiging tot een koude energiestroom in het lichaam. Gevoelig voor spijsverteringsproblemen, kouvatten en nekspanning.';
        recommendedJamu = 'Koninklijke Beras Kencur Jamu';
        jamuBenefits = 'Verwarmt de maag, verlicht een opgeblazen gevoel, verbetert een gezonde eetlust en verlicht spierpijn in de gewrichten.';
        recommendedSpa = 'Javaanse Warme Kruidenkompres Therapie';
      } else if (totalNeptuVal <= 14) {
        healthRisk = 'Heeft een evenwichtige energie, maar is vatbaar voor mentale stress door een hoog verantwoordelijkheidsgevoel. Gevoelig voor migraine of schouderpijn.';
        recommendedJamu = 'Verse Kunyit Asam Jamu (Kurkuma & Tamarinde)';
        jamuBenefits = 'Zuivert het bloed (natuurlijke detox), verfrist het lichaam, koelt de interne temperatuur en versterkt een gezonde, stralende huid.';
        recommendedSpa = 'Traditionele Javaanse Koninklijke Lulur & Massage';
      } else {
        healthRisk = 'Zeer hoge en vurige vitaliteitsenergie. Gevoelig voor een verhoogde bloeddruk, slapeloosheid of spierspanning in de onderrug.';
        recommendedJamu = 'Temulawak (Javaanse Gember) / Traditionele Pahit Jamu';
        jamuBenefits = 'Ondersteunt de leverfunctie, verbetert het metabolisme, verzacht gewrichtsontstekingen en filtert zware afvalstoffen.';
        recommendedSpa = 'Koninklijke Boreh Javaanse Helende Scrub & Bad';
      }
    } else {
      // English Descriptions
      const dayElements: Record<number, string> = {
        0: 'Sky/Wind (Optimistic, visionary, loves freedom)',
        1: 'Flower/Moon (Elegant, artistic, highly empathetic, peace-loving)',
        2: 'Fire (Passionate, critical, risk-taker, dynamic & active)',
        3: 'Earth/Leaf (Patient, calm, mentor-figure, highly stable)',
        4: 'Cloud/Thunder (Strong charisma, independent, broad-minded, firm)',
        5: 'Water/Star (Spiritual, loves harmony, aesthetic, soothing soul)',
        6: 'Mountain/Soil (Sturdy, patient, protector, extremely loyal)'
      };

      const pasaranElements: Record<number, string> = {
        0: 'Metal element (Focused on detail, hardworking, deep analytics)', // Wage
        1: 'Water element (High spirituality, natural healer, visionary)', // Kliwon
        2: 'Air element (Intellectual, strong communicator, social harmony)', // Legi
        3: 'Fire element (Extraordinary courage, ambitious, active energy)', // Pahing
        4: 'Earth element (Solid leadership, authoritative, patient)' // Pon
      };

      character = `Born on ${dayName} ${pasaranName} with a Neptu score of ${totalNeptuVal}. You are guided by the elements of ${dayElements[dayIndex]} and ${pasaranElements[pasaranIndex]}. This celestial pairing grants you profound emotional sensitivity, strong spiritual integrity, and an authentic warmth that naturally draws people near. You are highly self-reliant and loyal to your commitments.`;

      if (totalNeptuVal <= 10) {
        healthRisk = 'Prone to cold energy circulation. Vulnerable to stomach indigestion, bloating, and neck/shoulder tension.';
        recommendedJamu = 'Royal Beras Kencur Jamu';
        jamuBenefits = 'Warms the stomach, alleviates flatulence, boosts a healthy appetite, and relieves muscle stiffness in the joints.';
        recommendedSpa = 'Java Javanese Warm Herbal Compress Therapy';
      } else if (totalNeptuVal <= 14) {
        healthRisk = 'Balanced vitality but highly prone to psychological stress due to heavy social responsibilities. Prone to migraines or upper back pain.';
        recommendedJamu = 'Fresh Kunyit Asam Jamu (Turmeric Tamarind)';
        jamuBenefits = 'Purifies the blood (natural detox), refreshes the body, cools down internal heat, and enhances radiant skin glowing from within.';
        recommendedSpa = 'Traditional Javanese Royal Lulur & Deep Tissue Massage';
      } else {
        healthRisk = 'Exhibits extremely high and fiery vital energy. Prone to high tension, mild insomnia, or heavy lower back/hip stiffness.';
        recommendedJamu = 'Temulawak (Java Ginger) / Traditional Bitter Jamu';
        jamuBenefits = 'Protects liver health, improves macro-metabolism, reduces joint inflammation, and flushes deep toxins.';
        recommendedSpa = 'Royal Boreh Javanese Healing Scrub & Soaking Ritual';
      }
    }

    setSingleResult({
      dayName,
      pasaranName,
      dayNeptu: dayNeptuVal,
      pasaranNeptu: pasaranNeptuVal,
      totalNeptu: totalNeptuVal,
      character,
      healthRisk,
      recommendedJamu,
      jamuBenefits,
      recommendedSpa
    });
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;
    generateSingleReport(singleName || 'Sobat SR Natural', birthDate);
  };

  const generateCoupleReport = (p1Name: string, p1DateStr: string, p2Name: string, p2DateStr: string) => {
    const p1 = calculateWeton(p1DateStr);
    const p2 = calculateWeton(p2DateStr);

    if (!p1 || !p2) return;

    const p1Label = `${getDayLabel(p1.dayIndex)} ${getPasaranLabel(p1.pasaranIndex)}`;
    const p2Label = `${getDayLabel(p2.dayIndex)} ${getPasaranLabel(p2.pasaranIndex)}`;

    const combinedNeptu = p1.totalNeptuVal + p2.totalNeptuVal;

    // Compatibility Rules Matrix
    let compatibilityName = '';
    let compatibilityMeaning = '';
    let compatibilityClass = '';
    let remedyRecommendation = '';

    if ([19, 27, 36].includes(combinedNeptu)) {
      compatibilityClass = 'text-amber-800 bg-amber-50 border-amber-250';
      if (language === 'id') {
        compatibilityName = 'PEGAT (Penyelarasan)';
        compatibilityMeaning = 'Hubungan berpotensi menghadapi tantangan perbedaan sudut pandang. Kunci kebahagiaan terletak pada komunikasi terbuka dan saling mengalah.';
        remedyRecommendation = 'Terapi Aromaterapi Pasangan Lavender & Cendana untuk meleburkan ketegangan ego.';
      } else if (language === 'nl') {
        compatibilityName = 'PEGAT (Harmonisatie nodig)';
        compatibilityMeaning = 'De relatie kan te maken krijgen met verschillende standpunten. De sleutel tot geluk ligt in open communicatie en wederzijds begrip.';
        remedyRecommendation = 'Lavendel & Sandelhout Aromatherapie voor koppels om ego-spanningen te verlichten.';
      } else {
        compatibilityName = 'PEGAT (Alignment Needed)';
        compatibilityMeaning = 'The relationship may face occasional perspective clashes. The key to happiness lies in open communication and mutual compromise.';
        remedyRecommendation = 'Couple Lavender & Sandalwood Aromatherapy to ease emotional ego blockages.';
      }
    } else if ([18, 26, 34].includes(combinedNeptu)) {
      compatibilityClass = 'text-emerald-850 bg-emerald-50 border-emerald-250';
      if (language === 'id') {
        compatibilityName = 'RATU (Kemakmuran & Wibawa)';
        compatibilityMeaning = 'Hubungan yang sangat disegani, tenang, dan membawa pengaruh berwibawa bagi lingkungan sekitar. Pasangan pembawa rezeki stabil.';
        remedyRecommendation = 'Ritual Royal Boreh Bersama untuk mengunci keharmonisan aura raga berdua.';
      } else if (language === 'nl') {
        compatibilityName = 'RATU (Welvaart & Respect)';
        compatibilityMeaning = 'Een zeer gerespecteerde, rustige relatie die een positieve infloed heeft op de omgeving. Partners die stabiele welvaart aantrekken.';
        remedyRecommendation = 'Gezamenlijke Royal Boreh-ritueel om de harmonie van jullie gezamenlijke aura te bezegelen.';
      } else {
        compatibilityName = 'RATU (Prosperity & Respect)';
        compatibilityMeaning = 'A highly respected, serene partnership that carries a strong, positive presence. Partners who naturally attract stable wealth.';
        remedyRecommendation = 'Shared Royal Javanese Boreh Ritual to lock in absolute wellness and aura harmony.';
      }
    } else if ([17, 25, 33].includes(combinedNeptu)) {
      compatibilityClass = 'text-rose-850 bg-rose-50 border-rose-250';
      if (language === 'id') {
        compatibilityName = 'JODOH (Kecocokan Sejati)';
        compatibilityMeaning = 'Kecocokan murni yang mendalam. Anda berdua mampu saling menerima kekurangan masing-masing secara ikhlas dan penuh kedamaian.';
        remedyRecommendation = 'Ritual Mandi Bunga Mawar Tradisional Javanese Royal Bath untuk mengikat batin.';
      } else if (language === 'nl') {
        compatibilityName = 'JODOH (Ware Match)';
        compatibilityMeaning = 'Pure en diepe compatibiliteit. Jullie kunnen elkaars tekortkomingen oprecht en in vrede accepteren en ondersteunen.';
        remedyRecommendation = 'Traditionele Javaanse Royal Bath met rozenblaadjes om jullie zielsverbinding te vieren.';
      } else {
        compatibilityName = 'JODOH (True Destiny)';
        compatibilityMeaning = 'Profound, effortless compatibility. You are both naturally inclined to accept each other\'s flaws with grace and deep peace.';
        remedyRecommendation = 'Romantic Royal Javanese Flower Bath (Mandi Kembang) to strengthen spiritual connection.';
      }
    } else if ([16, 24, 32].includes(combinedNeptu)) {
      compatibilityClass = 'text-blue-850 bg-blue-50 border-blue-250';
      if (language === 'id') {
        compatibilityName = 'TOPO (Perjuangan Membawa Berkah)';
        compatibilityMeaning = 'Di awal mungkin memerlukan kerja keras membina keselarasan ekonomi/tempat tinggal, namun kelak akan sangat kokoh dan sejahtera.';
        remedyRecommendation = 'Pijat Relaksasi Otot Herbal Pasangan untuk meredakan kelelahan fisik perjuangan raga.';
      } else if (language === 'nl') {
        compatibilityName = 'TOPO (Groei door inspanning)';
        compatibilityMeaning = 'In het begin kan het wat moeite kosten om materiële of spirituele stabiliteit op te bouwen, maar uiteindelijk zal het zeer welvarend zijn.';
        remedyRecommendation = 'Javaanse Kruidenstempel Massage voor koppels om fysieke vermoeidheid te verlichten.';
      } else {
        compatibilityName = 'TOPO (Blessings through Growth)';
        compatibilityMeaning = 'May require patience and shared effort in the early stages of home/economic building, but will mature into an unbreakable, wealthy bond.';
        remedyRecommendation = 'Dual Javanese Herbal Compress Deep Tissue Massage to dissolve physical fatigue.';
      }
    } else if ([15, 23, 31].includes(combinedNeptu)) {
      compatibilityClass = 'text-emerald-850 bg-emerald-50/70 border-emerald-200';
      if (language === 'id') {
        compatibilityName = 'TINARI (Limpahan Keberuntungan)';
        compatibilityMeaning = 'Diberkahi kemudahan finansial dan rezeki yang mengalir lancar dari berbagai penjuru usaha. Kehidupan yang penuh kenyamanan.';
        remedyRecommendation = 'Lulur Kelapa & Boreh Mewah Bersama untuk memancarkan energi kemakmuran raga.';
      } else if (language === 'nl') {
        compatibilityName = 'TINARI (Overvloed van geluk)';
        compatibilityMeaning = 'Gezegend met financieel gemak en welvaart die vanuit verschillende hoeken naar jullie toe stroomt. Een leven vol comfort.';
        remedyRecommendation = 'Gezamenlijke Kokosnoot & Koffie Lulur Scrub om de voorspoed en vitaliteit te vieren.';
      } else {
        compatibilityName = 'TINARI (Continuous Fortune)';
        compatibilityMeaning = 'Blessed with financial ease and smooth wealth-generation. Life is filled with luxury, comfortable homes, and peaceful endeavors.';
        remedyRecommendation = 'Luxury Coconut & Coffee Body Scrub together to stimulate prosperity and body radiance.';
      }
    } else if ([22, 30].includes(combinedNeptu)) {
      compatibilityClass = 'text-amber-850 bg-amber-50/60 border-amber-200';
      if (language === 'id') {
        compatibilityName = 'PADU (Cinta dalam Perdebatan)';
        compatibilityMeaning = 'Kerap mengalami perdebatan kecil yang hangat namun dinamis. Rasa cinta yang besar membuat percekcokan cepat reda dan merekatkan hubungan.';
        remedyRecommendation = 'Terapi Pijat Kepala & Wajah (Javanese Scalp Massage) penenang saraf pikiran berdua.';
      } else if (language === 'nl') {
        compatibilityName = 'PADU (Passievolle discussies)';
        compatibilityMeaning = 'Vaker kleine discussies die dynamisch zijn, maar de liefde is groot genoeg om ruzies snel op te lossen en de band te versterken.';
        remedyRecommendation = 'Kalmerende Javaanse Hoofdmassage voor beide partners om de geest te ontspannen.';
      } else {
        compatibilityName = 'PADU (Spirited Banter)';
        compatibilityMeaning = 'Prone to frequent, small, passionate debates. However, your underlying love is immense, keeping friction short-lived and bonding you closer.';
        remedyRecommendation = 'Deep Scalp & Head Massages together to cool down active mental frequencies.';
      }
    } else if ([21, 29].includes(combinedNeptu)) {
      compatibilityClass = 'text-amber-800 bg-amber-50 border-amber-250';
      if (language === 'id') {
        compatibilityName = 'SUJANAN (Ujian Kesetiaan)';
        compatibilityMeaning = 'Memerlukan rasa saling percaya yang ekstra tinggi untuk menjaga keutuhan batin. Keterbukaan tanpa rahasia adalah tameng terbaik.';
        remedyRecommendation = 'Meditasi Keselarasan Nafas & Spa Rerempahan Tradisional untuk membersihkan vibrasi negatif.';
      } else if (language === 'nl') {
        compatibilityName = 'SUJANAN (Overtuiging & Vertrouwen)';
        compatibilityMeaning = 'Vereist extra vertrouwen om de innerlijke band te behouden. Openheid zonder geheimen is de beste bescherming voor jullie liefde.';
        remedyRecommendation = 'Gezamenlijke Ademhalingsmeditatie & Traditionele Kruiden Spa om negatieve vibraties te reinigen.';
      } else {
        compatibilityName = 'SUJANAN (Trust & Truth)';
        compatibilityMeaning = 'Requires high mutual trust and absolute transparency to shield your emotional bond. Honesty is your strongest protection.';
        remedyRecommendation = 'Harmonizing Breath Meditation & Traditional Herbal Cleansing Spa to purge static vibrations.';
      }
    } else {
      // Default: Pesthi (14, 20, 28, 35)
      compatibilityClass = 'text-emerald-850 bg-emerald-50 border-emerald-250';
      if (language === 'id') {
        compatibilityName = 'PESTHI (Kedamaian Abadi)';
        compatibilityMeaning = 'Kehidupan rumah tangga yang sangat tenang, damai, rukun tanpa gejolak berarti. Masa tua yang bahagia menanti Anda berdua.';
        remedyRecommendation = 'Ritual Spa Tradisional Kraton Jogja / Javanese Lulur Sutra berpasangan.';
      } else if (language === 'nl') {
        compatibilityName = 'PESTHI (Eeuwige Vrede)';
        compatibilityMeaning = 'Een zeer rustig, vreedzaam dan wel harmonieus gezinsleven zonder noemenswaardige onrust. Een gelukkige toekomst wacht op jullie.';
        remedyRecommendation = 'Traditionele Kraton Spa-ritueel & Javaanse Lulur voor koppels.';
      } else {
        compatibilityName = 'PESTHI (Eternal Serenity)';
        compatibilityMeaning = 'A exceptionally tranquil, peaceful, and balanced life together. Minimal drama and maximum lifetime harmony. A beautiful journey awaits.';
        remedyRecommendation = 'Royal Javanese Kraton Spa Ritual & Silk Lulur Treatment for couples.';
      }
    }

    setCoupleResult({
      p1Weton: p1Label,
      p1Neptu: p1.totalNeptuVal,
      p2Weton: p2Label,
      p2Neptu: p2.totalNeptuVal,
      combinedNeptu,
      compatibilityName,
      compatibilityMeaning,
      compatibilityClass,
      remedyRecommendation
    });
  };

  const handleCoupleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner1Date || !partner2Date) return;
    generateCoupleReport(partner1Name || 'Partner 1', partner1Date, partner2Name || 'Partner 2', partner2Date);
  };

  const resetSingle = () => {
    setSingleName('');
    setBirthDate('');
    setSingleResult(null);
  };

  const resetCouple = () => {
    setPartner1Name('');
    setPartner1Date('');
    setPartner2Name('');
    setPartner2Date('');
    setCoupleResult(null);
  };

  const generateAuspiciousDays = (birthNeptu?: number) => {
    const days = [];
    const baseDate = new Date(); // Starts today
    
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date();
      nextDate.setDate(baseDate.getDate() + i);
      
      const yyyy = nextDate.getFullYear();
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dd = String(nextDate.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;
      
      const calc = calculateWeton(dateString);
      if (calc) {
        const { dayIndex, pasaranIndex, totalNeptuVal } = calc;
        const dayLabel = getDayLabel(dayIndex);
        const pasaranLabel = getPasaranLabel(pasaranIndex);
        const wetonName = `${dayLabel} ${pasaranLabel}`;
        
        // Javanese compatibility logic
        let rawScore = totalNeptuVal;
        if (birthNeptu) {
          rawScore = birthNeptu + totalNeptuVal;
        }
        
        const cycleIndex = rawScore % 5; // 0=Pati, 1=Sandang, 2=Pangan, 3=Gedhong, 4=Loro
        
        let status: 'highly_auspicious' | 'auspicious' | 'neutral' | 'cautious' = 'neutral';
        let statusLabelID = '';
        let statusLabelEN = '';
        let statusLabelNL = '';
        let recommendationID = '';
        let recommendationEN = '';
        let recommendationNL = '';
        let icon = '✨';
        
        if (cycleIndex === 1) { // Sandang
          status = 'highly_auspicious';
          statusLabelID = 'Sangat Baik (Sandang)';
          statusLabelEN = 'Highly Auspicious (Sandang)';
          statusLabelNL = 'Zeer Gunstig (Sandang)';
          recommendationID = 'Sangat baik untuk memulai diet jamu baru, negosiasi bisnis, dan terapi kebugaran.';
          recommendationEN = 'Excellent for initiating new herbal diets, business negotiations, and active fitness.';
          recommendationNL = 'Uitstekend voor het starten van een nieuw jamu-dieet, zakelijke deals en fitness.';
          icon = '💰';
        } else if (cycleIndex === 2) { // Pangan
          status = 'highly_auspicious';
          statusLabelID = 'Sangat Baik (Pangan)';
          statusLabelEN = 'Highly Auspicious (Pangan)';
          statusLabelNL = 'Zeer Gunstig (Pangan)';
          recommendationID = 'Hari terbaik untuk menikmati Jamu Kunyit Asam hangat dan melakukan perawatan Royal Lulur.';
          recommendationEN = 'Best day to indulge in warm Turmeric Tamarind Jamu and enjoy a Royal Lulur scrub treatment.';
          recommendationNL = 'Beste dag om te genieten van warme Kunyit Asam Jamu en een Royal Lulur scrub.';
          icon = '🌾';
        } else if (cycleIndex === 3) { // Gedhong
          status = 'auspicious';
          statusLabelID = 'Baik (Gedhong)';
          statusLabelEN = 'Auspicious (Gedhong)';
          statusLabelNL = 'Gunstig (Gedhong)';
          recommendationID = 'Aura kemakmuran sedang tinggi. Cocok untuk meditasi ketenangan batin dan pijat relaksasi.';
          recommendationEN = 'Prosperity aura is high. Great for deep peace meditation and restorative massage.';
          recommendationNL = 'Voorspoedige aura is sterk. Geweldig voor diepe meditatie en ontspannende massage.';
          icon = '🏛️';
        } else if (cycleIndex === 4) { // Loro
          status = 'cautious';
          statusLabelID = 'Pemulihan Raga (Loro)';
          statusLabelEN = 'Physical Recovery (Loro)';
          statusLabelNL = 'Lichamelijk Herstel (Loro)';
          recommendationID = 'Waspada kelelahan fisik. Sangat disarankan beristirahat total, pijat kompres hangat, minum Beras Kencur.';
          recommendationEN = 'Beware of physical fatigue. Highly recommended to rest, take warm compress massage, and sip Beras Kencur.';
          recommendationNL = 'Pas op voor fysieke vermoeidheid. Rust goed uit, neem warme kompressen en drink Beras Kencur.';
          icon = '💆';
        } else { // Pati
          status = 'neutral';
          statusLabelID = 'Kontemplasi (Pati)';
          statusLabelEN = 'Spiritual Introspection (Pati)';
          statusLabelNL = 'Spirituele Bezinning (Pati)';
          recommendationID = 'Kurangi aktivitas berisiko tinggi. Sempurna untuk yoga ringan, mandi kembang, dan minum Temulawak hangat.';
          recommendationEN = 'Avoid high-risk ventures. Perfect for gentle yoga, flower bath ritual, and drinking warm Temulawak.';
          recommendationNL = 'Vermijd risicovolle stappen. Perfect voor zachte yoga, bloemenbadritueel en warme Temulawak.';
          icon = '🧘';
        }
        
        days.push({
          date: nextDate.toLocaleDateString(language === 'id' ? 'id-ID' : language === 'nl' ? 'nl-NL' : 'en-US', { day: 'numeric', month: 'short' }),
          weekday: nextDate.toLocaleDateString(language === 'id' ? 'id-ID' : language === 'nl' ? 'nl-NL' : 'en-US', { weekday: 'long' }),
          wetonName,
          totalNeptu: totalNeptuVal,
          status,
          statusLabel: language === 'id' ? statusLabelID : language === 'nl' ? statusLabelNL : statusLabelEN,
          recommendation: language === 'id' ? recommendationID : language === 'nl' ? recommendationNL : recommendationEN,
          icon
        });
      }
    }
    return days;
  };

  return (
    <div className="bg-white border border-gold/20 rounded-3xl p-6 sm:p-8 md:p-10 luxury-shadow space-y-6" id="primbon-jawa-calculator">
      
      {/* Header Info */}
      <div className="text-center space-y-2 border-b border-gold/15 pb-6">
        <div className="inline-flex items-center justify-center space-x-2 bg-gold/10 text-gold-dark px-4 py-1.5 rounded-full border border-gold/20">
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold">
            {language === 'id' ? 'Hiburan Tradisional' : language === 'nl' ? 'Traditioneel Vermaak' : 'Traditional Entertainment'}
          </span>
        </div>
        <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-royal-green">
          {language === 'id' ? 'Kitab Primbon & Weton Jawa' : language === 'nl' ? 'Boek van Javaanse Primbon & Weton' : 'Sacred Javanese Primbon & Weton'}
        </h3>
        <p className="text-xs text-royal-green/70 font-light max-w-2xl mx-auto leading-relaxed">
          {language === 'id' 
            ? 'Temukan weton kelahiran Anda, neptu, kecocokan pasangan, serta ramalan kecenderungan kesehatan fisik & rekomendasi jamu herbal penyeimbang aura alami raga Anda.'
            : language === 'nl'
            ? 'Ontdek je Javaanse geboorte-weton, neptu-score, relatiecompatibiliteit, en ontvang holistische gezondheidsprognoses en traditionele jamu-aanbevelingen.'
            : 'Unveil your Javanese birth weton, neptu strength, relationship compatibility, and discover personalized traditional holistic Javanese remedies and herbal Jamu advice.'}
        </p>

        {/* Tab Toggle Buttons */}
        <div className="flex justify-center mt-4">
          <div className="flex flex-wrap justify-center bg-cream p-1 rounded-full border border-gold/15 gap-1">
            <button
              onClick={() => { setActiveTab('single'); }}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                activeTab === 'single' ? 'bg-royal-green text-cream shadow-md' : 'text-royal-green/70 hover:text-royal-green'
              }`}
            >
              {language === 'id' ? 'Cek Weton & Kesehatan' : language === 'nl' ? 'Check Weton & Welzijn' : 'Check Weton & Wellness'}
            </button>
            <button
              onClick={() => { setActiveTab('couple'); }}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                activeTab === 'couple' ? 'bg-royal-green text-cream shadow-md' : 'text-royal-green/70 hover:text-royal-green'
              }`}
            >
              {language === 'id' ? 'Kecocokan Jodoh' : language === 'nl' ? 'Relatie Match' : 'Couple Compatibility'}
            </button>
            <button
              onClick={() => { setActiveTab('haribaik'); }}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-serif font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                activeTab === 'haribaik' ? 'bg-royal-green text-cream shadow-md' : 'text-royal-green/70 hover:text-royal-green'
              }`}
              id="tab-peta-hari-baik"
            >
              <Sparkles className="w-3 h-3 text-gold" />
              <span>{language === 'id' ? 'Peta Hari Baik' : language === 'nl' ? 'Gunstige Dagen' : 'Auspicious Days Map'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SINGLE CALCULATOR TAB */}
      {activeTab === 'single' && (
        <div className="space-y-6">
          {!singleResult ? (
            <form onSubmit={handleSingleSubmit} className="max-w-xl mx-auto space-y-4 bg-cream/20 border border-gold/10 p-6 rounded-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest text-royal-green uppercase font-bold block mb-1">
                    {language === 'id' ? 'Nama Lengkap Anda' : language === 'nl' ? 'Jouw Volledige Naam' : 'Your Full Name'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-royal-green/30 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={singleName}
                      onChange={e => setSingleName(e.target.value)}
                      placeholder="e.g., Kartini"
                      className="w-full bg-white border border-gold/25 focus:border-gold rounded-xl pl-10 pr-4 py-2.5 text-xs text-royal-green focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono tracking-widest text-royal-green uppercase font-bold block mb-1">
                    {language === 'id' ? 'Tanggal Lahir Anda' : language === 'nl' ? 'Geboortedatum' : 'Date of Birth'}
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-royal-green/30 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="date"
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                      className="w-full bg-white border border-gold/25 focus:border-gold rounded-xl pl-10 pr-4 py-2.5 text-xs text-royal-green focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shortcut Buttons / Tombol Pintasan */}
              <div className="space-y-1.5 pb-1">
                <span className="text-[9px] font-mono text-royal-green/60 uppercase font-bold tracking-wider block">
                  {language === 'id' ? '⚡ Pintasan Weton Lahir:' : language === 'nl' ? '⚡ Snelle Weton Selectie:' : '⚡ Quick Weton Select:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSingleName(language === 'id' ? 'Sobat SR Natural' : 'SR Natural Guest');
                      const today = new Date();
                      const yyyy = today.getFullYear();
                      const mm = String(today.getMonth() + 1).padStart(2, '0');
                      const dd = String(today.getDate()).padStart(2, '0');
                      setBirthDate(`${yyyy}-${mm}-${dd}`);
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold-dark hover:bg-gold/25 transition-all font-mono cursor-pointer flex items-center space-x-1"
                  >
                    <span>📅</span>
                    <span>{language === 'id' ? 'Hari Ini (Today)' : language === 'nl' ? 'Vandaag' : 'Today'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSingleName('R.A. Kartini');
                      setBirthDate('1879-04-21');
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-royal-green/5 border border-royal-green/10 text-royal-green/80 hover:bg-royal-green/10 transition-all font-mono cursor-pointer flex items-center space-x-1"
                  >
                    <span>👩</span>
                    <span>Kartini (21 Apr 1879)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSingleName('Ir. Soekarno');
                      setBirthDate('1901-06-06');
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-royal-green/5 border border-royal-green/10 text-royal-green/80 hover:bg-royal-green/10 transition-all font-mono cursor-pointer flex items-center space-x-1"
                  >
                    <span>🇮🇩</span>
                    <span>Soekarno (6 Jun 1901)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSingleName('K.H. Dewantara');
                      setBirthDate('1889-05-02');
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-royal-green/5 border border-royal-green/10 text-royal-green/80 hover:bg-royal-green/10 transition-all font-mono cursor-pointer flex items-center space-x-1"
                  >
                    <span>🎓</span>
                    <span>Ki Hajar (2 Mei 1889)</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-royal-green hover:bg-leaf-green text-cream hover:text-gold font-bold text-xs tracking-widest uppercase rounded-full transition-all duration-300 shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Activity className="w-4 h-4" />
                <span>{language === 'id' ? 'Buka Tabir Primbon Saya' : language === 'nl' ? 'Open Mijn Weton Geheimen' : 'Reveal My Weton Wellness'}</span>
              </button>
            </form>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Result display */}
              <div className="bg-cream/35 border border-gold/20 p-6 sm:p-8 rounded-2xl space-y-6">
                
                {/* Weton Header Banner */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gold/15 pb-4 gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] font-mono text-gold-dark font-bold tracking-widest uppercase">
                      {language === 'id' ? 'Weton Kelahiran' : language === 'nl' ? 'Jouw Geboorte Weton' : 'Your Birth Weton'}
                    </span>
                    <h4 className="font-serif text-2xl sm:text-3xl font-bold text-royal-green mt-1">
                      {singleResult.dayName} {singleResult.pasaranName}
                    </h4>
                  </div>
                  
                  {/* Neptu Score Card */}
                  <div className="bg-royal-green text-cream px-6 py-2.5 rounded-2xl border border-gold/35 text-center">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-gold/80">Neptu</div>
                    <div className="text-2xl font-bold font-serif text-gold">{singleResult.totalNeptu}</div>
                    <div className="text-[9px] text-cream/70 font-sans mt-0.5">
                      ({singleResult.dayNeptu} + {singleResult.pasaranNeptu})
                    </div>
                  </div>
                </div>

                {/* Grid for Detailed Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Character Profile */}
                  <div className="space-y-3 bg-white p-5 rounded-xl border border-gold/10 shadow-sm">
                    <div className="flex items-center space-x-2 text-royal-green border-b border-gold/5 pb-2">
                      <User className="w-4 h-4 text-gold-dark" />
                      <h5 className="font-serif font-bold text-xs uppercase tracking-wider">
                        {language === 'id' ? 'Karakter & Watak' : language === 'nl' ? 'Karakter & Eigenschappen' : 'Character & Personality'}
                      </h5>
                    </div>
                    <p className="text-xs text-royal-green/85 leading-relaxed font-light font-sans">
                      {singleResult.character}
                    </p>
                  </div>

                  {/* Right Column: Health Risk & Physical Vulnerabilities */}
                  <div className="space-y-3 bg-white p-5 rounded-xl border border-gold/10 shadow-sm">
                    <div className="flex items-center space-x-2 text-royal-green border-b border-gold/5 pb-2">
                      <Activity className="w-4 h-4 text-gold-dark" />
                      <h5 className="font-serif font-bold text-xs uppercase tracking-wider">
                        {language === 'id' ? 'Kecenderungan Kesehatan' : language === 'nl' ? 'Gezondheidsrisico\'s' : 'Wellness & Health Vulnerability'}
                      </h5>
                    </div>
                    <p className="text-xs text-royal-green/85 leading-relaxed font-light font-sans">
                      {singleResult.healthRisk}
                    </p>
                  </div>

                </div>

                {/* Recommendations Banner (Direct Link to Spa Theme!) */}
                <div className="bg-royal-green border border-gold/30 p-5 rounded-2xl text-cream grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Jamu Recommendation */}
                  <div className="md:col-span-6 space-y-2">
                    <div className="flex items-center space-x-2 text-gold">
                      <Coffee className="w-4 h-4" />
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                        {language === 'id' ? 'RAMUAN JAMU PENYEIMBANG' : language === 'nl' ? 'AANBEVOLEN KRUIDENDRANK' : 'RECOMMENDED JAMU BOTANICAL'}
                      </span>
                    </div>
                    <h6 className="font-serif text-base sm:text-lg font-bold text-gold">
                      {singleResult.recommendedJamu}
                    </h6>
                    <p className="text-xs text-cream/80 font-light leading-relaxed">
                      {singleResult.jamuBenefits}
                    </p>
                  </div>

                  {/* Spa Treatment Recommendation */}
                  <div className="md:col-span-6 space-y-2 md:border-l md:border-cream/20 md:pl-6">
                    <div className="flex items-center space-x-2 text-gold">
                      <Flame className="w-4 h-4" />
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                        {language === 'id' ? 'REKOMENDASI TERAPI SPA KRATON' : language === 'nl' ? 'AANBEVOLEN SPA TREATMENT' : 'RECOMMENDED ROYAL SPA SESSION'}
                      </span>
                    </div>
                    <h6 className="font-serif text-base sm:text-lg font-bold text-gold">
                      {singleResult.recommendedSpa}
                    </h6>
                    <p className="text-xs text-cream/80 font-light leading-relaxed">
                      {language === 'id'
                        ? 'Didesain khusus untuk mengharmoniskan unsur elemen mikro tubuh Anda berdasarkan perhitungan neptu & elemen primbon guna membuang aura negatif raga.'
                        : language === 'nl'
                        ? 'Speciaal ontworpen om uw micro-lichaamselementen te harmoniseren op basis van uw neptu-berekening en negatieve vibraties te verdrijven.'
                        : 'Custom designed to balance your micro-physical elements based on Javanese cosmic mathematics, restoring spiritual alignment.'}
                    </p>
                  </div>

                </div>

                {/* Reset & Share buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const shareUrl = `${window.location.origin}${window.location.pathname}?weton_tab=single&weton_name=${encodeURIComponent(singleName || 'Sobat SR Natural')}&weton_date=${encodeURIComponent(birthDate)}`;
                      navigator.clipboard.writeText(shareUrl).then(() => {
                        setCopiedSingle(true);
                        setTimeout(() => setCopiedSingle(false), 2500);
                      });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gold hover:bg-gold-light text-royal-green text-xs font-serif font-bold tracking-wider uppercase rounded-full transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md border border-gold/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {copiedSingle ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-royal-green animate-bounce" />
                        <span>{language === 'id' ? 'Tautan Berhasil Disalin!' : language === 'nl' ? 'Link Gekopieerd!' : 'Link Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-royal-green" />
                        <span>{language === 'id' ? 'Bagikan Hasil Weton (Salin Link)' : language === 'nl' ? 'Deel Resultaat (Kopieer Link)' : 'Share Results (Copy Link)'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={resetSingle}
                    className="w-full sm:w-auto px-5 py-2.5 bg-royal-green/10 hover:bg-royal-green/20 border border-royal-green/15 text-royal-green text-xs font-serif font-bold tracking-wider uppercase rounded-full transition-all cursor-pointer"
                  >
                    {language === 'id' ? 'Hitung Tanggal Lain' : language === 'nl' ? 'Bereken Andere Datum' : 'Check Another Date'}
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      )}

      {/* COUPLE CALCULATOR TAB */}
      {activeTab === 'couple' && (
        <div className="space-y-6">
          {!coupleResult ? (
            <form onSubmit={handleCoupleSubmit} className="max-w-2xl mx-auto bg-cream/20 border border-gold/10 p-6 rounded-2xl space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Partner 1 Info */}
                <div className="space-y-3 p-4 bg-white rounded-xl border border-gold/10">
                  <h5 className="text-[10px] font-mono tracking-widest text-gold-dark uppercase font-bold border-b border-gold/5 pb-1">
                    {language === 'id' ? 'Partner Pertama' : language === 'nl' ? 'Eerste Partner' : 'First Partner'}
                  </h5>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] font-mono text-royal-green/60 uppercase font-bold block mb-1">Nama</label>
                      <input
                        type="text"
                        value={partner1Name}
                        onChange={e => setPartner1Name(e.target.value)}
                        placeholder="e.g., Rama"
                        className="w-full bg-cream/10 border border-gold/25 focus:border-gold rounded-lg px-3 py-2 text-xs text-royal-green focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-royal-green/60 uppercase font-bold block mb-1">Tanggal Lahir</label>
                      <input
                        type="date"
                        value={partner1Date}
                        onChange={e => setPartner1Date(e.target.value)}
                        className="w-full bg-cream/10 border border-gold/25 focus:border-gold rounded-lg px-3 py-2 text-xs text-royal-green focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Partner 2 Info */}
                <div className="space-y-3 p-4 bg-white rounded-xl border border-gold/10">
                  <h5 className="text-[10px] font-mono tracking-widest text-gold-dark uppercase font-bold border-b border-gold/5 pb-1">
                    {language === 'id' ? 'Partner Kedua' : language === 'nl' ? 'Tweede Partner' : 'Second Partner'}
                  </h5>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] font-mono text-royal-green/60 uppercase font-bold block mb-1">Nama</label>
                      <input
                        type="text"
                        value={partner2Name}
                        onChange={e => setPartner2Name(e.target.value)}
                        placeholder="e.g., Shinta"
                        className="w-full bg-cream/10 border border-gold/25 focus:border-gold rounded-lg px-3 py-2 text-xs text-royal-green focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-royal-green/60 uppercase font-bold block mb-1">Tanggal Lahir</label>
                      <input
                        type="date"
                        value={partner2Date}
                        onChange={e => setPartner2Date(e.target.value)}
                        className="w-full bg-cream/10 border border-gold/25 focus:border-gold rounded-lg px-3 py-2 text-xs text-royal-green focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Shortcut Buttons / Tombol Pintasan */}
              <div className="space-y-1.5 pb-1">
                <span className="text-[9px] font-mono text-royal-green/60 uppercase font-bold tracking-wider block">
                  {language === 'id' ? '⚡ Pintasan Pasangan Mitologi Jawa:' : language === 'nl' ? '⚡ Snelle Javaanse Paren:' : '⚡ Quick Javanese Couples:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setPartner1Name('Rama');
                      setPartner1Date('1985-04-12');
                      setPartner2Name('Shinta');
                      setPartner2Date('1988-08-18');
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-850 hover:bg-rose-100 transition-all font-mono cursor-pointer flex items-center space-x-1"
                  >
                    <span>🏹</span>
                    <span>Rama & Shinta</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPartner1Name('B. Bondowoso');
                      setPartner1Date('1987-03-05');
                      setPartner2Name('Roro Jonggrang');
                      setPartner2Date('1990-11-21');
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-850 hover:bg-amber-100 transition-all font-mono cursor-pointer flex items-center space-x-1"
                  >
                    <span>🏰</span>
                    <span>Bondowoso & Jonggrang</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPartner1Name('Panji Asmorobangun');
                      setPartner1Date('1991-01-22');
                      setPartner2Name('Dewi Sekartaji');
                      setPartner2Date('1993-10-09');
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-teal-50 border border-teal-250 text-teal-850 hover:bg-teal-100 transition-all font-mono cursor-pointer flex items-center space-x-1"
                  >
                    <span>🎭</span>
                    <span>Panji & Sekartaji</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-royal-green hover:bg-leaf-green text-cream hover:text-gold font-bold text-xs tracking-widest uppercase rounded-full transition-all duration-300 shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-gold-dark" />
                <span>{language === 'id' ? 'Hitung Kecocokan Jodoh Kami' : language === 'nl' ? 'Bereken Onze Compatibiliteit' : 'Analyze Our Relationship Match'}</span>
              </button>
            </form>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-cream/35 border border-gold/20 p-6 sm:p-8 rounded-2xl space-y-6">
                
                {/* Partner comparison row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center justify-between text-center border-b border-gold/15 pb-6 gap-4">
                  
                  {/* Partner 1 Summary */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-royal-green/50 uppercase font-bold tracking-wider">
                      {partner1Name || 'Partner 1'}
                    </span>
                    <h5 className="font-serif text-lg font-bold text-royal-green">{coupleResult.p1Weton}</h5>
                    <span className="inline-block text-[10px] font-mono bg-white px-2.5 py-0.5 rounded-full border border-gold/10 text-royal-green/70">
                      Neptu {coupleResult.p1Neptu}
                    </span>
                  </div>

                  {/* Combined heart score badge */}
                  <div className="flex flex-col items-center justify-center py-2">
                    <div className="relative">
                      <Heart className="w-14 h-14 text-rose-650 fill-rose-100" />
                      <span className="absolute inset-0 flex items-center justify-center font-serif text-lg font-bold text-rose-750">
                        {coupleResult.combinedNeptu}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-stone-500 uppercase mt-2">Combined Neptu</span>
                  </div>

                  {/* Partner 2 Summary */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-royal-green/50 uppercase font-bold tracking-wider">
                      {partner2Name || 'Partner 2'}
                    </span>
                    <h5 className="font-serif text-lg font-bold text-royal-green">{coupleResult.p2Weton}</h5>
                    <span className="inline-block text-[10px] font-mono bg-white px-2.5 py-0.5 rounded-full border border-gold/10 text-royal-green/70">
                      Neptu {coupleResult.p2Neptu}
                    </span>
                  </div>

                </div>

                {/* Compatibility Outcome Card */}
                <div className={`p-6 rounded-2xl border text-center space-y-3 ${coupleResult.compatibilityClass}`}>
                  <div className="inline-flex items-center space-x-2 border-b border-current pb-1 mb-1">
                    <Sparkles className="w-4 h-4 text-gold-dark" />
                    <h4 className="font-serif text-xl font-bold tracking-wide">
                      {coupleResult.compatibilityName}
                    </h4>
                  </div>
                  <p className="text-sm max-w-xl mx-auto leading-relaxed font-light">
                    {coupleResult.compatibilityMeaning}
                  </p>
                </div>

                {/* Royal Treatment Therapy recommendation to heal or celebrate */}
                <div className="bg-white border border-gold/15 p-5 rounded-xl space-y-3 shadow-sm">
                  <div className="flex items-center space-x-2 text-royal-green">
                    <ShieldCheck className="w-4 h-4 text-gold-dark" />
                    <h5 className="font-serif font-bold text-xs uppercase tracking-wider">
                      {language === 'id' ? 'Terapi Penyeimbang Hubungan Kraton' : language === 'nl' ? 'Aanbevolen Balancerende Therapie' : 'Javanese Relationship Harmonization Therapy'}
                    </h5>
                  </div>
                  <p className="text-xs text-royal-green/85 leading-relaxed font-light font-sans">
                    {language === 'id' 
                      ? `Berdasarkan kitab primbon, pasangan Anda sangat disarankan untuk menjalani:`
                      : language === 'nl'
                      ? `Op basis van de primbon-geschriften wordt het ten zeerste aanbevolen om te ondergaan:`
                      : `Based on sacred primbon alignment, your partnership would flourish immensely by partaking in:`}
                  </p>
                  <div className="flex items-start space-x-2 bg-cream/20 p-3 rounded-lg border border-gold/10">
                    <span className="text-gold-dark font-serif text-sm mr-1">✦</span>
                    <span className="text-xs text-royal-green font-medium font-serif leading-normal">
                      {coupleResult.remedyRecommendation}
                    </span>
                  </div>
                </div>

                {/* Reset & Share buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const shareUrl = `${window.location.origin}${window.location.pathname}?c1_name=${encodeURIComponent(partner1Name || 'Partner 1')}&c1_date=${encodeURIComponent(partner1Date)}&c2_name=${encodeURIComponent(partner2Name || 'Partner 2')}&c2_date=${encodeURIComponent(partner2Date)}`;
                      navigator.clipboard.writeText(shareUrl).then(() => {
                        setCopiedCouple(true);
                        setTimeout(() => setCopiedCouple(false), 2500);
                      });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gold hover:bg-gold-light text-royal-green text-xs font-serif font-bold tracking-wider uppercase rounded-full transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md border border-gold/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {copiedCouple ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-royal-green animate-bounce" />
                        <span>{language === 'id' ? 'Tautan Berhasil Disalin!' : language === 'nl' ? 'Link Gekopieerd!' : 'Link Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-3.5 h-3.5 text-royal-green" />
                        <span>{language === 'id' ? 'Bagikan Hasil Jodoh (Salin Link)' : language === 'nl' ? 'Deel Match (Kopieer Link)' : 'Share Match (Copy Link)'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={resetCouple}
                    className="w-full sm:w-auto px-5 py-2.5 bg-royal-green/10 hover:bg-royal-green/20 border border-royal-green/15 text-royal-green text-xs font-serif font-bold tracking-wider uppercase rounded-full transition-all cursor-pointer"
                  >
                    {language === 'id' ? 'Cek Kecocokan Lain' : language === 'nl' ? 'Bereken Andere Match' : 'Check Another Couple'}
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      )}

      {/* AUSPICIOUS DAYS MAP TAB (PETA HARI BAIK) */}
      {activeTab === 'haribaik' && (
        <div className="space-y-6 animate-fade-in" id="peta-hari-baik-section">
          
          {/* Legend and Intro */}
          <div className="bg-cream/35 border border-gold/25 p-5 sm:p-6 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2 text-royal-green border-b border-gold/15 pb-2">
              <Sparkles className="w-5 h-5 text-gold-dark" />
              <h4 className="font-serif font-bold text-sm uppercase tracking-wider">
                {language === 'id' ? 'Sistem Hari Baik Javanese Primbon' : language === 'nl' ? 'Javaans Gunstig Dagensysteem' : 'Javanese Auspicious Days Almanac'}
              </h4>
            </div>
            
            <p className="text-xs text-royal-green/80 leading-relaxed font-light">
              {language === 'id'
                ? 'Dalam tradisi Jawa, kecocokan energi hari dihitung menggunakan perputaran Pancawara (Pasaran) dan Saptawara (Hari). Siklus "Sandang, Pangan, Gedhong, Loro, Pati" menunjukkan bagaimana alam memancarkan getaran selaras bagi tubuh, pikiran, dan rezeki Anda.'
                : language === 'nl'
                ? 'In de Javaanse traditie wordt de energie van een dag berekend met de cyclus van de Pancawara (Pasaran) en Saptawara (Weekdagen). De cyclus "Sandang, Pangan, Gedhong, Loro, Pati" laat zien hoe de natuur harmonieuze vibraties uitstraalt voor uw lichaam en welvaart.'
                : 'In Javanese tradition, daily cosmic energy is computed using the combined cycles of Pancawara (Pasaran) and Saptawara (Weekdays). The cyclical sequence "Sandang, Pangan, Gedhong, Loro, Pati" dictates how nature radiates harmonious vibrations for your mind, body, and wealth.'}
            </p>

            {/* Visual Legend */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 pt-2">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-xs">💰</span>
                <div className="text-[10px] font-serif font-bold text-emerald-800 mt-1">Sandang</div>
                <div className="text-[8px] text-emerald-700/80 font-mono uppercase mt-0.5">{language === 'id' ? 'Sangat Baik' : 'Highly Good'}</div>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-250 rounded-xl text-center">
                <span className="text-xs">🌾</span>
                <div className="text-[10px] font-serif font-bold text-emerald-850 mt-1">Pangan</div>
                <div className="text-[8px] text-emerald-700/80 font-mono uppercase mt-0.5">{language === 'id' ? 'Sangat Baik' : 'Highly Good'}</div>
              </div>
              <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-center">
                <span className="text-xs">🏛️</span>
                <div className="text-[10px] font-serif font-bold text-teal-850 mt-1">Gedhong</div>
                <div className="text-[8px] text-teal-700/80 font-mono uppercase mt-0.5">{language === 'id' ? 'Baik / Berkah' : 'Auspicious'}</div>
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <span className="text-xs">💆</span>
                <div className="text-[10px] font-serif font-bold text-amber-850 mt-1">Loro</div>
                <div className="text-[8px] text-amber-700/80 font-mono uppercase mt-0.5">{language === 'id' ? 'Pemulihan / Rest' : 'Recovery'}</div>
              </div>
              <div className="p-2.5 bg-stone-50 border border-gold/15 rounded-xl text-center col-span-2 md:col-span-1">
                <span className="text-xs">🧘</span>
                <div className="text-[10px] font-serif font-bold text-royal-green mt-1">Pati</div>
                <div className="text-[8px] text-royal-green/60 font-mono uppercase mt-0.5">{language === 'id' ? 'Kontemplasi' : 'Meditation'}</div>
              </div>
            </div>
          </div>

          {/* Persona Selection status */}
          <div className="bg-white border border-gold/15 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <span className="text-[9px] font-mono text-gold-dark font-bold uppercase tracking-widest block">
                {language === 'id' ? 'Sifat Kalender' : 'Calendar Mode'}
              </span>
              <p className="text-xs font-serif text-royal-green font-bold">
                {singleResult 
                  ? (language === 'id' ? `Disesuaikan untuk: ${singleName} (Neptu ${singleResult.totalNeptu})` : `Personalized for: ${singleName} (Neptu ${singleResult.totalNeptu})`)
                  : (language === 'id' ? 'Kalender Hari Baik Umum (Gunakan Tab Cek Weton untuk Personalisasi)' : 'General Auspicious Days (Check your Weton for a personalized map!)')}
              </p>
            </div>
            {singleResult && (
              <button
                onClick={() => {
                  // Trigger clear
                  resetSingle();
                }}
                className="text-[9px] uppercase font-mono px-3 py-1.5 rounded-full border border-gold/20 text-gold-dark hover:bg-gold/5 transition-all cursor-pointer"
              >
                {language === 'id' ? 'Gunakan Umum' : 'Switch to General'}
              </button>
            )}
          </div>

          {/* Interactive 7-Day Forecast Map */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-xs text-royal-green uppercase tracking-wider block">
              {language === 'id' ? 'Peta Prakiraan Hari Baik (7 Hari ke Depan)' : language === 'nl' ? 'Gunstige Dagenkaart (Volgende 7 Dagen)' : 'Auspicious Days Forecast Map (Next 7 Days)'}
            </h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generateAuspiciousDays(singleResult?.totalNeptu).map((day, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all duration-300 flex items-start space-x-4 ${
                    day.status === 'highly_auspicious'
                      ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-350 shadow-xs'
                      : day.status === 'auspicious'
                      ? 'bg-teal-50/40 border-teal-200 hover:border-teal-350 shadow-xs'
                      : day.status === 'cautious'
                      ? 'bg-amber-50/40 border-amber-200 hover:border-amber-350 shadow-xs'
                      : 'bg-stone-50 border-gold/15 hover:border-gold/30'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl text-center flex-shrink-0 ${
                    day.status === 'highly_auspicious'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-250'
                      : day.status === 'auspicious'
                      ? 'bg-teal-100 text-teal-850 border border-teal-250'
                      : day.status === 'cautious'
                      ? 'bg-amber-100 text-amber-850 border border-amber-250'
                      : 'bg-stone-100 text-royal-green border border-gold/10'
                  }`}>
                    <span className="text-lg block leading-none">{day.icon}</span>
                    <span className="text-[9px] font-mono font-bold uppercase block mt-1">
                      Neptu {day.totalNeptu}
                    </span>
                  </div>

                  <div className="space-y-1 flex-grow">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="text-[10px] font-mono text-royal-green/60">
                        {day.weekday}, {day.date}
                      </span>
                      
                      <span className={`text-[9px] font-serif font-bold px-2 py-0.5 rounded-full border ${
                        day.status === 'highly_auspicious'
                          ? 'bg-emerald-100 text-emerald-850 border-emerald-250'
                          : day.status === 'auspicious'
                          ? 'bg-teal-100 text-teal-850 border-teal-250'
                          : day.status === 'cautious'
                          ? 'bg-amber-100 text-amber-850 border-amber-250'
                          : 'bg-stone-100 text-royal-green/80 border-gold/10'
                      }`}>
                        {day.statusLabel}
                      </span>
                    </div>

                    <h6 className="font-serif font-bold text-sm text-royal-green">
                      {day.wetonName}
                    </h6>
                    
                    <p className="text-[11px] text-royal-green/75 leading-relaxed font-light">
                      {day.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Banner to check treatments/herbs */}
          <div className="bg-royal-green border border-gold/30 p-5 rounded-2xl text-cream flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-[10px] font-mono text-gold uppercase tracking-widest font-bold">
                {language === 'id' ? 'HARMONI ENERGI TUBUH' : 'PHYSICAL ENERGY HARMONY'}
              </span>
              <h5 className="font-serif text-lg font-bold text-gold">
                {language === 'id' ? 'Sesuaikan Perawatan Sesuai Prakiraan Hari' : 'Tailor Your Herbal Treatments & Spa Daily'}
              </h5>
              <p className="text-xs text-cream/80 max-w-xl font-light leading-relaxed">
                {language === 'id'
                  ? 'Gunakan hari Sandang & Pangan untuk terapi pengaktifan energi rezeki raga, hari Loro untuk pemulihan mendalam dengan pijat rempah hangat, dan hari Pati untuk detoksifikasi jiwa.'
                  : 'Utilize your Sandang & Pangan days for prosperity and vitality therapies, your Loro days for deep healing warm compresses, and your Pati days for mental-spiritual cleansing.'}
              </p>
            </div>
            <a
              href="#services"
              className="px-5 py-2.5 bg-gold hover:bg-cream text-royal-green font-serif font-bold text-xs uppercase tracking-wider rounded-full transition-all text-center"
            >
              {language === 'id' ? 'Lihat Layanan Terapi' : 'Explore Spa Therapies'}
            </a>
          </div>

        </div>
      )}

    </div>
  );
};
