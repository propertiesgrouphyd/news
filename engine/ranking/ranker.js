/**
 * Rank news articles by priority.
 * Higher score = higher priority.
 */

function calculateScore(article) {
    let score = 0;

    // Prefer newer articles
    if (article.published) {
        const ageHours =
            (Date.now() - new Date(article.published).getTime()) / 3600000;

        if (ageHours <= 1) score += 100;
        else if (ageHours <= 3) score += 80;
        else if (ageHours <= 6) score += 60;
        else if (ageHours <= 12) score += 40;
        else if (ageHours <= 24) score += 20;
    }

    // Prefer longer titles
    if (article.title) {
        score += Math.min(article.title.length, 50);
    }

    // Prefer articles with summaries
    if (article.summary) {
        score += 20;
    }

    return score;
}

export function rankArticles(articles = []) {
    return articles
        .map(article => ({
            ...article,
            score: calculateScore(article)
        }))
        .sort((a, b) => b.score - a.score);
}
