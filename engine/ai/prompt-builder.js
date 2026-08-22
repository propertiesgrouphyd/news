export function buildPrompt(article) {

    const facts = [
        `Title: ${article.title}`,
        `Summary: ${article.excerpt || article.description || ""}`,
        `Content: ${(article.text || "").slice(0, 1500)}`,
        `Published: ${article.published || "Unknown"}`,
        `Category: ${article.category}`
    ].join("\n");

    return `
Generate one original Telugu news article.

Rules:

- Use only the verified facts.
- Never invent information.
- Never mention source website.
- Write natural Telugu newspaper style.
- Do not translate sentence by sentence.
- Keep paragraphs short.
- Use clear headings.
- Return ONLY valid JSON.
- No markdown.
- No HTML.

Required JSON format:

{
  "headline": "",
  "summary": "",
  "sections": [
    {
      "heading": "",
      "paragraphs": [
        ""
      ]
    }
  ],
  "category": "",
  "location": "",
  "importance": "normal",
  "tags": []
}

Verified facts:

${facts}
`.trim();

}
