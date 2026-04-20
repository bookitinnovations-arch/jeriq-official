import { GoogleGenAI } from "@google/genai";

// Initialize Gemini on client side as per the gemini-api skill
// The platform injects GEMINI_API_KEY into the environment
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY || '' 
});

// Jeriq's Identity & Knowledge Base
const JERIQ_BIO = `
Full name: Jeremiah Chukwuebuka Ani
Born: May 6, 1999, Nkpor, Anambra — native of Enugu State. 
CEO of Iyoo Cartel Records.
Latest single: "Born to Be Great" (released January 26, 2026), produced by Dr Jayswaarg.
Pepsi Brand Ambassador: Appointed December 2025 (First Igbo artist in history).
Discography: 
- Hood Boy Dreams (2020)
- East N West (2021)
- Billion Dollar Dream (2022)
- BDD Deluxe (2023)
- Evil Twin (2024)
- King (2024)
Key Collaborations: Phyno, Zlatan, Odumodublvck, Victony, Bella Shmurda, Knucks (UK), Maglera Doe Boy (SA), Blaqbonez.
Major Feats: Sold out Nnamdi Azikiwe Stadium (30,000 capacity) in December 2024.
Rankings: Billboard Afrobeat Charts #47, Rolling Stone 40 Best Afropop Songs 2023.
Voice/Tone: Mixed Igbo, Pidgin, and English. Street-royal, confident, deeply rooted in the East (042, Enugu). 
Switching Tones: Deep storytelling for history, cryptic bar-dropping for rap, street Pidgin/Igbo for casual talk.
`;

const SYSTEM_PROMPT = `
You are IYOO AI, the digital embodiment of Jeriq the Hussla.
${JERIQ_BIO}
Rules:
- Speak a blend of English, Pidgin, and Igbo naturally.
- Call fans "Ogbe", "Soldier", or "Iyoo".
- Never break character. You are Jeriq.
- "Born to Be Great" is your anthem.
- You are the first Igbo Pepsi Ambassador.
`;

async function callAIGenerate(action: string, payload: any) {
  // Use gemini-3-flash-preview for basic text tasks
  const model = "gemini-3-flash-preview";
  
  let prompt = "";
  let responseMimeType: "application/json" | "text/plain" = "text/plain";

  switch (action) {
    case 'rap-name':
      prompt = `Generate a rap name for ${payload.realName} from ${payload.city}. Format JSON: { "rapName": "", "explanation": "", "rank": "", "motto": "" }`;
      responseMimeType = "application/json";
      break;
    case 'news-report':
      prompt = `Write a news report for ${payload.fanName} achievement: ${payload.achievement}. Format JSON: { "headline": "", "subheadline": "", "article": "", "reporter": "", "date": "${new Date().toLocaleDateString()}" }`;
      responseMimeType = "application/json";
      break;
    case 'rap-battle':
      prompt = `Generate an 8-bar rap battle on topic: ${payload.topic}. East vs West. Format JSON: { "topic": "", "eastVerse": "", "westVerse": "", "eastName": "East General", "westName": "Lagos Don" }`;
      responseMimeType = "application/json";
      break;
    case 'flow-analyzer':
      prompt = `Analyze these lyrics as Jeriq: "${payload.lyrics}". Score /10. Give line-by-line feedback. Format JSON: { "score": 0, "feedback": "", "lineAnalysis": [] }`;
      responseMimeType = "application/json";
      break;
    case 'prophecy':
      prompt = `Give a street prophecy for ${payload.name || 'Ogbe'} as Jeriq. Be dramatic. Format JSON: { "prophecy": "" }`;
      responseMimeType = "application/json";
      break;
    case 'mood-reader':
      prompt = `Recommend a Jeriq song for mood: ${payload.mood}. Explain why. Format JSON: { "song": "", "reason": "" }`;
      responseMimeType = "application/json";
      break;
    case 'verse-gen':
      prompt = `Write a hard-hitting 8-bar rap verse for a fan named ${payload.name || 'Ogbe'}. Mention the East and hussle. Format JSON: { "verse": "" }`;
      responseMimeType = "application/json";
      break;
    case 'verdict':
      prompt = `Jeriq, give your street verdict on this situation: "${payload.situation}". Be fair but tough. Format JSON: { "verdict": "" }`;
      responseMimeType = "application/json";
      break;
    case 'decode':
      prompt = `Explain the hidden Igbo wordplay and street meaning in these bars: "${payload.bars}". Format JSON: { "explanation": "" }`;
      responseMimeType = "application/json";
      break;
    case 'outfit':
      prompt = `What would Jeriq wear to "${payload.occasion}"? Describe the drip in detail. Format JSON: { "outfit": "" }`;
      responseMimeType = "application/json";
      break;
    case 'chat':
      // Chat handled specifically below
      break;
    default:
      throw new Error("Invalid action");
  }

  if (action === 'chat') {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: payload.messages,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });
    return { text: response.text };
  }

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType,
    }
  });

  const text = response.text || '';
  return responseMimeType === "application/json" ? JSON.parse(text) : { text };
}

// Tool Export Functions
export async function generateRapName(realName: string, city: string) { return callAIGenerate('rap-name', { realName, city }); }
export async function generateNewsReport(fanName: string, achievement: string) { return callAIGenerate('news-report', { fanName, achievement }); }
export async function generateRapBattle(topic: string) { return callAIGenerate('rap-battle', { topic }); }
export async function analyzeFlow(lyrics: string) { return callAIGenerate('flow-analyzer', { lyrics }); }
export async function generateProphecy(name: string) { return callAIGenerate('prophecy', { name }); }
export async function readBeatMood(mood: string) { return callAIGenerate('mood-reader', { mood }); }
export async function generateVerse(name: string) { return callAIGenerate('verse-gen', { name }); }
export async function giveVerdict(situation: string) { return callAIGenerate('verdict', { situation }); }
export async function decodeBars(bars: string) { return callAIGenerate('decode', { bars }); }
export async function generateOutfit(occasion: string) { return callAIGenerate('outfit', { occasion }); }

export const iyooAI = {
  async chat(userMessage: string, history: any[]) {
    // Format history for the SDK
    const formattedHistory = history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || m.parts?.[0]?.text }]
    }));

    return callAIGenerate('chat', { 
      messages: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ]
    });
  }
};
