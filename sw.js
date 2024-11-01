const cacheName = "pwa-serial-sensor-app-v1";
const assets = [
  "/",
  "index.html",
  "script.js",
  "style.css",
  "manifest.json",
  "icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
