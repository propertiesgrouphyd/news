import fs from "node:fs/promises";
import path from "node:path";

const RAW_DIR = path.resolve("data/raw");

export async function writeRawArticle(article) {
    await fs.mkdir(RAW_DIR, {
        recursive: true
    });

    const file = path.join(RAW_DIR, `${article.id}.json`);

    await fs.writeFile(
        file,
        JSON.stringify(article, null, 2),
        "utf8"
    );

    return file;
}
