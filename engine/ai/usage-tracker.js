import fs from "node:fs/promises";
import path from "node:path";

const FILE = path.resolve("data/state/usage.json");
const DAILY_LIMIT = 70000;

function today() {
    return new Date().toISOString().slice(0, 10);
}

export async function addUsage(usage = {}) {

    let state = {
        date: today(),
        tokens: 0,
        articles: 0
    };

    try {
        state = JSON.parse(
            await fs.readFile(FILE, "utf8")
        );
    } catch {}

    if (state.date !== today()) {
        state = {
            date: today(),
            tokens: 0,
            articles: 0
        };
    }

    state.tokens += usage.total_tokens || 0;
    state.articles += 1;

    await fs.writeFile(
        FILE,
        JSON.stringify(state, null, 2),
        "utf8"
    );

    return state;
}

export async function checkUsageLimit() {

    try {
        const state = JSON.parse(
            await fs.readFile(FILE, "utf8")
        );

        if (
            state.date === today() &&
            state.tokens >= DAILY_LIMIT
        ) {
            throw new Error(
                `Daily Groq token budget reached (${state.tokens}/${DAILY_LIMIT})`
            );
        }

    } catch (error) {

        if (
            error.message.includes("Daily Groq")
        ) {
            throw error;
        }

    }
}
