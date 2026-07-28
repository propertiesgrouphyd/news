import crypto from "node:crypto";

export function createArticleId(article) {
    const input = [
        article.url ?? "",
        article.published ?? "",
        article.title ?? ""
    ].join("|");

    return crypto
        .createHash("sha256")
        .update(input)
        .digest("hex");
}
