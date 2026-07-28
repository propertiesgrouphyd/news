import fs from "node:fs/promises";
import path from "node:path";

const PROCESSED_DIR = path.resolve("data/processed");
const FAILED_DIR = path.resolve("data/failed");

async function write(dir, article) {

    await fs.mkdir(dir, {
        recursive: true
    });

    const file = path.join(
        dir,
        `${article.id}.json`
    );

    await fs.writeFile(
        file,
        JSON.stringify(article, null, 2),
        "utf8"
    );

    return file;

}

export async function writeProcessedArticle(article) {

    return write(PROCESSED_DIR, {
        ...article,
        status: "completed",
        processedAt: new Date().toISOString()
    });

}

export async function writeFailedArticle(article, error) {

    return write(FAILED_DIR, {
        ...article,
        status: "failed",
        failedAt: new Date().toISOString(),
        error: error
            ? (error.stack || error.message || String(error))
            : null
    });

}
