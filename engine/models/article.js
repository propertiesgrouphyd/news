import { createArticleId } from "../utils/id.js";

function timestamp() {
    return new Date().toISOString();
}

export function createArticle(raw, category) {
    const article = {
        id: createArticleId(raw),

        category,

        sourceName: raw.sourceName ?? "",
        title: raw.title ?? "",
        summary: raw.summary ?? "",
        url: raw.url ?? "",
        published: raw.published ?? "",

        score: raw.score ?? 0,

        status: "pending",

        createdAt: timestamp(),
        updatedAt: timestamp()
    };

    return article;
}
