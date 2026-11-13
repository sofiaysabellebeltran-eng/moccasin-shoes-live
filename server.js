import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3001;
const PAYMONGO_SECRET = process.env.PAYMONGO_SECRET_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
const DB_FILE = path.join(process.cwd(), "orders.json");

if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([]));

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: "moccasin.info@theljrgroup.com", pass: "aiod hzgz midh saqk" },
});

app.use(cors());
app.use(bodyParser.json());

// --- KAI AI CHAT ENDPOINT WITH RETRY & FALLBACK ---
app.post("/api/chat", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "AI key missing on server" });

  try {
    const { history } = req.body;
    const SYSTEM_PROMPT = `You are Kai, the LROS Closer for Moccasin PH. You sell the "Plan C — The Moccasin Bridge" (5 pairs of handmade leather moccasins + 50 digital apps for ₱7,500). You are warm, relentless, and speak street-fluent Taglish. Never discount the ₱7,500 price; add value instead. End EVERY reply with a close, fallback, or callback. Hard Stop: If user mentions crisis/no money for food, say "I'm not selling you anything today. Keep your money for your family. Ingat."`;
    
    const contents = history.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

    // Models to try in order
    const models = ["gemini-3.8-flash", "gemini-3.5-flash-lite"];
    
    // Fetch with retry logic
    async function fetchWithRetry(url, options, maxRetries = 3) {
      let delay = 1000; // Start with 1 second
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(url, options);
          if (response.status === 503 || response.status === 429) {
            if (attempt === maxRetries) return response;
            console.log(`⚠️ Model busy (503). Retrying in ${delay}ms...`);
            await new Promise(r => setTimeout(r, delay));
            delay = Math.min(delay * 2, 5000); // Exponential backoff up to 5s
            continue;
          }
          return response;
        } catch (err) {
          if (attempt === maxRetries) throw err;
          await new Promise(r => setTimeout(r, delay));
          delay = Math.min(delay * 2, 5000);
        }
      }
    }

    let finalResponse = null;

    for (const model of models) {
      try {
        const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents
          })
        });

        const data = await response.json();
        
        if (!data.error && data.candidates && data.candidates[0]) {
          const replyText = data.candidates[0].content.parts[0].text.replace(/\*/g, '');
          return res.json({ reply: replyText }); // Success! Exit loop and send reply
        } else {
          console.log(`⚠️ Model ${model} failed with error: ${data.error?.message || 'Unknown'}. Trying next model...`);
        }
      } catch (err) {
        console.log(`⚠️ Network error with model ${model}. Trying next model...`);
      }
    }

    // If all models fail
    console.error("❌ All models failed. High demand or network issue.");
    res.status(503).json({ error: "High demand on AI servers. Please wait 10 seconds and try again." });

  } catch (error) {
    console.error("❌ Server error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- EXISTING PAYMONGO & ORDER ENDPOINTS ---
app.post("/api/checkout", async (req, res) => { /* ... */ });
app.post("/api/bundle-checkout", async (req, res) => { /* ... */ });
app.post("/api/manual-save", async (req, res) => { /* ... */ });
app.get("/api/admin/orders", (req, res) => {
  const orders = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  res.json(orders.reverse());
});
app.post("/api/admin/ship", async (req, res) => { /* ... */ });

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT} with retry logic`));
