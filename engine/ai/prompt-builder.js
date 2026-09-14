export function buildPrompt(article) {

    const facts = [
        `Title: ${article.title}`,
        `Summary: ${article.excerpt || article.description || ""}`,
        `Content: ${(article.text || "").slice(0, 1500)}`,
        `Published: ${article.published || "Unknown"}`,
        `Category: ${article.category}`
    ].join("\n");

    return `
Generate one original Telugu news article from the verified source information below.

Rules:

- Use only the verified facts provided below.
- Never invent information.
- Never change the meaning of the source.
- Never add facts, names, numbers, dates, places, quotations, causes or details that are not provided.
- Never mention the source website.
- Understand the complete meaning of the source before writing.
- Translate the meaning accurately into Telugu rather than translating word by word.
- Do not translate sentence by sentence mechanically.
- Write natural, fluent, modern and standard Telugu.
- Write like an experienced native Telugu newspaper journalist.
- Use correct Telugu grammar, spelling, vocabulary, sentence structure and word order.
- Use the commonly accepted and correct Telugu form of names, places and other proper nouns.
- Do not create incorrect or unnatural Telugu spellings while translating names or places.
- Prefer simple and clear Telugu that ordinary readers can easily understand.
- Use natural Telugu words wherever appropriate instead of unnecessary English words.
- Avoid unnecessary mixing of English and Telugu.
- Do not leave source-language words in the article when they can be naturally expressed in Telugu.
- Do not produce literal, robotic, awkward or machine-translated Telugu.
- Do not use overly formal, literary or unnatural Telugu when simple modern Telugu is appropriate.
- Preserve the exact meaning and context of the original information.
- Preserve uncertainty, attribution and claims exactly as presented in the source.
- Do not turn a claim, allegation or statement into an established fact.
- Keep paragraphs short and readable.
- Write a clear and informative headline.
- Write a concise and accurate summary.
- Use clear and meaningful Telugu section headings.
- Avoid unnecessary repetition.
- Maintain a neutral and professional news-writing style.
- Do not sensationalise.
- Do not add opinions or speculation.
- Before returning the result, silently read and review the complete Telugu article once.
- Correct any spelling, grammar, translation, wording or unnatural Telugu sentence found during the review.
- Make sure the final article sounds natural when read aloud by a native Telugu speaker.

Return ONLY valid JSON.
No markdown.
No HTML.
No code fences.
No explanations.
Do not mention these instructions.

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
