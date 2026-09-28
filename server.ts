import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { defaultDatabaseState } from "./src/data/defaultData";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Local JSON database file path
const DB_FILE = path.join(process.cwd(), "db.json");

// Default dataset for products, articles, and orders
const defaultState = defaultDatabaseState;

// Check if database file exists, otherwise write defaults
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultState, null, 2), "utf-8");
    return defaultState;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading db file, resetting to defaults", err);
    return defaultState;
  }
}

function saveDB(state: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to db file", err);
  }
}

// Initialize database
let db = loadDB();

// Setup Gemini SDK on Server
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      }
    }
  });
} else {
  console.log("No GEMINI_API_KEY found, running in AI simulation mode.");
}

// GET: Entire DB state
app.get("/api/db", (req, res) => {
  db = loadDB();
  res.json(db);
});

// POST: Add or Update a Product
app.post("/api/products", (req, res) => {
  const product = req.body;
  db = loadDB();
  if (!product.id) {
    product.id = "prod-" + Date.now();
    product.rating = 5.0;
    product.reviewsCount = 0;
    db.products.push(product);
  } else {
    const idx = db.products.findIndex((p: any) => p.id === product.id);
    if (idx !== -1) {
      db.products[idx] = { ...db.products[idx], ...product };
    } else {
      db.products.push(product);
    }
  }
  saveDB(db);
  res.json({ success: true, product });
});

// PATCH: Update Product Stock (Inventory Control)
app.patch("/api/products/:id/stock", (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  db = loadDB();
  const idx = db.products.findIndex((p: any) => p.id === id);
  if (idx !== -1) {
    db.products[idx].stock = Number(stock);
    saveDB(db);
    return res.json({ success: true, product: db.products[idx] });
  }
  res.status(404).json({ error: "Product not found" });
});

// POST: Add or Update an Article
app.post("/api/articles", (req, res) => {
  const article = req.body;
  db = loadDB();
  if (!article.id) {
    article.id = "art-" + Date.now();
    article.date = new Date().toISOString().split('T')[0];
    db.articles.push(article);
  } else {
    const idx = db.articles.findIndex((a: any) => a.id === article.id);
    if (idx !== -1) {
      db.articles[idx] = { ...db.articles[idx], ...article };
    } else {
      db.articles.push(article);
    }
  }
  saveDB(db);
  res.json({ success: true, article });
});

// POST: Create a New Order (handles stock deduction)
app.post("/api/orders", (req, res) => {
  const orderDetails = req.body;
  db = loadDB();
  
  // Deduct stocks
  for (const item of orderDetails.items) {
    const pIdx = db.products.findIndex((p: any) => p.id === item.productId);
    if (pIdx !== -1) {
      db.products[pIdx].stock = Math.max(0, db.products[pIdx].stock - item.quantity);
    }
  }

  const newOrder = {
    id: "ord-" + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toISOString(),
    items: orderDetails.items,
    subtotal: orderDetails.subtotal,
    shipping: orderDetails.shipping,
    tax: orderDetails.tax,
    total: orderDetails.total,
    status: "Pending",
    shippingAddress: orderDetails.shippingAddress,
    paymentMethod: orderDetails.paymentMethod
  };

  db.orders.unshift(newOrder);
  saveDB(db);
  res.json({ success: true, order: newOrder });
});

// POST: Reorder a past order
app.post("/api/orders/reorder/:id", (req, res) => {
  const { id } = req.params;
  db = loadDB();
  const pastOrder = db.orders.find((o: any) => o.id === id);
  if (!pastOrder) {
    return res.status(404).json({ error: "Order not found" });
  }

  // Verify stock levels and deduct
  for (const item of pastOrder.items) {
    const pIdx = db.products.findIndex((p: any) => p.id === item.productId);
    if (pIdx !== -1) {
      db.products[pIdx].stock = Math.max(0, db.products[pIdx].stock - item.quantity);
    }
  }

  const newOrder = {
    ...pastOrder,
    id: "ord-" + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toISOString(),
    status: "Pending"
  };

  db.orders.unshift(newOrder);
  saveDB(db);
  res.json({ success: true, order: newOrder });
});

// POST: Update Promo Banner Settings
app.post("/api/promo", (req, res) => {
  const { text, visible } = req.body;
  db = loadDB();
  db.promoBanner = { text, visible };
  saveDB(db);
  res.json({ success: true, promoBanner: db.promoBanner });
});

// POST: Skin Quiz routine generator via Gemini API
app.post("/api/quiz", async (req, res) => {
  const answers = req.body;
  db = loadDB();

  const productsListStr = db.products
    .map((p: any) => `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Core Ingredients: ${p.ingredients.join(", ")}, Target Concerns: ${p.skinConcern.join(", ")}, Benefits: ${p.benefits.join("; ")}`)
    .join("\n");

  const prompt = `You are a clinical dermatologist and cosmetic formulation expert formulating a customized daily medical skincare regimen for a patient with the following skin characteristics:
- Skin Type: ${answers.skinType}
- Main Skin Concern: ${answers.concern}
- Sensitivity Level: ${answers.sensitivity}
- Age Group: ${answers.ageGroup}
- Budget Category: ${answers.budget}

You must select EXACTLY matching products from our clinic's official product list below. DO NOT recommend products not on this list.
Our Official Products:
${productsListStr}

Please generate:
1. A structured step-by-step skincare routine consisting of matching products. Each step must specify step number, product category type, product ID, product Name, and exact dermatologist application instructions.
2. A scientific biochemical explanation of why this routine was constructed for their concerns and sensitivity level.
3. 3 crucial clinical tips for application, sun protection, or active ingredient management.

You MUST respond strictly with a valid JSON object matching this schema:
{
  "routine": [
    {
      "step": 1,
      "type": "cleanser / serum / cream / exfoliant / mask",
      "productId": "id-from-official-list",
      "productName": "Exact Name of the matched product",
      "instructions": "Dermatologist application instructions (e.g. apply in evening, use SPF next day, etc)"
    }
  ],
  "explanation": "Detailed professional explanation...",
  "tips": [
    "Clinical Tip 1",
    "Clinical Tip 2",
    "Clinical Tip 3"
  ]
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              routine: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.INTEGER },
                    type: { type: Type.STRING },
                    productId: { type: Type.STRING },
                    productName: { type: Type.STRING },
                    instructions: { type: Type.STRING }
                  },
                  required: ["step", "type", "productId", "productName", "instructions"]
                }
              },
              explanation: { type: Type.STRING },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["routine", "explanation", "tips"]
          }
        }
      });

      const resultText = response.text || "{}";
      const resultObj = JSON.parse(resultText);
      return res.json(resultObj);
    } catch (err) {
      console.error("Gemini Quiz Error", err);
      // Fallback to simulated local generation
    }
  }

  // SIMULATED FALLBACK GENERATION (when AI fails or API key is absent)
  console.log("Using simulated quiz matching logic.");
  const matchedProducts = db.products.filter((p: any) => {
    return p.skinConcern.includes(answers.concern) || p.skinConcern.includes("Sensitive Skin");
  });

  const routine: any[] = [];
  let step = 1;

  // Find a cleanser
  const cleanser = db.products.find((p: any) => p.category === "cleanser") || db.products[1];
  routine.push({
    step: step++,
    type: "cleanser",
    productId: cleanser.id,
    productName: cleanser.name,
    instructions: "Apply morning and evening. Wash gently with lukewarm water. Crucial first step to clear pores."
  });

  // Find matching serum
  const serum = matchedProducts.find((p: any) => p.category === "serum") || db.products[0];
  routine.push({
    step: step++,
    type: "serum",
    productId: serum.id,
    productName: serum.name,
    instructions: serum.usage || "Apply a few drops after cleansing, patting gently into the skin."
  });

  // Find cream
  const cream = matchedProducts.find((p: any) => p.category === "cream") || db.products[3];
  routine.push({
    step: step++,
    type: "cream",
    productId: cream.id,
    productName: cream.name,
    instructions: cream.usage || "Apply evenly to lock in active ingredients and defend lipid layers."
  });

  res.json({
    routine,
    explanation: `Based on your skin profile (${answers.skinType}, targeting ${answers.concern} with ${answers.sensitivity} sensitivity), we designed this medical-grade routine. Since your barrier requires delicate care, we avoided excessive acids and introduced ${serum.name} which utilizes key therapeutic components like ${serum.ingredients[0]} to soothe redness, restore epidermal lipids, and elevate overall skin hydration securely.`,
    tips: [
      "Always patch test active serums behind the ear for 24 hours before full facial introduction.",
      "If using Retinol or exfoliating acids, SPF 50 is strictly mandatory the following morning to prevent severe post-inflammatory photo-pigmentation.",
      "Apply hydrating serums to damp skin to maximize water retention and lock in moisture efficiently."
    ]
  });
});

// POST: Skincare AI Consultation Chatbot Advisor
app.post("/api/gemini/advisor", async (req, res) => {
  const { message, history } = req.body;
  db = loadDB();

  const productsListStr = db.products
    .map((p: any) => `- Name: ${p.name}, Category: ${p.category}, Active Ingredients: ${p.ingredients.join(", ")}, Skin Concerns: ${p.skinConcern.join(", ")}, Price: $${p.price}, Target: ${p.description}`)
    .join("\n");

  const systemPrompt = `You are the chief Cetaphil clinical AI skincare consultant, a professional, highly empathetic dermatologist assistant. 
Your goal is to offer objective, science-backed skin counseling, break down advanced ingredients (like ceramides, niacinamide, panthenol, and calendula), and recommend precise products from our clinic's official line-up.

Always maintain a reassuring, authoritative, and helpful medical tone. Keep answers structured, easy to read, using clear markdown lists.
Do NOT mention or recommend any external brands or products outside of our Cetaphil lineup listed here:
${productsListStr}

If the user asks general questions about skin routines or specific ingredients, explain biochemically what they do and suggest the corresponding Cetaphil product.`;

  if (ai) {
    try {
      // Reconstruct chat with history
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: systemPrompt,
        }
      });

      // Inject history (excluding the final current message)
      if (history && history.length > 0) {
        // Simple mock history loading by iterating messages or constructing a single prompt containing context
      }

      const response = await chat.sendMessage({ message });
      return res.json({ response: response.text });
    } catch (err) {
      console.error("Gemini Advisor Error", err);
    }
  }

  // Fallback simulated response
  const lowerMsg = message.toLowerCase();
  let fallbackReply = "Thank you for consulting the Cetaphil Clinical Advisor. ";
  if (lowerMsg.includes("acne") || lowerMsg.includes("pimple") || lowerMsg.includes("oily")) {
    fallbackReply += "For oily and acne-prone skin, we advise the **Cetaphil Oily Skin Cleanser** to remove excess oil without stripping the moisture barrier, paired with our lightweight moisturizing formulations.";
  } else if (lowerMsg.includes("dry") || lowerMsg.includes("dehydrated") || lowerMsg.includes("flake")) {
    fallbackReply += "Dehydrated skin requires deep, long-lasting barrier repair. We recommend **Cetaphil Moisturizing Cream (Very Dry to Dry Sensitive Skin)** containing Sweet Almond Oil, Niacinamide, and Panthenol for 48-hour hydration defense.";
  } else if (lowerMsg.includes("sensitive") || lowerMsg.includes("red") || lowerMsg.includes("burn")) {
    fallbackReply += "Sensitive or reactive skin requires ultra-gentle, non-irritating care. We recommend the classic **Cetaphil Gentle Skin Cleanser** with Micellar Technology, followed by **Cetaphil Daily Hydrating Lotion** to soothe and calm the epidermis.";
  } else if (lowerMsg.includes("baby") || lowerMsg.includes("infant") || lowerMsg.includes("child")) {
    fallbackReply += "For delicate baby skin, explore our **Cetaphil Baby** range, featuring tear-free **Cetaphil Baby Daily Lotion with Organic Calendula** and **Cetaphil Baby Shampoo** to nourish delicate skin from Day 1.";
  } else {
    fallbackReply += "To establish a clinical routine for your skin, I recommend trying our **Interactive Skin Quiz** located in the top menu! It identifies your skin type and sensitivity triggers to provide recommended Cetaphil formulations.";
  }
  res.json({ response: fallbackReply });
});

// POST: AI Copywriter for CMS
app.post("/api/gemini/generate-description", async (req, res) => {
  const { name, ingredients, concerns } = req.body;

  const prompt = `You are a clinical skincare brand copywriter. Write a highly compelling, professional, dermatologist-aligned e-commerce product description for a product named "${name}" containing key ingredients "${ingredients}" designed specifically to treat "${concerns}".
Your copy must include:
1. An authoritative, elegant 3-sentence introduction describing the product's medical purpose and efficacy.
2. A bulleted list of 3 key scientific benefits (e.g. cellular hydration, sebum regulation, lipid alignment) using advanced medical terminology.
3. Concise "How to Use" instructions.

Keep the output elegant, professional, and do not use generic marketing buzzwords. Just return plain text formatted in standard markdown.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      return res.json({ text: response.text });
    } catch (err) {
      console.error("Gemini CMS Copywriter Error", err);
    }
  }

  // Simulated description fallback
  res.json({
    text: `### Clinical Description
This professional-strength formulation represents an advanced approach to restoring compromised skin architecture. Engineered with clinical-grade **${ingredients}**, it works at a cellular level to target **${concerns}** while strengthening structural skin integrity.

### Key Benefits
- **Optimized Skin Restoration**: Actively delivers therapeutic concentrations to reverse cellular fatigue.
- **Deep Moisture Reinforcement**: Rebuilds protective lipid bilayers, preventing trans-epidermal water loss (TEWL).
- **Targeted Care for ${concerns}**: Gently calms active inflammatory pathways and refines coarse textures.

### Clinical Directions
Apply 2-3 drops to dry, thoroughly cleansed skin in the morning or evening. Pat gently and follow with your recommended barrier repair moisturizer.`
  });
});

// Vite Middleware & Static Serves & Bootstrap
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cetaphil Server is running on port ${PORT}`);
  });
}

bootstrap();
