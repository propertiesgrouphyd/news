import settings from "../../config/settings.json" with { type: "json" };

import { buildPrompt } from "../ai/prompt-builder.js";
import { generateArticle } from "../ai/groq.js";
import { parseAndValidate } from "../validator/validator.js";
import { addUsage, checkUsageLimit } from "../ai/usage-tracker.js";

const AI_DELAY = 3000;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function processArticle(article) {

    await checkUsageLimit();

    const prompt = buildPrompt(article);

    const response = await generateArticle({
        apiKey: process.env.GROQ_API_KEY,
        model: settings.ai.model,
        temperature: settings.ai.temperature,
        maxTokens: settings.ai.maxTokens,
        retryCount: settings.ai.retryCount,
        retryDelay: settings.ai.retryDelay,
        prompt
    });

    await addUsage(response.usage);

    const validatedArticle = parseAndValidate(response.content);

    await sleep(AI_DELAY);

    return validatedArticle;

}
