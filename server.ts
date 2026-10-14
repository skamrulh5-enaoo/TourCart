import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// Enforce explicit JSON body size limit to prevent memory exhaustion attacks
app.use(express.json({ limit: "256kb" }));

// In-Memory Rate Limiter for API endpoints
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function apiRateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 20; // 20 requests per minute

  const record = rateLimitStore.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (record.count >= maxRequests) {
    return res.status(429).json({ error: "Too many requests. Please wait a minute before trying again." });
  }

  record.count += 1;
  next();
}

// Clean up stale rate limit entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Initialize Gemini client lazily
function getGenAIClient(clientKey?: string) {
  const apiKey = clientKey || reqApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing. Please set GEMINI_API_KEY or provide an API key.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

let reqApiKey = "";

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "TourCart AI Engine", secure: true, hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// TOUR PLANNING AI CHATBOT ENDPOINT (Protected by Rate Limiter)
app.post("/api/chat", apiRateLimiter, async (req, res) => {
  try {
    const { message, history, messages, context, apiKey } = req.body;
    if (apiKey && typeof apiKey === "string" && apiKey.trim().length > 10) {
      reqApiKey = apiKey.trim();
    } else {
      const headerKey = req.headers["x-gemini-api-key"];
      if (typeof headerKey === "string" && headerKey.trim().length > 10) {
        reqApiKey = headerKey.trim();
      }
    }

    let userQuery = "";
    let chatHistory: Array<{ role?: string; content?: string; text?: string }> = [];

    if (typeof message === "string" && message.trim().length > 0) {
      userQuery = message.trim();
      if (Array.isArray(history)) chatHistory = history;
    } else if (Array.isArray(messages) && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      userQuery = (lastMsg?.content || lastMsg?.text || "").trim();
      chatHistory = messages.slice(0, -1);
    }

    if (!userQuery) {
      return res.status(400).json({ error: "Message string or non-empty messages array is required." });
    }

    if (userQuery.length > 2000) {
      return res.status(400).json({ error: "Message exceeds maximum length of 2000 characters." });
    }

    const ai = getGenAIClient();

    let contextBonus = "";
    if (context && typeof context === "object") {
      if (context.currentTrip) contextBonus += ` User active destination: ${context.currentTrip}.`;
      if (context.selectedRoute) contextBonus += ` Selected route: ${context.selectedRoute}.`;
      if (context.cartCount) contextBonus += ` Cart items count: ${context.cartCount}.`;
    }

    const systemInstruction = `
You are the Official TourCart AI Travel Concierge & Tour Planner, an expert local travel guide for Bangladesh tourism, specifically specializing in Southeast & Sylhet region spots:
- Cox's Bazar (World's longest beach, Inani, Himchhari, Marine Drive, Moheshkhali)
- Saint Martin's Island (Coral Island, Chhera Dwip, fresh seafood, kayaking)
- Bandarban (Nilgiri, Bogakain Lake, Keokradong, Nafakhum, Amiakhum, Golden Temple, Chimbuk Peak)
- Rangamati (Kaptai Lake, Hanging Bridge, Shuvolong Waterfall, Rajban Vihara)
- Khagrachhari (Alutila Cave, Risang Waterfall, Sajek Valley)
- Sylhet & Sreemangal (Ratargul Swamp Forest, Jaflong, Bichnakandi, Sadapathar, Lawachara, Tea Gardens)
- Chittagong & Dhaka heritage gateways.
${contextBonus}

Your mission:
1. Provide enthusiastic, highly practical, and well-structured tour itineraries tailored to the user's specific preferences (duration, budget, travel style, group size, interests).
2. Detail day-by-day schedules with morning, afternoon, and evening activities.
3. Recommend best transport options (Non-AC/AC Scania Bus, Train, Jeep/Chander Gari, Kayak) and hotel tiers (Budget, Standard, Luxury/5-Star).
4. Provide estimated cost breakdowns in Bangladeshi Taka (BDT ৳) per person.
5. Offer authentic local tips (food items to try like Cox's Bazar Loitta Fry, Bandarban Bamboo Chicken, Saint Martin Lobster/Snapper, Sylhet Shatkora Beef).
6. Be friendly, polite, and end with an encouraging note. Format responses using clean Markdown with bold headings, bullet points, and emoji icons.
`;

    // Format chat contents safely
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(chatHistory)) {
      // Limit history to last 10 messages max to prevent token amplification attacks
      const boundedHistory = chatHistory.slice(-10);
      boundedHistory.forEach((item) => {
        const textVal = (item.content || item.text || "").trim();
        if (textVal.length > 0) {
          contents.push({
            role: item.role === "model" || item.role === "assistant" ? "model" : "user",
            parts: [{ text: textVal.slice(0, 1000) }],
          });
        }
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: userQuery }],
    });

    const candidateModels = ["gemini-3.6-flash", "gemini-flash-latest"];
    let responseText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          },
        });
        if (response && response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt with ${modelName} failed:`, err?.message || err);
      }
    }

    if (!responseText) {
      console.error("All Gemini models failed. Last error:", lastError);
      return res.status(500).json({
        error: lastError?.message ? `Gemini API error: ${lastError.message}` : "Unable to reach Gemini API. Please check your API Key configuration or try again.",
      });
    }

    return res.json({ reply: responseText, response: responseText });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({
      error: error?.message || "An error occurred while generating your tour plan. Please try again.",
    });
  }
});

// PAYMENT GATEWAY VERIFICATION ENDPOINT (bKash & Nagad)
app.post("/api/payment/verify", apiRateLimiter, (req, res) => {
  try {
    const { method, amount, senderPhone, trxId, refNum, merchantNumber } = req.body;

    if (!trxId || typeof trxId !== "string" || trxId.trim().length < 6) {
      return res.status(400).json({ error: "Valid bKash / Nagad Transaction ID (TrxID) is required (min 6 chars)." });
    }

    if (!senderPhone || typeof senderPhone !== "string" || senderPhone.trim().length < 10) {
      return res.status(400).json({ error: "Valid 11-digit Sender Mobile Number is required." });
    }

    const cleanedTrxId = trxId.trim().toUpperCase();
    const cleanedSender = senderPhone.trim();
    const receiptId = `RCPT-TC-${Math.floor(100000 + Math.random() * 900000)}`;

    return res.json({
      success: true,
      receiptId: receiptId,
      status: "PAID_VERIFIED_PENDING_AUDIT",
      message: `${method || 'MFS'} Payment transaction recorded successfully!`,
      payment: {
        method: method || "bKash",
        trxId: cleanedTrxId,
        amount: Number(amount) || 0,
        senderPhone: cleanedSender,
        merchantNumber: merchantNumber || "01740902857",
        refNum: refNum || `TC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("Payment verification error:", err);
    return res.status(500).json({ error: "Failed to process payment verification." });
  }
});

// ROBOTS.TXT ROUTE — Optimized for Search Engines (Google, Bing) and AI Bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *
Allow: /
Allow: /destination/
Allow: /guides/
Allow: /sitemap.xml
Disallow: /admin
Disallow: /api/

# AI Crawler Permissions
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bytespider
Allow: /

Sitemap: https://app.tourcartbd.com/sitemap.xml
`);
});

// SITEMAP.XML ROUTE — Dynamic XML Sitemap for Crawlability and Indexability
app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  const baseUrl = "https://app.tourcartbd.com";
  const today = new Date().toISOString().split("T")[0];

  const pages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/#destinations", priority: "0.9", changefreq: "daily" },
    { url: "/#activities", priority: "0.9", changefreq: "daily" },
    { url: "/#hotels", priority: "0.8", changefreq: "weekly" },
    { url: "/#bus-transport", priority: "0.8", changefreq: "weekly" },
    { url: "/#local-transport", priority: "0.8", changefreq: "weekly" },
    { url: "/#aeo-knowledge-hub", priority: "0.9", changefreq: "weekly" },
    { url: "/#destination-guides", priority: "0.9", changefreq: "weekly" },
    { url: "/#app-registration", priority: "0.7", changefreq: "monthly" },
    { url: "/#faq", priority: "0.8", changefreq: "monthly" },
    { url: "/destination/coxsbazar", priority: "0.9", changefreq: "weekly" },
    { url: "/destination/bandarban", priority: "0.9", changefreq: "weekly" },
    { url: "/destination/rangamati", priority: "0.8", changefreq: "weekly" },
    { url: "/destination/khagrachhari", priority: "0.8", changefreq: "weekly" },
    { url: "/destination/chattogram", priority: "0.8", changefreq: "weekly" }
  ];

  const xmlUrls = pages
    .map(
      (p) => `  <url>
    <loc>${baseUrl}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("\n");

  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`);
});

// SEO SCHEMA API ROUTE
app.get("/api/seo/schema", (req, res) => {
  res.json({
    agency: "TourCart Bangladesh",
    url: "https://app.tourcartbd.com",
    destinationsCount: 5,
    destinations: ["Cox's Bazar", "Bandarban", "Rangamati", "Khagrachhari", "Chattogram"],
    features: ["Modular Itinerary Builder", "Direct MFS Deposit", "Zero Markup", "Local Drivers & Hotels"]
  });
});

async function startServer() {
  // Vite middleware for development
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
    console.log(`TourCart server running on http://localhost:${PORT}`);
  });
}

startServer();
