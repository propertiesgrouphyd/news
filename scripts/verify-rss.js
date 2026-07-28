import { loadRSS } from "./engine/collector/rss.js";
import sources from "./config/sources.json" with { type: "json" };

let failed = false;

for (const [category, list] of Object.entries(sources.categories)) {
    console.log("\n==================================================");
    console.log("CATEGORY:", category);
    console.log("==================================================");

    for (const src of list) {
        process.stdout.write(src.name + " ... ");

        try {
            const items = await loadRSS(src.rss);

            console.log("OK (" + items.length + " articles)");

            if (items.length) {
                console.log("   First:", items[0].title ?? "(no title)");
            }
        } catch (e) {
            failed = true;
            console.log("FAILED");
            console.log("   URL:", src.rss);
            console.log("   Error:", e.message);
        }

        console.log();
    }
}

if (failed) {
    console.log("RSS VERIFICATION: FAILED");
    process.exitCode = 1;
} else {
    console.log("RSS VERIFICATION: PASSED");
}
