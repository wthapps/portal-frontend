const VAPID_PUBLIC_KEY =
  "BKffWUvxlc6R_0lHoAFBjU6WIAJkEBNfs9awsnUIKaAllkK94iOBnKI6rLFd9WxPDnsmBCK2S5L1dmVWTHkt9J4=";

function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function registerSw() {
  if (navigator.serviceWorker) {
    console.log('should register SW');
    navigator.serviceWorker
      .register("/ngsw-worker.js")
      .then(function(registration) {
        console.info(
          "ServiceWorker registration successful with scope:",
          registration.scope
        );

        // if there's no controller, this page wasn't loaded
        // via a service worker, so they're looking at the latest version.
        // In that case, exit early
        if (!navigator.serviceWorker.controller) return;

        // if there's an updated worker already waiting, update
        if (registration.waiting) {
          console.info("show toast and upon click update...");
          registration.waiting.postMessage({ updateSw: true });
          return;
        }

        // if there's an updated worker installing, track its
        // progress. If it becomes "installed", update
        if (registration.installing) {
          registration.addEventListener("statechange", function() {
            if (registration.installing.state == "installed") {
              console.info("show toast and upon click update...");
              registration.installing.postMessage({ updateSw: true });
              return;
            }
          });
        }

        // otherwise, listen for new installing workers arriving.
        // If one arrives, track its progress.
        // If it becomes "installed", update
        registration.addEventListener("updatefound", function() {
          let newServiceWorker = registration.installing;

          newServiceWorker.addEventListener("statechange", function() {
            if (newServiceWorker.state == "installed") {
              console.info("show toast and upon click update...");
              newServiceWorker.postMessage({ updateSw: true });
            }
          });
        });
      })
      .catch(function(error) {
        console.info("ServiceWorker registration failed:", error);
      });

    navigator.serviceWorker.addEventListener("controllerchange", function() {
      window.location.reload();
    });

    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      console.log(
        "Service Worker Ready",
        serviceWorkerRegistration,
        VAPID_PUBLIC_KEY
      );
      serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    });

    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification["permission"] === "granted") {
      console.log("Permission to receive notifications has been granted");
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification["permission"] !== "denied") {
      Notification.requestPermission(function(permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          console.log("Permission to receive notifications has been granted");
        }
      });
    }
  }
  // Otherwise, no push notifications :(
  else {
    console.error("Service worker is not supported in this browser");
  }
}
