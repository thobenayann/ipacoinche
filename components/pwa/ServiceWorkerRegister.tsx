"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export function ServiceWorkerRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setUpdateAvailable(true);
            }
          });
        });
      });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  }, []);

  function handleUpdate() {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      } else {
        window.location.reload();
      }
    });
  }

  if (!updateAvailable) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex items-center justify-center p-3">
      <button
        onClick={handleUpdate}
        className="flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-white px-5 py-2.5 text-sm font-medium text-[#333333] shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-200 hover:shadow-[0_6px_28px_rgba(0,0,0,0.18)] active:scale-[0.97]"
      >
        <RefreshCw className="size-4 text-[var(--accent)]" />
        Nouvelle version disponible — Mettre à jour
      </button>
    </div>
  );
}
