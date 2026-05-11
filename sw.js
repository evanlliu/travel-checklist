// v1.5.6
const CACHE_NAME = "travel-checklist-v1.5.6";
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/style.css?v=1.5.6",
  "./js/config.js?v=1.5.6",
  "./js/app.js?v=1.5.6",
  "./manifest.json?v=1.5.6",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.pathname.includes("/api/") || url.pathname.endsWith("/data.json")) return;

  event.respondWith(
    fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(request))
  );
});
