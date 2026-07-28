import fs from "node:fs/promises";
import path from "node:path";

const PROCESSED_DIR = path.resolve("data/processed");
const OUTPUT_DIR = path.resolve("data/output");

async function loadArticles() {

    let files = [];

    try {
        files = await fs.readdir(PROCESSED_DIR);
    } catch {
        return [];
    }

    const articles = [];

    for (const file of files) {

        if (!file.endsWith(".json")) {
            continue;
        }

        try {

            const article = JSON.parse(
                await fs.readFile(
                    path.join(PROCESSED_DIR, file),
                    "utf8"
                )
            );

            if (!article.id || !article.category) {
                continue;
            }

            articles.push(article);

        } catch {
            // Ignore invalid JSON
        }

    }

    return articles;

}

function formatArticle(article) {

    return {
        id: article.id,
        category: article.category,
        sourceName: article.sourceName,
        originalTitle: article.title,
        url: article.url,
        published: article.published,
        score: article.score,

        content: {
            headline: article.content?.headline ?? "",
            summary: article.content?.summary ?? "",
            sections: article.content?.sections ?? [],
            location: article.content?.location ?? "",
            importance: article.content?.importance ?? "",
            tags: article.content?.tags ?? []
        }
    };

}

function sortArticles(articles) {

    return [...articles].sort((a, b) => {

        if ((b.score || 0) !== (a.score || 0)) {
            return (b.score || 0) - (a.score || 0);
        }

        return new Date(b.published || 0)
             - new Date(a.published || 0);

    });

}

async function writeFeed(name, articles) {

    await fs.mkdir(OUTPUT_DIR, {
        recursive: true
    });

    const output = {
        generatedAt: new Date().toISOString(),
        total: articles.length,
        articles: articles.map(formatArticle)
    };

    await fs.writeFile(
        path.join(OUTPUT_DIR, `${name}.json`),
        JSON.stringify(output, null, 2),
        "utf8"
    );

}

async function main() {

    const articles = sortArticles(
        await loadArticles()
    );

    await writeFeed(
        "latest",
        articles
    );

    for (const category of [
        "national",
        "international",
        "andhraPradesh"
    ]) {

        await writeFeed(
            category,
            articles.filter(
                article => article.category === category
            )
        );

    }

    console.log(
        `✓ Generated ${articles.length} articles`
    );

}

main().catch(error => {

    console.error(error);
    process.exit(1);

});
