"use client";

import { useEffect } from "react";

/**
 * Clear leftover service workers from other apps on the same origin
 * (e.g. localhost:3000). Prevents repeated GET /sw.js from a controlling SW.
 */
export function UnregisterServiceWorkers() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    void navigator.serviceWorker.getRegistrations().then((regs) => {
      for (const reg of regs) {
        void reg.unregister();
      }
    });
    if ("caches" in window) {
      void caches.keys().then((keys) => {
        for (const key of keys) {
          void caches.delete(key);
        }
      });
    }
  }, []);

  return null;
}
