export function buildPrompt(article) {
  const facts = [
    `Title: ${article.title}`,
    `Summary: ${article.excerpt || article.description || ""}`,
    `Content: ${(article.text || "").slice(0, 4000)}`,
    `Published: ${article.published || "Unknown"}`,
    `Category: ${article.category}`
  ].join("\n");

  return `
Generate ONE original Telugu news article.

Requirements:

- Use ONLY the facts provided.
- Never invent facts.
- Never mention the source website.
- Never translate sentence by sentence.
- Write natural Telugu.
- Write like a professional newspaper.
- Keep paragraphs short.
- No markdown.
- No HTML.
- Return ONLY valid JSON.

JSON format:

{
  "headline": "",
  "summary": "",
  "paragraphs": [],
  "category": "",
  "location": "",
  "importance": "normal",
  "tags": []
}

Verified Facts:

${facts}
`.trim();
}
