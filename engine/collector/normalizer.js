import { cleanText, truncate } from "../utils/text.js";

function firstDefined(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return "";
}

function extractLink(item) {
  const link = item.link;

  if (typeof link === "string") {
    return link.trim();
  }

  if (Array.isArray(link)) {
    for (const entry of link) {
      if (typeof entry === "string") {
        return entry.trim();
      }

      if (entry?.href) {
        return String(entry.href).trim();
      }

      if (entry?.["#text"]) {
        return String(entry["#text"]).trim();
      }
    }
  }

  if (link?.href) {
    return String(link.href).trim();
  }

  if (link?.["#text"]) {
    return String(link["#text"]).trim();
  }

  return "";
}

function extractPublished(item) {
  return firstDefined(
    item.pubDate,
    item.published,
    item.updated,
    item["dc:date"],
    item.isoDate
  );
}

function extractDescription(item) {
  return firstDefined(
    item.description,
    item.summary,
    item.contentSnippet,
    item.content
  );
}

export function normalizeRSSItem(item, category, source) {
  return {
    category,
    sourceId: source.id,
    sourceName: source.name,

    title: cleanText(firstDefined(item.title)),
    url: extractLink(item),
    published: cleanText(extractPublished(item)),
    description: truncate(cleanText(extractDescription(item)), 600),

    guid: cleanText(firstDefined(item.guid, item.id)),
    author: cleanText(firstDefined(item.creator, item.author))
  };
}

export function normalizeRSSItems(items, category, source) {
  return items
    .map(item => normalizeRSSItem(item, category, source))
    .filter(item => item.title && item.url);
}
