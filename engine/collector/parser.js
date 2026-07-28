import { JSDOM, VirtualConsole } from "jsdom";
import { Readability } from "@mozilla/readability";

import { cleanText } from "../utils/text.js";

const virtualConsole = new VirtualConsole();

virtualConsole.on("jsdomError", error => {
  if (
    error?.message?.includes("Could not parse CSS stylesheet")
  ) {
    return;
  }

  console.error(error);
});

export async function extractArticle(url, timeout = 30000) {

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
      throw new Error(
        `Article request failed (${response.status})`
      );
    }

    const html = await response.text();

    const dom = new JSDOM(html, {
      url,
      virtualConsole
    });

    const reader = new Readability(dom.window.document);

    const article = reader.parse();

    if (!article) {
      return null;
    }

    return {
      url,
      title: cleanText(article.title || ""),
      byline: cleanText(article.byline || ""),
      excerpt: cleanText(article.excerpt || ""),
      text: cleanText(article.textContent || ""),
      length: article.length || 0,
      siteName: cleanText(article.siteName || "")
    };

  } finally {
    clearTimeout(timer);
  }

}
