/* Kill-switch: this app does not use a service worker.
   Satisfies browsers/extensions still requesting /sw.js (avoids Next 404 noise)
   and unregisters any leftover registration from another localhost project. */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        if ("navigate" in client) {
          client.navigate(client.url);
        }
      }
    })(),
  );
});
