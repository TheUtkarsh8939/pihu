// Define the cache name and the files to cache
const CACHE_NAME = 'offline-cache-v1';
const OFFLINE_URL = 'offline.html';

// Install the service worker and cache the offline page
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([OFFLINE_URL]);
        })
    );
});

// Intercept network requests and serve the offline page when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(OFFLINE_URL);
        })
    );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
