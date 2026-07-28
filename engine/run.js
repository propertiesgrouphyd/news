import "dotenv/config";

import { spawn } from "node:child_process";

import { validateConfig } from "./config/validate.js";
import fs from "node:fs/promises";
import path from "node:path";

const STEPS = [
    "collect.js",
    "process.js",
    "merge.js",
    "deploy.js"
];


async function resetDailyWorkspace() {

    const folders = [
        "data/failed",
        "data/processed",
        "data/raw"
    ];

    for (const folder of folders) {

        await fs.rm(folder, {
            recursive: true,
            force: true
        });

        await fs.mkdir(folder, {
            recursive: true
        });
    }

    await fs.rm(
        "data/state/queue.json",
        { force: true }
    );

    await fs.writeFile(
        "data/state/usage.json",
        JSON.stringify({
            date: "",
            tokens: 0,
            articles: 0
        }, null, 2)
    );

    console.log("✓ Daily workspace reset");

}

function run(script) {

    return new Promise((resolve, reject) => {

        const child = spawn(
            process.execPath,
            [path.join("engine", script)],
            {
                stdio: "inherit"
            }
        );

        child.on("error", reject);

        child.on("exit", code => {

            if (code === 0) {
                resolve();
            } else {
                reject(
                    new Error(`${script} exited with code ${code}`)
                );
            }

        });

    });

}

async function main() {

    await validateConfig();

    await resetDailyWorkspace();

    console.log("=================================");
    console.log("VIDHWAAN News Engine");
    console.log("=================================\n");

    for (const step of STEPS) {

        console.log(`\n▶ Running ${step}\n`);

        await run(step);

        if (step === "process.js") {

            const files = await fs.readdir(
                "data/processed"
            );

            const processedCount = files.filter(
                file => file.endsWith(".json")
            ).length;

            const MIN_PROCESSED_ARTICLES = 10;

            if (processedCount < MIN_PROCESSED_ARTICLES) {

                throw new Error(
                    `Only ${processedCount} processed articles generated. Minimum required is ${MIN_PROCESSED_ARTICLES}. Stopping before merge/deploy.`
                );

            }

            console.log(
                `✓ Processed articles: ${processedCount}`
            );

        }

    }

    console.log("\n=================================");
    console.log("Pipeline completed successfully.");
    console.log("=================================");

}

main().catch(error => {

    console.error("\nPipeline failed.");
    console.error(error);

    process.exit(1);

});
