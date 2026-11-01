// Bundle Wise service worker: keeps the app working offline.
// Change the version number below whenever you want every device to refresh its saved copy.
const CACHE = "bundle-wise-v1";
const FILES = [
  "./",
  "index.html",
  "admin.html",
  "manifest.json",
  "images/icon-192.png",
  "images/icon-512.png",
  "images/icon-maskable-512.png",
  "images/8ac7af4e-af87-4d08-bcc4-0b827c78cb1b.jfif"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first (so updates show up), saved copy when offline.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match("index.html")))
  );
});
