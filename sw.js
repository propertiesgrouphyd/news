/* =========================================
   VIDHWAAN Telugu News PWA
   Service Worker
========================================= */


const CACHE_NAME = "vidhwaan-news-v4";


const APP_FILES = [

    "/",
    "/index.html",
    "/main.css",
    "/app.js",
    "/manifest.json",

    "/icons/logo.png",
    "/icons/icon-192.png",
    "/icons/icon-512.png"

];



/* =========================
   INSTALL
========================= */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(CACHE_NAME)
                .then(
                    cache =>
                        cache.addAll(APP_FILES)
                )

        );


        self.skipWaiting();

    }
);



/* =========================
   ACTIVATE
========================= */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()
                .then(
                    keys =>
                        Promise.all(
                            keys
                                .filter(
                                    key =>
                                        key !== CACHE_NAME
                                )
                                .map(
                                    key =>
                                        caches.delete(key)
                                )
                        )
                )

        );


        self.clients.claim();

    }
);



/* =========================
   FETCH
========================= */

self.addEventListener(
    "fetch",
    event => {


        const url =
            new URL(event.request.url);



        /*
          Daily news JSON:
          Always network fresh
        */

        if (
            url.pathname.includes(
                "/data/output/news/"
            )
        ) {

            event.respondWith(

                fetch(
                    event.request,
                    {
                        cache:"no-store"
                    }
                )

            );

            return;

        }



        /*
          App shell:
          Cache first
        */

        event.respondWith(

            caches.match(
                event.request
            )
            .then(
                cached =>

                    cached ||
                    fetch(event.request)

            )

        );


    }
);
