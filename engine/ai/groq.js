const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const RETRYABLE_STATUS = new Set([
  408,
  409,
  429,
  500,
  502,
  503,
  504
]);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function generateArticle({
  apiKey,
  model,
  prompt,
  temperature = 0.2,
  maxTokens = 2048,
  retryCount = 3,
  retryDelay = 3000
}) {
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  let lastError;

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      const response = await fetch(GROQ_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          temperature,
          max_tokens: maxTokens,
          messages: [
            {
              role: "system",
              content:
                "You are VIDHWAAN News AI. Return ONLY valid JSON. Never use markdown or explanations."
            },
            {
              role: "user",
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();

        if (
          response.status === 429
        ) {

          throw new Error(
            `Groq rate limit reached: ${errorText}`
          );

        }

        if (
          response.status !== 429 &&
          RETRYABLE_STATUS.has(response.status) &&
          attempt < retryCount
        ) {
          const retryAfter = Number(response.headers.get("Retry-After"));
          const MAX_RETRY_DELAY = 30000;

          const delay = Number.isFinite(retryAfter) && retryAfter > 0
            ? Math.min(retryAfter * 1000, MAX_RETRY_DELAY)
            : Math.min(retryDelay * (2 ** attempt), MAX_RETRY_DELAY);

          console.log(
            `[Groq] HTTP ${response.status}. Retry ${attempt + 1}/${retryCount} in ${delay} ms`
          );

          await sleep(delay);
          continue;
        }

        throw new Error(`Groq API error (${response.status}): ${errorText}`);
      }

      const result = await response.json();

      let content = result?.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new Error("Groq returned an empty response.");
      }

      // Remove markdown fences if AI returns ```json ... ```
      content = content
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      // Ensure JSON is valid before returning
      try {
        JSON.parse(content);
      } catch {
        throw new Error(
          "Groq returned invalid JSON:\\n" + content.slice(0, 500)
        );
      }

      return {
        content,
        usage: result.usage || {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };

    } catch (error) {
      lastError = error;

      if (
        error.message.includes("rate_limit_exceeded") ||
        error.message.includes("tokens per day") ||
        error.message.includes("TPD")
      ) {
        throw error;
      }

      if (attempt >= retryCount) {
        break;
      }

      const delay = retryDelay * (2 ** attempt);

      console.log(
        `[Groq] Network error attempt ${attempt + 1}/${retryCount}:`,
        error.message
      );

      console.log(
        `[Groq] Retrying in ${delay} ms`
      );

      await sleep(delay);
    }
  }

  throw lastError;
}
