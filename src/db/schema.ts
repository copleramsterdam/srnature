import { pgTable, text, doublePrecision, integer, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';

// 1. Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(), // We can use the Firebase Auth uid as primary key directly!
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  username: text('username'),
  passwordHash: text('password_hash'),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// 2. Products table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: jsonb('name').notNull(), // MultilingualString
  category: text('category').notNull(),
  description: jsonb('description').notNull(), // MultilingualString
  ingredients: jsonb('ingredients').notNull(), // MultilingualArray
  benefits: jsonb('benefits').notNull(), // MultilingualArray
  traditionalExplanation: jsonb('traditional_explanation').notNull(), // MultilingualString
  scientificExplanation: jsonb('scientific_explanation').notNull(), // MultilingualString
  howToConsume: jsonb('how_to_consume').notNull(), // MultilingualString
  recommendedConsumption: jsonb('recommended_consumption').notNull(), // MultilingualString
  whoShouldUse: jsonb('who_should_use').notNull(), // MultilingualString
  warnings: jsonb('warnings').notNull(), // MultilingualString
  price: doublePrecision('price').notNull(),
  stock: integer('stock').notNull(),
  isFeatured: boolean('is_featured').notNull().default(false),
  imageUrl: text('image_url').notNull()
});

// 3. Blog posts table
export const blogs = pgTable('blogs', {
  id: text('id').primaryKey(),
  title: jsonb('title').notNull(), // MultilingualString
  content: jsonb('content').notNull(), // MultilingualString (Markdown)
  excerpt: jsonb('excerpt').notNull(), // MultilingualString
  author: text('author').notNull(),
  date: text('date').notNull(),
  category: jsonb('category').notNull(), // MultilingualString
  seoKeywords: jsonb('seo_keywords').notNull(), // MultilingualArray
  imageUrl: text('image_url').notNull()
});

// 4. Testimonials table
export const testimonials = pgTable('testimonials', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: jsonb('role').notNull(), // MultilingualString
  text: jsonb('text').notNull(), // MultilingualString
  rating: doublePrecision('rating').notNull(),
  avatar: text('avatar').notNull()
});

// 5. Orders table
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  country: text('country').notNull(),
  productIds: jsonb('product_ids').notNull(), // string[]
  productNames: jsonb('product_names').notNull(), // string[]
  quantities: jsonb('quantities').notNull(), // number[]
  prices: jsonb('prices').notNull(), // number[]
  totalPrice: doublePrecision('total_price').notNull(),
  notes: text('notes').notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'completed' | 'cancelled'
  createdAt: text('created_at').notNull()
});

// 6. SEO Settings table
export const seoSettings = pgTable('seo_settings', {
  id: text('id').primaryKey().default('default'),
  title: jsonb('title').notNull(), // MultilingualString
  description: jsonb('description').notNull(), // MultilingualString
  keywords: jsonb('keywords').notNull() // MultilingualArray
});

// 7. Business Info table
export const businessInfo = pgTable('business_info', {
  id: text('id').primaryKey().default('default'),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  address: text('address').notNull(),
  mapsEmbedUrl: text('maps_embed_url').notNull(),
  openingHours: jsonb('opening_hours').notNull(), // MultilingualString
  socialMedia: jsonb('social_media').notNull() // { instagram, facebook, whatsapp }
});

// 8. Massage Services table
export const services = pgTable('services', {
  id: text('id').primaryKey(),
  badge: jsonb('badge').notNull(), // MultilingualString
  name: jsonb('name').notNull(), // MultilingualString
  shortDesc: jsonb('short_desc').notNull(), // MultilingualString
  longDesc: jsonb('long_desc').notNull(), // MultilingualString
  durations: jsonb('durations').notNull(), // { mins: string, price: number }[]
  imageUrl: text('image_url').notNull(),
  iconType: text('icon_type').notNull()
});
