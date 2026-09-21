const CACHE_NAME =
  "scw-v3-final-2026-09-21";

const BASE_PATH =
  "/soccer-cards-war/";

const APP_SHELL = [
  BASE_PATH,
  `${BASE_PATH}index.html`,
  `${BASE_PATH}manifest.webmanifest`,
  `${BASE_PATH}icons/icon-180.png`,
  `${BASE_PATH}icons/icon-192.png`,
  `${BASE_PATH}icons/icon-512.png`,
];

/* =========================================================
   INSTALL
========================================================= */

self.addEventListener(
  "install",
  (event) => {
    event.waitUntil(
      caches
        .open(
          CACHE_NAME
        )
        .then(
          (cache) =>
            cache.addAll(
              APP_SHELL
            )
        )
        .then(() =>
          self.skipWaiting()
        )
    );
  }
);

/* =========================================================
   ACTIVATE

   Eski Soccer Cards War cache'lerini temizle.
========================================================= */

self.addEventListener(
  "activate",
  (event) => {
    event.waitUntil(
      caches
        .keys()
        .then(
          (keys) =>
            Promise.all(
              keys.map(
                (key) => {
                  if (
                    key !==
                    CACHE_NAME
                  ) {
                    return caches.delete(
                      key
                    );
                  }

                  return null;
                }
              )
            )
        )
        .then(() =>
          self.clients.claim()
        )
    );
  }
);

/* =========================================================
   FETCH

   HTML / navigation:
   NETWORK FIRST

   Böylece yeni deploy gelince eski uygulama
   telefonda takılı kalmaz.

   Assetler:
   CACHE FIRST + network fallback
========================================================= */

self.addEventListener(
  "fetch",
  (event) => {
    const request =
      event.request;

    if (
      request.method !==
      "GET"
    ) {
      return;
    }

    const url =
      new URL(
        request.url
      );

    /*
      Başka domain isteklerine dokunma.
    */

    if (
      url.origin !==
      self.location.origin
    ) {
      return;
    }

    const isNavigation =
      request.mode ===
        "navigate" ||
      request.destination ===
        "document";

    if (isNavigation) {
      event.respondWith(
        fetch(request)
          .then(
            (response) => {
              const copy =
                response.clone();

              caches
                .open(
                  CACHE_NAME
                )
                .then(
                  (cache) =>
                    cache.put(
                      request,
                      copy
                    )
                );

              return response;
            }
          )
          .catch(
            async () => {
              const cached =
                await caches.match(
                  request
                );

              if (cached) {
                return cached;
              }

              return caches.match(
                `${BASE_PATH}index.html`
              );
            }
          )
      );

      return;
    }

    event.respondWith(
      caches
        .match(request)
        .then(
          async (
            cached
          ) => {
            if (cached) {
              /*
                Cache varsa hemen dön,
                arkada güncellemeyi dene.
              */

              fetch(request)
                .then(
                  (
                    response
                  ) => {
                    if (
                      response &&
                      response.ok
                    ) {
                      const copy =
                        response.clone();

                      caches
                        .open(
                          CACHE_NAME
                        )
                        .then(
                          (
                            cache
                          ) =>
                            cache.put(
                              request,
                              copy
                            )
                        );
                    }
                  }
                )
                .catch(() => {
                  // Offline ise sorun yok.
                });

              return cached;
            }

            try {
              const response =
                await fetch(
                  request
                );

              if (
                response &&
                response.ok
              ) {
                const copy =
                  response.clone();

                const cache =
                  await caches.open(
                    CACHE_NAME
                  );

                cache.put(
                  request,
                  copy
                );
              }

              return response;
            } catch {
              return new Response(
                "",
                {
                  status: 504,
                  statusText:
                    "Offline",
                }
              );
            }
          }
        )
    );
  }
);

/* =========================================================
   MESAJ İLE ZORLA AKTİFLEŞTİRME
========================================================= */

self.addEventListener(
  "message",
  (event) => {
    if (
      event.data ===
      "SKIP_WAITING"
    ) {
      self.skipWaiting();
    }
  }
);