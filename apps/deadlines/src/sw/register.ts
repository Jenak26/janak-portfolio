/* Registers the worker and reports when a new build is installed and waiting.
   iOS keeps home screen apps alive in the background and does not always navigate on launch,
   so the app also asks for an update check each time it comes back to the foreground. */
export function registerSW(onUpdateReady: (apply: () => void) => void): void {
  if (!("serviceWorker" in navigator) || !import.meta.env.PROD) return;
  let reloading = false;
  const offer = (worker: ServiceWorker) => onUpdateReady(() => {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloading) return;
      reloading = true;
      location.reload();
    });
    worker.postMessage({ type: "SKIP_WAITING" });
  });

  navigator.serviceWorker.register("/deadlines/sw.js", { scope: "/deadlines/", updateViaCache: "none" }).then(reg => {
    if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener("updatefound", () => {
      const w = reg.installing;
      if (!w) return;
      w.addEventListener("statechange", () => {
        // An installed worker with a page already controlled means a new build, not a first install.
        if (w.state === "installed" && navigator.serviceWorker.controller) offer(w);
      });
    });
    let last = Date.now();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden || Date.now() - last < 60_000) return;
      last = Date.now();
      reg.update().catch(() => {});
    });
  }).catch(() => { /* offline first load or blocked: the app still works without it */ });
}
