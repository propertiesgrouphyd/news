function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) &&
    value.length > 0 &&
    value.every(item => isNonEmptyString(item));
}

export function parseArticle(jsonText) {
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Invalid JSON returned by AI: ${error.message}`);
  }
}

export function validateArticle(article) {
  if (!article || typeof article !== "object") {
    throw new Error("Article must be a JSON object.");
  }

  if (!isNonEmptyString(article.headline)) {
    throw new Error("Missing or invalid 'headline'.");
  }

  if (!isNonEmptyString(article.summary)) {
    throw new Error("Missing or invalid 'summary'.");
  }

  if (!isStringArray(article.paragraphs)) {
    throw new Error("Missing or invalid 'paragraphs'.");
  }

  if (!isNonEmptyString(article.category)) {
    throw new Error("Missing or invalid 'category'.");
  }

  if (!isNonEmptyString(article.location)) {
    throw new Error("Missing or invalid 'location'.");
  }

  if (!isNonEmptyString(article.importance)) {
    throw new Error("Missing or invalid 'importance'.");
  }

  if (!isStringArray(article.tags)) {
    throw new Error("Missing or invalid 'tags'.");
  }

  return article;
}

export function parseAndValidate(jsonText) {
  const article = parseArticle(jsonText);
  return validateArticle(article);
}
