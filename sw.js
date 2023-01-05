// This code executes in its own worker or thread
self.addEventListener("activate", event => {
    console.log("Service worker activated");
});
const chacheName = "mudassirali-PWA";
const urlsToCache = ["/", "manifest.json", "app.webmanifest","index.js", "app.js", "style.css", "icons/Logo.png", "icons/logo2.png", "icons/logoname.png", "font/flaticon.css", "font/HelveticaNeueBold.ttf", "font/Flaticon.woff2"]

self.addEventListener("install", (event) => {
    console.log("Service worker installed",self);
    event.waitUntil(
        caches.open(chacheName)
            .then(cache => {
                console.log('in caches')
                return cache.addAll(urlsToCache);
            })
    );

//    event.waitUntil(async () => {
//     console.log('in caches')
//       const cache = await caches.open(chacheName);
//       return await cache.addAll(urlsToCache);
//    });
});

self.addEventListener("fetch", event => {
    console.log(`URL requested: ${event.request.url}`);
    const urlOrRequest = event.request.url
    // Cache-specific search
    caches.open(chacheName).then(cache => {
        cache.match(urlOrRequest).then(cachedResponse  => {
            console.log(cachedResponse  ? cachedResponse  : `${urlOrRequest} not in the cache`);
        })
    });
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                    // It can update the cache to serve updated content on the next request
                    return cachedResponse || fetch(event.request);
                }
            )
    )

    //Stale while revalidate
    /*event.respondWith(
        caches.match(event.request).then(async cachedResponse => {
                const networkFetch = await fetch(event.request).then(response => {
                    // update the cache with a clone of the network response
                    caches.open(chacheName).then(cache => {
                        cache.put(event.request, response.clone());
                    });
                });
                // prioritize cached response over network
                console.log(`Respond With: ${cachedResponse} and ${networkFetch}`)
                return cachedResponse || networkFetch;
            }
        )
    )*/

});
