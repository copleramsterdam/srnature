import fs from 'fs';
import path from 'path';
import { DatabaseSchema, Product, BlogPost, Testimonial, Order, SeoSettings, BusinessInfo, MassageService } from '../types';
import { db } from '../db/index';
import { users, products, blogs, testimonials, orders, seoSettings, businessInfo, services } from '../db/schema';
import { eq, notInArray } from 'drizzle-orm';

const DB_FILE = path.join(process.cwd(), 'db.json');

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "aromatherapy-massage-oil",
    name: {
      en: "Lemongrass & Lavender Aromatherapy Massage Oil",
      nl: "Citroengras & Lavendel Aromatherapie Massageolie",
      id: "Minyak Pijat Aromaterapi Lavender & Lemongrass"
    },
    category: "womens-health",
    description: {
      en: "A luxurious, hand-blended massage oil combining premium organic lemongrass, soothing French lavender blossoms, and vitamin-rich sweet almond oil. Deeply nourishes the skin while calming the nervous system.",
      nl: "Een luxe, met de hand samengestelde massageolie die premium biologisch citroengras, verzachtende Franse lavendelbloesems en vitaminerijke zoete amandelolie combineert. Voedt de huid diep en kalmeert het zenuwstelsel.",
      id: "Minyak pijat mewah buatan tangan yang memadukan serai organik premium, bunga lavender Prancis yang menenangkan, dan minyak almon manis kaya vitamin. Menutrisi kulit secara mendalam sekaligus menenangkan sistem saraf."
    },
    ingredients: {
      en: [
        "Organic Lemongrass Essential Oil",
        "French Lavender Essential Oil",
        "Sweet Almond Carrier Oil",
        "Jojoba Seed Oil",
        "Vitamin E (Tocopherol)"
      ],
      nl: [
        "Biologische Citroengras Etherische Olie",
        "Franse Lavendel Etherische Olie",
        "Zoete Amandelolie",
        "Jojoba Olie",
        "Vitamine E"
      ],
      id: [
        "Minyak Atsiri Serai Organik",
        "Minyak Atsiri Lavender Prancis",
        "Minyak Almon Manis",
        "Minyak Jojoba",
        "Vitamin E"
      ]
    },
    benefits: {
      en: [
        "Promotes deep muscular relaxation and stress relief",
        "Intensely hydrates and softens dry skin",
        "Relieves nervous tension and anxiety",
        "Enhances blood flow and natural body glow"
      ],
      nl: [
        "Bevordert diepe spierontspanning en stressverlichting",
        "Hydrateert en verzacht de droge huid intensief",
        "Verlicht zenuwspanning en angst",
        "Verbetert de bloedsomloop en geeft een gezonde glans"
      ],
      id: [
        "Mendukung relaksasi otot mendalam dan pereda stres",
        "Menghidrasi secara intensif dan menghaluskan kulit kering",
        "Meredakan ketegangan saraf dan kecemasan",
        "Melancarkan sirkulasi darah dan memberi kilau alami kulit"
      ]
    },
    traditionalExplanation: {
      en: "Used in ancient Javanese royal palaces, aromatic oils were rubbed onto royals after bathing to restore physical energy and shield against elements.",
      nl: "Gebruikt in de oude Javaanse koninklijke paleizen, werden aromatische oliën na het baden op het lichaam gewreven om fysieke energie te herstellen.",
      id: "Digunakan di istana kerajaan Jawa kuno, minyak aromatik dioleskan ke tubuh para bangsawan setelah mandi untuk memulihkan energi fisik."
    },
    scientificExplanation: {
      en: "Linalool from lavender stimulates parasympathetic activity to lower heart rate, while lemongrass compounds have strong antibacterial properties.",
      nl: "Linalool uit lavendel stimuleert parasympathische activiteit om de hartslag te verlagen, terwijl citroengras sterke antibacteriële eigenschappen heeft.",
      id: "Kandungan Linalool dari lavender menstimulasi aktivitas parasimpatis untuk menurunkan denyut jantung, sementara kandungan serai memiliki sifat antibakteri alami."
    },
    howToConsume: {
      en: "Warm a small amount in your hands. Massage gently into skin with circular motions. For best results, use after a warm shower or bath.",
      nl: "Verwarm een kleine hoeveelheid in uw handen. Masseer zachtjes in de huid met cirkelvormige bewegingen. Voor het beste resultaat na een warme douche of bad gebruiken.",
      id: "Hangatkan sedikit minyak di telapak tangan Anda. Masseer dengan lembut ke kulit dengan gerakan melingkar. Untuk hasil terbaik, gunakan setelah mandi air hangat."
    },
    recommendedConsumption: {
      en: "Apply daily or as needed during massage therapy sessions to soothe body and mind.",
      nl: "Dagelijks aanbrengen of naar behoefte tijdens massagetherapiesessies.",
      id: "Gunakan setiap hari atau sesuai kebutuhan selama sesi terapi pijat untuk menenangkan tubuh dan pikiran."
    },
    whoShouldUse: {
      en: "Perfect for anyone experiencing muscle soreness, dry skin, high stress, or difficulty sleeping.",
      nl: "Perfect voor iedereen die last heeft van spierpijn, droge huid, stress of slaapproblemen.",
      id: "Sangat cocok untuk siapa saja yang mengalami pegal otot, kulit kering, stres tinggi, atau susah tidur."
    },
    warnings: {
      en: "For external use only. Conduct a patch test before first use. Avoid contact with eyes.",
      nl: "Uitsluitend voor uitwendig gebruik. Voer voor het eerste gebruik een patchtest uit. Contact met de ogen vermijden.",
      id: "Hanya untuk pemakaian luar. Lakukan uji sensitivitas kulit sebelum pemakaian pertama. Hindari kontak dengan mata."
    },
    price: 14.5,
    stock: 85,
    isFeatured: true,
    imageUrl: "/src/assets/images/aromatherapy_massage_oil_1783856854257.jpg"
  },
  {
    id: "javanese-herbal-compress",
    name: {
      en: "Traditional Warm Javanese Herbal Compress",
      nl: "Traditioneel Warm Javaans Kruidenstempel",
      id: "Kompres Herbal Jawa Hangat (Pulasari)"
    },
    category: "immune-booster",
    description: {
      en: "A traditional Javanese hot compress filled with aromatic roots, warming ginger, cloves, and premium therapeutic herbs wrapped in organic white linen. Used to relieve sore joints, open energy paths, and warm the body.",
      nl: "Een traditioneel Javaans warm kruidenstempel gevuld met aromatische wortels, verwarmende gember, kruidnagel en premium kruiden verpakt in biologisch wit linnen. Wordt gebruikt om pijnlijke gewrichten te verlichten en het lichaam te verwarmen.",
      id: "Kompres hangat tradisional Jawa yang diisi dengan akar aromatik, jahe yang menghangatkan, cengkeh, dan tanaman obat terapeutik pilihan dalam balutan kain linen organik. Digunakan untuk meredakan nyeri sendi, melancarkan energi, dan menghangatkan tubuh."
    },
    ingredients: {
      en: [
        "Zingiber cassumunar (Plai)",
        "Lemongrass",
        "Kaffir lime leaves",
        "Turmeric root",
        "Camphor & Menthol",
        "Organic Cloves"
      ],
      nl: [
        "Zingiber cassumunar (Plai)",
        "Citroengras",
        "Kaffir limoenblaadjes",
        "Kurkumawortel",
        "Kamfer & Menthol",
        "Biologische Kruidnagel"
      ],
      id: [
        "Bangle / Zingiber cassumunar",
        "Serai Wangi",
        "Daun Jeruk Purut",
        "Rimpang Temulawak",
        "Kamfer & Menthol",
        "Cengkeh Organik"
      ]
    },
    benefits: {
      en: [
        "Instantly relieves muscle cramps and joint pain",
        "Improves local blood circulation",
        "Relieves respiratory congestion with aromatic steam",
        "Soothes backache and neck tension"
      ],
      nl: [
        "Verlicht direct spierkrampen en gewrichtspijn",
        "Verbetert de lokale bloedsomloop",
        "Verlicht ademhalingsproblemen met aromatische stoom",
        "Kalmeert rugpijn en nekspanning"
      ],
      id: [
        "Meredakan kram otot dan nyeri sendi dengan cepat",
        "Meningkatkan sirkulasi darah lokal",
        "Melegakan pernapasan melalui uap aromatik hangat",
        "Menghilangkan pegal punggung dan ketegangan leher"
      ]
    },
    traditionalExplanation: {
      en: "Originating from the central Javanese courts, herbal compresses were steamed and pressed along the body's energy channels (Meridian lines) to induce deep organic healing.",
      nl: "Oorspronkelijk afkomstig uit de Midden-Javaanse hoven, werden kruidenstempels gestoomd en langs de energiekanalen van het lichaam gedrukt om diepe natuurlijke genezing te stimuleren.",
      id: "Berasal dari keraton Jawa Tengah, kompres herbal dikukus lalu ditekan-tekan di sepanjang jalur energi tubuh (meridian) untuk memulihkan kebugaran alami."
    },
    scientificExplanation: {
      en: "Moist heat combined with active botanical compounds like gingerol and camphor penetrates deeply into muscles, reducing inflammation and stiffness.",
      nl: "Vochtige warmte in combinatie met actieve botanische verbindingen zoals gingerol dringt diep door in de spieren, waardoor ontstekingen en stijfheid worden verminderd.",
      id: "Panas lembap berpadu dengan zat aktif botani seperti gingerol dan kamfer meresap jauh ke dalam jaringan otot, mengurangi peradangan dan meredakan kekakuan."
    },
    howToConsume: {
      en: "Steam the compress ball for 10-15 minutes until hot and aromatic. Test temperature on inner arm. Press firmly but gently onto tense body parts.",
      nl: "Stoom het kruidenstempel 10-15 minuten tot het warm en aromatisch is. Test de temperatuur. Druk stevig maar voorzichtig op gespannen lichaamsdelen.",
      id: "Kukus bola kompres herbal selama 10-15 menit hingga panas dan harum. Uji suhu pada lengan bagian dalam terlebih dahulu. Tekankan dengan mantap namun lembut ke bagian tubuh yang pegal."
    },
    recommendedConsumption: {
      en: "Use 2-3 times a week during relaxation rituals. Each compress can be reused up to 3 times if kept refrigerated.",
      nl: "Gebruik 2-3 keer per week tijdens ontspanningsrituelen. Elk stempel kan tot 3 keer hergebruucht worden.",
      id: "Gunakan 2-3 kali seminggu saat ritual relaksasi. Setiap bola kompres dapat digunakan kembali hingga 3 kali jika disimpan di dalam lemari es setelah dipakai."
    },
    whoShouldUse: {
      en: "Highly recommended for individuals with chronic back pain, stiff shoulders, joint fatigue, or cold chills.",
      nl: "Zeer aanbevolen voor mensen met chronische rugpijn, stijve schouders, gewrichtsvermoeidheid of koude rillingen.",
      id: "Sangat disarankan bagi individu dengan nyeri punggung kronis, bahu kaku, kelelahan sendi, atau badan meriang."
    },
    warnings: {
      en: "Do not use directly on open wounds or acute skin infections. Ensure the temperature is safe to avoid burns.",
      nl: "Niet direct gebruiken op open wonden of acute huidinfecties. Zorg ervoor dat de temperatuur veilig is om brandwonden te voorkomen.",
      id: "Jangan digunakan langsung di atas luka terbuka atau infeksi kulit akut. Pastikan suhu kompres aman sebelum ditempelkan ke kulit untuk mencegah luka bakar."
    },
    price: 18.0,
    stock: 40,
    isFeatured: true,
    imageUrl: "/src/assets/images/javanese_herbal_compress_1783856870034.jpg"
  },
  {
    id: "royal-body-scrub",
    name: {
      en: "Royal Jasmine & Sandalwood Lulur Body Scrub",
      nl: "Koninklijke Jasmijn & Sandelhout Lulur Body Scrub",
      id: "Lulur Tradisional Melati & Cendana (Royal Scrub)"
    },
    category: "digestive-health",
    description: {
      en: "An ancient royal beauty recipe. This traditional Javanese 'Lulur' body scrub uses finely ground organic rice powder, fresh turmeric, aromatic sandalwood, and sweet jasmine blossoms to exfoliate, brighten, and scent the skin.",
      nl: "Een eeuwenoud koninklijk schoonheidsrecept. Deze traditionele Javaanse 'Lulur' body scrub gebruikt fijngemalen biologische rijstpoeder, verse kurkuma, aromatisch sandelhout en zoete jasmijn om te exfoliëren en te muren.",
      id: "Resep kecantikan istana kuno. Lulur tradisional Jawa ini menggunakan tepung beras organik halus, kunyit segar, cendana aromatik, dan kelopak melati untuk mengangkat sel kulit mati, mencerahkan, dan mengharumkan kulit."
    },
    ingredients: {
      en: [
        "Finely Ground Jasmine Rice",
        "Aromatic Sandalwood (Santalum album)",
        "Fresh Curcuma extract",
        "Jasmine flower petals",
        "Organic honey",
        "Sweet Almond oil"
      ],
      nl: [
        "Fijngemalen Jasmijnrijst",
        "Aromatisch Sandelhout",
        "Vers Curcuma-extract",
        "Jasmijnblaadjes",
        "Biologische honing",
        "Zoete Amandelolie"
      ],
      id: [
        "Tepung Beras Melati Halus",
        "Kayu Cendana Aromatik",
        "Ekstrak Kunyit Segar",
        "Kelopak Bunga Melati",
        "Madu Organik",
        "Minyak Almon Manis"
      ]
    },
    benefits: {
      en: [
        "Gently exfoliates dead skin cells",
        "Visibly brightens and evens skin tone",
        "Imparts a divine, long-lasting natural royal aroma",
        "Soothes skin irritations and leaves it silky soft"
      ],
      nl: [
        "Exfolieert op milde wijze dode huidcellen",
        "Maakt de huid zichtbaar lichter en egaler",
        "Geeft een heerlijk, langdurig natuurlijk koninklijk aroma",
        "Kalmeert huidirritaties en laat de huid zijdezacht achter"
      ],
      id: [
        "Mengangkat sel kulit mati dengan sangat lembut",
        "Mencerahkan dan meratakan rona kulit secara alami",
        "Memberikan keharuman khas keraton yang mewah dan tahan lama",
        "Menenangkan iritasi kulit dan menjadikannya sehalus sutra"
      ]
    },
    traditionalExplanation: {
      en: "In Javanese palaces, brides-to-be underwent the daily 'Lulur' ritual for 40 days prior to their wedding ceremony to ensure glowing, fragrant, and flawless skin.",
      nl: "In de Javaanse paleizen ondergingen toekomstige bruiden gedurende 40 dagen voor de bruiloft het dagelijkse 'Lulur'-ritueel voor een stralende, geurige huid.",
      id: "Di lingkungan istana Jawa, para calon pengantin wanita menjalani ritual 'Lulur' setiap hari selama 40 hari sebelum upacara pernikahan untuk memastikan kulit bercahaya, harum, dan tanpa cela."
    },
    scientificExplanation: {
      en: "Rice powder is rich in para-aminobenzoic acid which acts as a natural sunscreen, while turmeric contains curcumin which inhibits melanin production for skin brightening.",
      nl: "Rijstpoeder is rijk aan para-aminobenzoëzuur dat werkt als een natuurlijk zonnefilter, terwijl kurkuma melanineproductie remt voor een lichtere huid.",
      id: "Tepung beras kaya akan asam para-aminobenzoat yang bertindak sebagai tabir surya alami, sedangkan kunyit mengandung kurkumin yang menghambat produksi melanin untuk mencerahkan kulit."
    },
    howToConsume: {
      en: "Mix 2-3 tablespoons of powder with warm water or rose water to form a thick paste. Apply all over the body. Let dry slightly, then rub gently in circular motions to scrub off. Rinse thoroughly.",
      nl: "Meng 2-3 eetlepels poeder met warm water of rozenwater tot een dikke pasta. Breng aan op het lichaam. Laat drogen en wrijf zachtjes weg. Spoel af.",
      id: "Campurkan 2-3 sendok makan bubuk lulur dengan air hangat atau air mawar hingga membentuk pasta kental. Oleskan ke seluruh tubuh. Biarkan setengah kering, lalu gosok perlahan dengan gerakan melingkar hingga lulur rontok. Bilas dengan air hingga bersih."
    },
    recommendedConsumption: {
      en: "Use 1-2 times a week during your shower ritual for perfectly renewed skin.",
      nl: "Gebruik 1-2 keer per week tijdens het douchen voor een perfect vernieuwde huid.",
      id: "Gunakan 1-2 kali seminggu saat ritual mandi Anda untuk kulit yang bersih dan diperbarui sempurna."
    },
    whoShouldUse: {
      en: "Perfect for anyone wishing to achieve glowing skin, eliminate body odor, remove dullness, or experience royal pampering.",
      nl: "Perfect voor iedereen die een stralende huid wil, lichaamsgeur wil elimineren, of koninklijke verwennerij wil ervaren.",
      id: "Sangat tepat bagi siapa saja yang mendambakan kulit bercahaya, menyegarkan aroma tubuh, mengatasi kulit kusam, atau menikmati relaksasi ala putri keraton."
    },
    warnings: {
      en: "Do not use on open wounds, acne-prone face, or irritated skin. Stop use if irritation occurs.",
      nl: "Niet gebruiken op open wonden, gezicht met acne of geïrriteerde huid. Stop het gebruik als irritatie optreedt.",
      id: "Jangan digunakan pada luka terbuka, wajah berjerawat, atau kulit yang sedang mengalami iritasi parah. Hentikan penggunaan jika terjadi iritasi."
    },
    price: 15.0,
    stock: 35,
    isFeatured: true,
    imageUrl: "/src/assets/images/royal_body_scrub_1783856884329.jpg"
  },
  {
    id: "frangipani-coconut-body-oil",
    name: {
      en: "Kambodja & Coconut Soothing Body Oil",
      nl: "Kambodja & Kokosverzachtende Lichaamsolie",
      id: "Minyak Tubuh Relaksasi Bunga Kamboja & Kelapa"
    },
    category: "womens-health",
    description: {
      en: "An ultra-nourishing body oil infused with pure Bali Frangipani (Kambodja) blossoms and virgin cold-pressed coconut oil. Locks in intense moisture, restores natural elasticity, and surrounds you with an enchanting tropical aroma.",
      nl: "Een intens voedende lichaamsolie doordrenkt met pure Bali Frangipani (Kambodja) bloesems en koudgeperste kokosolie. Houdt vocht vast, herstelt de elasticiteit en omringt u met een betoverend tropisch aroma.",
      id: "Minyak tubuh yang sangat menutrisi, diperkaya dengan bunga Kamboja Bali murni dan minyak kelapa dara (VCO) perasan dingin. Mengunci kelembapan intensif, mengembalikan elastisitas alami, dan menyelimuti Anda dengan aroma tropis yang menawan."
    },
    ingredients: {
      en: ["Virgin Coconut Oil", "Pure Frangipani (Plumeria) Essential Oil", "Organic Jojoba Oil", "Sunflower Seed Oil", "Vitamin E"],
      nl: ["Extra Vierge Kokosolie", "Pure Frangipani Etherische Olie", "Biologische Jojoba Olie", "Zonnebloemolie", "Vitamine E"],
      id: ["Minyak Kelapa Dara (VCO)", "Minyak Atsiri Kamboja Murni", "Minyak Jojoba Organik", "Minyak Biji Matahari", "Vitamin E"]
    },
    benefits: {
      en: [
        "Provides long-lasting barrier protection and deep skin hydration",
        "Soothes sunburns, skin dryness, and flaky patches",
        "Aromatic compounds evoke feelings of warmth, peace, and deep rest",
        "Absorbs beautifully without leaving a greasy residue"
      ],
      nl: [
        "Biedt langdurige barrièrebescherming en diepe hydratatie",
        "Kalmeert zonnebrand, droogheid en schilferige plekken",
        "Aromatische verbindingen roepen gevoelens van warmte en rust op",
        "Trekt prachtig in zonder een vettig laagje achter te laten"
      ],
      id: [
        "Memberikan perlindungan pelindung kulit dan hidrasi mendalam yang tahan lama",
        "Menenangkan kulit terbakar matahari, kekeringan, dan kulit bersisik",
        "Senyawa aromatik membangkitkan rasa hangat, damai, dan relaksasi mendalam",
        "Meresap dengan indah ke kulit tanpa meninggalkan rasa lengket"
      ]
    },
    traditionalExplanation: {
      en: "Frangipani blossoms (Kambodja) are sacred in Balinese and Javanese spiritual practices. Their nectar is known to calm spiritual distress and invite positive, peaceful energies.",
      nl: "Frangipani-bloesems (Kambodja) zijn heilig in Balinese en Javaanse spirituele praktijken. Hun nectar staat bekend om het kalmeren van de geest.",
      id: "Bunga Kamboja sangat disucikan dalam tradisi spiritual Bali dan Jawa. Aromanya dipercaya menenangkan pikiran yang gundah dan mengundang energi positif serta kedamaian raga."
    },
    scientificExplanation: {
      en: "Medium-chain fatty acids in virgin coconut oil possess high cellular affinity, repairing the lipid barrier while frangipani compounds help reduce physiological stress markers.",
      nl: "Middelketen vetzuren in kokosolie herstellen de lipidenspuit, terwijl frangipani-verbindingen fysiologische stress helpen verminderen.",
      id: "Asam lemak rantai sedang dalam VCO memiliki afinitas seluler yang tinggi untuk memperbaiki pelindung lipid kulit, sementara senyawa kamboja membantu menurunkan indikator stres fisiologis."
    },
    howToConsume: {
      en: "Apply generously all over your body after showering while your skin is still damp. Can also be added directly to warm bathwater for a luxurious soak.",
      nl: "Breng na het douchen royaal aan op het hele lichaam terwijl de huid nog vochtig is. Kan ook aan het badwater worden toegevoegd.",
      id: "Oleskan secara merata ke seluruh tubuh setelah mandi saat kulit masih setengah basah. Dapat juga ditambahkan langsung ke air hangat bak mandi untuk sensasi berendam mewah."
    },
    recommendedConsumption: {
      en: "Use daily after bathing or as a nourishing evening body treatment.",
      nl: "Dagelijks gebruiken na het baden of als voedende avondbehandeling.",
      id: "Gunakan setiap hari setelah mandi atau sebagai perawatan malam hari yang menutrisi kulit."
    },
    whoShouldUse: {
      en: "Ideal for dry or sun-damaged skin, and individuals seeking deep mental relaxation.",
      nl: "Ideaal voor de droge of door de zon beschadigde huid en mensen die diepe ontspanning zoeken.",
      id: "Sangat ideal untuk kulit kering atau terpapar sinar matahari, serta mereka yang mencari ketenangan pikiran mendalam."
    },
    warnings: {
      en: "For external use only. Discontinue if redness or irritation occurs.",
      nl: "Uitsluitend voor uitwendig gebruik. Stop het gebruik bij irritatie.",
      id: "Hanya untuk pemakaian luar. Hentikan pemakaian jika timbul kemerahan atau iritasi."
    },
    price: 16.5,
    stock: 50,
    isFeatured: true,
    imageUrl: "/src/assets/images/aromatherapy_massage_oil_1783856854257.jpg"
  },
  {
    id: "organic-herbal-bath-salts",
    name: {
      en: "Ginger & Pandan Purifying Bath Salts",
      nl: "Gember & Pandan Zuiverend Badzout",
      id: "Garam Mandi Purifikasi Jahe & Pandan Tradisional"
    },
    category: "immune-booster",
    description: {
      en: "Hand-harvested sea crystals combined with therapeutic Epsom salts, dried ginger roots, and aromatic pandan leaves. Restores depleted minerals, detoxifies the body, and relieves aching muscles with natural thermogenic warming.",
      nl: "Met de hand geoogst zeezout gecombineerd met therapeutisch Epsom-zout, gedroogde gemberwortel en aromatische pandanblaadjes. Herstelt mineralen en verlicht vermoeide spieren.",
      id: "Kristal garam laut organik yang dipanen manual, berpadu dengan garam Epsom terapeutik, jahe kering, dan irisan daun pandan wangi. Memulihkan mineral tubuh, mendetoksifikasi racun, dan meredakan otot pegal dengan kehangatan termogenik alami."
    },
    ingredients: {
      en: ["Natural Sea Salt Crystals", "Magnesium Sulfate (Epsom Salt)", "Dried Zingiber officinale (Ginger) Root", "Dehydrated Pandanus amaryllifolius Leaf", "Pandan Essential Oil"],
      nl: ["Natuurlijke Zeezoutkristallen", "Magnesiumsulfaat (Epsom Zout)", "Gedroogde Gemberwortel", "Gedehydrateerde Pandanblaadjes", "Pandan Etherische Olie"],
      id: ["Kristal Garam Laut Alami", "Magnesium Sulfat (Garam Epsom)", "Jahe Kering (Zingiber officinale)", "Irisan Daun Pandan Kering", "Minyak Atsiri Pandan"]
    },
    benefits: {
      en: [
        "Soothes muscle spasms, stiffness, and joint aches",
        "Warms the body's core temperature to stimulate perspiration and detoxification",
        "Pandan aroma calms hyperactive brain waves and relaxes nerves",
        "Softens dry skin and purges pores from impurities"
      ],
      nl: [
        "Kalmeert spierkrampen, stijfheid en gewrichtspijn",
        "Verwarmt het lichaam om transpiratie en ontgifting te stimuleren",
        "Pandan-aroma kalmeert hyperactieve hersengolven",
        "Verzacht de droge huid en reinigt de poriën"
      ],
      id: [
        "Meredakan kram otot, kekakuan, dan linu pada persendian",
        "Menghangatkan suhu inti tubuh untuk merangsang keringat sehat dan detoksifikasi",
        "Aroma pandan yang harum menenangkan saraf yang tegang",
        "Menghaluskan kulit kasar dan membersihkan pori-pori dari kotoran"
      ]
    },
    traditionalExplanation: {
      en: "In Javanese herbal tradition (Mandi Rempah), bathing with warm water infused with roots and leaves was prescribed to eliminate body chills (masuk angin) and recover post-childbirth or after hard manual work.",
      nl: "In de Javaanse kruidentraditie (Mandi Rempah) werd een warm bad met wortels en bladeren voorgeschreven om kou te verdrijven en te herstellen na zwaar werk.",
      id: "Dalam tradisi herbal Jawa (Mandi Rempah), berendam air hangat yang dicampur rimpang dan dedaunan berkhasiat menghilangkan masuk angin, memulihkan kelelahan tubuh setelah bekerja keras, serta menyegarkan badan kembali."
    },
    scientificExplanation: {
      en: "Epsom salt releases magnesium ions that are absorbed dermally to reduce systemic muscle spasms, while gingerol compounds elevate localized heat, relaxing vascular tissues.",
      nl: "Epsom-zout geeft magnesiumionen af die spierkrampen verminderen, terwijl gemberverbindingen de lokale warmte verhogen en bloedvaten ontspannen.",
      id: "Garam Epsom melepaskan ion magnesium yang diserap kulit untuk mengurangi kram otot, sedangkan senyawa gingerol meningkatkan suhu lokal tubuh guna merelaksasi pembuluh darah."
    },
    howToConsume: {
      en: "Dissolve 4-6 tablespoons of bath salts in a warm foot tub or full-sized bathtub. Soak for 15-20 minutes. Breathe in the aromatic pandan-ginger steam deeply.",
      nl: "Los 4-6 eetlepels badzout op in een warm voetenbad of ligbad. Week 15-20 minuten. Adem de aromatische stoom diep in.",
      id: "Larutkan 4-6 sendok makan garam mandi ke dalam bak berendam hangat atau baskom rendaman kaki. Rendam tubuh atau kaki Anda selama 15-20 menit sambil menghirup uap pandan-jahe yang melegakan."
    },
    recommendedConsumption: {
      en: "Enjoy 2-3 times a week, especially after physically demanding activities or before sleeping.",
      nl: "Geniet 2-3 keer per week, vooral na zware fysieke inspanning of voor het slapengaan.",
      id: "Gunakan 2-3 kali seminggu, sangat dianjurkan setelah aktivitas fisik yang berat atau sebelum tidur malam."
    },
    whoShouldUse: {
      en: "Perfect for those with tired feet, cold extremities, heavy physical fatigue, or sleeplessness.",
      nl: "Perfect voor mensen met vermoeide voeten, koude ledematen, zware fysieke vermoeidheid of slapeloosheid.",
      id: "Sangat cocok untuk penderita kaki lelah, meriang, insomnia, atau mereka yang mengalami kelelahan fisik berat."
    },
    warnings: {
      en: "Avoid if you have open sores or severe active eczema. Do not ingest.",
      nl: "Vermijd bij open wonden of ernstig eczeem. Niet inslikken.",
      id: "Hindari penggunaan jika terdapat luka terbuka lebar atau eksim akut. Tidak untuk dikonsumsi."
    },
    price: 12.0,
    stock: 60,
    isFeatured: true,
    imageUrl: "/src/assets/images/jasmine_bath_salts_img_1783867901388.jpg"
  },
  {
    id: "royal-hair-creambath-mask",
    name: {
      en: "Royal Javanese Kemiri & Aloe Hair Creambath Mask",
      nl: "Koninklijk Javaans Kemiri & Aloë Haarmasker",
      id: "Creambath Kemiri & Lidah Buaya Tradisional Kraton"
    },
    category: "womens-health",
    description: {
      en: "A deeply conditioning, traditional hair spa cream combining roasted Candlenut (Kemiri) oil, fresh Aloe Vera, and celery extracts. Nourishes dry hair roots, promotes robust hair growth, and leaves locks silky, thick, and beautifully fragrant.",
      nl: "Een diep conditionerend, traditioneel haarspa-masker met geroosterde Candlenut (Kemiri) olie, verse Aloë Vera en selderij-extracten. Voedt droog haar en stimuleert haargroei.",
      id: "Krim perawatan rambut spa tradisional yang menutrisi mendalam, memadukan minyak Kemiri bakar asli, lidah buaya segar, dan ekstrak seledri. Menutrisi akar rambut yang kering, merangsang pertumbuhan rambut lebat, serta menjadikannya berkilau hitam, halus, dan harum alami."
    },
    ingredients: {
      en: ["Pure Candlenut (Aleurites moluccanus) Oil", "Organic Aloe Barbadensis Leaf Juice", "Apium graveolens (Celery) Extract", "Virgin Coconut Oil", "Jasmine Floral Wax", "Panthenol (Pro-Vitamin B5)"],
      nl: ["Pure Candlenut (Kemiri) Olie", "Biologische Aloë Vera", "Selderij-extract", "Kokosolie", "Jasmijnwas", "Panthenol"],
      id: ["Minyak Kemiri Bakar Murni", "Jus Lidah Buaya Organik (Aloe Vera)", "Ekstrak Daun Seledri", "Minyak Kelapa (VCO)", "Lilin Bunga Melati", "Panthenol (Pro-Vitamin B5)"]
    },
    benefits: {
      en: [
        "Deeply conditions dry, brittle, or chemically treated hair",
        "Minyak Kemiri is clinically proven to strengthen roots and reduce hair fall",
        "Aloe Vera cools and soothes itchy, dry, or dandruff-prone scalp",
        "Imbues hair with a traditional royal jasmine fragrance that lasts for days"
      ],
      nl: [
        "Voedt droog, broos of chemisch behandeld haar intensief",
        "Kemiri-olie versterkt de haarwortels en vermindert haaruitval",
        "Aloë Vera koelt en kalmeert een jeukende, droge of schilferige hoofdhuid",
        "Geeft het haar een traditionele koninklijke jasmijngeur"
      ],
      id: [
        "Menutrisi dan memperbaiki rambut kering, bercabang, atau rusak akibat pewarnaan",
        "Minyak Kemiri terbukti memperkuat akar rambut dan mengurangi kerontokan",
        "Lidah Buaya mendinginkan dan menenangkan kulit kepala yang gatal atau berketombe",
        "Memberikan keharuman melati keraton yang anggun dan tahan lama pada helai rambut"
      ]
    },
    traditionalExplanation: {
      en: "The Javanese 'Creambath' is an essential weekly crown-care ritual. Javanese royal ladies used freshly pressed candle nuts and aloe stalks to maintain their famous long, heavy, obsidian-black hair.",
      nl: "De Javaanse 'Creambath' is een wekelijks verzorgingsritueel. Javaanse koninklijke dames gebruikten Kemiri-noten en Aloë-stengels om hun legendarische lange, zwarte haar te verzorgen.",
      id: "Ritual 'Creambath' Jawa adalah perawatan mahkota rambut yang wajib dilakukan setiap minggu. Para putri keraton menggunakan kemiri bakar hangat dan pelepah lidah buaya segar untuk menjaga rambut hitam lebat dan sehat berkilau."
    },
    scientificExplanation: {
      en: "Candlenut oil is extremely rich in linoleic and linolenic essential fatty acids that penetrate hair shafts to repair damage, while proteolytic enzymes in aloe clear dead skin cells on the scalp.",
      nl: "Kemiri-olie is extreem rijk aan essentiële vetzuren die de haarschacht binnendringen, terwijl aloë-enzymen dode huidcellen op de hoofdhuid reinigen.",
      id: "Minyak kemiri kaya akan asam lemak esensial linoleat dan linolenat yang meresap ke batang rambut untuk memperbaiki kerusakan keratin, sementara enzim proteolitik dalam lidah buaya meningkatkan kesuburan kulit kepala."
    },
    howToConsume: {
      en: "After shampooing, apply a generous amount from roots to hair tips. Massage your scalp gently for 5 minutes. Wrap hair in a warm wet towel for 10-15 minutes, then rinse thoroughly with warm water.",
      nl: "Na het wassen royaal aanbrengen van de wortels tot de punten. Masseer de hoofdhuid 5 minuten. Wikkel in een warme handdoek voor 10-15 minuten en spoel uit.",
      id: "Setelah keramas, oleskan krim secukupnya dari kulit kepala hingga ujung rambut. Masseer kulit kepala dengan lembut selama 5 menit. Bungkus rambut dengan handdoek hangat selama 10-15 menit agar nutrisi meresap maksimal, lalu bilas bersih dengan air hangat."
    },
    recommendedConsumption: {
      en: "Use once a week as a deeply restorative hair spa mask.",
      nl: "Eenmaal per week gebruiken als diep herstellend haarmasker.",
      id: "Gunakan sekali seminggu sebagai ritual masker spa rambut intensif."
    },
    whoShouldUse: {
      en: "Perfect for dry hair, damaged ends, itchy scalp, hair thinning, or anyone wanting a luxurious traditional Javanese hair care experience.",
      nl: "Perfect voor droog haar, beschadigde punten, jeukende hoofdhuid, haaruitval of liefhebbers van authentieke haarverzorging.",
      id: "Sangat dianjurkan untuk rambut kering kusam, ujung rambut bercabang, kulit kepala gatal/berketombe, rambut rontok, atau siapa saja yang menginginkan sensasi spa rambut mewah ala keraton."
    },
    warnings: {
      en: "For external use only. If eye contact occurs, rinse immediately with clean water.",
      nl: "Uitsluitend voor uitwendig gebruik. Bij contact met de ogen onmiddellijk uitspoelen met water.",
      id: "Hanya untuk pemakaian luar. Jika terkena mata, segera bilas dengan air bersih."
    },
    price: 19.5,
    stock: 45,
    isFeatured: true,
    imageUrl: "/src/assets/images/herbal_hair_tonic_img_1783867868700.jpg"
  }
];

const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: "javanese-massage-art",
    title: {
      en: "The Healing Touch: Sacred Art of Javanese Royal Massages",
      nl: "De Genezende Aanraking: Heilige Kunst van Javaanse Koninklijke Massages",
      id: "Sentuhan yang Menyembuhkan: Seni Suci Pijat Keraton Jawa Tradisional"
    },
    content: {
      en: "For over a thousand years, Javanese royal palaces preserved the traditional art of body healing and massage as a form of sacred holistic wellness. At SR Natural, we bring this authentic heritage directly to your doorstep. Javanese massage employs deep, firm strokes with aromatic botanical oils to ease muscular tension, improve blood circulation, and realign the spirit with the physical body.\n\nHistorically documented on the ancient 9th-century reliefs of Borobudur, therapists are depicted using natural oils and palm pressure to restore vital energies. Our home service therapies respect this precise lineages, creating a complete spa sanctuary in your private space.",
      nl: "Al meer dan duizend jaar bewaarde de Javaanse koninklijke paleizen de traditionele kunst van lichaamsgenezing en massage als een vorm van heilige holistische wellness. Bij SR Natural brengen we dit authentieke erfgoed rechtstreeks naar uw voordeur. Javaanse massage maakt gebruik van diepe, stevige bewegingen met aromatische botanische oliën om spierspanning te verlichten, de bloedsomloop te verbeteren en de geest opnieuw in lijn te brengen met het fysieke lichaam.",
      id: "Selama lebih dari seribu tahun, istana kerajaan Jawa melestarikan seni tradisional penyembuhan tubuh dan pijat sebagai bentuk kebugaran holistik yang suci. Di SR Natural, kami menghadirkan warisan otentik ini langsung ke depan pintu Anda. Pijat Jawa menggunakan usapan yang dalam dan mantap dengan minyak botani aromatik untuk meredakan ketegangan otot, melancarkan sirkulasi darah, dan menyelaraskan kembali jiwa dengan raga."
    },
    excerpt: {
      en: "Explore the profound spiritual and physical benefits of Javanese royal massages and how warm botanical oils soothe modern stress.",
      nl: "Ontdek de diepe spirituele en fysieke voordelen van Javaanse koninklijke massages en hoe warme botanische oliën moderne stress verzachten.",
      id: "Jelajahi manfaat spiritual dan fisik yang mendalam dari pijat kerajaan Jawa dan bagaimana minyak botani hangat meredakan stres modern."
    },
    author: "Dewi Sekartaji",
    date: "2026-07-08",
    category: { en: "Javanese Wisdom", nl: "Javaanse Wijsheid", id: "Kearifan Jawa" },
    seoKeywords: {
      en: [
        "Javanese massage Amsterdam",
        "traditional home massage NL",
        "royal spa therapy Netherlands",
        "SR Natural massage services"
      ],
      nl: [
        "Javaanse massage Amsterdam",
        "traditionele massage aan huis",
        "koninklijke spa therapie Nederland",
        "SR Natural massage diensten"
      ],
      id: [
        "pijat panggilan belanda",
        "pijat jawa amsterdam",
        "home service massage netherlands",
        "terapi spa tradisional jawa"
      ]
    },
    imageUrl: "/src/assets/images/full_body_massage_luxury_1783855796402.jpg"
  },
  {
    id: "benefits-of-herbal-compress",
    title: {
      en: "The Science of Steam: Therapeutic Benefits of Warm Herbal Compresses",
      nl: "De Wetenschap van Stoom: Therapeutische Voordelen van Warme Kruidenstempels",
      id: "Sains di Balik Uap: Manfaat Terapi Kompres Herbal Hangat Tradisional"
    },
    content: {
      en: "For centuries, traditional Javanese healers applied hot herbal compresses (known as *Pulasari* or *Kukusan*) along the meridian energy lines to alleviate bodily blockages, chronic aches, and joint stiffness. Today, modern physical therapy validates these methods, proving that the synergy of heat and organic essential oils acts directly on the nervous system to trigger muscle tissue recovery.\n\nWhen a steamed herbal compress filled with gingerol-rich ginger, lemongrass, and camphor is pressed onto the skin, the blood vessels expand, allowing oxygenated blood to rush into tense muscles. Simultaneously, the hot vapor releases essential oils that are inhaled, inducing a state of parasympathetic nervous relaxation that lowers cortisol levels.",
      nl: "Eeuwenlang brachten traditionele Javaanse genezers warme kruidenstempels aan op de energiebanen van het lichaam om blokkades, chronische pijn en gewrichtsstijfheid te verlichten. Tegenwoordig bevestigt de moderne fysiotherapie deze methoden en bewijst dat de synergie van warmte en biologische oliën direct inwerkt op het zenuwstelsel.",
      id: "Selama berabad-abad, tabib tradisional Jawa menempelkan kompres herbal hangat (dikenal sebagai *Pulasari*) di sepanjang meridian energi untuk meredakan sumbatan tubuh, nyeri kronis, dan kekakuan sendi. Hari ini, terapi fisik modern membenarkan metode ini, membuktikan bahwa sinergi panas dan minyak esensial organik bekerja langsung pada sistem saraf untuk memicu pemulihan jaringan otot."
    },
    excerpt: {
      en: "Discover the powerful combination of moist heat and active botanicals that makes traditional compresses highly effective for joint and muscle recovery.",
      nl: "Ontdek de krachtige combinatie van vochtige warmte en actieve botanische stoffen die traditionele kruidenstempels effectief maakt voor spierherstel.",
      id: "Temukan kombinasi kuat dari panas lembap dan tanaman obat aktif yang membuat kompres tradisional sangat efektif untuk pemulihan sendi dan otot."
    },
    author: "Dr. Lukas van der Meer",
    date: "2026-07-10",
    category: { en: "Scientific Research", nl: "Wetenschappelijk Onderzoek", id: "Penelitian Ilmiah" },
    seoKeywords: {
      en: [
        "warm herbal compress therapy",
        "Pulasari compress benefits",
        "organic muscle recovery",
        "traditional spa science"
      ],
      nl: [
        "warme kruidenstempel therapie",
        "kruidenstempel voordelen",
        "biologisch spierherstel",
        "traditionele spa wetenschap"
      ],
      id: [
        "kompres herbal hangat",
        "manfaat pulasari jawa",
        "pemulihan otot alami",
        "sains terapi spa tradisional"
      ]
    },
    imageUrl: "/src/assets/images/javanese_herbal_compress_1783856870034.jpg"
  },
  {
    id: "royal-bridal-lulur-secrets",
    title: {
      en: "The Sacred Ritual of Royal Javanese Lulur for Luminous Skin",
      nl: "Het Heilige Ritueel van Koninklijke Javaanse Lulur voor een Stralende Huid",
      id: "Rahasia Lulur Pengantin Jawa: Ritual Kecantikan Kuno untuk Kulit Berkilau"
    },
    content: {
      en: "For centuries, Javanese princesses inside the Kraton (Royal Palaces) underwent a daily purification ritual called Lulur. Traditionally prepared 40 days before a wedding, this sacred treatment exfoliates, brightens, and perfumes the skin naturally.\n\nOur signature Royal Body Scrub utilizes this exact heritage formulation, blending finely ground organic rice, wild ginger, sandalwood, and aromatic jasmine. Rice powder acts as a natural gentle abrasive that lifts dead skin cells, while sandalwood offers antibacterial compounds that clear blemishes. Jasmine blossoms infuse the body with a long-lasting, calming royal scent. Today, Javanese Lulur is celebrated globally as one of the most effective and luxurious organic skin-rejuvenation therapies.",
      nl: "Eeuwenlang ondergingen Javaanse prinsessen in de Kraton (koninklijke paleizen) een dagelijks reinigingsritueel genaamd Lulur. Traditioneel 40 dagen voor een huwelijk voorbereid, exfolieert, verheldert en parfumeert deze heilige behandeling de huid op natuurlijke wijze. Onze kenmerkende Royal Body Scrub maakt gebruik van exact deze erfgoedformule om uw huid de koninklijke glans te geven.",
      id: "Selama berabad-abad, para putri kerajaan Jawa di dalam Keraton menjalani ritual pembersihan harian yang disebut Lulur. Secara tradisional disiapkan 40 hari sebelum hari pernikahan, terapi suci ini mengeksfoliasi, mencerahkan, dan mengharumkan kulit secara alami.\n\nLulur Cendana Melati (Royal Body Scrub) kami menggunakan formulasi warisan otentik ini, memadukan beras organik giling halus, temu kunci, cendana, dan melati aromatik. Tepung beras bertindak sebagai pengelupas alami lembut yang mengangkat sel kulit mati, sementara cendana menawarkan senyawa antibakteri yang membersihkan noda wajah. Bunga melati memberikan keharuman royal yang menenangkan dan tahan lama. Hari ini, Lulur Jawa dirayakan secara global sebagai salah satu terapi peremajaan kulit organik yang paling efektif dan mewah."
    },
    excerpt: {
      en: "Discover how ancient palace princesses used organic rice powder, sandalwood, and fresh jasmine to achieve porcelain-smooth skin naturally.",
      nl: "Ontdek hoe oude paleisprinsessen biologisch rijstpoeder, sandelhout en verse jasmijn gebruikten voor een porseleinzachte huid.",
      id: "Temukan bagaimana putri keraton kuno menggunakan bubuk beras organik, cendana, dan melati segar untuk mendapatkan kulit selembut porselen secara alami."
    },
    author: "Roro Ajeng",
    date: "2026-07-12",
    category: { en: "Royal Beauty Care", nl: "Koninklijke Schoonheid", id: "Perawatan Kecantikan Keraton" },
    seoKeywords: {
      en: ["Javanese lulur scrub NL", "royal wedding scrub", "sandalwood body scrub", "traditional Javanese beauty"],
      nl: ["Javaanse lulur scrub NL", "koninklijke bruidsscrub", "sandelhout bodyscrub", "traditionele Javaanse schoonheid"],
      id: ["lulur pengantin jawa belanda", "lulur cendana melati", "perawatan kulit keraton", "eksfoliasi alami jawa"]
    },
    imageUrl: "/src/assets/images/royal_body_scrub_1783856884329.jpg"
  },
  {
    id: "healing-power-of-kunyit-asam",
    title: {
      en: "Jamu Kunyit Asam: The Ancient Golden Elixir of Javanese Health",
      nl: "Jamu Kunyit Asam: Het Oude Gouden Elixer van Javaanse Gezondheid",
      id: "Kunyit Asam: Ramuan Emas Kuno Warisan Leluhur untuk Kebugaran Wanita"
    },
    content: {
      en: "In Java, wellness is drank as much as it is massaged. Jamu, the traditional herbal medicine system of Indonesia, relies heavily on rhizomes to keep the body balanced. Chief among these remedies is Kunyit Asam, a tangy golden beverage crafted from fresh turmeric and sweet tamarind.\n\nModern scientific research heavily validates the health-promoting qualities of this drink. Turmeric contains curcumin, a powerful natural anti-inflammatory agent that acts similarly to over-the-counter painkillers without side effects. Tamarind provides rich doses of vitamin C and tartaric acid, which enhance digestion and boost the body's immune system. Regular consumption balances hormones, clears skin from within, and detoxifies vital organs. At SR Natural, we honor this wisdom, aligning our external therapies with Javanese dietary balance.",
      nl: "In Java wordt wellness evenzeer gedronken als gemasseerd. Jamu, het traditionele kruidengeneeskundesysteem van Indonesië, vertrouwt sterk op wortelstokken om het lichaam in balans te houden. De belangrijkste hiervan is Kunyit Asam, een verfrissend gouden drankje gemaakt van verse kurkuma en zoete tamarinde.",
      id: "Di Jawa, kebugaran tidak hanya dirawat lewat pijatan, tetapi juga diminum. Jamu, sistem pengobatan herbal tradisional Indonesia, sangat bergantung pada rimpang untuk menjaga keseimbangan tubuh. Salah satu ramuan utama adalah Kunyit Asam, minuman emas menyegarkan yang dibuat dari kunyit segar dan asam jawa pilihan.\n\nPenelitian ilmiah modern sangat membenarkan khasiat peningkat kesehatan dari minuman ini. Kunyit mengandung kurkumin, agen anti-inflamasi alami yang kuat yang bekerja mirip dengan pereda nyeri tanpa efek samping. Asam jawa menyediakan dosis kaya vitamin C dan asam tartarat, meningkatkan pencernaan, dan meningkatkan sistem kekebalan tubuh. Konsumsi teratur dapat menyeimbangkan hormon, mencerahkan kulit dari dalam, dan mendetoksifikasi organ-organ vital."
    },
    excerpt: {
      en: "Unveil the anti-inflammatory and cellular renewal properties of Indonesia's most famous herbal wellness beverage.",
      nl: "Onthul de ontstekingsremmende en celvernieuwende eigenschappen van de meest beroemde kruidendrank van Indonesië.",
      id: "Ungkap khasiat anti-inflamasi dan pembaruan sel dari minuman kesehatan herbal paling terkenal di Indonesia."
    },
    author: "Kartika Hadi",
    date: "2026-07-13",
    category: { en: "Traditional Jamu", nl: "Traditionele Jamu", id: "Jamu Tradisional" },
    seoKeywords: {
      en: ["jamu drink Netherlands", "kunyit asam benefits", "turmeric tamarind health", "Javanese wellness elixir"],
      nl: ["jamu drank Nederland", "kunyit asam voordelen", "kurkuma tamarinde gezondheid", "Javaans wellness elixer"],
      id: ["minuman jamu belanda", "khasiat kunyit asam", "antioksidan kunyit asam jawa", "jamu tradisional wanita"]
    },
    imageUrl: "/src/assets/images/kunyit_asam_bottle_1783604890128.jpg"
  }
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Saskia de Vries",
    role: { en: "Yoga Instructor, Amsterdam", nl: "Yogadocent, Amsterdam", id: "Instruktur Yoga, Amsterdam" },
    text: {
      en: "Booking a home service Javanese massage with SR Natural has completely transformed my weekly self-care routine. The lemongrass and lavender oil feels incredibly nourishing, and the therapeutic touch melts all my stress away. Truly a premium experience in the comfort of my home.",
      nl: "Het boeken van een Javaanse massage aan huis bij SR Natural heeft mijn wekelijkse zelfverzorging volledig getransformeerd. De citroengras- en lavendelolie voelt ongelooflijk voedend en alle stress smelt weg.",
      id: "Memesan layanan pijat Jawa kunjungan rumah dari SR Natural telah sepenuhnya mengubah rutinitas perawatan diri mingguan saya. Minyak serai dan lavender terasa sangat menutrisi raga, dan sentuhan terapeutiknya melelehkan seluruh stres saya."
    },
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "test-2",
    name: "Andres Siregar",
    role: { en: "Software Engineer, Rotterdam", nl: "Softwareontwikkelaar, Rotterdam", id: "Insinyur Perangkat Lunak, Rotterdam" },
    text: {
      en: "As a software engineer sitting in front of screens all day, my neck and shoulders were constantly stiff. The warm herbal compress and deep-tissue Javanese massage from SR Natural cured my physical tension instantly. Absolute perfection!",
      nl: "Als softwareontwikkelaar die de hele dag achter schermen zit, waren mijn nek en schouders constant stijf. Het warme kruidenstempel en de diepe Javaanse massage hebben mijn fysieke spanning direct verholpen.",
      id: "Sebagai insinyur perangkat lunak yang duduk di depan layar seharian, leher dan bahu saya selalu kaku. Kompres herbal hangat dan pijat dalam ala Jawa dari SR Natural menghilangkan ketegangan fisik saya seketika. Sempurna!"
    },
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

const DEFAULT_SEO: SeoSettings = {
  title: {
    en: "SR Natural | Premium Traditional Javanese Massage & Spa Wellness Netherlands",
    nl: "SR Natural | Premium Traditionele Javaanse Massage & Spa Wellness Nederland",
    id: "SR Natural | Layanan Pijat Jawa Premium & Produk Spa Tradisional di Belanda"
  },
  description: {
    en: "Indulge in traditional Javanese home service massages and premium organic spa wellness products in the Netherlands. Experience ultimate relaxation, deep muscle recovery, and royal beauty care.",
    nl: "Geniet van traditionele Javaanse massages aan huis en premium biologische spa-wellnessproducten in Nederland. Ervaar ultieme ontspanning en koninklijke schoonheidsverzorging.",
    id: "Nikmati layanan pijat tradisional Jawa kunjungan rumah (home service) dan produk spa wellness organik premium di Belanda. Rasakan relaksasi mendalam, kesegaran tubuh, dan perawatan kecantikan ala keraton."
  },
  keywords: {
    en: [
      "premium javanese massage amsterdam",
      "home visit massage netherlands",
      "organic spa products rotterdam",
      "traditional herbal compress",
      "stress relief wellness",
      "royal beauty lulur scrub"
    ],
    nl: [
      "premium javaanse massage amsterdam",
      "massage aan huis nederland",
      "biologische spa producten rotterdam",
      "traditioneel kruidenstempel",
      "ontspanning en wellness",
      "koninklijke lulur scrub"
    ],
    id: [
      "pijat panggilan belanda",
      "home service massage amsterdam",
      "produk spa organik premium",
      "kompres herbal hangat jawa",
      "lulur tradisional melati cendana",
      "relaksasi kebugaran keluarga"
    ]
  }
};

const DEFAULT_BUSINESS: BusinessInfo = {
  phone: '+31684861301',
  email: 'info@javaherbal.nl',
  address: 'Keizersgracht 424, 1016 EK Amsterdam, Netherlands',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d2436.03554181816!2d4.8837311!3d52.3676759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c609c1388b1fc5%3A0x6b63d91cf9723ec!2sKeizersgracht%20424%2C%201016%20EK%20Amsterdam!5e0!3m2!1sen!2snl!4v1783604900000!5m2!1sen!2snl',
  openingHours: {
    en: 'Monday - Saturday: 09:00 - 18:00, Sunday: Closed',
    nl: 'Maandag - Zaterdag: 09:00 - 18:00, Zondag: Gesloten',
    id: 'Senin - Sabtu: 09:00 - 18:00, Minggu: Tutup'
  },
  socialMedia: {
    instagram: 'https://instagram.com/java.herbal',
    facebook: 'https://facebook.com/java.herbal',
    whatsapp: 'https://wa.me/31684861301'
  }
};

const DEFAULT_SERVICES: MassageService[] = [
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

// Default secure admin: username "admin", password "srn2026"
const DEFAULT_USERS = [
  {
    id: 'admin-1',
    username: 'admin',
    passwordHash: 'srn2026' // simple password for admin access
  }
];

let memoryDb: DatabaseSchema | null = null;
let isInitializing = false;

async function syncWithCloudSQL() {
  console.log('Synchronizing with Cloud SQL PostgreSQL...');
  try {
    // 1. Users
    const dbUsers = await db.select().from(users);
    if (dbUsers.length === 0) {
      console.log('Seeding users into Cloud SQL...');
      for (const u of DEFAULT_USERS) {
        await db.insert(users).values({
          id: u.id,
          uid: u.id,
          username: u.username,
          passwordHash: u.passwordHash,
          email: 'admin@djamoe.nl'
        });
      }
    }

    // 2. Products
    const dbProducts = await db.select().from(products);
    if (dbProducts.length === 0) {
      console.log('Seeding products into Cloud SQL...');
      for (const p of DEFAULT_PRODUCTS) {
        await db.insert(products).values(p);
      }
    }

    // 3. Blogs
    const dbBlogs = await db.select().from(blogs);
    if (dbBlogs.length === 0) {
      console.log('Seeding blogs into Cloud SQL...');
      for (const b of DEFAULT_BLOGS) {
        await db.insert(blogs).values(b);
      }
    }

    // 4. Testimonials
    const dbTestimonials = await db.select().from(testimonials);
    if (dbTestimonials.length === 0) {
      console.log('Seeding testimonials into Cloud SQL...');
      for (const t of DEFAULT_TESTIMONIALS) {
        await db.insert(testimonials).values(t);
      }
    }

    // 5. SEO Settings
    const dbSeo = await db.select().from(seoSettings);
    if (dbSeo.length === 0) {
      console.log('Seeding SEO settings into Cloud SQL...');
      await db.insert(seoSettings).values({
        id: 'default',
        title: DEFAULT_SEO.title,
        description: DEFAULT_SEO.description,
        keywords: DEFAULT_SEO.keywords
      });
    }

    // 6. Business Info
    const dbBusiness = await db.select().from(businessInfo);
    if (dbBusiness.length === 0) {
      console.log('Seeding business info into Cloud SQL...');
      await db.insert(businessInfo).values({
        id: 'default',
        phone: DEFAULT_BUSINESS.phone,
        email: DEFAULT_BUSINESS.email,
        address: DEFAULT_BUSINESS.address,
        mapsEmbedUrl: DEFAULT_BUSINESS.mapsEmbedUrl,
        openingHours: DEFAULT_BUSINESS.openingHours,
        socialMedia: DEFAULT_BUSINESS.socialMedia
      });
    }

    // 7. Services
    const dbServices = await db.select().from(services);
    if (dbServices.length === 0) {
      console.log('Seeding services into Cloud SQL...');
      for (const s of DEFAULT_SERVICES) {
        await db.insert(services).values(s);
      }
    }

    const currentUsers = await db.select().from(users);
    const currentProducts = await db.select().from(products);
    const currentBlogs = await db.select().from(blogs);
    const currentTestimonials = await db.select().from(testimonials);
    const currentSeo = await db.select().from(seoSettings);
    const currentBusiness = await db.select().from(businessInfo);
    const currentServices = await db.select().from(services);
    const currentOrders = await db.select().from(orders);

    memoryDb = {
      users: currentUsers.map(u => ({
        id: u.id,
        username: u.username || 'admin',
        passwordHash: u.passwordHash || 'srn2026'
      })),
      products: currentProducts as Product[],
      blogs: currentBlogs as BlogPost[],
      testimonials: currentTestimonials as Testimonial[],
      seoSettings: {
        title: (currentSeo[0]?.title as any) || DEFAULT_SEO.title,
        description: (currentSeo[0]?.description as any) || DEFAULT_SEO.description,
        keywords: (currentSeo[0]?.keywords as any) || DEFAULT_SEO.keywords
      },
      businessInfo: {
        phone: currentBusiness[0]?.phone || DEFAULT_BUSINESS.phone,
        email: currentBusiness[0]?.email || DEFAULT_BUSINESS.email,
        address: currentBusiness[0]?.address || DEFAULT_BUSINESS.address,
        mapsEmbedUrl: currentBusiness[0]?.mapsEmbedUrl || DEFAULT_BUSINESS.mapsEmbedUrl,
        openingHours: (currentBusiness[0]?.openingHours as any) || DEFAULT_BUSINESS.openingHours,
        socialMedia: (currentBusiness[0]?.socialMedia as any) || DEFAULT_BUSINESS.socialMedia
      },
      services: currentServices as MassageService[],
      orders: currentOrders as Order[]
    };

    console.log('Cloud SQL synchronization and local cache population complete!');
  } catch (err) {
    console.error('Error during Cloud SQL synchronization:', err);
  } finally {
    isInitializing = false;
  }
}

export async function syncWriteToCloudSQL(data: DatabaseSchema) {
  console.log('Persisting changes to Cloud SQL PostgreSQL in the background...');
  try {
    // 1. Products
    const prodIds = data.products.map(p => p.id);
    if (prodIds.length > 0) {
      await db.delete(products).where(notInArray(products.id, prodIds));
    } else {
      await db.delete(products);
    }
    for (const p of data.products) {
      await db.insert(products).values(p).onConflictDoUpdate({
        target: products.id,
        set: p
      });
    }

    // 2. Blogs
    const blogIds = data.blogs.map(b => b.id);
    if (blogIds.length > 0) {
      await db.delete(blogs).where(notInArray(blogs.id, blogIds));
    } else {
      await db.delete(blogs);
    }
    for (const b of data.blogs) {
      await db.insert(blogs).values(b).onConflictDoUpdate({
        target: blogs.id,
        set: b
      });
    }

    // 3. Testimonials
    const testIds = data.testimonials.map(t => t.id);
    if (testIds.length > 0) {
      await db.delete(testimonials).where(notInArray(testimonials.id, testIds));
    } else {
      await db.delete(testimonials);
    }
    for (const t of data.testimonials) {
      await db.insert(testimonials).values(t).onConflictDoUpdate({
        target: testimonials.id,
        set: t
      });
    }

    // 4. Services
    if (data.services) {
      const srvIds = data.services.map(s => s.id);
      if (srvIds.length > 0) {
        await db.delete(services).where(notInArray(services.id, srvIds));
      } else {
        await db.delete(services);
      }
      for (const s of data.services) {
        await db.insert(services).values(s).onConflictDoUpdate({
          target: services.id,
          set: s
        });
      }
    }

    // 5. Orders
    const ordIds = data.orders.map(o => o.id);
    if (ordIds.length > 0) {
      await db.delete(orders).where(notInArray(orders.id, ordIds));
    } else {
      await db.delete(orders);
    }
    for (const o of data.orders) {
      await db.insert(orders).values(o).onConflictDoUpdate({
        target: orders.id,
        set: o
      });
    }

    // 6. SEO Settings
    await db.insert(seoSettings).values({
      id: 'default',
      title: data.seoSettings.title,
      description: data.seoSettings.description,
      keywords: data.seoSettings.keywords
    }).onConflictDoUpdate({
      target: seoSettings.id,
      set: {
        title: data.seoSettings.title,
        description: data.seoSettings.description,
        keywords: data.seoSettings.keywords
      }
    });

    // 7. Business Info
    await db.insert(businessInfo).values({
      id: 'default',
      phone: data.businessInfo.phone,
      email: data.businessInfo.email,
      address: data.businessInfo.address,
      mapsEmbedUrl: data.businessInfo.mapsEmbedUrl,
      openingHours: data.businessInfo.openingHours,
      socialMedia: data.businessInfo.socialMedia
    }).onConflictDoUpdate({
      target: businessInfo.id,
      set: {
        phone: data.businessInfo.phone,
        email: data.businessInfo.email,
        address: data.businessInfo.address,
        mapsEmbedUrl: data.businessInfo.mapsEmbedUrl,
        openingHours: data.businessInfo.openingHours,
        socialMedia: data.businessInfo.socialMedia
      }
    });

    console.log('Background persistence to Cloud SQL PostgreSQL complete!');
  } catch (err) {
    console.error('Failed to persist changes to Cloud SQL:', err);
  }
}

export function initDatabase() {
  if (memoryDb) return;

  // Initialize with local defaults first so that the server doesn't crash during bootstrap
  memoryDb = {
    products: DEFAULT_PRODUCTS,
    blogs: DEFAULT_BLOGS,
    orders: [],
    testimonials: DEFAULT_TESTIMONIALS,
    seoSettings: DEFAULT_SEO,
    businessInfo: DEFAULT_BUSINESS,
    users: DEFAULT_USERS,
    services: DEFAULT_SERVICES
  };

  if (isInitializing) return;
  isInitializing = true;

  // Trigger Cloud SQL background sync
  syncWithCloudSQL().catch(err => {
    console.error('Failed to sync with Cloud SQL PostgreSQL:', err);
  });
}

export function readDatabase(): DatabaseSchema {
  initDatabase();
  return memoryDb!;
}

export function writeDatabase(data: DatabaseSchema) {
  memoryDb = data;
  syncWriteToCloudSQL(data).catch(err => {
    console.error('Failed to trigger async syncWriteToCloudSQL:', err);
  });
}

