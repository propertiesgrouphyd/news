import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const OUTPUT_DIR = path.resolve("data/output/news");
const MANIFEST_FILE = path.resolve("data/output/news/manifest.json");

async function sha256(file) {

    const data = await fs.readFile(file);

    return crypto
        .createHash("sha256")
        .update(data)
        .digest("hex");
}

async function main(){

    await fs.mkdir(
        OUTPUT_DIR,
        {recursive:true}
    );

    const files = await fs.readdir(OUTPUT_DIR);

    const manifest={
        generatedAt:new Date().toISOString(),
        files:[]
    };

    for(const file of files){

        if(
            !file.endsWith(".json") ||
            file==="manifest.json"
        ) continue;

        const full =
            path.join(
                OUTPUT_DIR,
                file
            );

        const stat =
            await fs.stat(full);

        manifest.files.push({
            file,
            size:stat.size,
            sha256:await sha256(full)
        });

        console.log(`✓ ${file}`);
    }

    await fs.writeFile(
        MANIFEST_FILE,
        JSON.stringify(manifest,null,2)
    );

    console.log("Deployment package ready.");
}

main().catch(error=>{
    console.error(error);
    process.exit(1);
});
