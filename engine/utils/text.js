import he from "he";

export function decodeHtml(text = "") {
  return he.decode(String(text));
}

export function stripHtml(html = "") {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeWhitespace(text = "") {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function cleanText(text = "") {
  return normalizeWhitespace(stripHtml(decodeHtml(text)));
}

export function truncate(text = "", maxLength = 200) {
  const value = String(text).trim();

  if (value.length <= maxLength) {
    return value;
  }

  return value.slice(0, maxLength).trimEnd() + "…";
}

export function wordCount(text = "") {
  const words = cleanText(text).split(/\s+/).filter(Boolean);
  return words.length;
}

export function readingTime(text = "", wordsPerMinute = 180) {
  const words = wordCount(text);
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function uniqueStrings(values = []) {
  return [...new Set(values.map(v => String(v).trim()).filter(Boolean))];
}

export function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
