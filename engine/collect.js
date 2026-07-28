import path from "node:path";

import logger from "./utils/logger.js";

import { collectNews } from "./pipeline/collector.js";
import { QueueManager } from "./queue/queue.js";

async function main() {

    logger.info("VIDHWAAN Collector started.");

    const articles = await collectNews();

    const queue = new QueueManager(
        path.resolve("data/state/queue.json")
    );

    const total = await queue.replacePending(articles);

    logger.info(`Queue created with ${total} articles.`);
    logger.info("Collector finished successfully.");

}

main().catch(error => {

    logger.error(error);

    process.exit(1);

});
