import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const OUTPUT_DIR = path.resolve("data/output");
const MANIFEST_FILE = path.resolve("data/output/manifest.json");

async function sha256(file) {

    const data = await fs.readFile(file);

    return crypto
        .createHash("sha256")
        .update(data)
        .digest("hex");

}

async function main() {

    const files = await fs.readdir(OUTPUT_DIR);

    const manifest = {
        generatedAt: new Date().toISOString(),
        files: []
    };

    for (const file of files) {

        if (
            !file.endsWith(".json") ||
            file === "manifest.json"
        ) {
            continue;
        }

        const fullPath = path.join(
            OUTPUT_DIR,
            file
        );

        const stat = await fs.stat(fullPath);

        manifest.files.push({
            file,
            size: stat.size,
            sha256: await sha256(fullPath)
        });

        console.log(`✓ ${file}`);

    }

    await fs.writeFile(
        MANIFEST_FILE,
        JSON.stringify(manifest, null, 2),
        "utf8"
    );

    console.log();
    console.log("Deployment package ready.");
    console.log(`Manifest: ${MANIFEST_FILE}`);

}

main().catch(error => {

    console.error(error);
    process.exit(1);

});
