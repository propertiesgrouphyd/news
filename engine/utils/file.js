import { promises as fs } from "node:fs";
import path from "node:path";

export async function ensureDirectory(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function readJson(filePath) {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

export async function writeJson(filePath, data, pretty = true) {
  await ensureDirectory(path.dirname(filePath));

  const content = pretty
    ? JSON.stringify(data, null, 2)
    : JSON.stringify(data);

  await fs.writeFile(filePath, content + "\n", "utf8");
}

export async function readText(filePath) {
  return fs.readFile(filePath, "utf8");
}

export async function writeText(filePath, content) {
  await ensureDirectory(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
}

export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
