import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini on server side
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Proxy Gemini requests to keep key secret
  app.post("/api/ai/generate", async (req, res) => {
    const { action, payload } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY not configured on server" });
    }

    try {
      let result;
      const model = "gemini-3.1-pro-preview";

      switch (action) {
        case "rap-name":
          result = await ai.models.generateContent({
            model,
            contents: [{ role: 'user', parts: [{ text: `You are Jeriq — CEO of Iyoo Cartel. Generate a rap name for ${payload.realName} from ${payload.city}. Format JSON: { "rapName": "", "explanation": "", "rank": "", "motto": "" }` }] }],
            config: { responseMimeType: "application/json" }
          });
          break;
        
        case "news-report":
          result = await ai.models.generateContent({
            model,
            contents: [{ role: 'user', parts: [{ text: `You are editor of ENUGU TIMES. Write a news report for ${payload.fanName} achievement: ${payload.achievement}. Format JSON: { "headline": "", "subheadline": "", "article": "", "reporter": "", "date": "${new Date().toLocaleDateString()}" }` }] }],
            config: { responseMimeType: "application/json" }
          });
          break;

        case "rap-battle":
          result = await ai.models.generateContent({
            model,
            contents: [{ role: 'user', parts: [{ text: `Generate an 8-bar rap battle on topic: ${payload.topic}. East vs West. Format JSON: { "topic": "", "eastVerse": "", "westVerse": "", "eastName": "East General", "westName": "Lagos Don" }` }] }],
            config: { responseMimeType: "application/json" }
          });
          break;

        case "chat":
          // For chat we'll use simple generation for now
          result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: payload.messages,
            config: {
              systemInstruction: "You are IYOO AI, the digital embodiment of Jeriq the Hussla and the Iyoo Cartel. Your tone is street-royal, confident, and deeply rooted in the East (042, Enugu). Speak a blend of English, Pidgin, and Igbo. You are loyal to your fans. Call them \"Ogbe\", \"Soldier\", or \"Iyoo\". Born to Be Great is your latest 2026 single. You became Pepsi Ambassador in Dec 2025."
            }
          });
          return res.json({ text: result.text });

        case "flow-analyzer":
          result = await ai.models.generateContent({
            model,
            contents: [{ role: 'user', parts: [{ text: `Analyze these lyrics as Jeriq: "${payload.lyrics}". Score /10. Give line-by-line feedback. Format JSON: { "score": 0, "feedback": "", "lineAnalysis": [] }` }] }],
            config: { responseMimeType: "application/json" }
          });
          break;

        case "prophecy":
          result = await ai.models.generateContent({
            model,
            contents: [{ role: 'user', parts: [{ text: `Give a street prophecy for ${payload.name} as Jeriq. Be dramatic. Format JSON: { "prophecy": "" }` }] }],
            config: { responseMimeType: "application/json" }
          });
          break;

        case "mood-reader":
          result = await ai.models.generateContent({
            model,
            contents: [{ role: 'user', parts: [{ text: `Recommend a Jeriq song for mood: ${payload.mood}. Explain why. Format JSON: { "song": "", "reason": "" }` }] }],
            config: { responseMimeType: "application/json" }
          });
          break;

        default:
          return res.status(400).json({ error: "Invalid action" });
      }

      res.json(JSON.parse(result.text));
    } catch (error: any) {
      console.error("AI Proxy Error:", error);
      res.status(500).json({ error: error.message || "Failed to contact Gemini" });
    }
  });

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
