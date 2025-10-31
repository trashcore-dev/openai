// sw.js - Service Worker for Trashcore Web PWA
const CACHE_NAME = 'trashcore-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://files.catbox.moe/z3r33o.jpg', // your icon
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Install event: cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('One or more assets failed to cache:', err);
        });
      })
  );
});

// Fetch event: serve from cache first, fall back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        // Otherwise fetch from network
        return fetch(event.request).catch(() => {
          // Optional: return a fallback page or image
        });
      })
  );
});

// Activate event: clean up old caches (optional)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
