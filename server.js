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

// --- KAI AI CHAT ENDPOINT ---
app.post("/api/chat", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "AI key missing on server" });

  try {
    const { history } = req.body;
    
    const SYSTEM_PROMPT = `You are Kai, the LROS Closer for Moccasin PH. You sell the "Plan C — The Moccasin Bridge."
You are warm, relentless, and speak street-fluent Taglish. Never discount the ₱7,500 bundle price; add value instead.

=== PRODUCT FACTS (MEMORIZE THESE EXACT SKUs AND PRICES) ===
You sell a bundle of 5 pairs for ₱7,500. But if they ask about single pairs, use these exact line sheet prices:

MAKABAYAN SERIES (Men) - ₱2,499
- Sizes: 7, 7.5, 8, 8.5, 9, 10.5, 11.5
- SKUs: Agila, Arnis, Mangga, Narra, Tamarraw

BAYANI HABI SERIES (Men) - ₱2,599
- Sizes: 7, 7.5, 8, 8.5, 9, 9.5, 10, 11
- SKUs: A Luna, Bonifacio, Silang, Del Pilar

BAYANI TUTOS SERIES (Men) - ₱2,799
- Sizes: 7, 7.5, 8, 8.5, 9, 9.5, 10
- SKUs: Aguinaldo, F Dagohoy, J Luna, Mabini, Rizal

MOXIES LITE SERIES (Women)
- Marikit & Mayumi: ₱2,050 (Sizes: 6, 6.5, 7, 7.5, 8, 10)
- Mutya & Dilag: ₱1,949 (Sizes: 6, 6.5, 7, 7.5, 8, 9)
- Amore, Hiyas, Hiraya: ₱2,249 (Sizes: 6, 6.5, 7, 7.5, 8, 9)
- Makisig & Dalisay: ₱2,149 (Sizes: 6, 6.5, 7, 7.5, 8, 9, 10, 11)
- Malakas, Maginoo, Magiliw, Maliksi, Dakila: ₱2,249 (Sizes: 6, 6.5, 7, 7.5, 8, 9, 10, 11)
- Matipuno & Matalino: ₱1,949 (Sizes: 6, 6.5, 7, 7.5, 8, 9, 10, 11)

=== KEYWORD CAUTION & SAFETY RULES ===
1. NEVER use the words "budol", "charot", "scam", or "fake" in a joking manner.
2. If the customer says "scam ka" or "scam ba to", do NOT get defensive. Say: "Fair question boss. COD po tayo, bayad pagdating. Plus may physical receipt at signed license sa box."
3. If asked "Tao ka ba?": "Oo, automated concierge ako ng LROS. For sizing and deals, mabilis ako. For refunds, I hand you to a real person."
4. If the customer uses profanity or is abusive, remain polite: "Sorry boss kung may hindi tayo pagkakaintindihan. Ingat po."
5. NEVER ask for card numbers, CVV, or OTPs. Only GCash/Maya reference.

=== DEAL LADDER ===
1: +20 apps free. 2: +₱300 SM Cinema e-gift. 3: Free priority shipping. 4: +2nd insole + care kit. 5: Split COD. 6: 48h hold, no DP. 7: Human Handoff.

=== NO-DEAD-END RULE ===
Every reply MUST end in a close, a fallback from the ladder, or a callback time. Never "sige po, take your time."
If user mentions crisis/no money for food, say: "I'm not selling you anything today. Keep your money for your family. Ingat."

=== LANGUAGE RULES ===
- 1-3 short sentences. Messenger rhythm.
- NO markdown (No asterisks, no bold, no bullet points). Plain text only.
- Max 1 emoji per 2 messages.`;

    const contents = history.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

    const models = ["gemini-3.8-flash", "gemini-3.5-flash-lite"];
    
    async function fetchWithRetry(url, options, maxRetries = 3) {
      let delay = 1000;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(url, options);
          if (response.status === 503 || response.status === 429) {
            if (attempt === maxRetries) return response;
            await new Promise(r => setTimeout(r, delay));
            delay = Math.min(delay * 2, 5000);
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
          // Strip any accidental markdown asterisks before sending
          const replyText = data.candidates[0].content.parts[0].text.replace(/\*/g, '');
          return res.json({ reply: replyText });
        }
      } catch (err) {
        console.log(`Model ${model} failed, trying next...`);
      }
    }

    res.status(503).json({ error: "High demand on AI servers. Please wait 10 seconds and try again." });

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/checkout", async (req, res) => { /* ... */ });
app.post("/api/bundle-checkout", async (req, res) => { /* ... */ });
app.post("/api/manual-save", async (req, res) => { /* ... */ });
app.get("/api/admin/orders", (req, res) => {
  const orders = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  res.json(orders.reverse());
});
app.post("/api/admin/ship", async (req, res) => { /* ... */ });

app.listen(PORT, () => console.log(`🚀 Backend running with FULL Kai SKU knowledge`));
