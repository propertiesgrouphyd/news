export function now() {
  return new Date();
}

export function isoNow() {
  return new Date().toISOString();
}

export function unixNow() {
  return Math.floor(Date.now() / 1000);
}

export function formatIST(date = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date);
}

export function minutesBetween(start, end) {
  return Math.round((end.getTime() - start.getTime()) / 60000);
}

export function secondsBetween(start, end) {
  return Math.round((end.getTime() - start.getTime()) / 1000);
}

export function executionTimer() {
  const started = Date.now();

  return {
    elapsedMs() {
      return Date.now() - started;
    },

    elapsedSeconds() {
      return Number(((Date.now() - started) / 1000).toFixed(2));
    }
  };
}
