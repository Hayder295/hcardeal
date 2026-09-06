/* H CAR DEAL — Service Worker
   يخزّن الغلاف ومكتبات CDN حتى يعمل التطبيق بلا إنترنت بعد أول تشغيل.
   لا يلمس IndexedDB — بياناتك ليست هنا. */
const VERSION = "hcd-nb-v1.0.3729";
const BASE = new URL("./", self.registration.scope).pathname;

const CORE = [
  BASE, BASE + "index.html", BASE + "app.js", BASE + "manifest.json",
  BASE + "icon-192.png", BASE + "icon-512.png", BASE + "icon-maskable.png",
  BASE + "apple-touch-icon.png", BASE + "splash.png",
];
const CDN = [
  "https://unpkg.com/react@18.3.1/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone@7.25.6/babel.min.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(CORE).catch(() => {});
    await Promise.all(CDN.map((u) =>
      fetch(u, { mode: "cors" }).then((r) => r.ok && c.put(u, r)).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  if (req.mode === "navigate") {
    e.respondWith(fetch(req)
      .then((r) => { caches.open(VERSION).then((c) => c.put(BASE + "index.html", r.clone())); return r; })
      .catch(() => caches.match(BASE + "index.html")));
    return;
  }

  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => {
    if (r && r.ok) { const cp = r.clone(); caches.open(VERSION).then((c) => c.put(req, cp)); }
    return r;
  }).catch(() => hit)));
});
