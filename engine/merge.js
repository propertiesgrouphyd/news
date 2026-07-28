import fs from "node:fs/promises";
import path from "node:path";

const PROCESSED_DIR = path.resolve("data/processed");
const OUTPUT_DIR = path.resolve("data/output/news");

function indiaDate() {
    return new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: "Asia/Kolkata"
        }
    ).format(new Date());
}

async function loadArticles() {

    let files = [];

    try {
        files = await fs.readdir(PROCESSED_DIR);
    } catch {
        return [];
    }

    const articles = [];

    for (const file of files) {

        if (!file.endsWith(".json")) continue;

        try {

            const article = JSON.parse(
                await fs.readFile(
                    path.join(PROCESSED_DIR, file),
                    "utf8"
                )
            );

            if (article.id && article.category) {
                articles.push(article);
            }

        } catch {}

    }

    return articles;
}

function formatArticle(article) {

    return {
        id: article.id,
        sourceName: article.sourceName,
        title: article.title,
        url: article.url,
        published: article.published,
        score: article.score,

        content: {
            headline: article.content?.headline || "",
            summary: article.content?.summary || "",
            sections: article.content?.sections || [],
            location: article.content?.location || "",
            importance: article.content?.importance || "",
            tags: article.content?.tags || []
        }
    };
}

async function main() {

    const articles = await loadArticles();

    const date = indiaDate();

    const payload = {
        date,
        generatedAt: new Date().toISOString(),

        categories: {
            national: [],
            international: [],
            andhraPradesh: []
        },

        meta: {
            totalArticles: articles.length
        }
    };

    for (const article of articles) {

        const item = formatArticle(article);

        if (payload.categories[article.category]) {
            payload.categories[article.category].push(item);
        }

    }

    await fs.mkdir(
        OUTPUT_DIR,
        { recursive:true }
    );

    await fs.writeFile(
        path.join(
            OUTPUT_DIR,
            `${date}.json`
        ),
        JSON.stringify(payload,null,2),
        "utf8"
    );

    console.log(
        `✓ Generated ${date}.json (${articles.length} articles)`
    );
}

main().catch(error=>{
    console.error(error);
    process.exit(1);
});
