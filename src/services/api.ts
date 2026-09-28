import { DBState, Product, Article, Order, QuizAnswers, QuizRecommendation } from '../types';
import { defaultDatabaseState } from '../data/defaultData';

const STORAGE_KEY = 'cetaphil_clinical_db_v2';

/**
 * Safely fetches JSON from an endpoint.
 * Catches network failures, HTML error responses (like <!doctype ...> from GitHub Pages),
 * and invalid JSON without throwing unhandled syntax errors.
 */
async function safeJsonFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    
    const contentType = res.headers.get('content-type') || '';
    // If the server returned an HTML error/fallback page (e.g. GitHub Pages 404 or index.html)
    if (contentType.includes('text/html')) return null;

    const text = await res.text();
    if (!text) return null;
    
    // Check if the body accidentally starts with HTML doctype or tags
    const trimmed = text.trim();
    if (trimmed.startsWith('<') || trimmed.toLowerCase().startsWith('<!doctype')) {
      return null;
    }

    return JSON.parse(trimmed) as T;
  } catch (err) {
    // Network failure or offline
    return null;
  }
}

/**
 * Reads local cached database from localStorage, falling back to default dataset.
 */
export function getStoredDB(): DBState {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
        return {
          products: parsed.products,
          articles: parsed.articles || defaultDatabaseState.articles,
          orders: parsed.orders || defaultDatabaseState.orders,
          promoBanner: parsed.promoBanner || defaultDatabaseState.promoBanner
        };
      }
    }
  } catch (e) {
    console.warn('Could not read from local storage, using initial dataset', e);
  }
  return { ...defaultDatabaseState };
}

/**
 * Persists the current database state to localStorage.
 */
export function saveStoredDB(state: DBState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save database state to localStorage', e);
  }
}

/**
 * Loads entire database state.
 * Tries server first (/api/db). If server is available, syncs to localStorage.
 * If server returns HTML or fails (e.g. GitHub Pages static deployment), seamlessly returns stored state.
 */
export async function fetchDatabaseState(): Promise<DBState> {
  const remote = await safeJsonFetch<DBState>('/api/db');
  if (remote && Array.isArray(remote.products) && remote.products.length > 0) {
    saveStoredDB(remote);
    return remote;
  }
  return getStoredDB();
}

/**
 * Adds or updates a product.
 * Compatible with both full-stack server and static hosting (GitHub Pages).
 */
export async function saveProductApi(product: Partial<Product>): Promise<{ success: boolean; product: Product }> {
  // Try remote backend if present
  const remote = await safeJsonFetch<{ success: boolean; product: Product }>('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });

  if (remote && remote.product) {
    const db = getStoredDB();
    const idx = db.products.findIndex(p => p.id === remote.product.id);
    if (idx !== -1) {
      db.products[idx] = remote.product;
    } else {
      db.products.push(remote.product);
    }
    saveStoredDB(db);
    return remote;
  }

  // Fallback to local storage (GitHub Pages mode)
  const db = getStoredDB();
  let savedProduct: Product;
  if (!product.id) {
    savedProduct = {
      ...(product as Product),
      id: 'prod-' + Date.now(),
      rating: product.rating || 5.0,
      reviewsCount: product.reviewsCount || 0,
      stock: Number(product.stock || 0),
      price: Number(product.price || 0)
    };
    db.products.push(savedProduct);
  } else {
    const idx = db.products.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      savedProduct = { ...db.products[idx], ...product } as Product;
      db.products[idx] = savedProduct;
    } else {
      savedProduct = product as Product;
      db.products.push(savedProduct);
    }
  }
  saveStoredDB(db);
  return { success: true, product: savedProduct };
}

/**
 * Updates stock for a product.
 */
export async function updateProductStockApi(id: string, newStock: number): Promise<{ success: boolean; stock: number }> {
  const remote = await safeJsonFetch<{ success: boolean; product: Product }>(`/api/products/${id}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock: newStock })
  });

  const db = getStoredDB();
  const idx = db.products.findIndex(p => p.id === id);
  if (idx !== -1) {
    db.products[idx].stock = newStock;
    saveStoredDB(db);
  }

  return { success: true, stock: newStock };
}

/**
 * Saves or updates an article.
 */
export async function saveArticleApi(article: Partial<Article>): Promise<{ success: boolean; article: Article }> {
  const remote = await safeJsonFetch<{ success: boolean; article: Article }>('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article)
  });

  if (remote && remote.article) {
    const db = getStoredDB();
    const idx = db.articles.findIndex(a => a.id === remote.article.id);
    if (idx !== -1) {
      db.articles[idx] = remote.article;
    } else {
      db.articles.push(remote.article);
    }
    saveStoredDB(db);
    return remote;
  }

  // Fallback to local storage
  const db = getStoredDB();
  let savedArticle: Article;
  if (!article.id) {
    savedArticle = {
      ...(article as Article),
      id: 'art-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    db.articles.push(savedArticle);
  } else {
    const idx = db.articles.findIndex(a => a.id === article.id);
    if (idx !== -1) {
      savedArticle = { ...db.articles[idx], ...article } as Article;
      db.articles[idx] = savedArticle;
    } else {
      savedArticle = article as Article;
      db.articles.push(savedArticle);
    }
  }
  saveStoredDB(db);
  return { success: true, article: savedArticle };
}

/**
 * Updates promotional banner.
 */
export async function savePromoApi(promo: { text: string; visible: boolean }): Promise<{ success: boolean; promoBanner: { text: string; visible: boolean } }> {
  await safeJsonFetch('/api/promo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(promo)
  });

  const db = getStoredDB();
  db.promoBanner = promo;
  saveStoredDB(db);
  return { success: true, promoBanner: promo };
}

/**
 * Places a customer order and adjusts inventory.
 */
export async function createOrderApi(orderDetails: any): Promise<{ success: boolean; order: Order }> {
  const remote = await safeJsonFetch<{ success: boolean; order: Order }>('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderDetails)
  });

  if (remote && remote.order) {
    const db = getStoredDB();
    db.orders.unshift(remote.order);
    // Deduct stock in local cache
    for (const item of orderDetails.items) {
      const pIdx = db.products.findIndex(p => p.id === item.productId);
      if (pIdx !== -1) {
        db.products[pIdx].stock = Math.max(0, db.products[pIdx].stock - item.quantity);
      }
    }
    saveStoredDB(db);
    return remote;
  }

  // Local storage execution (GitHub Pages mode)
  const db = getStoredDB();
  for (const item of orderDetails.items) {
    const pIdx = db.products.findIndex(p => p.id === item.productId);
    if (pIdx !== -1) {
      db.products[pIdx].stock = Math.max(0, db.products[pIdx].stock - item.quantity);
    }
  }

  const newOrder: Order = {
    id: 'ord-' + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toISOString(),
    items: orderDetails.items,
    subtotal: orderDetails.subtotal,
    shipping: orderDetails.shipping,
    tax: orderDetails.tax,
    total: orderDetails.total,
    status: 'Pending',
    shippingAddress: orderDetails.shippingAddress,
    paymentMethod: orderDetails.paymentMethod
  };

  db.orders.unshift(newOrder);
  saveStoredDB(db);
  return { success: true, order: newOrder };
}

/**
 * Reorders a previous order.
 */
export async function reorderApi(orderId: string): Promise<{ success: boolean; order: Order }> {
  const remote = await safeJsonFetch<{ success: boolean; order: Order }>(`/api/orders/reorder/${orderId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (remote && remote.order) {
    const db = getStoredDB();
    db.orders.unshift(remote.order);
    for (const item of remote.order.items) {
      const pIdx = db.products.findIndex(p => p.id === item.productId);
      if (pIdx !== -1) {
        db.products[pIdx].stock = Math.max(0, db.products[pIdx].stock - item.quantity);
      }
    }
    saveStoredDB(db);
    return remote;
  }

  // Fallback to local
  const db = getStoredDB();
  const pastOrder = db.orders.find(o => o.id === orderId);
  if (!pastOrder) {
    throw new Error('Order not found in record.');
  }

  for (const item of pastOrder.items) {
    const pIdx = db.products.findIndex(p => p.id === item.productId);
    if (pIdx !== -1) {
      db.products[pIdx].stock = Math.max(0, db.products[pIdx].stock - item.quantity);
    }
  }

  const newOrder: Order = {
    ...pastOrder,
    id: 'ord-' + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toISOString(),
    status: 'Pending'
  };

  db.orders.unshift(newOrder);
  saveStoredDB(db);
  return { success: true, order: newOrder };
}

/**
 * Skin Quiz Clinical Routine Generator.
 * Tries server Gemini endpoint; falls back to dermatologist rules engine.
 */
export async function generateQuizRoutineApi(answers: QuizAnswers, products: Product[]): Promise<QuizRecommendation> {
  const remote = await safeJsonFetch<QuizRecommendation>('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers)
  });

  if (remote && Array.isArray(remote.routine) && remote.routine.length > 0) {
    return remote;
  }

  // Clinical client-side matching algorithm
  const concernLower = (answers.concern || '').toLowerCase();
  const typeLower = (answers.skinType || '').toLowerCase();

  // Pick Cleanser
  let cleanser: Product | undefined;
  if (typeLower.includes('oily') || concernLower.includes('acne') || concernLower.includes('oil')) {
    cleanser = products.find(p => p.id === 'cet-oily-skin-cleanser-125') || products.find(p => p.category === 'cleanser');
  } else {
    cleanser = products.find(p => p.id === 'cet-gentle-skin-cleanser-125') || products.find(p => p.category === 'cleanser');
  }
  if (!cleanser && products.length > 0) cleanser = products[0];

  // Pick Moisturizer / Cream
  let cream: Product | undefined;
  if (concernLower.includes('flak') || typeLower.includes('dry') || concernLower.includes('severely')) {
    cream = products.find(p => p.id === 'cet-moisturizing-cream-453') || products.find(p => p.id === 'cet-moisturizing-cream-85');
  } else if (typeLower.includes('oily')) {
    cream = products.find(p => p.id === 'cet-moisturizing-cream-85') || products.find(p => p.category === 'cream');
  } else {
    cream = products.find(p => p.id === 'cet-dam-lotion-100') || products.find(p => p.id === 'cet-moisturizing-cream-85');
  }
  if (!cream && products.length > 1) cream = products[1];

  // Pick Sunscreen
  let sunscreen = products.find(p => p.id === 'cet-sun-spf50-light-gel-50') || products.find(p => p.category === 'sunscreen');
  if (!sunscreen && products.length > 2) sunscreen = products[2];

  const routine = [
    {
      step: 1,
      type: 'Cleanser',
      productId: cleanser?.id || 'cet-oily-skin-cleanser-125',
      productName: cleanser?.name || 'Cetaphil Cleanser',
      instructions: 'Wash gently with lukewarm water every morning and night. Do not scrub harshly to avoid damaging the lipid barrier.'
    },
    {
      step: 2,
      type: 'Moisturizer',
      productId: cream?.id || 'cet-moisturizing-cream-85',
      productName: cream?.name || 'Cetaphil Moisturizing Cream',
      instructions: 'Apply within 3 minutes of washing while skin is slightly damp to seal in hydration and reinforce lipid barriers.'
    },
    {
      step: 3,
      type: 'Sun Protection',
      productId: sunscreen?.id || 'cet-sun-spf50-light-gel-50',
      productName: sunscreen?.name || 'Cetaphil Sun SPF 50+ Light Gel',
      instructions: 'Apply liberally every morning as the final step. Reapply every 2-3 hours when outdoors under direct sunlight.'
    }
  ];

  return {
    routine,
    explanation: `Based on your skin profile (${answers.skinType || 'Combination'} skin with ${answers.concern || 'Sensitivity'} and ${answers.sensitivity || 'Moderate'} sensitivity), dermatological guidelines emphasize non-stripping cleansing and active lipid barrier fortification. ${cleanser?.name} purifies without disrupting natural moisture levels, followed by ${cream?.name} containing Niacinamide and Panthenol to seal hydration for 48 hours without clogging pores.`,
    tips: [
      'Always use lukewarm water when washing face; hot water dissolves the protective natural intercellular ceramides.',
      'Apply moisturizer to damp skin to lock in maximum hydration.',
      'Daily SPF 50+ is mandatory even indoors near windows to prevent UVA-induced collagen breakdown and redness.'
    ]
  };
}

/**
 * AI Skincare Consultant Consultation.
 */
export async function askAdvisorApi(message: string, history: any[], products: Product[]): Promise<string> {
  const remote = await safeJsonFetch<{ response: string }>('/api/gemini/advisor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history })
  });

  if (remote && remote.response) {
    return remote.response;
  }

  // Intelligent client-side clinical advisor
  const q = message.toLowerCase();
  
  if (q.includes('acne') || q.includes('pimple') || q.includes('oily') || q.includes('breakout')) {
    return `### Clinical Consultation: Oily & Acne-Prone Skin

For oily and acne-prone skin, dermatologists advise avoiding aggressive, stripping soaps that trigger reactive rebound sebum production.

**Recommended Clinical Regimen:**
1. **Cetaphil Oily Skin Cleanser (125ml)**: Proven to deep-clean pores and remove up to 99% of excess oil, dirt, and makeup while preserving essential epidermal lipids.
2. **Cetaphil Sun SPF 50+ Light Gel (50ml)**: Lightweight, non-comedogenic gel that prevents UV-induced pore inflammation with zero white cast.

**Dermatologist Tip:** Niacinamide (Vitamin B3) inside Cetaphil cleansers noticeably refines pore appearance and calms active redness.`;
  }

  if (q.includes('dry') || q.includes('flak') || q.includes('peel') || q.includes('dehydrat')) {
    return `### Clinical Consultation: Dry & Dehydrated Skin

Dry skin lacks vital lipids, whereas dehydrated skin lacks water. A healthy barrier requires both humectants (to bind moisture) and occlusives (to seal it in).

**Recommended Clinical Regimen:**
1. **Cetaphil Gentle Skin Cleanser (125ml)**: Formulated with Micellar Technology and Glycerin; cleanses without stripping moisture. Can even be used without water!
2. **Cetaphil Moisturizing Cream (85g or 453g)**: Clinically proven to provide continuous 48-hour hydration with sweet almond oil, Vitamin E, and Niacinamide.
3. **Cetaphil DAM Daily Advance Lotion (100g)**: Powered by 5-ingredient lipid complex with Shea Butter and Macadamia Nut Oil.

**Dermatologist Tip:** Apply your moisturizer within 3 minutes of cleansing while skin is still slightly damp.`;
  }

  if (q.includes('baby') || q.includes('infant') || q.includes('child') || q.includes('newborn')) {
    return `### Pediatric Consultation: Baby & Infant Care

Infant skin is roughly 30% thinner than adult skin and loses moisture up to twice as fast.

**Recommended Pediatric Regimen:**
1. **Cetaphil Baby Shampoo (200ml)**: 100% tear-free formula enriched with natural chamomile to gently soothe delicate scalps and cradle cap flakes.
2. **Cetaphil Baby Daily Lotion with Organic Calendula (400ml)**: Pediatrician-recommended, safe from Day 1 to nourish and protect delicate infant barriers against diaper friction and dryness.

**Pediatrician Tip:** Keep baby bath times under 10 minutes using lukewarm water to protect natural skin oils.`;
  }

  if (q.includes('sun') || q.includes('spf') || q.includes('uv') || q.includes('burn')) {
    return `### Photoprotection Consultation: Sensitive Skin

Over 90% of premature aging and sensitive skin flare-ups are triggered by UVA radiation, which penetrates clouds and window glass year-round.

**Recommended Photoprotection:**
- **Cetaphil Sun SPF 50+ Light Gel (50ml)**: Delivers broad-spectrum protection against UVA, UVB, and infrared radiation. Water and sweat-resistant for up to 4 hours with Vitamin E antioxidants.

**Application Rule:** Apply a generous nickel-sized amount 15-20 minutes before outdoor exposure, and reapply every 2 hours when swimming or sweating.`;
  }

  return `### Cetaphil Clinical Advisory

Thank you for consulting the Cetaphil Clinical Advisor. 

Cetaphil is the **#1 Dermatologist-Recommended** sensitive skincare brand worldwide. All formulations defend against the **5 Signs of Skin Sensitivity**:
1. Weakened Skin Barrier
2. Dryness & Dehydration
3. Irritation & Redness
4. Roughness & Flaking
5. Tightness & Discomfort

**Next Recommended Steps:**
- Try our **Interactive Skin Quiz** in the top navigation to receive a fully personalized 3-step routine.
- Or let me know your primary skin concern (e.g. Acne, Dryness, Sun Protection, or Baby Care) and I will provide exact formulation guidance!`;
}

/**
 * AI Product Description Generator for CMS Admin.
 */
export async function generateAIDescriptionApi(name: string, ingredients: string, concerns: string): Promise<string> {
  const remote = await safeJsonFetch<{ text: string }>('/api/gemini/generate-description', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, ingredients, concerns })
  });

  if (remote && remote.text) {
    return remote.text;
  }

  return `### Clinical Description
This dermatologist-tested formulation is specifically engineered for skin experiencing ${concerns}. Formulated with clinical-grade **${ingredients}**, it works at a cellular level to fortify the epidermal lipid barrier and defend against trans-epidermal water loss (TEWL).

### Key Clinical Benefits
- **Intensive Cellular Barrier Repair**: Reinforces natural stratum corneum lipids and improves moisture retention for 48 hours.
- **Calming Anti-Inflammatory Efficacy**: Soothes active redness, irritation, and sensitivity flares.
- **Non-Comedogenic & Hypoallergenic**: Clinically tested to not clog pores or irritate compromised skin layers.

### Directions for Clinical Use
Apply morning and evening to clean skin. Gently massage in upward circular motions until fully absorbed. Suitable for daily face and body use.`;
}
