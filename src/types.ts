export interface MultilingualString {
  en: string;
  nl: string;
  id?: string;
}

export interface MultilingualArray {
  en: string[];
  nl: string[];
  id?: string[];
}

export interface Product {
  id: string;
  name: MultilingualString;
  category: string; // Key name (e.g., "womens-health", "immune-booster")
  description: MultilingualString;
  ingredients: MultilingualArray;
  benefits: MultilingualArray;
  traditionalExplanation: MultilingualString;
  scientificExplanation: MultilingualString;
  howToConsume: MultilingualString;
  recommendedConsumption: MultilingualString;
  whoShouldUse: MultilingualString;
  warnings: MultilingualString;
  price: number;
  stock: number;
  isFeatured: boolean;
  imageUrl: string;
}

export interface BlogPost {
  id: string;
  title: MultilingualString;
  content: MultilingualString; // Markdown
  excerpt: MultilingualString;
  author: string;
  date: string;
  category: MultilingualString;
  seoKeywords: MultilingualArray;
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: MultilingualString;
  text: MultilingualString;
  rating: number;
  avatar: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  country: string;
  productIds: string[];
  productNames: string[]; // snapshot of product names
  quantities: number[];
  prices: number[]; // snapshot of prices
  totalPrice: number;
  notes: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface SeoSettings {
  title: MultilingualString;
  description: MultilingualString;
  keywords: MultilingualArray;
}

export interface BusinessInfo {
  phone: string;
  email: string;
  address: string;
  mapsEmbedUrl: string;
  openingHours: MultilingualString;
  socialMedia: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
}

export interface MassageService {
  id: string;
  badge: MultilingualString;
  name: MultilingualString;
  shortDesc: MultilingualString;
  longDesc: MultilingualString;
  durations: { mins: string; price: number }[];
  imageUrl: string;
  iconType: string;
}

export interface DatabaseSchema {
  products: Product[];
  blogs: BlogPost[];
  orders: Order[];
  testimonials: Testimonial[];
  seoSettings: SeoSettings;
  businessInfo: BusinessInfo;
  users: { id: string; username: string; passwordHash: string }[];
  services?: MassageService[];
}
