import settings from "../../config/settings.json" with { type: "json" };
import sources from "../../config/sources.json" with { type: "json" };

import logger from "../utils/logger.js";

import { loadRSS } from "../collector/rss.js";
import { normalizeRSSItems } from "../collector/normalizer.js";
import { removeDuplicateArticles } from "../collector/deduplicator.js";
import { rankArticles } from "../ranking/ranker.js";
import { createArticle } from "../models/article.js";


function isYesterdayArticle(dateString) {

    if (!dateString) {
        return false;
    }

    const published = new Date(dateString);

    if (isNaN(published)) {
        return false;
    }

    const istNow = new Date(
        new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata"
        })
    );

    const yesterdayStart = new Date(istNow);

    yesterdayStart.setDate(
        yesterdayStart.getDate() - 1
    );

    yesterdayStart.setHours(
        0, 0, 0, 0
    );

    const yesterdayEnd = new Date(yesterdayStart);

    yesterdayEnd.setHours(
        23, 59, 59, 999
    );

    const articleDate = new Date(
        published.toLocaleString("en-US", {
            timeZone: "Asia/Kolkata"
        })
    );

    return (
        articleDate >= yesterdayStart &&
        articleDate <= yesterdayEnd
    );

}

/**
 * Collect, normalize, deduplicate and rank articles.
 * Returns a flat array of canonical Article objects.
 */
export async function collectNews() {
    logger.info("Starting news collection...");

    const queue = [];

    for (const [category, sourceList] of Object.entries(sources.categories)) {

        let articles = [];

        for (const source of sourceList.filter(s => s.enabled)) {

            try {

                logger.info(`Loading RSS: ${source.name}`);

                const rssItems = await loadRSS(
                    source.rss,
                    settings.pipeline.requestTimeout
                );

                const normalized = normalizeRSSItems(
                    rssItems,
                    category,
                    source
                );

                const filtered = normalized.filter(
                    article => isYesterdayArticle(article.published)
                );

                articles.push(
                    ...filtered.slice(
                        0,
                        settings.pipeline.maxArticlesPerSource
                    )
                );

            } catch (error) {

                logger.error(source.name, error.message);

            }

        }

        articles = removeDuplicateArticles(articles);

        articles = rankArticles(articles);

        articles = articles.slice(
            0,
            settings.pipeline.maxArticlesPerCategory
        );

        for (const article of articles) {
            queue.push(createArticle(article, category));
        }

        logger.info(
            `${category}: ${articles.length} ranked articles`
        );

    }

    logger.info("News collection completed.");

    return queue;
}
