import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({ apiKey });
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "TourCartBD AI Engine" });
});

// TOUR PLANNING AI CHATBOT ENDPOINT
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message string is required." });
    }

    const ai = getGenAIClient();

    const systemInstruction = `
You are the Official TourCartBD AI Travel Concierge & Tour Planner, an expert local travel guide for Bangladesh tourism, specifically specializing in Southeast & Sylhet region spots:
- Cox's Bazar (World's longest beach, Inani, Himchhari, Marine Drive, Moheshkhali)
- Saint Martin's Island (Coral Island, Chhera Dwip, fresh seafood, kayaking)
- Bandarban (Nilgiri, Bogakain Lake, Keokradong, Nafakhum, Amiakhum, Golden Temple, Chimbuk Peak)
- Rangamati (Kaptai Lake, Hanging Bridge, Shuvolong Waterfall, Rajban Vihara)
- Khagrachhari (Alutila Cave, Risang Waterfall, Sajek Valley)
- Sylhet & Sreemangal (Ratargul Swamp Forest, Jaflong, Bichnakandi, Sadapathar, Lawachara, Tea Gardens)
- Chittagong & Dhaka heritage gateways.

Your mission:
1. Provide enthusiastic, highly practical, and well-structured tour itineraries tailored to the user's specific preferences (duration, budget, travel style, group size, interests).
2. Detail day-by-day schedules with morning, afternoon, and evening activities.
3. Recommend best transport options (Non-AC/AC Scania Bus, Train, Jeep/Chander Gari, Kayak) and hotel tiers (Budget, Standard, Luxury/5-Star).
4. Provide estimated cost breakdowns in Bangladeshi Taka (BDT ৳) per person.
5. Offer authentic local tips (food items to try like Cox's Bazar Loitta Fry, Bandarban Bamboo Chicken, Saint Martin Lobster/Snapper, Sylhet Shatkora Beef).
6. Be friendly, polite, and end with a encouraging note. Format responses using clean Markdown with bold headings, bullet points, and emoji icons.
`;

    // Format chat contents
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      history.forEach((item: { role?: string; text?: string }) => {
        if (item.text) {
          contents.push({
            role: item.role === "model" ? "model" : "user",
            parts: [{ text: item.text }],
          });
        }
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const responseText = response.text || "Sorry, I couldn't generate a tour plan right now. Please try again!";

    return res.json({ response: responseText });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({
      error: error.message || "An error occurred while generating your tour plan.",
    });
  }
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
    console.log(`TourCartBD server running on http://localhost:${PORT}`);
  });
}

startServer();
