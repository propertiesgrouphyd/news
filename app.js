/* =========================================
   VIDHWAAN Telugu News PWA
   Application Engine
========================================= */


/* =========================
   CONFIG
========================= */

const APP_CONFIG = {

    NEWS_PATH: "/data/output/news/",

    TIMEZONE: "Asia/Kolkata"

};



/* =========================
   STATE
========================= */

const STATE = {

    articles: [],

    currentArticle: null,

    currentIndex: 0

};



/* =========================
   DOM
========================= */

const DOM = {

    feed: document.getElementById("feed"),

    articleView: document.getElementById("article-view"),

    articleContent:
        document.getElementById("article-content"),

    backButton:
        document.getElementById("back-button"),

    errorBox:
        document.getElementById("error-box")

};



/* =========================
   DATE MANAGER
========================= */

function getNewsDate() {


    const parts =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: APP_CONFIG.TIMEZONE,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                hour12: false
            }
        )
        .formatToParts(new Date());


    let year = "";
    let month = "";
    let day = "";
    let hour = 0;


    parts.forEach(part => {

        if (part.type === "year")
            year = part.value;

        if (part.type === "month")
            month = part.value;

        if (part.type === "day")
            day = part.value;

        if (part.type === "hour")
            hour = Number(part.value);

    });



    const date =
        new Date(
            `${year}-${month}-${day}T00:00:00`
        );


    if (hour < 5) {

        date.setDate(
            date.getDate() - 1
        );

    }


    return `${year}-${month}-${day}`;


}



/* =========================
   NEWS LOADER
========================= */

async function loadNews() {

    const date = getNewsDate();

    const url =
        `${APP_CONFIG.NEWS_PATH}${date}.json`;


    try {

        const response = await fetch(
            url,
            {
                cache: "no-store"
            }
        );


        if (!response.ok) {

            throw new Error(
                "News file not found"
            );

        }


        const data =
            await response.json();


        STATE.articles =
            flattenArticles(data);


        renderFeed();


    } catch(error) {

        showError(
            "ఈ రోజు వార్తలు అందుబాటులో లేవు."
        );

        console.error(error);

    }

}



/* =========================
   JSON NORMALIZER
========================= */

function flattenArticles(data) {

    const result = [];

    const categories =
        data.categories || {};


    Object.values(categories)
        .forEach(list => {

            if (Array.isArray(list)) {

                result.push(...list);

            }

        });


    return result;

}




/* =========================
   FEED RENDERER
========================= */

function renderFeed() {


    DOM.feed.innerHTML = "";


    STATE.articles.forEach(
        (article, index) => {


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "news-card";


            card.innerHTML = `

                <div class="card-box">

                    <div class="category">
                        ${getCategory(article)}
                    </div>


                    <h2 class="headline">
                        ${escapeHTML(
                            article.content?.headline || ""
                        )}
                    </h2>


                    <p class="summary">
                        ${escapeHTML(
                            article.content?.summary || ""
                        )}
                    </p>


                    <div class="location">
                        📍
                        ${
                            escapeHTML(
                                article.content?.location || ""
                            )
                        }
                    </div>


                    <div class="tags">
                        ${
                            formatTags(
                                article.content?.tags
                            )
                        }
                    </div>

                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    openArticle(index);

                }
            );


            DOM.feed.appendChild(card);


        }
    );


}



function getCategory(article) {


    const category =
        article.category || "";


    const map = {

        national:
            "జాతీయ వార్తలు",

        international:
            "అంతర్జాతీయ వార్తలు",

        andhraPradesh:
            "ఆంధ్రప్రదేశ్ వార్తలు"

    };


    return map[category] || "VIDHWAAN తెలుగు న్యూస్";


}



function formatTags(tags) {


    if (!Array.isArray(tags)) {

        return "";

    }


    return tags
        .slice(0,5)
        .map(
            tag => `#${escapeHTML(tag)}`
        )
        .join(" ");

}




/* =========================
   HTML SECURITY
========================= */

function escapeHTML(value) {


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}




/* =========================
   ARTICLE VIEW
========================= */

function openArticle(index) {


    STATE.currentIndex = index;

    STATE.currentArticle =
        STATE.articles[index];


    renderArticle();


    DOM.articleView
        .classList
        .add("active");


    history.pushState(
        {
            article:index
        },
        "",
        `#news-${index}`
    );


}



function renderArticle() {


    const article =
        STATE.currentArticle;


    if (!article) {

        return;

    }


    const content =
        article.content || {};


    DOM.articleContent.innerHTML = `

        <h1 class="article-title">
            ${
                escapeHTML(
                    content.headline || ""
                )
            }
        </h1>


        <div class="article-section">

            ${
                escapeHTML(
                    content.summary || ""
                )
            }

        </div>


        ${
            renderSections(
                content.sections
            )
        }


        <div class="location">

            📍
            ${
                escapeHTML(
                    content.location || ""
                )
            }

        </div>


        <div class="tags">

            ${
                formatTags(
                    content.tags
                )
            }

        </div>


        <p class="article-footer">

            VIDHWAAN తెలుగు న్యూస్

        </p>

    `;

}



function renderSections(sections) {


    if (!Array.isArray(sections)) {

        return "";

    }


    return sections
        .map(section => {


            let html = `

            <div class="article-section">

            `;


            if (section.heading) {

                html += `

                <h2 class="section-heading">
                    ${escapeHTML(section.heading)}
                </h2>

                `;

            }


            if (Array.isArray(section.paragraphs)) {

                section.paragraphs.forEach(
                    paragraph => {

                        html += `

                        <p>
                            ${escapeHTML(paragraph)}
                        </p>

                        `;

                    }
                );

            }


            html += `

            </div>

            `;


            return html;


        })
        .join("");

}



/* =========================
   BACK NAVIGATION
========================= */

function closeArticle() {


    DOM.articleView
        .classList
        .remove("active");


    history.back();

}


DOM.backButton.addEventListener(
    "click",
    closeArticle
);



window.addEventListener(
    "popstate",
    () => {

        DOM.articleView
            .classList
            .remove("active");

    }
);



/* =========================
   ERROR HANDLING
========================= */

function showError(message) {


    DOM.errorBox.textContent =
        message;

}


/* =========================
   APP START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadNews();

    }
);



/* =========================
   HASH RESTORE
========================= */

window.addEventListener(
    "load",
    () => {

        if (
            location.hash.startsWith("#news-")
        ) {

            const index =
                Number(
                    location.hash.replace(
                        "#news-",
                        ""
                    )
                );


            if (
                !Number.isNaN(index) &&
                STATE.articles[index]
            ) {

                openArticle(index);

            }

        }

    }
);



/* =========================
   PWA INSTALL MANAGER
========================= */

let deferredInstallPrompt = null;


const installButton =
    document.getElementById(
        "install-button"
    );



window.addEventListener(
    "beforeinstallprompt",
    event => {


        event.preventDefault();


        deferredInstallPrompt =
            event;


        if (installButton) {

            installButton.style.display =
                "block";

        }

    }
);



if (installButton) {


    installButton.addEventListener(
        "click",
        async () => {


            if (!deferredInstallPrompt) {

                return;

            }


            deferredInstallPrompt.prompt();


            const result =
                await deferredInstallPrompt.userChoice;


            if (
                result.outcome === "accepted"
            ) {

                console.log(
                    "PWA installed"
                );

            }


            deferredInstallPrompt = null;


            installButton.style.display =
                "none";


        }
    );


}



window.addEventListener(
    "appinstalled",
    () => {


        if (installButton) {

            installButton.style.display =
                "none";

        }


        console.log(
            "VIDHWAAN News installed"
        );


    }
);

