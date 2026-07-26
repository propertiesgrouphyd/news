import path from "node:path";
import { writeJson } from "../utils/file.js";

export async function writeCategory(categoryName, articles, outputDir) {
  const fileName = `${categoryName}.json`;

  const payload = {
    category: categoryName,
    generatedAt: new Date().toISOString(),
    totalArticles: articles.length,
    articles
  };

  await writeJson(path.join(outputDir, fileName), payload, true);
}

export async function writeLatest(allArticles, outputDir) {
  const payload = {
    generatedAt: new Date().toISOString(),
    totalArticles: allArticles.length,
    articles: allArticles
  };

  await writeJson(path.join(outputDir, "latest.json"), payload, true);
}

export async function publishOutput(outputDir, categorizedArticles) {
  const allArticles = [];

  for (const [category, articles] of Object.entries(categorizedArticles)) {
    await writeCategory(category, articles, outputDir);
    allArticles.push(...articles);
  }

  allArticles.sort((a, b) => {
    const aTime = new Date(a.published || 0).getTime();
    const bTime = new Date(b.published || 0).getTime();
    return bTime - aTime;
  });

  await writeLatest(allArticles, outputDir);

  return {
    categories: Object.keys(categorizedArticles).length,
    totalArticles: allArticles.length
  };
}
