import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_STATE = {
    version: 2,
    createdAt: null,
    updatedAt: null,
    pending: [],
    processing: null
};

function now() {
    return new Date().toISOString();
}

export class QueueManager {

    constructor(stateFile) {
        this.stateFile = stateFile;
    }

    async load() {
        try {
            return JSON.parse(
                await fs.readFile(this.stateFile, "utf8")
            );
        } catch {

            const state = {
                ...DEFAULT_STATE,
                createdAt: now(),
                updatedAt: now()
            };

            await this.save(state);

            return state;
        }
    }

    async save(state) {

        state.updatedAt = now();

        await fs.mkdir(
            path.dirname(this.stateFile),
            { recursive: true }
        );

        await fs.writeFile(
            this.stateFile,
            JSON.stringify(state, null, 2),
            "utf8"
        );

    }

    async replacePending(articles) {

        const state = await this.load();

        state.pending = articles.map(article => ({
            ...article,
            attempts: 0
        }));

        state.processing = null;

        await this.save(state);

        return state.pending.length;

    }

    async next() {

        const state = await this.load();

        if (state.processing || state.pending.length === 0) {
            return null;
        }

        state.processing = state.pending.shift();

        state.processing.attempts =
            (state.processing.attempts || 0) + 1;

        state.processing.startedAt = now();

        await this.save(state);

        return state.processing;

    }

    async complete() {

        const state = await this.load();

        state.processing = null;

        await this.save(state);

    }

    async fail() {

        const state = await this.load();

        state.processing = null;

        await this.save(state);

    }

}
