import { generateArticle } from "./engine/ai/groq.js";

const start = Date.now();

try {
    const result = await generateArticle({
        apiKey: process.env.GROQ_API_KEY,
        model: "llama-3.3-70b-versatile",
        prompt: "Reply ONLY with valid JSON: {\"status\":\"ok\"}",
        temperature: 0,
        maxTokens: 32
    });

    console.log("SUCCESS");
    console.log(result);

} catch (e) {
    console.log("FAILED");
    console.log(e.message);
}

console.log("Elapsed:", Date.now() - start, "ms");
