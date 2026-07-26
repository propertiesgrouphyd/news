import "node:process";
import path from "node:path";

import settings from "../config/settings.json" with { type: "json" };
import sources from "../config/sources.json" with { type: "json" };

import logger from "./utils/logger.js";

import { loadRSS } from "./collector/rss.js";
import { normalizeRSSItems } from "./collector/normalizer.js";
import { removeDuplicateArticles } from "./collector/deduplicator.js";
import { extractArticle } from "./collector/parser.js";

import { buildPrompt } from "./ai/prompt-builder.js";
import { generateArticle } from "./ai/groq.js";

import { parseAndValidate } from "./validator/validator.js";
import { publishOutput } from "./publisher/json-builder.js";

async function processSource(category, source) {
  logger.info(`Loading RSS: ${source.name}`);

  const rssItems = await loadRSS(
    source.rss,
    settings.pipeline.requestTimeout
  );

  const normalized = normalizeRSSItems(rssItems, category, source);

  return normalized.slice(0, settings.pipeline.maxArticlesPerSource);
}

async function processArticle(article) {
  logger.info(`Processing: ${article.title}`);

  const extracted = await extractArticle(
    article.url,
    settings.pipeline.requestTimeout
  );

  if (!extracted?.text) {
    logger.warn(`Skipping (empty article): ${article.url}`);
    return null;
  }

  const prompt = buildPrompt({
    ...article,
    ...extracted
  });

  const aiResponse = await generateArticle({
    apiKey: process.env.GROQ_API_KEY,
    model: settings.ai.model,
    prompt,
    temperature: settings.ai.temperature,
    maxTokens: settings.ai.maxTokens
  });

  const generated = parseAndValidate(aiResponse);

  return {
    ...generated,
    source: article.sourceName,
    published: article.published,
    originalUrl: article.url,
    generatedAt: new Date().toISOString()
  };
}

async function main() {
  logger.info("VIDHWAAN News Engine started.");

  const categorized = {};

  for (const [category, sourceList] of Object.entries(sources.categories)) {
    let articles = [];

    for (const source of sourceList.filter(s => s.enabled)) {
      try {
        const result = await processSource(category, source);
        articles.push(...result);
      } catch (error) {
        logger.error(source.name, error.message);
      }
    }

    articles = removeDuplicateArticles(articles);
    articles = articles.slice(0, settings.pipeline.maxArticlesPerCategory);

    const output = [];

    for (const article of articles) {
      try {
        const generated = await processArticle(article);

        if (generated) {
          output.push(generated);
        }
      } catch (error) {
        logger.error(article.title, error.message);
      }
    }

    categorized[category] = output;
  }

  const outputDir = path.resolve(settings.output.directory);

  const summary = await publishOutput(outputDir, categorized);

  logger.info(
    `Finished. Categories: ${summary.categories}, Articles: ${summary.totalArticles}`
  );
}

main().catch(error => {
  logger.error(error);
  process.exit(1);
});
