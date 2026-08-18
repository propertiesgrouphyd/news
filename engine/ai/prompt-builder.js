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

- Use only the verified facts below. Never invent information.
- Never mention the source website.
- Write natural, professional Telugu newspaper style.
- Understand the facts first and rewrite them naturally; do not translate sentence by sentence.
- "headline", "summary", every "sections.heading", and every "sections.paragraphs" MUST be in Telugu.
- Do not leave English sentences in any editorial content.
- Preserve names, official abbreviations, organizations, schemes, places, numbers, and technical terms accurately when required.
- "location" should use the natural Telugu location name.
- "tags" must be concise, natural Telugu terms that are easy for Telugu readers to understand and search.
- Preserve official abbreviations such as PGRS and GVMC when appropriate.
- Keep paragraphs short, clear, factual, and easy to read.
- Use clear Telugu headings.
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

Language requirements:

- headline: Telugu
- summary: Telugu
- sections.heading: Telugu
- sections.paragraphs: Telugu
- location: natural Telugu location name
- tags: concise Telugu searchable terms
- category: use the provided category
- importance: use the appropriate allowed value based only on the verified facts

Before returning, verify that all editorial text is Telugu and every statement is supported by the verified facts.

Verified facts:

${facts}
`.trim();

}
