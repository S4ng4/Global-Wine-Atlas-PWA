const CACHE_NAME = 'global-wine-atlas-v2';
const CORE_ASSETS = [
    './',
    './index.html',
    './wine-map.html',
    './wine-details.html',
    './WineByTheGlass.html',
    './wine-comparison.html',
    './regions.html',
    './SparklingWineDoc.html',
    './OurStory.html',
    './cellar-manager.html',
    './manifest.json',
    './config/brand.json',
    './data/wines.json',
    './css/atlas.css',
    './js/brand.js',
    './js/bottle-visual.js',
    './js/world-atlas-data.js',
    './js/cellar-store.js',
    './js/world-atlas-map.js',
    './js/atlas-page.js',
    './image/crest.svg',
    './image/cellar-hero.webp',
    './image/icon-192x192.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;

    // Network-first for JSON data/config so cellar updates appear immediately
    if (url.pathname.endsWith('.json')) {
        event.respondWith(
            fetch(event.request)
                .then((res) => {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
                    return res;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Stale-while-revalidate for static pages & scripts
    event.respondWith(
        caches.match(event.request).then((cached) => {
            const networkFetch = fetch(event.request).then((res) => {
                if (res && res.status === 200) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
                }
                return res;
            }).catch(() => cached);
            return cached || networkFetch;
        })
    );
});
