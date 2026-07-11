"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register service worker after page load to prevent blocking main thread
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("NuFrame PWA ServiceWorker registered: ", registration.scope);
          })
          .catch((error) => {
            console.error("NuFrame PWA ServiceWorker registration failed: ", error);
          });
      });
    }
  }, []);

  return null;
}
