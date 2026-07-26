import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  trimValues: true,
  parseTagValue: true
});

export async function fetchRSS(url, timeout = 30000) {
  const controller = new AbortController();

  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "VIDHWAAN News Engine/1.0"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`RSS request failed (${response.status})`);
    }

    const xml = await response.text();

    return parser.parse(xml);
  } finally {
    clearTimeout(timer);
  }
}

export function extractRSSItems(feed) {
  if (!feed) return [];

  if (feed.rss?.channel?.item) {
    return Array.isArray(feed.rss.channel.item)
      ? feed.rss.channel.item
      : [feed.rss.channel.item];
  }

  if (feed.feed?.entry) {
    return Array.isArray(feed.feed.entry)
      ? feed.feed.entry
      : [feed.feed.entry];
  }

  return [];
}

export async function loadRSS(url, timeout = 30000) {
  const feed = await fetchRSS(url, timeout);
  return extractRSSItems(feed);
}
