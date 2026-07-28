import "dotenv/config";

import path from "node:path";

import { QueueManager } from "./queue/queue.js";

import { writeRawArticle } from "./processor/raw-writer.js";
import { writeProcessedArticle, writeFailedArticle } from "./processor/processed-writer.js";

import { extractArticle } from "./collector/parser.js";
import { processArticle } from "./processor/ai-processor.js";

import logger from "./utils/logger.js";

const queue = new QueueManager(
    path.resolve("data/state/queue.json")
);

async function processNext() {

    const article = await queue.next();

    if (!article) {
        return null;
    }

    logger.info(`Processing: ${article.title}`);

    try {

        await writeRawArticle(article);

        let extracted = null;

        try {
            extracted = await extractArticle(article.url);
        } catch (error) {
            logger.warn(
                `Article extraction failed, using RSS fallback: ${error.message}`
            );
        }

        if (!extracted?.text) {

            extracted = {
                url: article.url,
                title: article.title || "",
                byline: article.author || "",
                excerpt: article.description || article.summary || "",
                text: article.description || article.summary || "",
                length: 0,
                siteName: article.sourceName || ""
            };

            logger.info(
                `Using RSS fallback: ${article.title}`
            );
        }

        const aiArticle = await processArticle({
            ...article,
            ...extracted
        });


        const processedArticle = {
            ...article,

            original: {
                title: article.title,
                summary: article.summary
            },

            content: aiArticle
        };

        await writeProcessedArticle(processedArticle);

        await queue.complete();

        logger.info(`Completed: ${article.title}`);

        return true;

    } catch (error) {

        logger.error(
            `Failed: ${article.title}\n${error.stack || error.message}`
        );

        await writeFailedArticle(article, error);

        await queue.fail();

        if (
            error.message.includes("rate_limit_exceeded") ||
            error.message.includes("tokens per day") ||
            error.message.includes("TPD")
        ) {
            logger.error("Groq daily quota exhausted. Stopping processor.");
            return false;
        }

        return true;

    }

}

async function main() {

    logger.info("VIDHWAAN Processor started.");

    while (true) {

        const processed = await processNext();

        if (!processed) {
            break;
        }

    }

    logger.info("Processor finished.");

}

main().catch(error => {
    logger.error(error.stack || error.message);
    process.exit(1);
});
