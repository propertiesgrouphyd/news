const LEVELS = {
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40
};

const currentLevel =
  LEVELS[(process.env.LOG_LEVEL || "INFO").toUpperCase()] ?? LEVELS.INFO;

function timestamp() {
  return new Date().toISOString();
}

function write(level, ...args) {
  if (LEVELS[level] < currentLevel) return;

  const prefix = `[${timestamp()}] [${level}]`;

  if (level === "ERROR") {
    console.error(prefix, ...args);
  } else if (level === "WARN") {
    console.warn(prefix, ...args);
  } else {
    console.log(prefix, ...args);
  }
}

export const logger = {
  debug: (...args) => write("DEBUG", ...args),
  info: (...args) => write("INFO", ...args),
  warn: (...args) => write("WARN", ...args),
  error: (...args) => write("ERROR", ...args)
};

export default logger;
