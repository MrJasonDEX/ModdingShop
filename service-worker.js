const CACHE_NAME = 'modshop-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/css/main.css',
    '/assets/js/app.js',
    '/data/mods.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(URLS_TO_CACHE))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
