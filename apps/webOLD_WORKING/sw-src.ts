declare const self: ServiceWorkerGlobalScope & typeof globalThis;

const PRECACHE_CACHE = "precache-v1";
const RUNTIME_CACHE = "runtime";

// This array will be replaced at build time by @serwist/cli inject-manifest
// Serwist CLI expects the placeholder self.__SW_MANIFEST
const PRECACHE_MANIFEST: Array<{ url: string }> = (self as any).__SW_MANIFEST || [];

self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE_CACHE);
      const urls = PRECACHE_MANIFEST.map((entry) => entry.url);
      await cache.addAll(urls);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== PRECACHE_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event: ExtendableMessageEvent) => {
  const data = event.data;
  if (!data || typeof data !== "object") return;
  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event: FetchEvent) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Network-first for navigation requests (HTML)
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(PRECACHE_CACHE);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(PRECACHE_CACHE);
          const cached = await cache.match(request);
          return cached || fetch(request);
        }
      })(),
    );
    return;
  }

  // Script, style, image: cache-first with background update
  const dest = request.destination;
  if (dest === "script" || dest === "style" || dest === "image") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE);
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((response) => {
            cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached || fetch(request));

        return cached || fetchPromise;
      })(),
    );
  }
});
