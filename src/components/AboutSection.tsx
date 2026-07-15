import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, MapPin, Clock, Heart, ShieldCheck, ArrowRight, ChevronDown, ChevronUp, Calendar, User, Phone, Mail, X, CheckCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';

interface AboutSectionProps {
  onBookMassage: (message: string) => void;
}

// Full translated content for the 6 services (Compact initially, click to expand)
const massageServices = [
  {
    id: 'body-massage',
    badge: { en: 'Harmonizing', nl: 'Harmoniserend', id: 'Harmonisasi' },
    name: { en: 'Body Massage', nl: 'Lichaamsmassage', id: 'Body Massage' },
    shortDesc: {
      en: 'Relieve muscle tension and fatigue with our signature Javanese touch.',
      nl: 'Verlicht spierspanning en vermoeidheid met onze kenmerkende Javaanse aanraking.',
      id: 'Redakan ketegangan otot dan kelelahan dengan sentuhan khas Jawa kami.'
    },
    longDesc: {
      en: 'Enjoy a comprehensive body massage that helps relieve muscle tension, provides a sense of comfort, and makes your body feel lighter after a long day of activities. Tailored pressure is applied using Javanese techniques to improve blood flow and restore energy.',
      nl: 'Geniet van een uitgebreide lichaamsmassage die helpt bij het verlichten van spierspanning, zorgt voor comfort en uw lichaam lichter laat voelen na een actieve dag. Traditionele druktechnieken stimuleren de bloedsomloop.',
      id: 'Nikmati pijatan menyeluruh yang membantu meredakan ketegangan otot, memberikan rasa nyaman, dan membuat tubuh terasa lebih ringan setelah beraktivitas. Tekanan disesuaikan dengan teknik Jawa untuk melancarkan darah.'
    },
    durations: [
      { mins: '30', price: 35 },
      { mins: '60', price: 70 }
    ],
    imageUrl: '/src/assets/images/luxury_massage_session_1783703874698.jpg',
    iconType: 'heart'
  },
  {
    id: 'face-massage',
    badge: { en: 'Soothing', nl: 'Verzachtend', id: 'Penenang' },
    name: { en: 'Face Massage', nl: 'Gezichtsmassage', id: 'Face Massage' },
    shortDesc: {
      en: 'A relaxing facial therapy to release facial stress and restore skin glow.',
      nl: 'Een ontspannende gezichtstherapie om stress te verminderen en glans te herstellen.',
      id: 'Terapi wajah relaksasi untuk meredakan ketegangan wajah dan mencerahkan kulit.'
    },
    longDesc: {
      en: 'A facial treatment with gentle massage techniques that provide a relaxing sensation, help reduce facial tension, improve microcirculation, and leave your face feeling refreshed, youthful, and naturally glowing.',
      nl: 'Een gezichtsbehandeling met zachte massagetechnieken die een ontspannen gevoel geven, de spanning in het gezicht helpen verminderen, de microcirculatie stimuleren en uw gezicht er weer fris en stralend uit laten zien.',
      id: 'Perawatan wajah dengan teknik pijat lembut yang memberikan sensasi rileks, membantu mengurangi ketegangan pada otot wajah, melancarkan aliran darah, dan membuat wajah tampak lebih segar serta cerah alami.'
    },
    durations: [
      { mins: '30', price: 35 },
      { mins: '60', price: 70 }
    ],
    imageUrl: '/src/assets/images/luxury_face_massage_1783856646798.jpg',
    iconType: 'clock'
  },
  {
    id: 'full-body',
    badge: { en: 'Complete Care', nl: 'Volledige Zorg', id: 'Perawatan Lengkap' },
    name: { en: 'Royal Full Body Massage', nl: 'Koninklijke Volledige Massage', id: 'Pijat Full Body Keraton' },
    shortDesc: {
      en: 'A premium, therapeutic head-to-toe royal Javanese massage session.',
      nl: 'Een premium, therapeutische koninklijke Javaanse massage van top tot teen.',
      id: 'Sesi pijat terapeutik seluruh tubuh ala keraton Jawa dari kepala hingga kaki.'
    },
    longDesc: {
      en: 'Let your body rest and recharge. Enjoy a full body relaxation massage with a professional touch and natural aromatherapy that helps ease tension, reduce soreness, and bring peace to body and mind. Includes head, shoulder, back, and leg massage.',
      nl: 'Laat uw lichaam rusten en weer opladen. Geniet van een ontspannende volledige lichaamsmassage met een professionele aanraking en natuurlijke aromatherapie die helpt spanning te verlichten, spierpijn te verminderen en rust te brengen.',
      id: 'Biarkan tubuh Anda beristirahat dan kembali bertenaga. Nikmati pijat relaksasi seluruh tubuh dengan sentuhan profesional dan aromaterapi alami yang membantu meredakan ketegangan, mengurangi rasa pegal, dan menghadirkan ketenangan lahir dan batin.'
    },
    durations: [
      { mins: '90', price: 85 }
    ],
    imageUrl: '/src/assets/images/luxury_javanese_massage_1783857310800.jpg',
    iconType: 'shield'
  },
  {
    id: 'foot-massage',
    badge: { en: 'Reflexology', nl: 'Reflexologie', id: 'Refleksi' },
    name: { en: 'Foot Massage & Reflexology', nl: 'Voetmassage & Reflexologie', id: 'Pijat Refleksi Kaki' },
    shortDesc: {
      en: 'Targeted acupressure on foot reflex zones to restore body balance.',
      nl: 'Gerichte acupressuur op voetreflexzones om de balans te herstellen.',
      id: 'Akupresur terarah pada zona refleks kaki untuk mengembalikan keseimbangan tubuh.'
    },
    longDesc: {
      en: 'A dedicated therapy combining Javanese foot massage with acupressure. By stimulating specific reflex points on the feet corresponding to vital organs, it relieves fatigue, improves circulation, and balances your entire energy flow.',
      nl: 'Een speciale therapie die Javaanse voetmassage combineert met acupressuur. Door specifieke reflexpunten op de voeten te stimuleren, worden vermoeidheid en spanning effectief verlicht.',
      id: 'Terapi khusus yang memadukan pijat kaki Jawa dengan akupresur. Menstimulasi titik-titik refleks pada telapak kaki yang terhubung dengan organ vital untuk menghilangkan lelah, melancarkan peredaran darah, dan menyegarkan raga.'
    },
    durations: [
      { mins: '30', price: 30 },
      { mins: '60', price: 55 }
    ],
    imageUrl: '/src/assets/images/foot_massage_spa_1783936386115.jpg',
    iconType: 'heart'
  },
  {
    id: 'manicure',
    badge: { en: 'Nail Beauty', nl: 'Nagelverzorging', id: 'Kecantikan Kuku' },
    name: { en: 'Royal Hand Manicure', nl: 'Koninklijke Handmanicure', id: 'Manicure Tangan Keraton' },
    shortDesc: {
      en: 'Pamper your hands with nail shaping, cuticle care, and massage.',
      nl: 'Verwen uw handen met nagelvorming, nagelriemverzorging en massage.',
      id: 'Manjakan tangan Anda dengan pembentukan kuku, perawatan kutikula, dan pijat lembut.'
    },
    longDesc: {
      en: 'A luxurious hand treatment featuring natural scrubs, nail shaping, gentle cuticle care, and a soothing hand massage with Javanese jasmine-infused oils. Leaves your hands beautifully clean, soft, and smelling like royal gardens.',
      nl: 'Een luxe handbehandeling met natuurlijke scrubs, nagelmodellering, nagelriemverzorging en een ontspannende handmassage met jasmijnolie. Voor zijdezachte handen.',
      id: 'Perawatan tangan mewah yang mencakup scrub alami, pembentukan kuku, perawatan kutikula, dan pijat tangan yang menenangkan dengan minyak melati khas keraton. Menjadikan tangan Anda bersih, sangat halus, dan harum menawan.'
    },
    durations: [
      { mins: '45', price: 40 }
    ],
    imageUrl: '/src/assets/images/manicure_spa_1783936398626.jpg',
    iconType: 'sparkles'
  },
  {
    id: 'pedicure',
    badge: { en: 'Foot Spa', nl: 'Voetverzorging', id: 'Perawatan Kaki' },
    name: { en: 'Royal Pedicure Foot Spa', nl: 'Koninklijke Voetpedicure', id: 'Pedicure Kaki Keraton' },
    shortDesc: {
      en: 'Soak, scrub, and nourish your feet to pure softness and elegance.',
      nl: 'Laat uw voeten weken, scrubben en voeden tot ze puur zacht en elegant zijn.',
      id: 'Rendam, scrub, dan nutrisi kaki Anda hingga terasa sangat halus dan elegan.'
    },
    longDesc: {
      en: 'An immersive botanical foot spa. Includes a warm foot bath with herbal salts, natural exfoliation to remove rough skin, professional nail grooming, and a deeply relaxing calf and foot massage with organic warming oils.',
      nl: 'Een heerlijke botanische voetspa. Inclusief een warm voetbad met kruidenzout, natuurlijke exfoliatie om ruwe huid te verwijderen, professionele nagelverzorging en massage.',
      id: 'Foot spa botani yang memanjakan. Meliputi rendam kaki hangat dengan garam herbal, eksfoliasi alami untuk mengangkat kulit kasar, perawatan kuku profesional, serta pijat kaki dan betis dengan minyak hangat organik.'
    },
    durations: [
      { mins: '45', price: 45 }
    ],
    imageUrl: '/src/assets/images/pedicure_spa_1783936413057.jpg',
    iconType: 'sparkles'
  }
];

export const AboutSection: React.FC<AboutSectionProps> = ({ onBookMassage }) => {
  const { t, language } = useLanguage();

  const [services, setServices] = useState<any[]>(massageServices);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      })
      .catch(err => console.error('Error fetching massage services:', err));
  }, []);

  // Selected durations for services that support multiple durations
  const [selectedDurations, setSelectedDurations] = useState<Record<string, string>>({
    'body-massage': '60',
    'face-massage': '60',
    'foot-massage': '60',
  });

  // Keep track of which services have expanded details
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});

  // Confirmation Modal state
  const [activeBooking, setActiveBooking] = useState<{
    name: string;
    duration: string;
    price: number;
    imageUrl: string;
  } | null>(null);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('11:00');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');

  const modalT = {
    title: {
      en: 'Royal Treatment Booking',
      nl: 'Koninklijke Behandeling Boeken',
      id: 'Pemesanan Terapi Keraton'
    },
    therapy: {
      en: 'Chosen Therapy',
      nl: 'Gekozen Therapie',
      id: 'Terapi Pilihan'
    },
    date: {
      en: 'Preferred Date',
      nl: 'Gewenste Datum',
      id: 'Tanggal Kunjungan'
    },
    time: {
      en: 'Preferred Time',
      nl: 'Gewenste Tijd',
      id: 'Waktu Kunjungan'
    },
    name: {
      en: 'Your Name',
      nl: 'Uw Naam',
      id: 'Nama Lengkap Anda'
    },
    phone: {
      en: 'WhatsApp Phone Number',
      nl: 'WhatsApp Telefoonnummer',
      id: 'Nomor WhatsApp Anda'
    },
    email: {
      en: 'Email Address (Optional)',
      nl: 'E-mailadres (Optioneel)',
      id: 'Alamat Email (Opsional)'
    },
    btnConfirm: {
      en: 'Confirm & Book via WhatsApp',
      nl: 'Bevestigen & Boeken via WhatsApp',
      id: 'Konfirmasi & Pesan via WhatsApp'
    },
    btnSubmitting: {
      en: 'Transcribing Appointment...',
      nl: 'Afspraak Vastleggen...',
      id: 'Mencatat Janji Temu...'
    },
    btnCancel: {
      en: 'Go Back',
      nl: 'Terug',
      id: 'Kembali'
    },
    successTitle: {
      en: 'Appointment Registered!',
      nl: 'Afspraak Geregistreerd!',
      id: 'Janji Temu Berhasil Dicatat!'
    },
    successSubtitle: {
      en: 'Opening WhatsApp to finalize your booking with our dispatch team...',
      nl: 'WhatsApp wordt geopend om uw boeking te voltooien...',
      id: 'Membuka WhatsApp untuk menyelesaikan pemesanan dengan tim kami...'
    }
  };

  const buildNotes = () => {
    if (!activeBooking) return '';
    if (language === 'id') {
      return `Pemesanan Terapi Pijat:
- Jenis Layanan: ${activeBooking.name}
- Durasi: ${activeBooking.duration} Menit
- Tarif: €${activeBooking.price}
- Tanggal Kunjungan: ${selectedDate}
- Waktu Pilihan: ${selectedTime}
- Kunjungan ke rumah (home visit).`;
    } else if (language === 'nl') {
      return `Massage Boeking:
- Behandeling: ${activeBooking.name}
- Duur: ${activeBooking.duration} Minuten
- Prijs: €${activeBooking.price}
- Gewenste Datum: ${selectedDate}
- Gewenste Tijd: ${selectedTime}
- Thuisbezoek (home visit).`;
    } else {
      return `Massage Appointment Booking:
- Treatment: ${activeBooking.name}
- Duration: ${activeBooking.duration} Minutes
- Price: €${activeBooking.price}
- Requested Date: ${selectedDate}
- Preferred Time: ${selectedTime}
- Home visit session.`;
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBooking || !selectedDate || !selectedTime || !customerName.trim() || !phone.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName,
        phone,
        email,
        country: 'Netherlands',
        productIds: [],
        quantities: [],
        notes: buildNotes()
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
        
        setTimeout(() => {
          window.location.href = data.redirectUrl;
        }, 1500);
      } else {
        alert(data.error || 'Something went wrong. Please check your details.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedServices(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'heart':
        return <Heart className="w-3.5 h-3.5 text-gold" />;
      case 'clock':
        return <Clock className="w-3.5 h-3.5 text-gold" />;
      case 'shield':
        return <ShieldCheck className="w-3.5 h-3.5 text-gold" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-3.5 h-3.5 text-gold" />;
    }
  };

  // Multi-language strings for massage section
  const content = {
    title: {
      en: 'Relax, Refresh & Restore',
      nl: 'Relax, Refresh & Restore',
      id: 'Relax, Refresh & Restore'
    },
    heading: {
      en: 'Professional Body, Face & Beauty Therapies',
      nl: 'Professionele Lichaams-, Gezichts- & Schoonheidstherapieën',
      id: 'Terapi Tubuh, Wajah & Kecantikan Profesional'
    },
    intro: {
      en: 'At SR Nature & Aromatherapy, we offer luxury home-visit massage, reflexology, and premium nail care services with a gentle touch and pure organic aromatherapy to restore your body\'s natural harmony.',
      nl: 'Bij SR Nature & Aromatherapy bieden we luxe massage-, reflexologie- en premium nagelverzorgingsdiensten aan huis met een zachte aanraking en pure biologische aromatherapie.',
      id: 'Di SR Nature & Aromatherapy, kami menghadirkan layanan pijat panggilan, refleksi, dan perawatan kuku premium dengan sentuhan lembut serta aromaterapi organik murni untuk memulihkan keselarasan alami raga Anda.'
    },
    travelTitle: {
      en: 'Travel Fee Policy',
      nl: 'Reiskostenbeleid',
      id: 'Ketentuan Biaya Perjalanan'
    },
    travelText: {
      en: 'To support home visits, a small travel fee of €10 - €20 is applied for locations situated more than 10 km from our central station.',
      nl: 'Voor adressen verder dan 10 km van onze centrale locatie wordt een bescheiden reiskostentoeslag van €10 - €20 in rekening gebracht.',
      id: 'Untuk mendukung kunjungan ke rumah, dikenakan biaya perjalanan tambahan sebesar €10 - €20 jika jarak lokasi rumah Anda lebih dari 10 km.'
    },
    bookBtn: {
      en: 'Book This Service',
      nl: 'Boek Deze Dienst',
      id: 'Pesan Layanan Ini'
    }
  };

  const handleBookClick = (massageName: string, duration: string, price: number, imageUrl: string) => {
    setSelectedDate('');
    setSelectedTime('11:00');
    setCustomerName('');
    setPhone('');
    setEmail('');
    setIsSuccess(false);
    setRedirectUrl('');
    setActiveBooking({
      name: massageName,
      duration,
      price,
      imageUrl
    });
  };

  return (
    <section id="about" className="py-10 bg-cream batik-pattern border-b border-gold/15 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 text-gold">
              <Sparkles className="w-4 h-4 text-gold-dark animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-dark">
                {content.title[language] || content.title['en']}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-royal-green leading-tight">
              {content.heading[language] || content.heading['en']}
            </h2>
            <p className="text-xs sm:text-sm text-royal-green/75 font-light leading-relaxed max-w-2xl mx-auto">
              {content.intro[language] || content.intro['en']}
            </p>
          </div>
        </ScrollReveal>

        {/* Massage & Wellness Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10" id="massage-services-grid">
          {services.map((service, index) => {
            const activeDuration = selectedDurations[service.id] || service.durations[0].mins;
            const activeDurationObj = service.durations.find(d => d.mins === activeDuration) || service.durations[0];
            const isExpanded = !!expandedServices[service.id];

            return (
              <ScrollReveal 
                key={service.id}
                direction="up" 
                delay={0.1 + (index % 3) * 0.1} 
                className="bg-white border border-gold/20 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Service Image banner */}
                <div className="relative aspect-video sm:aspect-4/3 overflow-hidden">
                  <img 
                    src={service.imageUrl} 
                    alt={service.name[language] || service.name['en']} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center space-x-1.5 bg-royal-green/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gold/30">
                    {getIcon(service.iconType)}
                    <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-cream">
                      {service.badge[language] || service.badge['en']}
                    </span>
                  </div>
                </div>

                {/* Card Content body */}
                <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-royal-green leading-snug">
                        {service.name[language] || service.name['en']}
                      </h3>
                      <div className="text-right flex-shrink-0">
                        <span className="font-serif text-xl sm:text-2xl font-black text-gold-dark block">
                          €{activeDurationObj.price}
                        </span>
                        <span className="text-[10px] font-mono text-royal-green/60 uppercase tracking-wider block">
                          {activeDuration} {t('massage.duration_mins')}
                        </span>
                      </div>
                    </div>

                    {/* Short Description & Expandable section */}
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm text-royal-green/80 leading-relaxed font-light font-sans">
                        {service.shortDesc[language] || service.shortDesc['en']}
                      </p>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs text-royal-green/70 leading-relaxed font-light mt-2 pt-2 border-t border-gold/10 whitespace-pre-line">
                              {service.longDesc[language] || service.longDesc['en']}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Click for More Details button */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(service.id)}
                        className="inline-flex items-center space-x-1 text-gold-dark hover:text-gold text-xs font-semibold tracking-wide transition-colors mt-1 py-1 focus:outline-none"
                      >
                        <span>
                          {isExpanded 
                            ? (language === 'id' ? 'Sembunyikan detail' : language === 'nl' ? 'Minder tonen' : 'Hide details') 
                            : (language === 'id' ? 'Klik untuk selengkapnya...' : language === 'nl' ? 'Klik voor details...' : 'Click for details...')}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-gold-dark" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-gold-dark animate-pulse" />
                        )}
                      </button>
                    </div>

                    {/* Duration Switcher (if service has more than 1 duration option) */}
                    {service.durations.length > 1 ? (
                      <div className="flex items-center space-x-2 bg-cream/60 p-1 rounded-xl border border-gold/15 w-fit">
                        {service.durations.map((d) => (
                          <button 
                            key={d.mins}
                            type="button"
                            onClick={() => setSelectedDurations(prev => ({ ...prev, [service.id]: d.mins }))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                              activeDuration === d.mins 
                                ? 'bg-royal-green text-gold font-bold shadow' 
                                : 'text-royal-green/75 hover:text-royal-green'
                            }`}
                          >
                            {d.mins} Min
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 bg-cream/30 p-1 rounded-xl border border-dashed border-gold/15 w-fit select-none">
                        <span className="px-3 py-1 text-[10px] font-mono font-medium text-royal-green/60">
                          {activeDuration} Min {language === 'id' ? 'Terapi Lengkap' : 'Complete Therapy'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Direct Book Button */}
                  <button
                    type="button"
                    onClick={() => handleBookClick(service.name[language] || service.name['en'], activeDuration, activeDurationObj.price, service.imageUrl)}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-royal-green hover:bg-leaf-green text-cream font-bold text-xs tracking-widest uppercase py-3.5 rounded-2xl shadow-md transition-all duration-300 hover:translate-y-[-2px]"
                  >
                    <span>{content.bookBtn[language] || content.bookBtn['en']}</span>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </button>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Travel Expenses Banner */}
        <ScrollReveal direction="up" delay={0.2} className="max-w-4xl mx-auto bg-white border border-gold/25 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-lg relative overflow-hidden" id="travel-policy-banner">
          {/* Subtle gold decorative background shape */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="bg-gold/10 p-4 rounded-full text-gold-dark flex items-center justify-center flex-shrink-0 h-14 w-14 border border-gold/15">
            <MapPin className="w-7 h-7" />
          </div>
          <div className="space-y-1 text-center sm:text-left flex-grow">
            <h4 className="font-serif font-bold text-royal-green text-base sm:text-lg">
              {content.travelTitle[language] || content.travelTitle['en']}
            </h4>
            <p className="text-xs sm:text-sm text-royal-green/85 leading-relaxed font-light">
              {content.travelText[language] || content.travelText['en']}
            </p>
          </div>
        </ScrollReveal>

      </div>

      {/* Confirmation Modal overlay with custom animation */}
      <AnimatePresence>
        {activeBooking && (
          <div className="fixed inset-0 bg-royal-green/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" id="booking-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-cream border-2 border-gold/40 rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl relative my-auto flex flex-col max-h-[95vh] md:max-h-none"
              id="booking-modal-card"
            >
              {/* Header */}
              <div className="bg-royal-green p-6 text-cream border-b border-gold/30 flex justify-between items-center relative">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
                    {language === 'id' ? 'Saraswati Aromaterapi' : 'SR Natural Wellness'}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-white">
                    {modalT.title[language] || modalT.title['en']}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveBooking(null)}
                  className="text-gold hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Success Screen inside the Modal */}
              {isSuccess ? (
                <div className="p-8 sm:p-12 text-center space-y-6 flex-grow overflow-y-auto">
                  <div className="bg-leaf-green w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gold shadow-lg animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-royal-green">
                      {modalT.successTitle[language] || modalT.successTitle['en']}
                    </h4>
                    <p className="text-xs sm:text-sm text-royal-green/80 font-light max-w-md mx-auto leading-relaxed">
                      {modalT.successSubtitle[language] || modalT.successSubtitle['en']}
                    </p>
                  </div>
                  <div className="pt-4">
                    <a
                      href={redirectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-2.5 bg-[#128C7E] hover:bg-[#0e7065] text-cream font-bold text-xs sm:text-sm tracking-widest uppercase px-6 py-3.5 rounded-full shadow-lg transition-transform hover:scale-103 duration-300"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>{language === 'id' ? 'Buka WhatsApp Chat' : language === 'nl' ? 'Open WhatsApp' : 'Open WhatsApp Chat'}</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* Main Form */
                <form onSubmit={handleConfirm} className="flex-grow flex flex-col overflow-y-auto">
                  <div className="p-6 sm:p-8 space-y-6 flex-grow">
                    {/* Treatment Summary banner */}
                    <div className="bg-white border border-gold/20 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gold/15 bg-cream">
                        <img 
                          src={activeBooking.imageUrl} 
                          alt={activeBooking.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-center sm:text-left flex-grow space-y-1">
                        <span className="text-[9px] font-mono bg-gold/15 text-gold-dark px-2 py-0.5 rounded-full uppercase font-bold tracking-widest">
                          {modalT.therapy[language] || modalT.therapy['en']}
                        </span>
                        <h4 className="font-serif font-bold text-royal-green text-base sm:text-lg">
                          {activeBooking.name}
                        </h4>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-royal-green/75 font-mono">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-gold-dark" />
                            <span>{activeBooking.duration} Min</span>
                          </span>
                          <span className="font-serif font-bold text-gold-dark">
                            €{activeBooking.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Form Inputs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Date Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold tracking-wider uppercase text-royal-green/80 flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gold" />
                          <span>{modalT.date[language] || modalT.date['en']} *</span>
                        </label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={selectedDate}
                          onChange={e => setSelectedDate(e.target.value)}
                          className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-sm text-royal-green focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                        />
                      </div>

                      {/* Time Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold tracking-wider uppercase text-royal-green/80 flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-gold" />
                          <span>{modalT.time[language] || modalT.time['en']} *</span>
                        </label>
                        <select
                          required
                          value={selectedTime}
                          onChange={e => setSelectedTime(e.target.value)}
                          className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-sm text-royal-green focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                        >
                          <option value="09:00">09:00</option>
                          <option value="10:00">10:00</option>
                          <option value="11:00">11:00</option>
                          <option value="12:00">12:00</option>
                          <option value="13:00">13:00</option>
                          <option value="14:00">14:00</option>
                          <option value="15:00">15:00</option>
                          <option value="16:00">16:00</option>
                          <option value="17:00">17:00</option>
                          <option value="18:00">18:00</option>
                          <option value="19:00">19:00</option>
                          <option value="20:00">20:00</option>
                        </select>
                      </div>

                      {/* Customer Name */}
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-mono font-bold tracking-wider uppercase text-royal-green/80 flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-gold" />
                          <span>{modalT.name[language] || modalT.name['en']} *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          placeholder="e.g. Marieke Jansen"
                          className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-sm text-royal-green focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                        />
                      </div>

                      {/* WhatsApp Phone */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold tracking-wider uppercase text-royal-green/80 flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-gold" />
                          <span>{modalT.phone[language] || modalT.phone['en']} *</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="e.g. +31 6 12345678"
                          className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-sm text-royal-green focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold tracking-wider uppercase text-royal-green/80 flex items-center space-x-1.5">
                          <Mail className="w-3.5 h-3.5 text-gold" />
                          <span>{modalT.email[language] || modalT.email['en']}</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="e.g. marieke@gmail.com"
                          className="w-full bg-cream/30 border border-gold/25 rounded-xl px-4 py-2.5 text-sm text-royal-green focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                        />
                      </div>
                    </div>

                    {/* Travel Fee Disclaimer */}
                    <p className="text-[10px] text-royal-green/60 italic leading-relaxed text-center">
                      {language === 'id' 
                        ? 'Catatan: Biaya perjalanan kecil €10-€20 akan dikenakan jika alamat rumah Anda lebih dari 10 km.' 
                        : language === 'nl' 
                        ? 'Let op: Er wordt een kleine reiskostentoeslag van €10-€20 in rekening gebracht voor locaties verder dan 10 km.' 
                        : 'Note: A small travel fee of €10-€20 will be added for addresses situated more than 10 km from our station.'}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-6 bg-white border-t border-gold/15 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 inline-flex items-center justify-center space-x-2 bg-royal-green hover:bg-leaf-green text-cream disabled:bg-stone-200 disabled:text-stone-400 font-bold text-xs tracking-widest uppercase py-3.5 rounded-2xl shadow-md transition-all duration-300"
                    >
                      <MessageSquare className="w-4 h-4 text-gold" />
                      <span>{isSubmitting ? (modalT.btnSubmitting[language] || modalT.btnSubmitting['en']) : (modalT.btnConfirm[language] || modalT.btnConfirm['en'])}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveBooking(null)}
                      className="w-full sm:w-auto px-6 inline-flex items-center justify-center bg-cream hover:bg-gold/10 text-royal-green font-bold text-xs tracking-widest uppercase py-3.5 rounded-2xl border border-gold/20 transition-all duration-300"
                    >
                      <span>{modalT.btnCancel[language] || modalT.btnCancel['en']}</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
