import fs from "fs";
import readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const askQuestion = (q) => new Promise((resolve) => rl.question(q, resolve));

const SYSTEM_PROMPT = `You are Kai, the LROS Closer on Messenger. You sell "Plan C — The Moccasin Bridge."
You are an experienced, top-performing closer. You have never walked away from a warm lead empty-handed. You treat every "no" as a request for a different deal. But you never lie, never fake urgency, never fake reviews.

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

=== YOUR PERSONALITY ===
Warm, relentless, fast, punchy, funny. Mirror the customer's language. Slang is on: "pre", "bro", "boss", "idol", "lods", "sulit", "solid", "sagad", "pack na natin 'yan", "tara", "game".
=== DEAL LADDER ===
1: +20 apps free. 2: +₱300 SM Cinema e-gift. 3: Free priority shipping. 4: +2nd insole + care kit. 5: Split COD. 6: 48h hold, no DP. 7: Human Handoff.
=== NO-DEAD-END RULE ===
Every reply MUST end in a close, a fallback from the ladder, or a callback time. Never "sige po, take your time."
=== HARD STOPS ===
1. Distress: "I'm not selling you anything today. Keep your money..." 2. Stop: "Copy, boss. I'll stop. Salamat sa oras. 🙏"
=== LANGUAGE RULES ===
1-3 short sentences. Messenger rhythm. Max 1 emoji per 2 messages. Never corporate-speak.`;

const SCENARIOS = [
    "Customer says 'Magkano?' (How much?)",
    "Customer says 'Ang mahal naman' (It's too expensive)",
    "Customer asks 'Scam ba to?' (Is this a scam?)",
    "Customer says 'Wala akong pera ngayon' (I have no money right now)",
    "Customer asks about specific shoe sizes and availability.",
    "Customer says 'Sige, next month na lang' (Okay, maybe next month)",
    "Customer asks 'Ano mga apps?' (What are the apps?)",
    "Customer says 'Bawas na lang' (Can you give a discount?)",
    "Customer says 'Pang-gatas na lang ng anak ko' (HARD STOP)",
    "Customer asks 'Pwede ba COD?' (Can I pay cash on delivery?)",
    "Customer is comparing to Shopee/Lazada.",
    "Customer says 'Bakit 5 pairs?' (Why 5 pairs?)",
    "Customer asks 'Legit ba yung leather?' (Is the leather legit?)",
    "Customer says 'Sige na nga, game!' (Okay, let's do it!)",
    "Customer says 'Wait, may tanong ako' (Wait, I have a question)"
];

const MODELS = ["gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite"];

async function fetchWithRetry(url, options, maxRetries = 5) {
    let delay = 2000;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            if (response.status === 429 || response.status === 503 || response.status === 500) {
                if (attempt === maxRetries) return response;
                await new Promise(r => setTimeout(r, delay));
                delay = Math.min(delay * 2, 15000);
                continue;
            }
            return response;
        } catch (err) {
            if (attempt === maxRetries) throw err;
            await new Promise(r => setTimeout(r, delay));
            delay = Math.min(delay * 2, 15000);
        }
    }
}

async function generateTranscripts(apiKey) {
    const outputFile = "kai_training_data.jsonl";
    if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);

    console.log("\n🚀 Starting generation of 200 transcripts...");
    console.log("⏳ This will take about 15-20 minutes. Do not close this window.\n");

    let successCount = 0;

    for (let i = 1; i <= 200; i++) {
        const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
        const prompt = `Generate a realistic exchange between a Filipino customer and Kai.
Customer action: "${scenario}"
Output ONLY raw JSON exactly like this format, no markdown formatting:
{"user": "customer message", "assistant": "kai reply"}`;

        let success = false;
        
        for (const model of MODELS) {
            if (success) break;
            try {
                const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                        contents: [{ role: "user", parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.8 }
                    })
                });

                const data = await response.json();
                
                if (data.error) {
                    if (data.error.code === 503) {
                        process.stdout.write(`\r⚠️ Google is busy. Switching model...`);
                        continue; 
                    } else {
                        process.stdout.write(`\r❌ Error on ${i}: ${data.error.message}`);
                        continue;
                    }
                }

                let rawText = data.candidates[0].content.parts[0].text.trim();
                rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
                
                const pair = JSON.parse(rawText);
                const jsonlLine = JSON.stringify({
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: pair.user },
                        { role: "assistant", content: pair.assistant }
                    ]
                });

                fs.appendFileSync(outputFile, jsonlLine + "\n");
                successCount++;
                success = true;
                
                process.stdout.write(`\r✅ Generated: ${successCount} / 200 conversations...   `);

            } catch (error) {
                process.stdout.write(`\r⚠️ Parse error on ${i}. Retrying...`);
            }
        }

        // Wait 6 seconds between successful requests to respect free tier limits
        await new Promise(r => setTimeout(r, 6000));
    }

    console.log("\n\n🎉 SUCCESS! Generation complete.");
    console.log(`📁 Saved to: ${outputFile}`);
}

(async () => {
    const apiKey = await askQuestion("Paste your Gemini API Key (AIza...): ");
    rl.close();
    if (!apiKey) return console.log("No API key provided.");
    await generateTranscripts(apiKey.trim());
})();
