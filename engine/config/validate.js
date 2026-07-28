import fs from "node:fs/promises";

async function checkFile(file) {
    try {
        await fs.access(file);
        return true;
    } catch {
        return false;
    }
}

export async function validateConfig() {

    console.log("");
    console.log("=================================");
    console.log("Configuration Check");
    console.log("=================================");

    let valid = true;

    const files = [
        "config/settings.json",
        "config/sources.json"
    ];

    for (const file of files) {

        const exists = await checkFile(file);

        if (exists) {
            console.log(`✓ ${file}`);
        } else {
            console.log(`✗ ${file} missing`);
            valid = false;
        }
    }

    if (process.env.GROQ_API_KEY) {
        console.log("✓ GROQ_API_KEY");
    } else {
        console.log("✗ GROQ_API_KEY missing");
        valid = false;
    }

    console.log("=================================");

    if (!valid) {
        throw new Error(
            "Configuration validation failed."
        );
    }

    console.log("Configuration OK.");
    console.log("");

}
