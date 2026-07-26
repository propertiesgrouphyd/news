function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleKey(title = "") {
  return normalize(title);
}

export function removeDuplicateArticles(articles = []) {
  const seenUrls = new Set();
  const seenTitles = new Set();

  const unique = [];

  for (const article of articles) {
    const url = String(article.url || "").trim().toLowerCase();
    const title = titleKey(article.title);

    if (!url || !title) {
      continue;
    }

    if (seenUrls.has(url)) {
      continue;
    }

    if (seenTitles.has(title)) {
      continue;
    }

    seenUrls.add(url);
    seenTitles.add(title);

    unique.push(article);
  }

  return unique;
}
