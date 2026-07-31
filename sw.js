/* =========================================
   VIDHWAAN Telugu News
   Production Service Worker
========================================= */

const CACHE_NAME = "vidhwaan-news-shell";

const ICON_CACHE = [

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

        self.skipWaiting();

        event.waitUntil(

            caches.open(CACHE_NAME)
                .then(
                    cache =>
                        cache.addAll(ICON_CACHE)
                )

        );

    }
);


/* =========================
   ACTIVATE
========================= */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            (async () => {

                const keys =
                    await caches.keys();

                await Promise.all(

                    keys
                        .filter(
                            key =>
                                key !== CACHE_NAME
                        )
                        .map(
                            key =>
                                caches.delete(key)
                        )

                );

                await self.clients.claim();

            })()

        );

    }
);


/* =========================
   FETCH
========================= */

self.addEventListener(
    "fetch",
    event => {

        if (
            event.request.method !== "GET"
        ) {

            return;

        }


        const url =
            new URL(event.request.url);


        /* =========================
           DAILY NEWS JSON
           Always Network
        ========================= */

        if (
            url.pathname.startsWith(
                "/data/output/news/"
            )
        ) {

            event.respondWith(

                fetch(
                    event.request,
                    {
                        cache: "no-store"
                    }
                )

            );

            return;

        }


        /* =========================
           ICONS
           Cache First
        ========================= */

        if (
            url.pathname.startsWith(
                "/icons/"
            )
        ) {

            event.respondWith(

                caches.match(
                    event.request
                )
                .then(
                    cached => {

                        if (cached) {

                            return cached;

                        }

                        return fetch(
                            event.request
                        )
                        .then(
                            response => {

                                const copy =
                                    response.clone();

                                caches.open(
                                    CACHE_NAME
                                )
                                .then(
                                    cache =>
                                        cache.put(
                                            event.request,
                                            copy
                                        )
                                );

                                return response;

                            }
                        );

                    }
                )

            );

            return;

        }


        /* =========================
           APP SHELL
           Network First
        ========================= */

        event.respondWith(

            fetch(
                event.request
            )
            .then(
                response => {

                    const copy =
                        response.clone();

                    caches.open(
                        CACHE_NAME
                    )
                    .then(
                        cache =>
                            cache.put(
                                event.request,
                                copy
                            )
                    );

                    return response;

                }
            )
            .catch(
                () =>
                    caches.match(
                        event.request
                    )
            )

        );

    }
);
