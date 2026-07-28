function isNonEmptyString(value) {
    return typeof value === "string" &&
        value.trim().length > 0;
}

function isStringArray(value) {
    return Array.isArray(value) &&
        value.length > 0 &&
        value.every(item => isNonEmptyString(item));
}

function isSections(value) {

    return Array.isArray(value) &&
        value.length > 0 &&
        value.every(section =>
            section &&
            isNonEmptyString(section.heading) &&
            isStringArray(section.paragraphs)
        );
}

export function parseArticle(jsonText) {

    try {
        return JSON.parse(jsonText);
    } catch (error) {
        throw new Error(
            `Invalid JSON returned by AI: ${error.message}`
        );
    }

}

export function validateArticle(article) {

    if (!article || typeof article !== "object") {
        throw new Error("Article must be JSON object.");
    }

    if (!isNonEmptyString(article.headline)) {
        throw new Error("Missing headline.");
    }

    if (!isNonEmptyString(article.summary)) {
        throw new Error("Missing summary.");
    }

    if (!isSections(article.sections)) {
        throw new Error("Missing or invalid sections.");
    }

    if (!isNonEmptyString(article.category)) {
        throw new Error("Missing category.");
    }

    if (
        article.location !== undefined &&
        typeof article.location !== "string"
    ) {
        throw new Error("Invalid location.");
    }

    if (!isNonEmptyString(article.importance)) {
        throw new Error("Missing importance.");
    }

    if (
        article.tags !== undefined &&
        article.tags !== null &&
        !Array.isArray(article.tags)
    ) {
        throw new Error("Invalid tags.");
    }

    return article;
}

export function parseAndValidate(jsonText) {

    const article = parseArticle(jsonText);

    return validateArticle(article);

}
