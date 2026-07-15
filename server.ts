import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { readDatabase, writeDatabase, initDatabase } from './src/server/db';
import { Order, Product, BlogPost, DatabaseSchema, MassageService } from './src/types';

// Load environment variables
dotenv.config();

// Initialize database seed
initDatabase();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Express Body Parsers
app.use(express.json());

// Enable serving local images as static assets
app.use('/src/assets', express.static(path.join(process.cwd(), 'src/assets')));
app.use('/assets', express.static(path.join(process.cwd(), 'src/assets')));

// Lazy initialize Gemini client to avoid crashes if GEMINI_API_KEY is missing
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Simple Token-free/Header-based Session check for simplicity in AI studio env
// In production, you would use HTTP-only cookies, but a custom Auth header is perfect for this app's CMS
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === 'djamoe-admin-session-token-2026') {
      return next();
    }
  }
  return res.status(401).json({ error: 'Unauthorized. Admin access required.' });
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Authentications
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDatabase();
  const user = db.users.find(u => u.username === username && u.passwordHash === password);
  
  if (user) {
    res.json({
      success: true,
      token: 'djamoe-admin-session-token-2026',
      user: { id: user.id, username: user.username }
    });
  } else {
    res.status(401).json({ error: 'Invalid username or password.' });
  }
});

app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === 'djamoe-admin-session-token-2026') {
      return res.json({ valid: true });
    }
  }
  return res.status(401).json({ valid: false, error: 'Invalid or expired token.' });
});

// 2. Products API
app.get('/api/products', (req, res) => {
  const db = readDatabase();
  res.json(db.products);
});

app.post('/api/products', authenticateAdmin, (req, res) => {
  const db = readDatabase();
  const newProduct: Product = {
    id: req.body.id || 'product-' + Date.now(),
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    ingredients: req.body.ingredients,
    benefits: req.body.benefits,
    traditionalExplanation: req.body.traditionalExplanation,
    scientificExplanation: req.body.scientificExplanation,
    howToConsume: req.body.howToConsume,
    recommendedConsumption: req.body.recommendedConsumption,
    whoShouldUse: req.body.whoShouldUse,
    warnings: req.body.warnings,
    price: Number(req.body.price),
    stock: Number(req.body.stock),
    isFeatured: !!req.body.isFeatured,
    imageUrl: req.body.imageUrl || '/src/assets/images/hero_jamu_preparation_1783604874087.jpg'
  };

  db.products.push(newProduct);
  writeDatabase(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', authenticateAdmin, (req, res) => {
  const db = readDatabase();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  db.products[index] = {
    ...db.products[index],
    name: req.body.name || db.products[index].name,
    category: req.body.category || db.products[index].category,
    description: req.body.description || db.products[index].description,
    ingredients: req.body.ingredients || db.products[index].ingredients,
    benefits: req.body.benefits || db.products[index].benefits,
    traditionalExplanation: req.body.traditionalExplanation || db.products[index].traditionalExplanation,
    scientificExplanation: req.body.scientificExplanation || db.products[index].scientificExplanation,
    howToConsume: req.body.howToConsume || db.products[index].howToConsume,
    recommendedConsumption: req.body.recommendedConsumption || db.products[index].recommendedConsumption,
    whoShouldUse: req.body.whoShouldUse || db.products[index].whoShouldUse,
    warnings: req.body.warnings || db.products[index].warnings,
    price: req.body.price !== undefined ? Number(req.body.price) : db.products[index].price,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : db.products[index].stock,
    isFeatured: req.body.isFeatured !== undefined ? !!req.body.isFeatured : db.products[index].isFeatured,
    imageUrl: req.body.imageUrl || db.products[index].imageUrl
  };

  writeDatabase(db);
  res.json(db.products[index]);
});

app.delete('/api/products/:id', authenticateAdmin, (req, res) => {
  const db = readDatabase();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  db.products.splice(index, 1);
  writeDatabase(db);
  res.json({ success: true, message: 'Product deleted' });
});

// 3. Blogs API
app.get('/api/blogs', (req, res) => {
  const db = readDatabase();
  res.json(db.blogs);
});

app.post('/api/blogs', authenticateAdmin, (req, res) => {
  const db = readDatabase();
  const newBlog: BlogPost = {
    id: req.body.id || 'blog-' + Date.now(),
    title: req.body.title,
    content: req.body.content,
    excerpt: req.body.excerpt,
    author: req.body.author || 'Djamoe Master',
    date: new Date().toISOString().split('T')[0],
    category: req.body.category,
    seoKeywords: req.body.seoKeywords,
    imageUrl: req.body.imageUrl || '/src/assets/images/hero_jamu_preparation_1783604874087.jpg'
  };

  db.blogs.push(newBlog);
  writeDatabase(db);
  res.status(201).json(newBlog);
});

app.put('/api/blogs/:id', authenticateAdmin, (req, res) => {
  const db = readDatabase();
  const index = db.blogs.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Blog not found' });

  db.blogs[index] = {
    ...db.blogs[index],
    title: req.body.title || db.blogs[index].title,
    content: req.body.content || db.blogs[index].content,
    excerpt: req.body.excerpt || db.blogs[index].excerpt,
    category: req.body.category || db.blogs[index].category,
    seoKeywords: req.body.seoKeywords || db.blogs[index].seoKeywords,
    imageUrl: req.body.imageUrl || db.blogs[index].imageUrl,
    author: req.body.author || db.blogs[index].author
  };

  writeDatabase(db);
  res.json(db.blogs[index]);
});

app.delete('/api/blogs/:id', authenticateAdmin, (req, res) => {
  const db = readDatabase();
  const index = db.blogs.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Blog not found' });

  db.blogs.splice(index, 1);
  writeDatabase(db);
  res.json({ success: true, message: 'Blog post deleted' });
});

// 3b. Services API (Massage types)
app.get('/api/services', (req, res) => {
  const db = readDatabase();
  res.json(db.services || []);
});

app.post('/api/services', authenticateAdmin, (req, res) => {
  const db = readDatabase();
  if (!db.services) db.services = [];
  
  const newService: MassageService = {
    id: req.body.id || 'service-' + Date.now(),
    badge: req.body.badge,
    name: req.body.name,
    shortDesc: req.body.shortDesc,
    longDesc: req.body.longDesc,
    durations: req.body.durations || [],
    imageUrl: req.body.imageUrl || '/src/assets/images/luxury_massage_session_1783703874698.jpg',
    iconType: req.body.iconType || 'heart'
  };

  db.services.push(newService);
  writeDatabase(db);
  res.status(201).json(newService);
});

app.put('/api/services/:id', authenticateAdmin, (req, res) => {
  const db = readDatabase();
  if (!db.services) db.services = [];
  const index = db.services.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Service not found' });

  db.services[index] = {
    ...db.services[index],
    badge: req.body.badge || db.services[index].badge,
    name: req.body.name || db.services[index].name,
    shortDesc: req.body.shortDesc || db.services[index].shortDesc,
    longDesc: req.body.longDesc || db.services[index].longDesc,
    durations: req.body.durations || db.services[index].durations,
    imageUrl: req.body.imageUrl || db.services[index].imageUrl,
    iconType: req.body.iconType || db.services[index].iconType
  };

  writeDatabase(db);
  res.json(db.services[index]);
});

app.delete('/api/services/:id', authenticateAdmin, (req, res) => {
  const db = readDatabase();
  if (!db.services) db.services = [];
  const index = db.services.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Service not found' });

  db.services.splice(index, 1);
  writeDatabase(db);
  res.json({ success: true, message: 'Service deleted' });
});

// 4. Testimonials API
app.get('/api/testimonials', (req, res) => {
  const db = readDatabase();
  res.json(db.testimonials);
});

app.post('/api/testimonials', authenticateAdmin, (req, res) => {
  const db = readDatabase();
  const newTestimonial = {
    id: 'test-' + Date.now(),
    name: req.body.name,
    role: req.body.role,
    text: req.body.text,
    rating: Number(req.body.rating) || 5,
    avatar: req.body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
  };
  db.testimonials.push(newTestimonial);
  writeDatabase(db);
  res.status(201).json(newTestimonial);
});

// 5. Orders API (Form Submission)
app.post('/api/orders', (req, res) => {
  const { customerName, phone, email, country, productIds, quantities, notes } = req.body;
  
  if (!customerName || !phone || (!notes?.trim() && (!productIds || !productIds.length))) {
    return res.status(400).json({ error: 'Missing required customer details, products, or service notes.' });
  }

  const db = readDatabase();
  
  // Look up products to create snapshot and calculate total
  const matchedProducts: Product[] = [];
  const productNames: string[] = [];
  const prices: number[] = [];
  let totalPrice = 0;

  if (productIds && Array.isArray(productIds)) {
    productIds.forEach((id: string, index: number) => {
      const prod = db.products.find(p => p.id === id);
      if (prod) {
        matchedProducts.push(prod);
        productNames.push(prod.name.en); // Store snapshots
        prices.push(prod.price);
        
        const qty = quantities && quantities[index] ? Number(quantities[index]) : 1;
        totalPrice += prod.price * qty;

        // Deduct stock safely
        prod.stock = Math.max(0, prod.stock - qty);
      }
    });
  }

  const newOrder: Order = {
    id: 'ORD-' + Date.now().toString().slice(-6),
    customerName,
    phone,
    email: email || '',
    country: country || 'Netherlands',
    productIds: productIds || [],
    productNames: productNames || [],
    quantities: quantities || (productIds ? productIds.map(() => 1) : []),
    prices: prices || [],
    totalPrice,
    notes: notes || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.orders.push(newOrder);
  writeDatabase(db);

  // Auto-compose professional WhatsApp text message
  let waText = `🌿 *SR Natural - Booking & Order* 🌿\n\n`;
  waText += `*Customer details:*\n`;
  waText += `• Name: ${customerName}\n`;
  waText += `• Phone: ${phone}\n`;
  waText += `• Email: ${email || '-'}\n`;
  waText += `• Country: ${country || 'Netherlands'}\n\n`;
  
  if (productIds && productIds.length > 0) {
    waText += `*Ordered Herbs:*\n`;
    productIds.forEach((id: string, idx: number) => {
      const prodName = productNames[idx] || 'Unknown';
      const qty = quantities && quantities[idx] ? quantities[idx] : 1;
      const price = prices[idx] || 0;
      waText += `- ${prodName} x ${qty} (€${(price * qty).toFixed(2)})\n`;
    });
    waText += `\n*Products Total:* €${totalPrice.toFixed(2)}\n\n`;
  }
  
  if (notes) {
    waText += `*Service request / Notes:*\n${notes}\n\n`;
  }
  
  waText += `Thank you for choosing SR Natural. Please confirm my booking/order!`;

  const waBaseNumber = '+31684861301'.replace('+', '');
  const waUrl = `https://wa.me/${waBaseNumber}?text=${encodeURIComponent(waText)}`;

  res.status(201).json({ order: newOrder, redirectUrl: waUrl });
});

app.get('/api/orders', authenticateAdmin, (req, res) => {
  const db = readDatabase();
  res.json(db.orders);
});

app.put('/api/orders/:id/status', authenticateAdmin, (req, res) => {
  const db = readDatabase();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = req.body.status;
  writeDatabase(db);
  res.json(order);
});

// 6. Settings API
app.get('/api/settings', (req, res) => {
  const db = readDatabase();
  res.json({
    seoSettings: db.seoSettings,
    businessInfo: db.businessInfo
  });
});

app.put('/api/settings', authenticateAdmin, (req, res) => {
  const db = readDatabase();
  if (req.body.seoSettings) db.seoSettings = req.body.seoSettings;
  if (req.body.businessInfo) db.businessInfo = req.body.businessInfo;
  
  writeDatabase(db);
  res.json({ success: true, settings: { seoSettings: db.seoSettings, businessInfo: db.businessInfo } });
});

// 7. DB Backup (JSON file download)
app.get('/api/admin/backup', authenticateAdmin, (req, res) => {
  res.setHeader('Content-disposition', `attachment; filename=djamoe_db_backup_${Date.now()}.json`);
  res.setHeader('Content-type', 'application/json');
  res.write(JSON.stringify(readDatabase(), null, 2));
  res.end();
});

// 8. Admin Analytics Dashboard
app.get('/api/admin/analytics', authenticateAdmin, (req, res) => {
  const db = readDatabase();
  const totalProducts = db.products.length;
  const totalBlogs = db.blogs.length;
  const totalOrders = db.orders.length;
  const totalRevenue = db.orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const pendingOrders = db.orders.filter(o => o.status === 'pending').length;

  // top products stats based on ordered items
  const productSalesMap: Record<string, number> = {};
  db.orders.forEach(o => {
    o.productIds.forEach((id, idx) => {
      productSalesMap[id] = (productSalesMap[id] || 0) + (o.quantities[idx] || 1);
    });
  });

  const topProducts = db.products.map(p => ({
    name: p.name.en,
    sales: productSalesMap[p.id] || 0,
    revenue: (productSalesMap[p.id] || 0) * p.price,
    stock: p.stock
  })).sort((a, b) => b.sales - a.sales);

  res.json({
    totalProducts,
    totalBlogs,
    totalOrders,
    totalRevenue,
    pendingOrders,
    topProducts,
    simulatedVisits: {
      total: 1240,
      conversionRate: ((totalOrders / 1240) * 100).toFixed(1) + '%'
    }
  });
});

// ==========================================
// GEMINI INTELLIGENT WRITING & SEO APIS
// ==========================================

// Create blog post with Gemini assistance
app.post('/api/gemini/blog', authenticateAdmin, async (req, res) => {
  const { topic, lang } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required.' });

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({
      error: 'Gemini API not configured. Please supply a valid GEMINI_API_KEY secret in AI Studio settings.'
    });
  }

  try {
    const prompt = `Write a premium, beautiful, and engaging educational blog article about: "${topic}".
The article is for a luxurious Indonesian SR Natural Produk brand located in Amsterdam, the Netherlands called "SR NATURAL".
Focus on traditional Javanese wisdom, natural remedies, organic lifestyle, and ancient history.
Respond in JSON format according to this exact typescript interface structure:
{
  "title": "A highly catchy premium SEO-friendly title",
  "content": "Rich markdown body of the post with sections, elegant vocabulary, explaining traditional roots, ingredients, and science.",
  "excerpt": "A professional 2-sentence search snippet summary of the post",
  "seoKeywords": ["keyword1", "keyword2", "keyword3"]
}
Produce the response in the language: ${lang === 'nl' ? 'Dutch' : 'English'}. Include absolutely no other text, wrapping, markdown codeblocks or symbols outside the pure JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Empty response from Gemini.');
    }
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error('Gemini Blog error:', error);
    res.status(500).json({ error: 'Failed to generate content: ' + error.message });
  }
});

// Generate SEO meta tags with Gemini
app.post('/api/gemini/seo', authenticateAdmin, async (req, res) => {
  const { productName, productDescription, lang } = req.body;
  if (!productName) return res.status(400).json({ error: 'Product Name is required.' });

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({
      error: 'Gemini API key is not configured.'
    });
  }

  try {
    const prompt = `Write SEO title, Meta description, and search keywords for a premium herbal product:
Name: "${productName}"
Description: "${productDescription}"
Respond in JSON matching this schema:
{
  "seoTitle": "SEO title under 60 characters with branding",
  "metaDescription": "Enticing, premium Meta description under 155 characters",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
}
Create this in the language: ${lang === 'nl' ? 'Dutch' : 'English'}. Include absolutely no wrapping text, just the raw JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Empty response from Gemini.');
    }
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error('Gemini SEO error:', error);
    res.status(500).json({ error: 'Failed to generate SEO: ' + error.message });
  }
});

// Chat endpoint for Gemini-powered Herbalist
app.post('/api/gemini/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required.' });

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({
      error: 'Gemini API not configured. Please supply a valid GEMINI_API_KEY secret in AI Studio settings.'
    });
  }

  try {
    const db = readDatabase();
    // Compact representation of our product database to keep tokens low but highly informative
    const productsContext = db.products.map(p => ({
      name: p.name,
      category: p.category,
      description: p.description,
      ingredients: p.ingredients,
      benefits: p.benefits,
      traditionalExplanation: p.traditionalExplanation,
      scientificExplanation: p.scientificExplanation,
      howToConsume: p.howToConsume
    }));

    const systemInstruction = `You are "Sari", a wise, warm, and highly skilled traditional Javanese Herbalist ("Djamoe Master" or "SR Natural Wellness Expert").
You help clients understand the benefits of herbal ingredients, traditional Javanese remedies (Jamu), and spa therapy.
Answer questions accurately based on our official product and service database provided below.
If the client asks about specific products or ingredients, use our product details to explain their traditional wisdom and scientific validation.

Official Product Database:
${JSON.stringify(productsContext, null, 2)}

Guidelines:
1. Speak in a warm, respectful, and comforting manner.
2. Provide precise benefits of the ingredients mentioned. Blend traditional Javanese wisdom with modern scientific explanations.
3. Keep answers concise, visually structured with lists, and short enough to be read comfortably inside a compact mobile chat window.
4. Respond in the same language the customer is using (English, Dutch, or Indonesian).
5. If someone wants to book a treatment or buy a product, kindly guide them to use our Custom Order or Booking forms.
6. Only talk about our products/ingredients and related wellness wisdom. Do not answer general programming or unrelated topics. Keep it focused on SR Natural Wellness.`;

    // Construct contents including chat history if present
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: { role: string; parts: string | any[] }) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: typeof h.parts === 'string' ? h.parts : h.parts[0]?.text || '' }]
        });
      });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const resultText = response.text;
    res.json({ text: resultText });
  } catch (error: any) {
    console.error('Gemini Chat error:', error);
    res.status(500).json({ error: 'Failed to chat: ' + error.message });
  }
});

// ==========================================
// SEO ENDPOINTS (Robots.txt & XML Sitemap)
// ==========================================

app.get('/robots.txt', (req, res) => {
  const host = req.get('host');
  const protocol = req.secure ? 'https' : 'http';
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${protocol}://${host}/sitemap.xml
`);
});

app.get('/sitemap.xml', (req, res) => {
  const host = req.get('host');
  const protocol = req.secure ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  const db = readDatabase();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/philosophy</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/shop</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

  // Dynamically add product page urls
  db.products.forEach(p => {
    xml += `
  <url>
    <loc>${baseUrl}/product/${p.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Dynamically add blog post urls
  db.blogs.forEach(b => {
    xml += `
  <url>
    <loc>${baseUrl}/blog/${b.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  xml += `\n</urlset>`;

  res.type('application/xml');
  res.send(xml);
});


// ==========================================
// VITE OR STATIC STATIC MIDDLEWARE
// ==========================================

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite dev server middleware in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in Development mode.');
  } else {
    // Serve static frontend build in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static build from:', distPath);
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Djamoe Full Stack Server active at http://localhost:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  start().catch(err => {
    console.error('Failed to start server:', err);
  });
}

export default app;
